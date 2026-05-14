using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<Reservation> _reservations;

        public ReservationRepository(ApplicationDbContext context)
        {
            _context = context;
            _reservations = _context.Set<Reservation>();
        }

        public async Task AddAsync(Reservation reservation)
        {
            await _reservations.AddAsync(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsTableReservedAsync(int tableId, DateTime reservationDate)
        {
            return await _reservations.AnyAsync(r =>
                r.TableId == tableId &&
                r.ReservationDate == reservationDate &&
                (r.Status ?? "").ToLower() != "cancelled"
            );
        }

        public async Task<Reservation?> GetByIdAsync(int id)
        {
            return await _reservations.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Reservation?> GetByIdWithVenueAsync(int id)
        {
            return await _reservations
                .AsNoTracking()
                .Include(r => r.Venue)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task UpdateAsync(Reservation reservation)
        {
            var existing = await _reservations.FindAsync(reservation.Id);

            if (existing == null)
                throw new Exception("Reservation not found");

            existing.TableId = reservation.TableId;
            existing.ReservationDate = reservation.ReservationDate;
            existing.NumberOfPeople = reservation.NumberOfPeople;
            existing.SpecialRequests = reservation.SpecialRequests;
            existing.Status = reservation.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Reservation>> GetAllAsync()
        {
            return await _reservations.ToListAsync();
        }

        public async Task<List<Reservation>> GetByUserIdWithDetailsAsync(int userId)
        {
            return await _reservations
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .Include(r => r.Venue)
                .Include(r => r.Event)
                .Include(r => r.Table)
                .OrderByDescending(r => r.ReservationDate)
                .ToListAsync();
        }

        public async Task<List<Reservation>> GetForVenuesOwnedByUserAsync(int ownerUserId)
        {
            return await _reservations
                .AsNoTracking()
                .Where(r => r.Venue.OwnerId == ownerUserId)
                .Include(r => r.Venue)
                .Include(r => r.Event)
                .Include(r => r.Table)
                .OrderByDescending(r => r.ReservationDate)
                .ToListAsync();
        }

        public async Task<bool> HasDuplicateUserVenueDateTimeAsync(int userId, int venueId, DateTime reservationDate)
        {
            return await _reservations.AnyAsync(r =>
                r.UserId == userId &&
                r.VenueId == venueId &&
                r.ReservationDate == reservationDate &&
                (r.Status ?? "").ToLower() != "cancelled");
        }

        public async Task DeleteAsync(int id)
        {
            var reservation = await _reservations.FindAsync(id);

            if (reservation == null)
                throw new Exception("Reservation not found");

            _reservations.Remove(reservation);
            await _context.SaveChangesAsync();
        }
    }
}
