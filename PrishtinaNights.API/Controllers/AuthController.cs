using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }

        // ================= REFRESH =================
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDTO request)
        {
            var result = await _authService.RefreshTokenAsync(request);
            return Ok(result);
        }

        // ================= LOGOUT =================
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDTO request)
        {
            await _authService.LogoutAsync(request);
            return Ok("Logged out successfully");
        }
    }
}