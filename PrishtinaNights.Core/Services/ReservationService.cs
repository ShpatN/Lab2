using PrishtinaNights.Core;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _reservationRepository;

        public ReservationService(IReservationRepository reservationRepository)
        {
            _reservationRepository = reservationRepository;
        }

        public async Task<int> CreateReservationAsync(CreateReservationDTO dto)
        {
            if (await _reservationRepository.HasDuplicateUserVenueDateTimeAsync(dto.UserId, dto.VenueId, dto.ReservationDate))
                throw new Exception("You already have a reservation for this venue and time.");

            if (dto.TableId.HasValue)
            {
                var isReserved = await _reservationRepository
                    .IsTableReservedAsync(dto.TableId.Value, dto.ReservationDate);

                if (isReserved)
                    throw new Exception("Table is already reserved for this time.");
            }

            var reservation = new Reservation
            {
                UserId = dto.UserId,
                VenueId = dto.VenueId,
                TableId = dto.TableId,
                EventId = dto.EventId,
                ReservationDate = dto.ReservationDate,
                NumberOfPeople = dto.NumberOfPeople,
                Status = "pending",
                SpecialRequests = dto.SpecialRequests ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            await _reservationRepository.AddAsync(reservation);

            return reservation.Id;
        }

        public async Task<int> CreateForUserAsync(int userId, CreateReservationRequestDTO body)
        {
            var dto = new CreateReservationDTO
            {
                UserId = userId,
                VenueId = body.VenueId,
                TableId = body.TableId,
                EventId = body.EventId,
                ReservationDate = body.ReservationDate,
                NumberOfPeople = body.NumberOfPeople,
                SpecialRequests = body.SpecialRequests
            };

            return await CreateReservationAsync(dto);
        }

        public async Task<IReadOnlyList<ReservationListItemDTO>> GetMyReservationsAsync(int userId)
        {
            var list = await _reservationRepository.GetByUserIdWithDetailsAsync(userId);
            return list.Select(MapToListItem).ToList();
        }

        public async Task<IReadOnlyList<ReservationListItemDTO>> GetReservationsForVenuesIOwnAsync(int ownerUserId)
        {
            var list = await _reservationRepository.GetForVenuesOwnedByUserAsync(ownerUserId);
            return list.Select(MapToListItem).ToList();
        }

        public async Task<Reservation?> GetByIdForUserAsync(int id, int actingUserId, bool isAdmin)
        {
            var r = await _reservationRepository.GetByIdWithVenueAsync(id);
            if (r == null) return null;
            if (isAdmin) return r;
            if (r.UserId == actingUserId) return r;
            if (r.Venue != null && r.Venue.OwnerId == actingUserId) return r;
            return null;
        }

        public async Task UpdateAsync(UpdateReservationDTO dto, int actingUserId, bool isAdmin)
        {
            var existing = await _reservationRepository.GetByIdAsync(dto.Id);

            if (existing == null)
                throw new Exception("Reservation not found");

            if (!isAdmin && existing.UserId != actingUserId)
                throw new ForbiddenException("You can only update your own reservations.");

            if (dto.TableId.HasValue)
            {
                var isReserved = await _reservationRepository
                    .IsTableReservedAsync(dto.TableId.Value, dto.ReservationDate);

                if (isReserved && existing.TableId != dto.TableId)
                    throw new Exception("Table is already reserved for this time.");
            }

            existing.TableId = dto.TableId;
            existing.ReservationDate = dto.ReservationDate;
            existing.NumberOfPeople = dto.NumberOfPeople;
            existing.SpecialRequests = dto.SpecialRequests ?? string.Empty;
            existing.UpdatedAt = DateTime.UtcNow;

            await _reservationRepository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id, int actingUserId, bool isAdmin)
        {
            var existing = await _reservationRepository.GetByIdAsync(id);
            if (existing == null)
                throw new Exception("Reservation not found");
            if (!isAdmin && existing.UserId != actingUserId)
                throw new ForbiddenException("You can only cancel your own reservations.");
            await _reservationRepository.DeleteAsync(id);
        }

        public async Task<ReservationStatusUpdateResultDTO> UpdateStatusAsync(int id, string status, int actingUserId, bool isAdmin)
        {
            var normalized = (status ?? string.Empty).Trim().ToLowerInvariant();
            if (normalized != "accepted" && normalized != "declined")
                throw new Exception("Status must be either 'accepted' or 'declined'.");

            var existing = await _reservationRepository.GetByIdWithVenueAsync(id);
            if (existing == null)
                throw new Exception("Reservation not found");

            if (!isAdmin)
            {
                if (existing.Venue == null || existing.Venue.OwnerId != actingUserId)
                    throw new ForbiddenException("You can only manage reservation requests for your own venues.");
            }

            var current = (existing.Status ?? string.Empty).Trim().ToLowerInvariant();
            if (current != "pending")
                throw new Exception("Only pending reservations can be updated.");

            existing.Status = normalized;
            existing.UpdatedAt = DateTime.UtcNow;
            await _reservationRepository.UpdateAsync(existing);

            return new ReservationStatusUpdateResultDTO
            {
                ReservationId = existing.Id,
                UserId = existing.UserId,
                VenueId = existing.VenueId,
                Status = normalized,
            };
        }

        private static ReservationListItemDTO MapToListItem(Reservation r)
        {
            var dt = r.ReservationDate;
            var status = (r.Status ?? "Pending").Trim().ToLowerInvariant();

            var tableType = r.Table != null
                ? $"{(r.Table.IsVip ? "VIP " : string.Empty)}{r.Table.TableName}".Trim()
                : "General";

            return new ReservationListItemDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                VenueId = r.VenueId,
                VenueName = r.Venue?.Name ?? "Venue",
                EventId = r.EventId,
                EventName = r.Event?.Name,
                TableType = string.IsNullOrEmpty(tableType) ? "General" : tableType,
                Guests = r.NumberOfPeople,
                Date = dt.ToString("yyyy-MM-dd"),
                Time = dt.ToString("h:mm tt"),
                Status = status,
                TotalPrice = 0m,
                CreatedAt = r.CreatedAt.ToString("yyyy-MM-dd")
            };
        }
    }
}
