using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IVenueService
    {
        Task<IEnumerable<VenueDto>> GetAllAsync();
        Task<VenueDto?> GetByIdAsync(int id);
        Task<VenueDto> CreateAsync(CreateVenueDto dto);
        Task<VenueDto?> UpdateAsync(int id, UpdateVenueDto dto);
        Task<bool> DeleteAsync(int id);
    }
}