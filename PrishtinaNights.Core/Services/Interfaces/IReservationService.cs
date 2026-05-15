using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IReservationService
    {
        Task<int> CreateReservationAsync(CreateReservationDTO dto);

        Task<int> CreateForUserAsync(int userId, CreateReservationRequestDTO body);

        Task<IReadOnlyList<ReservationListItemDTO>> GetMyReservationsAsync(int userId);

        Task<IReadOnlyList<ReservationListItemDTO>> GetReservationsForVenuesIOwnAsync(int ownerUserId);

        Task<Reservation?> GetByIdForUserAsync(int id, int actingUserId, bool isAdmin);

        Task UpdateAsync(UpdateReservationDTO dto, int actingUserId, bool isAdmin);

        Task<ReservationStatusUpdateResultDTO> UpdateStatusAsync(int id, string status, int actingUserId, bool isAdmin);

        Task DeleteAsync(int id, int actingUserId, bool isAdmin);
    }
}
