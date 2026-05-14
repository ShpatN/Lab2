using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.API.Hubs;
using PrishtinaNights.API.Notifications;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/reservations")]
    [Authorize]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ReservationController(
            IReservationService reservationService,
            INotificationService notificationService,
            IHubContext<ChatHub> hubContext)
        {
            _reservationService = reservationService;
            _notificationService = notificationService;
            _hubContext = hubContext;
        }

        /// <summary>Current user's reservations, or reservations at venues they own when asVenueOwner=true.</summary>
        [HttpGet]
        public async Task<IActionResult> GetMine([FromQuery] bool asVenueOwner = false)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();
            var list = asVenueOwner
                ? await _reservationService.GetReservationsForVenuesIOwnAsync(userId)
                : await _reservationService.GetMyReservationsAsync(userId);
            return Ok(list);
        }

        [HttpPost]
        [Consumes("application/json")]
        public async Task<IActionResult> Create([FromBody] CreateReservationRequestDTO? body)
        {
            if (body is null)
                return BadRequest(new { message = "Send a JSON body. Content-Type must be application/json." });

            if (!User.TryGetUserId(out var userId))
                return Unauthorized();
            var id = await _reservationService.CreateForUserAsync(userId, body);

            var reservation = await _reservationService.GetByIdForUserAsync(id, userId, User.IsAdmin());
            var ownerUserId = reservation?.Venue?.OwnerId;
            if (reservation != null && ownerUserId.HasValue && ownerUserId.Value != userId)
            {
                var message = $"New reservation request for {reservation.Venue?.Name ?? "your venue"}.";
                await _notificationService.CreateAsync(
                    ownerUserId.Value,
                    "New reservation request",
                    message,
                    "reservation-created");
                await _hubContext.Clients.Group($"venue-{reservation.VenueId}")
                    .SendAsync("ReceiveMessage", userId.ToString(), message, DateTime.UtcNow);
            }
            return Ok(new { reservationId = id });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var reservation = await _reservationService.GetByIdForUserAsync(id, userId, User.IsAdmin());

            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateReservationDTO dto)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            await _reservationService.UpdateAsync(dto, userId, User.IsAdmin());
            return Ok("Reservation updated successfully");
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            await _reservationService.DeleteAsync(id, userId, User.IsAdmin());
            return Ok("Reservation deleted successfully");
        }

        [HttpPut("{id:int}/status")]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateReservationStatusDTO dto)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var result = await _reservationService.UpdateStatusAsync(id, dto.Status, userId, User.IsAdmin());

            var title = result.Status == "accepted" ? "Reservation accepted" : "Reservation declined";
            var message = result.Status == "accepted"
                ? "Your reservation has been accepted by the venue."
                : "Your reservation has been declined by the venue.";
            await _notificationService.CreateAsync(result.UserId, title, message, $"reservation-{result.Status}");
            var signalrPayload = JsonSerializer.Serialize(new
            {
                kind = "reservation-status",
                reservationId = result.ReservationId,
                status = result.Status,
                venueId = result.VenueId,
            });
            await _hubContext.Clients.Group($"user-{result.UserId}")
                .SendAsync("ReceiveMessage", userId.ToString(), signalrPayload, DateTime.UtcNow);

            return Ok(result);
        }
    }
}
