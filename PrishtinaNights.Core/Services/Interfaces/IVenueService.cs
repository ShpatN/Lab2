using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IVenueService
    {
        Task<IEnumerable<VenueDTO>> GetAllAsync(VenueSearchQueryDTO? query = null);

        Task<VenueDTO?> GetByIdAsync(int id);

        Task<VenueDTO> CreateAsync(CreateVenueDTO dto, int actingUserId, bool isAdmin);

        Task<VenueDTO?> UpdateAsync(int id, UpdateVenueDTO dto, int actingUserId, bool isAdmin);

        Task<bool> DeleteAsync(int id, int actingUserId, bool isAdmin);
    }
}
