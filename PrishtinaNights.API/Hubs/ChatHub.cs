using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace PrishtinaNights.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    public async Task JoinRoom(string roomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }

    public async Task LeaveRoom(string roomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
    }

    /// <summary>Broadcasts a message to everyone in the room (including sender).</summary>
    public async Task SendMessage(string roomId, string message)
    {
        var userId = Context.UserIdentifier ?? "anonymous";
        await Clients.Group(roomId).SendAsync("ReceiveMessage", userId, message, DateTime.UtcNow);
    }
}
