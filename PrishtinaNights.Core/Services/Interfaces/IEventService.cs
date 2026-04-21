using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventDTO>> GetAllAsync();
        Task<EventDTO?> GetByIdAsync(int id);
        Task<EventDTO> CreateAsync(CreateEventDTO dto);
        Task<EventDTO?> UpdateAsync(int id, UpdateEventDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}