using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        [Consumes("application/json")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO? request)
        {
            if (request is null)
                return BadRequest(new { message = "Send a JSON body with email and password. Content-Type must be application/json." });

            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        [Consumes("application/json")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO? request)
        {
            if (request is null)
                return BadRequest(new { message = "Send a JSON body with email, password, firstName, and lastName. Content-Type must be application/json." });

            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }

        // ================= REFRESH =================
        [HttpPost("refresh")]
        [Consumes("application/json")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDTO? request)
        {
            if (request is null)
                return BadRequest(new { message = "Send a JSON body with refreshToken. Content-Type must be application/json." });

            var result = await _authService.RefreshTokenAsync(request);
            return Ok(result);
        }

        // ================= LOGOUT =================
        [HttpPost("logout")]
        [Consumes("application/json")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDTO? request)
        {
            if (request is null)
                return BadRequest(new { message = "Send a JSON body with refreshToken. Content-Type must be application/json." });

            await _authService.LogoutAsync(request);
            return Ok("Logged out successfully");
        }
    }
}