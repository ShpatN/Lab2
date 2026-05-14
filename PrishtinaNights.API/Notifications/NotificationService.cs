using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace PrishtinaNights.API.Notifications;

public class NotificationService : INotificationService
{
    private readonly IMongoCollection<NotificationDocument> _collection;

    public NotificationService(IMongoClient client, IOptions<MongoDbSettings> options)
    {
        var cfg = options.Value;
        var db = client.GetDatabase(cfg.DatabaseName);
        _collection = db.GetCollection<NotificationDocument>(cfg.NotificationsCollectionName);
    }

    public async Task<IReadOnlyList<NotificationDTO>> GetForUserAsync(int userId)
    {
        var docs = await _collection
            .Find(n => n.UserId == userId)
            .SortByDescending(n => n.CreatedAt)
            .Limit(100)
            .ToListAsync();
        return docs.Select(Map).ToList();
    }

    public async Task<NotificationDTO> CreateAsync(int userId, string title, string message, string type)
    {
        var doc = new NotificationDocument
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            CreatedAt = DateTime.UtcNow,
            IsRead = false,
        };
        await _collection.InsertOneAsync(doc);
        return Map(doc);
    }

    public async Task<bool> MarkReadAsync(string id, int userId)
    {
        var update = Builders<NotificationDocument>.Update.Set(x => x.IsRead, true);
        var result = await _collection.UpdateOneAsync(x => x.Id == id && x.UserId == userId, update);
        return result.ModifiedCount > 0;
    }

    public async Task<int> MarkAllReadAsync(int userId)
    {
        var update = Builders<NotificationDocument>.Update.Set(x => x.IsRead, true);
        var result = await _collection.UpdateManyAsync(x => x.UserId == userId && !x.IsRead, update);
        return (int)result.ModifiedCount;
    }

    private static NotificationDTO Map(NotificationDocument d) =>
        new()
        {
            Id = d.Id,
            UserId = d.UserId,
            Title = d.Title,
            Message = d.Message,
            Type = d.Type,
            CreatedAt = d.CreatedAt,
            IsRead = d.IsRead,
        };
}
