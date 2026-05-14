namespace PrishtinaNights.Core.DTOs;

/// <summary>Reservation row for customer/owner dashboards (camelCase JSON).</summary>
public class ReservationListItemDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int VenueId { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public int? EventId { get; set; }
    public string? EventName { get; set; }
    public string TableType { get; set; } = string.Empty;
    public int Guests { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}
