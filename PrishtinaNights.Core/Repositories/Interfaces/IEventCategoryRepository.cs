using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IEventCategoryRepository
    {
        Task<IEnumerable<EventCategory>> GetAllAsync();
        Task<EventCategory?> GetByIdAsync(int id);
        Task<EventCategory> CreateAsync(EventCategory entity);
        Task<EventCategory?> UpdateAsync(EventCategory entity);
        Task<bool> DeleteAsync(int id);
    }
}