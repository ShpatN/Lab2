namespace PrishtinaNights.Core.DTOs;

public class EventSearchQueryDTO
{
    public string? Keyword { get; set; }
    public string? Category { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string? TimeFrom { get; set; }
    public string? SortBy { get; set; } = "date";
    public string? SortDirection { get; set; } = "asc";
}
