namespace PrishtinaNights.Core.DTOs;

public class VenueSearchQueryDTO
{
    public string? Keyword { get; set; }
    public string? Category { get; set; }
    public string? SortBy { get; set; } = "name";
    public string? SortDirection { get; set; } = "asc";
}
