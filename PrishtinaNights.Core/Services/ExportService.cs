using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class ExportService : IExportService
    {
        private readonly ApplicationDbContext _db;

        public ExportService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IReadOnlyList<ExportReservationDTO>> GetReservationsAsync(int userId, bool isAdmin, bool isVenueOwner, string scope)
        {
            var normalizedScope = NormalizeScope(scope, isAdmin, isVenueOwner);
            var query = _db.Reservations
                .AsNoTracking()
                .Include(r => r.User)
                .Include(r => r.Venue)
                .Include(r => r.Event)
                .AsQueryable();

            query = normalizedScope switch
            {
                "all" => query,
                "venue" => query.Where(r => r.Venue != null && r.Venue.OwnerId == userId),
                _ => query.Where(r => r.UserId == userId),
            };

            var rows = await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ExportReservationDTO
                {
                    ReservationId = r.Id,
                    UserId = r.UserId,
                    UserEmail = r.User != null ? (r.User.Email ?? string.Empty) : string.Empty,
                    VenueId = r.VenueId,
                    VenueName = r.Venue != null ? (r.Venue.Name ?? string.Empty) : string.Empty,
                    EventId = r.EventId,
                    EventName = r.Event != null ? r.Event.Name : string.Empty,
                    ReservationDate = r.ReservationDate,
                    NumberOfPeople = r.NumberOfPeople,
                    Status = r.Status,
                    SpecialRequests = r.SpecialRequests ?? string.Empty,
                    CreatedAt = r.CreatedAt,
                })
                .ToListAsync();

            return rows;
        }

        public async Task<IReadOnlyList<ExportPaymentDTO>> GetPaymentsAsync(int userId, bool isAdmin, bool isVenueOwner, string scope)
        {
            var normalizedScope = NormalizeScope(scope, isAdmin, isVenueOwner);
            var query = _db.Payments
                .AsNoTracking()
                .Include(p => p.User)
                .Include(p => p.Reservation)
                    .ThenInclude(r => r.Venue)
                .AsQueryable();

            query = normalizedScope switch
            {
                "all" => query,
                "venue" => query.Where(p => p.Reservation != null && p.Reservation.Venue.OwnerId == userId),
                _ => query.Where(p => p.UserId == userId),
            };

            var rows = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ExportPaymentDTO
                {
                    PaymentId = p.Id,
                    UserId = p.UserId,
                    UserEmail = p.User != null ? (p.User.Email ?? string.Empty) : string.Empty,
                    ReservationId = p.ReservationId,
                    VenueId = p.Reservation != null ? p.Reservation.VenueId : null,
                    VenueName = p.Reservation != null && p.Reservation.Venue != null ? (p.Reservation.Venue.Name ?? string.Empty) : string.Empty,
                    Amount = p.Amount,
                    Status = p.Status,
                    CreatedAt = p.CreatedAt,
                })
                .ToListAsync();

            return rows;
        }

        public async Task<IReadOnlyList<ExportEventDTO>> GetEventsAsync(int userId, bool isAdmin, bool isVenueOwner, string scope)
        {
            var normalizedScope = NormalizeScope(scope, isAdmin, isVenueOwner);
            var query = _db.Events
                .AsNoTracking()
                .Include(e => e.Venue)
                .Include(e => e.Category)
                .AsQueryable();

            query = normalizedScope switch
            {
                "all" => query,
                "venue" => query.Where(e => e.Venue.OwnerId == userId),
                _ => query.Where(e => e.CreatedBy == userId),
            };

            var rows = await query
                .OrderByDescending(e => e.StartDate)
                .Select(e => new ExportEventDTO
                {
                    EventId = e.Id,
                    VenueId = e.VenueId,
                    VenueName = e.Venue.Name,
                    CategoryId = e.CategoryId,
                    CategoryName = e.Category != null ? e.Category.Name : string.Empty,
                    Name = e.Name,
                    Description = e.Description ?? string.Empty,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsActive = e.IsActive,
                    CreatedAt = e.CreatedAt,
                })
                .ToListAsync();

            return rows;
        }

        private static string NormalizeScope(string? scope, bool isAdmin, bool isVenueOwner)
        {
            var requested = (scope ?? string.Empty).Trim().ToLowerInvariant();
            if (isAdmin && requested == "all") return "all";
            if (isVenueOwner && requested == "venue") return "venue";
            if (isVenueOwner && string.IsNullOrWhiteSpace(requested)) return "venue";
            return "mine";
        }
    }
}
