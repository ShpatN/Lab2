namespace PrishtinaNights.Core.DTOs
{
    public class ExportReservationDTO
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public int VenueId { get; set; }
        public string VenueName { get; set; } = string.Empty;
        public int? EventId { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime ReservationDate { get; set; }
        public int NumberOfPeople { get; set; }
        public string Status { get; set; } = string.Empty;
        public string SpecialRequests { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
