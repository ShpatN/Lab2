using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface ITicketTypeService
    {
        Task<IEnumerable<TicketTypeDTO>> GetAllAsync();

        Task<TicketTypeDTO?> GetByIdAsync(int id);

        Task<TicketTypeDTO> CreateAsync(CreateTicketTypeDTO dto, int actingUserId, bool isAdmin);

        Task<TicketTypeDTO?> UpdateAsync(int id, UpdateTicketTypeDTO dto, int actingUserId, bool isAdmin);

        Task<bool> DeleteAsync(int id, int actingUserId, bool isAdmin);
    }
}
