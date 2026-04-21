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
    public class PaymentLogRepository : IPaymentLogRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<PaymentLog> _logs;

        public PaymentLogRepository(ApplicationDbContext context)
        {
            _context = context;
            _logs = _context.Set<PaymentLog>();
        }

        public async Task AddAsync(PaymentLog log)
        {
            await _logs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
