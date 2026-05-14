using System.ComponentModel.DataAnnotations;

namespace PrishtinaNights.Core.DTOs;

/// <summary>POST body for creating a reservation (user comes from JWT).</summary>
public class CreateReservationRequestDTO
{
    [Required]
    [Range(1, int.MaxValue)]
    public int VenueId { get; set; }

    public int? TableId { get; set; }

    public int? EventId { get; set; }

    [Required]
    public DateTime ReservationDate { get; set; }

    [Required]
    [Range(1, 500)]
    public int NumberOfPeople { get; set; }

    public string? SpecialRequests { get; set; }
}
