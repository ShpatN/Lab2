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

        public async Task<IEnumerable<EventDTO>> GetAllAsync()
        {
            var events = await _eventRepository.GetAllAsync();

            return events.Select(e => new EventDTO
            {
                Id = e.Id,
                VenueId = e.VenueId,
                CategoryId = e.CategoryId,
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
                Name = e.Name,
                Description = e.Description,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                IsActive = e.IsActive
            };
        }

        public async Task<EventDTO> CreateAsync(CreateEventDTO dto)
        {
            var venueExists = await _venueRepository.ExistsAsync(dto.VenueId);
            if (!venueExists)
                throw new Exception("Venue not found.");

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
                Name = created.Name,
                Description = created.Description,
                StartDate = created.StartDate,
                EndDate = created.EndDate,
                IsActive = created.IsActive
            };
        }

        public async Task<EventDTO?> UpdateAsync(int id, UpdateEventDTO dto)
        {
            var existing = await _eventRepository.GetByIdAsync(id);
            if (existing == null) return null;

            var venueExists = await _venueRepository.ExistsAsync(dto.VenueId);
            if (!venueExists)
                throw new Exception("Venue not found.");

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
                Name = updated.Name,
                Description = updated.Description,
                StartDate = updated.StartDate,
                EndDate = updated.EndDate,
                IsActive = updated.IsActive
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _eventRepository.DeleteAsync(id);
        }
    }
}