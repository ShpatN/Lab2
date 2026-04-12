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
                r.Status != "Cancelled"
            );
        }

        public async Task<Reservation?> GetByIdAsync(int id)
        {
            return await _reservations.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task UpdateAsync(Reservation reservation)
        {
            var existing = await _reservations.FindAsync(reservation.Id);

            if (existing == null)
                throw new Exception("Reservation not found");

            existing.Status = reservation.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}
