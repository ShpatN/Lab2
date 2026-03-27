using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;
using BCrypt.Net;

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

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
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

            //  AUDIT LOG
            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = user.Id,
                Action = "LOGIN",
                Entity = "User",
                EntityId = user.Id,
                CreatedAt = DateTime.UtcNow
            });

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
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

            //  AUDIT LOG
            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = user.Id,
                Action = "REFRESH_TOKEN",
                Entity = "Auth",
                EntityId = user.Id,
                CreatedAt = DateTime.UtcNow
            });

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = newRefreshToken
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

            //  AUDIT LOG
            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = token.UserId,
                Action = "LOGOUT",
                Entity = "Auth",
                EntityId = token.UserId,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}