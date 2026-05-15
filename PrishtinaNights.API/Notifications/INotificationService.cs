namespace PrishtinaNights.API.Notifications;

public interface INotificationService
{
    Task<IReadOnlyList<NotificationDTO>> GetForUserAsync(int userId);
    Task<NotificationDTO> CreateAsync(int userId, string title, string message, string type);
    Task<bool> MarkReadAsync(string id, int userId);
    Task<int> MarkAllReadAsync(int userId);
}
