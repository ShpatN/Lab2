using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IVenueService
    {
        Task<IEnumerable<VenueDTO>> GetAllAsync();
        Task<VenueDTO?> GetByIdAsync(int id);
        Task<VenueDTO> CreateAsync(CreateVenueDTO dto);
        Task<VenueDTO?> UpdateAsync(int id, UpdateVenueDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}