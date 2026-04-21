using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
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
        Task<IEnumerable<Reservation>> GetAllAsync();
        Task<Reservation?> GetByIdAsync(int id);
        Task UpdateAsync(UpdateReservationDTO dto);
        Task DeleteAsync(int id);
    }
}
