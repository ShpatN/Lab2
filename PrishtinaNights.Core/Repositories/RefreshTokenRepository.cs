using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;

namespace PrishtinaNights.Core.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RefreshToken token)
        {
            _context.RefreshTokens.Add(token);
            await _context.SaveChangesAsync();
        }

        public async Task<List<RefreshToken>> GetAllWithUserAsync()
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .ToListAsync();
        }

        public async Task<List<RefreshToken>> GetAllAsync()
        {
            return await _context.RefreshTokens.ToListAsync();
        }

        public async Task RemoveAsync(RefreshToken token)
        {
            _context.RefreshTokens.Remove(token);
            await _context.SaveChangesAsync();
        }
    }
}