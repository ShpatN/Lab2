using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken token);
        Task<List<RefreshToken>> GetAllWithUserAsync();
        Task<List<RefreshToken>> GetAllAsync();
        Task RemoveAsync(RefreshToken token);
    }
}