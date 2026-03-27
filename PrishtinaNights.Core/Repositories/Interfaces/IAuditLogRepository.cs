using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IAuditLogRepository
    {
        Task AddAsync(AuditLog log);
    }
}