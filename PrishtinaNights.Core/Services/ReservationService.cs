using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _reservationRepository;

        public ReservationService(IReservationRepository reservationRepository)
        {
            _reservationRepository = reservationRepository;
        }

        public async Task<int> CreateReservationAsync(CreateReservationDTO dto)
        {
            var reservation = new Reservation
            {
                UserId = dto.UserId,
                VenueId = dto.VenueId,
                TableId = dto.TableId,
                EventId = dto.EventId,
                ReservationDate = dto.ReservationDate,
                NumberOfPeople = dto.NumberOfPeople,
                Status = "Pending",
                SpecialRequests = dto.SpecialRequests,
                CreatedAt = DateTime.UtcNow
            };

            await _reservationRepository.AddAsync(reservation);

            return reservation.Id;
        }
    }
}
