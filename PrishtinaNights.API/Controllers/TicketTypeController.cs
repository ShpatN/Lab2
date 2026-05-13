using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketTypeController : ControllerBase
    {
        private readonly ITicketTypeService _ticketTypeService;

        public TicketTypeController(ITicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var ticketTypes = await _ticketTypeService.GetAllAsync();
            return Ok(ticketTypes);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var ticketType = await _ticketTypeService.GetByIdAsync(id);

            if (ticketType == null)
                return NotFound();

            return Ok(ticketType);
        }

        [HttpPost]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> Create([FromBody] CreateTicketTypeDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var created = await _ticketTypeService.CreateAsync(dto, userId, User.IsAdmin());
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTicketTypeDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var updated = await _ticketTypeService.UpdateAsync(id, dto, userId, User.IsAdmin());

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

            var deleted = await _ticketTypeService.DeleteAsync(id, userId, User.IsAdmin());

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
