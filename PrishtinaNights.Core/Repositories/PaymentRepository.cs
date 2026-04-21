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

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _payments.ToListAsync();
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _payments.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task UpdateAsync(Payment payment)
        {
            var existing = await _payments.FindAsync(payment.Id);

            if (existing == null)
                throw new Exception("Payment not found");

            existing.Status = payment.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}