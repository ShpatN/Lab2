using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;

namespace PrishtinaNights.Core.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<Payment> _payments;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
            _payments = _context.Set<Payment>();
        }

        public async Task AddAsync(Payment payment)
        {
            await _payments.AddAsync(payment);
            await _context.SaveChangesAsync();
        }
    }
}