using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/venues")]
    public class VenueController : ControllerBase
    {
        private readonly IVenueService _venueService;

        public VenueController(IVenueService venueService)
        {
            _venueService = venueService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] VenueSearchQueryDTO query)
        {
            var venues = await _venueService.GetAllAsync(query);
            return Ok(venues);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var venue = await _venueService.GetByIdAsync(id);

            if (venue == null)
                return NotFound();

            return Ok(venue);
        }

        [HttpPost]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> Create([FromBody] CreateVenueDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var created = await _venueService.CreateAsync(dto, userId, User.IsAdmin());

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = AuthorizationPolicies.VenueOwnerOrAdmin)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVenueDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var updated = await _venueService.UpdateAsync(id, dto, userId, User.IsAdmin());

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

            var deleted = await _venueService.DeleteAsync(id, userId, User.IsAdmin());

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
