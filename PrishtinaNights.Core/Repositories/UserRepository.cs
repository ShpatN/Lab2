using Microsoft.EntityFrameworkCore;
using PrishtinaNights.Core.Data;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;

namespace PrishtinaNights.Core.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<User> _users;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
            _users = _context.Set<User>();
        }

        // ================= BASIC CRUD =================

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _users.AsNoTracking().ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _users
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _users
                .FirstOrDefaultAsync(u => u.Email == email); // no AsNoTracking (needed for auth)
        }

        public async Task AddAsync(User user)
        {
            await _users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            var existing = await _users.FindAsync(user.Id);

            if (existing == null)
                throw new Exception("User not found");

            // Update fields manually
            existing.FirstName = user.FirstName;
            existing.LastName = user.LastName;
            existing.Email = user.Email;
            existing.IsActive = user.IsActive;
            existing.UpdatedAt = user.UpdatedAt;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _users.FindAsync(id);
            if (user != null)
            {
                _users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _users.AnyAsync(u => u.Id == id);
        }

        // ================= ROLES =================

        public async Task<List<string>> GetUserRolesAsync(int userId)
        {
            return await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Include(ur => ur.Role)
                .Select(ur => ur.Role.Name)
                .ToListAsync();
        }

        // ================= PERMISSIONS =================

        public async Task<List<string>> GetUserPermissionsAsync(int userId)
        {
            return await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Include(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Name)
                .Distinct()
                .ToListAsync();
        }
    }
}