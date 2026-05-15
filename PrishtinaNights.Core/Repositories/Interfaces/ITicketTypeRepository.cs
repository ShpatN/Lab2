using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface ITicketTypeRepository
    {
        Task<IEnumerable<TicketType>> GetAllAsync();
        Task<TicketType?> GetByIdAsync(int id);
        Task<TicketType> CreateAsync(TicketType entity);
        Task<TicketType?> UpdateAsync(TicketType entity);
        Task<bool> DeleteAsync(int id);
    }
}