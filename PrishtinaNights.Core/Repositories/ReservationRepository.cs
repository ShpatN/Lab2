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
    }
}
