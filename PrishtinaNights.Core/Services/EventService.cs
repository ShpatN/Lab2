using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IVenueRepository _venueRepository;

        public EventService(IEventRepository eventRepository, IVenueRepository venueRepository)
        {
            _eventRepository = eventRepository;
            _venueRepository = venueRepository;
        }

        private async Task EnsureUserOwnsVenueAsync(int venueId, int actingUserId, bool isAdmin)
        {
            if (isAdmin) return;
            var venue = await _venueRepository.GetByIdAsync(venueId);
            if (venue == null)
                throw new Exception("Venue not found.");
            if (venue.OwnerId != actingUserId)
                throw new ForbiddenException("You can only manage events at venues you own.");
        }

        public async Task<IEnumerable<EventDTO>> GetAllAsync(EventSearchQueryDTO? query = null)
        {
            var events = await _eventRepository.GetAllAsync(query);

            return events.Select(e => new EventDTO
            {
                Id = e.Id,
                VenueId = e.VenueId,
                CategoryId = e.CategoryId,
                CategoryName = e.Category?.Name,
                Name = e.Name,
                Description = e.Description,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                IsActive = e.IsActive
            });
        }

        public async Task<EventDTO?> GetByIdAsync(int id)
        {
            var e = await _eventRepository.GetByIdAsync(id);
            if (e == null) return null;

            return new EventDTO
            {
                Id = e.Id,
                VenueId = e.VenueId,
                CategoryId = e.CategoryId,
                CategoryName = e.Category?.Name,
                Name = e.Name,
                Description = e.Description,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                IsActive = e.IsActive
            };
        }

        public async Task<EventDTO> CreateAsync(CreateEventDTO dto, int actingUserId, bool isAdmin)
        {
            var venueExists = await _venueRepository.ExistsAsync(dto.VenueId);
            if (!venueExists)
                throw new Exception("Venue not found.");

            await EnsureUserOwnsVenueAsync(dto.VenueId, actingUserId, isAdmin);

            var entity = new Event
            {
                VenueId = dto.VenueId,
                CategoryId = dto.CategoryId,
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _eventRepository.CreateAsync(entity);

            return new EventDTO
            {
                Id = created.Id,
                VenueId = created.VenueId,
                CategoryId = created.CategoryId,
                CategoryName = created.Category?.Name,
                Name = created.Name,
                Description = created.Description,
                StartDate = created.StartDate,
                EndDate = created.EndDate,
                IsActive = created.IsActive
            };
        }

        public async Task<EventDTO?> UpdateAsync(int id, UpdateEventDTO dto, int actingUserId, bool isAdmin)
        {
            var existing = await _eventRepository.GetByIdAsync(id);
            if (existing == null) return null;

            await EnsureUserOwnsVenueAsync(existing.VenueId, actingUserId, isAdmin);

            var venueExists = await _venueRepository.ExistsAsync(dto.VenueId);
            if (!venueExists)
                throw new Exception("Venue not found.");

            await EnsureUserOwnsVenueAsync(dto.VenueId, actingUserId, isAdmin);

            existing.VenueId = dto.VenueId;
            existing.CategoryId = dto.CategoryId;
            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.StartDate = dto.StartDate;
            existing.EndDate = dto.EndDate;
            existing.IsActive = dto.IsActive;
            existing.UpdatedAt = DateTime.UtcNow;

            var updated = await _eventRepository.UpdateAsync(existing);
            if (updated == null) return null;

            return new EventDTO
            {
                Id = updated.Id,
                VenueId = updated.VenueId,
                CategoryId = updated.CategoryId,
                CategoryName = updated.Category?.Name,
                Name = updated.Name,
                Description = updated.Description,
                StartDate = updated.StartDate,
                EndDate = updated.EndDate,
                IsActive = updated.IsActive
            };
        }

        public async Task<bool> DeleteAsync(int id, int actingUserId, bool isAdmin)
        {
            var existing = await _eventRepository.GetByIdAsync(id);
            if (existing == null) return false;

            await EnsureUserOwnsVenueAsync(existing.VenueId, actingUserId, isAdmin);

            return await _eventRepository.DeleteAsync(id);
        }
    }
}