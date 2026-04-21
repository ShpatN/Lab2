using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;

namespace PrishtinaNights.Core.Repositories
{
    public class TicketTypeRepository : ITicketTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public TicketTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TicketType>> GetAllAsync()
        {
            return await _context.TicketTypes.ToListAsync();
        }

        public async Task<TicketType?> GetByIdAsync(int id)
        {
            return await _context.TicketTypes.FindAsync(id);
        }

        public async Task<TicketType> CreateAsync(TicketType entity)
        {
            _context.TicketTypes.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<TicketType?> UpdateAsync(TicketType entity)
        {
            var existing = await _context.TicketTypes.FindAsync(entity.Id);
            if (existing == null) return null;

            existing.EventId = entity.EventId;
            existing.Name = entity.Name;
            existing.Price = entity.Price;
            existing.Quantity = entity.Quantity;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.TicketTypes.FindAsync(id);
            if (entity == null) return false;

            _context.TicketTypes.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}