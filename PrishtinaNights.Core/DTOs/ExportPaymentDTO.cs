namespace PrishtinaNights.Core.DTOs
{
    public class ExportPaymentDTO
    {
        public int PaymentId { get; set; }
        public int UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public int? ReservationId { get; set; }
        public int? VenueId { get; set; }
        public string VenueName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
