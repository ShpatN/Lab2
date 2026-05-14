namespace PrishtinaNights.API.Notifications;

public class NotificationDTO
{
    public string Id { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}
