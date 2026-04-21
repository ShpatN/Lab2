using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<int> CreatePaymentAsync(CreatePaymentDTO dto);
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task UpdateStatusAsync(UpdatePaymentStatusDTO dto);
    }
}
