namespace PrishtinaNights.API.Notifications;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";
    public string DatabaseName { get; set; } = "PrishtinaNights";
    public string NotificationsCollectionName { get; set; } = "notifications";
}
