using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IVenueRepository
    {
        Task<IEnumerable<Venue>> GetAllAsync();
        Task<Venue?> GetByIdAsync(int id);
        Task<Venue> AddAsync(Venue venue);
        Task<Venue?> UpdateAsync(Venue venue);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}