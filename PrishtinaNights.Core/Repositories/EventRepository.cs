using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;

namespace PrishtinaNights.Core.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;

        public EventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllAsync(EventSearchQueryDTO? query = null)
        {
            var q = query ?? new EventSearchQueryDTO();
            var keyword = q.Keyword?.Trim();
            var category = q.Category?.Trim();
            var sortDirection = (q.SortDirection ?? "asc").Trim().ToLowerInvariant();

            IQueryable<Event> events = _context.Events
                .AsNoTracking()
                .Include(e => e.Category);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                events = events.Where(e => e.Name.Contains(keyword));
            }

            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                events = events.Where(e => e.Category != null && e.Category.Name.Contains(category));
            }

            if (q.DateFrom.HasValue)
            {
                var from = q.DateFrom.Value.Date;
                events = events.Where(e => e.StartDate.Date >= from);
            }

            if (q.DateTo.HasValue)
            {
                var to = q.DateTo.Value.Date;
                events = events.Where(e => e.StartDate.Date <= to);
            }

            if (!string.IsNullOrWhiteSpace(q.TimeFrom) && TimeSpan.TryParse(q.TimeFrom, out var fromTime))
            {
                var fromHour = fromTime.Hours;
                var fromMinute = fromTime.Minutes;
                events = events.Where(e =>
                    e.StartDate.Hour > fromHour ||
                    (e.StartDate.Hour == fromHour && e.StartDate.Minute >= fromMinute));
            }

            events = sortDirection == "desc"
                ? events.OrderByDescending(e => e.StartDate)
                : events.OrderBy(e => e.StartDate);

            return await events.ToListAsync();
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Event> CreateAsync(Event entity)
        {
            await _context.Events.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Event?> UpdateAsync(Event entity)
        {
            var existing = await _context.Events.FindAsync(entity.Id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();

            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Events.FindAsync(id);
            if (entity == null) return false;

            _context.Events.Remove(entity);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}