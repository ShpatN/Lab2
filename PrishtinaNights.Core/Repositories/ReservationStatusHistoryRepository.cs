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
    public class ReservationStatusHistoryRepository : IReservationStatusHistoryRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<ReservationStatusHistory> _history;

        public ReservationStatusHistoryRepository(ApplicationDbContext context)
        {
            _context = context;
            _history = _context.Set<ReservationStatusHistory>();
        }

        public async Task AddAsync(ReservationStatusHistory history)
        {
            await _history.AddAsync(history);
            await _context.SaveChangesAsync();
        }
    }
}
