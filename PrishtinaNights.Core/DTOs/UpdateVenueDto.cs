using System.ComponentModel.DataAnnotations;

namespace PrishtinaNights.Core.DTOs
{
    public class UpdateVenueDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can't exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, ErrorMessage = "Description can't exceed 500 characters")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(200, ErrorMessage = "Address can't exceed 200 characters")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        [StringLength(100, ErrorMessage = "City can't exceed 100 characters")]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "OwnerId is required")]
        public int OwnerId { get; set; }

        public bool IsActive { get; set; }
    }
}