using System.ComponentModel.DataAnnotations;

namespace PrishtinaNights.Core.DTOs
{
    public class RefreshTokenRequestDTO
    {
        [Required(ErrorMessage = "Refresh token is required")]
        public string RefreshToken { get; set; } = string.Empty;
    }
}