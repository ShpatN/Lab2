using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IExportService
    {
        Task<IReadOnlyList<ExportReservationDTO>> GetReservationsAsync(int userId, bool isAdmin, bool isVenueOwner, string scope);
        Task<IReadOnlyList<ExportPaymentDTO>> GetPaymentsAsync(int userId, bool isAdmin, bool isVenueOwner, string scope);
        Task<IReadOnlyList<ExportEventDTO>> GetEventsAsync(int userId, bool isAdmin, bool isVenueOwner, string scope);
    }
}
