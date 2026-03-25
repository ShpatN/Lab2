using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(ApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        //  REGISTER ENDPOINT
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDTO request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
                return BadRequest("Email already exists");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");

            if (role != null)
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id
                });

                await _context.SaveChangesAsync();
            }

            return Ok("User registered successfully");
        }

        //  LOGIN ENDPOINT
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginRequestDTO request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

            var isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isValid)
                return Unauthorized("Invalid credentials");

            //  GET ROLES
            var roles = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Include(ur => ur.Role)
                .Select(ur => ur.Role.Name)
                .ToListAsync();

            //  GET PERMISSIONS (NEW)
            var permissions = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Include(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Name)
                .Distinct()
                .ToListAsync();

            var accessToken = _tokenService.GenerateAccessToken(user, roles, permissions);
            var refreshToken = _tokenService.GenerateRefreshToken();

            _context.RefreshTokens.Add(new RefreshToken
            {
                UserId = user.Id,
                TokenHash = refreshToken,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });
        }

        //  REFRESH TOKEN ENDPOINT
        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponseDTO>> RefreshToken(RefreshTokenRequestDTO request)
        {
            var existingToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.TokenHash == request.RefreshToken);

            if (existingToken == null)
                return Unauthorized("Invalid refresh token");

            var user = existingToken.User;

            // GET ROLES
            var roles = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Include(ur => ur.Role)
                .Select(ur => ur.Role.Name)
                .ToListAsync();

            // GET PERMISSIONS (NEW)
            var permissions = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Include(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Name)
                .Distinct()
                .ToListAsync();

            var newAccessToken = _tokenService.GenerateAccessToken(user, roles, permissions);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            _context.RefreshTokens.Remove(existingToken);

            _context.RefreshTokens.Add(new RefreshToken
            {
                UserId = user.Id,
                TokenHash = newRefreshToken,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDTO
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        // LOGOUT ENDPOINT
        [HttpPost("logout")]
        public async Task<IActionResult> Logout(RefreshTokenRequestDTO request)
        {
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.TokenHash == request.RefreshToken);

            if (token == null)
                return NotFound("Token not found");

            _context.RefreshTokens.Remove(token);
            await _context.SaveChangesAsync();

            return Ok("Logged out successfully");
        }
    }
}