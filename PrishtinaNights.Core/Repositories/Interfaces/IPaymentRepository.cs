using PrishtinaNights.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IPaymentRepository
    {
        Task AddAsync(Payment payment);
        Task<IEnumerable<Payment>> GetAllAsync();

        Task<IEnumerable<Payment>> GetByUserIdAsync(int userId);

        Task<Payment?> GetByIdAsync(int id);
        Task UpdateAsync(Payment payment);
    }
}
