using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface ITicketTypeService
    {
        Task<IEnumerable<TicketTypeDTO>> GetAllAsync();
        Task<TicketTypeDTO?> GetByIdAsync(int id);
        Task<TicketTypeDTO> CreateAsync(CreateTicketTypeDTO dto);
        Task<TicketTypeDTO?> UpdateAsync(int id, UpdateTicketTypeDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}