using PrishtinaNights.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.Repositories.Interfaces
{
    public interface IReservationRepository
    {
        Task AddAsync(Reservation reservation);
    }
}
