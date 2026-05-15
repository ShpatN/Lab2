using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;

namespace PrishtinaNights.Core.Repositories
{
    public class EventCategoryRepository : IEventCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public EventCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EventCategory>> GetAllAsync()
        {
            return await _context.EventCategories.ToListAsync();
        }

        public async Task<EventCategory?> GetByIdAsync(int id)
        {
            return await _context.EventCategories.FindAsync(id);
        }

        public async Task<EventCategory> CreateAsync(EventCategory entity)
        {
            _context.EventCategories.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<EventCategory?> UpdateAsync(EventCategory entity)
        {
            var existing = await _context.EventCategories.FindAsync(entity.Id);
            if (existing == null) return null;

            existing.Name = entity.Name;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.EventCategories.FindAsync(id);
            if (entity == null) return false;

            _context.EventCategories.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}