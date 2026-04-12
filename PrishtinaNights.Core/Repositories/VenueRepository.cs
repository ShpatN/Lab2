using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
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

        public async Task<IEnumerable<Venue>> GetAllAsync()
        {
            return await _context.Venues.ToListAsync();
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