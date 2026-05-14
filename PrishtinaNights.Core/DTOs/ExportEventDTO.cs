namespace PrishtinaNights.Core.DTOs
{
    public class ExportEventDTO
    {
        public int EventId { get; set; }
        public int VenueId { get; set; }
        public string VenueName { get; set; } = string.Empty;
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
