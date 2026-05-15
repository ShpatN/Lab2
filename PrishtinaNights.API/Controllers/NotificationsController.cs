using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.API.Notifications;

namespace PrishtinaNights.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notifications;

    public NotificationsController(INotificationService notifications)
    {
        _notifications = notifications;
    }

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();
        var rows = await _notifications.GetForUserAsync(userId);
        return Ok(rows);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(string id)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();
        var updated = await _notifications.MarkReadAsync(id, userId);
        if (!updated) return NotFound();
        return Ok(new { id, isRead = true });
    }
}
