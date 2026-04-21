using System.ComponentModel.DataAnnotations;

namespace PrishtinaNights.Core.DTOs
{
    public class UpdateTicketTypeDTO
    {
        [Required(ErrorMessage = "EventId is required")]
        public int EventId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can't exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be 0 or greater")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be 0 or greater")]
        public int Quantity { get; set; }
    }
}