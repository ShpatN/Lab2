namespace PrishtinaNights.Core.DTOs;

public class ReservationStatusUpdateResultDTO
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }
    public int VenueId { get; set; }
    public string Status { get; set; } = string.Empty;
}
