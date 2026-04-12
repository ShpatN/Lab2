using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<int> CreatePaymentAsync(CreatePaymentDTO dto);
    }
}
