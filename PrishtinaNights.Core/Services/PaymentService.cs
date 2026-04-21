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
        private readonly IPaymentLogRepository _paymentLogRepository;

        public PaymentService(
            IPaymentRepository paymentRepository,
            IReservationRepository reservationRepository,
            IReservationStatusHistoryRepository historyRepository,
            IPaymentLogRepository paymentLogRepository)
        {
            _paymentRepository = paymentRepository;
            _reservationRepository = reservationRepository;
            _historyRepository = historyRepository;
            _paymentLogRepository = paymentLogRepository;
        }

        public async Task<int> CreatePaymentAsync(CreatePaymentDTO dto)
        {
            // Create payment
            var payment = new Payment
            {
                UserId = dto.UserId,
                ReservationId = dto.ReservationId,
                Amount = dto.Amount,
                Status = "Paid",
                CreatedAt = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment);

            // log payment
            await _paymentLogRepository.AddAsync(new PaymentLog
            {
                PaymentId = payment.Id,
                Status = "Paid",
                Message = "Payment completed successfully",
                CreatedAt = DateTime.UtcNow
            });

            // If linked to reservation, confirm it
            if (dto.ReservationId.HasValue)
            {
                var reservation = await _reservationRepository
                    .GetByIdAsync(dto.ReservationId.Value);

                if (reservation == null)
                    throw new Exception("Reservation not found");

                reservation.Status = "Confirmed";

                await _reservationRepository.UpdateAsync(reservation);

                // Save status history
                await _historyRepository.AddAsync(new ReservationStatusHistory
                {
                    ReservationId = reservation.Id,
                    Status = "Confirmed",
                    ChangedAt = DateTime.UtcNow
                });
            }

            // Return payment id
            return payment.Id;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _paymentRepository.GetAllAsync();
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _paymentRepository.GetByIdAsync(id);
        }

        public async Task UpdateStatusAsync(UpdatePaymentStatusDTO dto)
        {
            var payment = await _paymentRepository.GetByIdAsync(dto.PaymentId);

            if (payment == null)
                throw new Exception("Payment not found");

            //  VALIDATION 
            if (payment.Status == "Refunded")
                throw new Exception("Payment already refunded");

            if (payment.Status == "Failed")
                throw new Exception("Payment already failed");

            // Allow only valid transitions
            if (dto.Status != "Refunded" && dto.Status != "Failed")
                throw new Exception("Invalid payment status");

            payment.Status = dto.Status;
            payment.UpdatedAt = DateTime.UtcNow;

            await _paymentRepository.UpdateAsync(payment);

            //  Log it
            await _paymentLogRepository.AddAsync(new PaymentLog
            {
                PaymentId = payment.Id,
                Status = dto.Status,
                Message = $"Payment status updated to {dto.Status}",
                CreatedAt = DateTime.UtcNow
            });

            if (dto.Status == "Refunded" && payment.ReservationId.HasValue)
            {
                var reservation = await _reservationRepository
                    .GetByIdAsync(payment.ReservationId.Value);

                if (reservation != null)
                {
                    reservation.Status = "Cancelled";
                    await _reservationRepository.UpdateAsync(reservation);

                    await _historyRepository.AddAsync(new ReservationStatusHistory
                    {
                        ReservationId = reservation.Id,
                        Status = "Cancelled",
                        ChangedAt = DateTime.UtcNow
                    });
                }
            }
        }

    }
}