using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync(EventSearchQueryDTO? query = null);
        Task<Event?> GetByIdAsync(int id);
        Task<Event> CreateAsync(Event entity);
        Task<Event?> UpdateAsync(Event entity);
        Task<bool> DeleteAsync(int id);
    }
}