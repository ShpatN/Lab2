namespace PrishtinaNights.Core.DTOs
{
    public class EventDTO
    {
        public int Id { get; set; }
        public int VenueId { get; set; }
        public int? CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}