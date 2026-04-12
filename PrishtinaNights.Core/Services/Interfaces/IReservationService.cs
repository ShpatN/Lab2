using PrishtinaNights.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface IReservationService
    {
        Task<int> CreateReservationAsync(CreateReservationDTO dto);
    }
}
