using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/events")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] EventSearchQueryDTO query)
        {
            var events = await _eventService.GetAllAsync(query);
            return Ok(events);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _eventService.GetByIdAsync(id);

            if (ev == null)
                return NotFound();

            return Ok(ev);
        }

        [HttpPost]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> Create([FromBody] CreateEventDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var created = await _eventService.CreateAsync(dto, userId, User.IsAdmin());
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEventDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var updated = await _eventService.UpdateAsync(id, dto, userId, User.IsAdmin());

            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> Delete(int id)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var deleted = await _eventService.DeleteAsync(id, userId, User.IsAdmin());

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
