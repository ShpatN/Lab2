using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly IReservationStatusHistoryRepository _historyRepository;

        public PaymentService(
            IPaymentRepository paymentRepository,
            IReservationRepository reservationRepository,
            IReservationStatusHistoryRepository historyRepository)
        {
            _paymentRepository = paymentRepository;
            _reservationRepository = reservationRepository;
            _historyRepository = historyRepository;
        }

        public async Task<int> CreatePaymentAsync(CreatePaymentDTO dto)
        {
            var payment = new Payment
            {
                UserId = dto.UserId,
                ReservationId = dto.ReservationId,
                Amount = dto.Amount,
                Status = "Paid",
                CreatedAt = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment);

            // IMPORTANT: Confirm reservation
            if (dto.ReservationId.HasValue)
            {
                var reservation = await _reservationRepository
                    .GetByIdAsync(dto.ReservationId.Value);

                if (reservation == null)
                    throw new Exception("Reservation not found");

                reservation.Status = "Confirmed";

                await _reservationRepository.UpdateAsync(reservation);

                await _historyRepository.AddAsync(new ReservationStatusHistory
                {
                    ReservationId = reservation.Id,
                    Status = "Confirmed",
                    ChangedAt = DateTime.UtcNow
                });
            }

            return payment.Id;
        }
    }
}