using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class EventCategoryService : IEventCategoryService
    {
        private readonly IEventCategoryRepository _eventCategoryRepository;

        public EventCategoryService(IEventCategoryRepository eventCategoryRepository)
        {
            _eventCategoryRepository = eventCategoryRepository;
        }

        public async Task<IEnumerable<EventCategoryDTO>> GetAllAsync()
        {
            var categories = await _eventCategoryRepository.GetAllAsync();

            return categories.Select(c => new EventCategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                CreatedBy = c.CreatedBy,
                UpdatedBy = c.UpdatedBy
            });
        }

        public async Task<EventCategoryDTO?> GetByIdAsync(int id)
        {
            var category = await _eventCategoryRepository.GetByIdAsync(id);
            if (category == null) return null;

            return new EventCategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt,
                CreatedBy = category.CreatedBy,
                UpdatedBy = category.UpdatedBy
            };
        }

        public async Task<EventCategoryDTO> CreateAsync(CreateEventCategoryDTO dto)
        {
            var entity = new EventCategory
            {
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _eventCategoryRepository.CreateAsync(entity);

            return new EventCategoryDTO
            {
                Id = created.Id,
                Name = created.Name,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt,
                CreatedBy = created.CreatedBy,
                UpdatedBy = created.UpdatedBy
            };
        }

        public async Task<EventCategoryDTO?> UpdateAsync(int id, UpdateEventCategoryDTO dto)
        {
            var existing = await _eventCategoryRepository.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Name = dto.Name;
            existing.UpdatedAt = DateTime.UtcNow;

            var updated = await _eventCategoryRepository.UpdateAsync(existing);
            if (updated == null) return null;

            return new EventCategoryDTO
            {
                Id = updated.Id,
                Name = updated.Name,
                CreatedAt = updated.CreatedAt,
                UpdatedAt = updated.UpdatedAt,
                CreatedBy = updated.CreatedBy,
                UpdatedBy = updated.UpdatedBy
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _eventCategoryRepository.DeleteAsync(id);
        }
    }
}