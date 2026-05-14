using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<int> CreatePaymentAsync(CreatePaymentDTO dto, int actingUserId, bool isAdmin);

        Task<IEnumerable<Payment>> GetAllForUserAsync(int actingUserId, bool isAdmin);

        Task<Payment?> GetByIdForUserAsync(int id, int actingUserId, bool isAdmin);

        Task UpdateStatusAsync(UpdatePaymentStatusDTO dto, int actingUserId, bool isAdmin);
    }
}
