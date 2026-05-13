using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request);
        Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request);
        Task<AuthResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request);
        Task LogoutAsync(RefreshTokenRequestDTO request);
    }
}