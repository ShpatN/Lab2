using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly ITokenService _tokenService;
        private readonly IAuditLogRepository _auditLogRepository;

        public AuthService(
            IUserRepository userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            ITokenService tokenService,
            IAuditLogRepository auditLogRepository)
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _tokenService = tokenService;
            _auditLogRepository = auditLogRepository;
        }

        // ================= LOGIN =================
        public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null || string.IsNullOrWhiteSpace(user.PasswordHash))
                throw new Exception("Invalid credentials");

            bool passwordOk;
            try
            {
                passwordOk = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            }
            catch
            {
                passwordOk = false;
            }

            if (!passwordOk)
                throw new Exception("Invalid credentials");

            var roles = await _userRepository.GetUserRolesAsync(user.Id);
            var permissions = await _userRepository.GetUserPermissionsAsync(user.Id);

            var accessToken = _tokenService.GenerateAccessToken(user, roles, permissions);

            var refreshToken = _tokenService.GenerateRefreshToken();
            var tokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);

            await _refreshTokenRepository.AddAsync(new RefreshToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await _auditLogRepository.AddAsync(CreateAuditLog(user.Id, "LOGIN", "User", user.Id));

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = MapUserInfo(user, roles)
            };
        }

        // ================= REGISTER =================
        public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request)
        {
            if (await _userRepository.EmailExistsAsync(request.Email))
                throw new Exception("Email already registered");

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);

            var roleId = await _userRepository.GetRoleIdByNameAsync("User")
                ?? await _userRepository.GetRoleIdByNameAsync("Customer")
                ?? await _userRepository.GetFirstRoleIdAsync();

            if (roleId.HasValue)
                await _userRepository.AddUserRoleAsync(user.Id, roleId.Value);

            var roles = await _userRepository.GetUserRolesAsync(user.Id);
            var permissions = await _userRepository.GetUserPermissionsAsync(user.Id);

            var accessToken = _tokenService.GenerateAccessToken(user, roles, permissions);

            var refreshToken = _tokenService.GenerateRefreshToken();
            var tokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);

            await _refreshTokenRepository.AddAsync(new RefreshToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await _auditLogRepository.AddAsync(CreateAuditLog(user.Id, "REGISTER", "User", user.Id));

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = MapUserInfo(user, roles)
            };
        }

        // ================= REFRESH =================
        public async Task<AuthResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request)
        {
            var tokens = await _refreshTokenRepository.GetAllWithUserAsync();

            var existingToken = tokens.FirstOrDefault(rt =>
            {
                try
                {
                    return !string.IsNullOrEmpty(rt.TokenHash) &&
                           BCrypt.Net.BCrypt.Verify(request.RefreshToken, rt.TokenHash);
                }
                catch { return false; }
            });

            if (existingToken == null)
                throw new Exception("Invalid refresh token");

            if (existingToken.ExpiresAt < DateTime.UtcNow)
                throw new Exception("Refresh token expired");

            var user = existingToken.User;

            var roles = await _userRepository.GetUserRolesAsync(user.Id);
            var permissions = await _userRepository.GetUserPermissionsAsync(user.Id);

            var accessToken = _tokenService.GenerateAccessToken(user, roles, permissions);

            var newRefreshToken = _tokenService.GenerateRefreshToken();
            var newHash = BCrypt.Net.BCrypt.HashPassword(newRefreshToken);

            await _refreshTokenRepository.RemoveAsync(existingToken);

            await _refreshTokenRepository.AddAsync(new RefreshToken
            {
                UserId = user.Id,
                TokenHash = newHash,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await _auditLogRepository.AddAsync(CreateAuditLog(user.Id, "REFRESH_TOKEN", "Auth", user.Id));

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = newRefreshToken,
                User = MapUserInfo(user, roles)
            };
        }

        // ================= LOGOUT =================
        public async Task LogoutAsync(RefreshTokenRequestDTO request)
        {
            var tokens = await _refreshTokenRepository.GetAllAsync();

            var token = tokens.FirstOrDefault(rt =>
            {
                try
                {
                    return !string.IsNullOrEmpty(rt.TokenHash) &&
                           BCrypt.Net.BCrypt.Verify(request.RefreshToken, rt.TokenHash);
                }
                catch { return false; }
            });

            if (token == null)
                throw new Exception("Token not found");

            await _refreshTokenRepository.RemoveAsync(token);

            await _auditLogRepository.AddAsync(CreateAuditLog(token.UserId, "LOGOUT", "Auth", token.UserId));
        }

        /// <summary>SQL schema often requires non-null optional columns on AuditLogs.</summary>
        private static AuditLog CreateAuditLog(int? userId, string action, string entity, int? entityId) =>
            new AuditLog
            {
                UserId = userId,
                Action = action,
                Entity = entity ?? string.Empty,
                EntityId = entityId,
                OldValue = string.Empty,
                NewValue = string.Empty,
                IpAddress = string.Empty,
                CreatedAt = DateTime.UtcNow
            };

        private static AuthUserInfoDTO MapUserInfo(User user, List<string> roles) =>
            new()
            {
                Id = user.Id,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                IsActive = user.IsActive,
                Roles = roles ?? new List<string>()
            };
    }
}