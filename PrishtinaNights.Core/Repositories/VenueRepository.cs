using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;

namespace PrishtinaNights.Core.Repositories
{
    public class VenueRepository : IVenueRepository
    {
        private readonly ApplicationDbContext _context;

        public VenueRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Venue>> GetAllAsync(VenueSearchQueryDTO? query = null)
        {
            var q = query ?? new VenueSearchQueryDTO();
            var keyword = q.Keyword?.Trim();
            var category = q.Category?.Trim();
            var sortDirection = (q.SortDirection ?? "asc").Trim().ToLowerInvariant();

            IQueryable<Venue> venues = _context.Venues.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                venues = venues.Where(v =>
                    v.Name.Contains(keyword) ||
                    v.City.Contains(keyword) ||
                    v.Address.Contains(keyword));
            }

            // No dedicated venue category column exists; use name/description match.
            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                var normalizedCategory = category.ToLowerInvariant();
                venues = venues.Where(v => v.Category.ToLower() == normalizedCategory);
            }

            venues = sortDirection == "desc"
                ? venues.OrderByDescending(v => v.Name)
                : venues.OrderBy(v => v.Name);

            return await venues.ToListAsync();
        }

        public async Task<Venue?> GetByIdAsync(int id)
        {
            return await _context.Venues.FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Venue> AddAsync(Venue venue)
        {
            await _context.Venues.AddAsync(venue);
            await _context.SaveChangesAsync();
            return venue;
        }

        public async Task<Venue?> UpdateAsync(Venue venue)
        {
            var existingVenue = await _context.Venues.FirstOrDefaultAsync(v => v.Id == venue.Id);

            if (existingVenue == null)
                return null;

            _context.Entry(existingVenue).CurrentValues.SetValues(venue);
            await _context.SaveChangesAsync();

            return existingVenue;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var venue = await _context.Venues.FirstOrDefaultAsync(v => v.Id == id);

            if (venue == null)
                return false;

            _context.Venues.Remove(venue);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Venues.AnyAsync(v => v.Id == id);
        }
    }
}