using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventDTO>> GetAllAsync(EventSearchQueryDTO? query = null);

        Task<EventDTO?> GetByIdAsync(int id);

        Task<EventDTO> CreateAsync(CreateEventDTO dto, int actingUserId, bool isAdmin);

        Task<EventDTO?> UpdateAsync(int id, UpdateEventDTO dto, int actingUserId, bool isAdmin);

        Task<bool> DeleteAsync(int id, int actingUserId, bool isAdmin);
    }
}
