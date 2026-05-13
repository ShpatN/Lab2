using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<List<string>> GetUserRolesAsync(int userId);
        Task<List<string>> GetUserPermissionsAsync(int userId);
        Task<bool> EmailExistsAsync(string email);
        Task<int?> GetRoleIdByNameAsync(string roleName);
        Task<int?> GetFirstRoleIdAsync();
        Task AddUserRoleAsync(int userId, int roleId);
    }
}