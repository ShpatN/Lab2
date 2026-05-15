using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IEventCategoryService
    {
        Task<IEnumerable<EventCategoryDTO>> GetAllAsync();
        Task<EventCategoryDTO?> GetByIdAsync(int id);
        Task<EventCategoryDTO> CreateAsync(CreateEventCategoryDTO dto);
        Task<EventCategoryDTO?> UpdateAsync(int id, UpdateEventCategoryDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}