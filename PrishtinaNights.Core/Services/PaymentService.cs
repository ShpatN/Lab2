using PrishtinaNights.Core;
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

        public async Task<int> CreatePaymentAsync(CreatePaymentDTO dto, int actingUserId, bool isAdmin)
        {
            var userId = isAdmin ? dto.UserId : actingUserId;
            if (!isAdmin && dto.UserId != actingUserId)
                throw new ForbiddenException("You can only create payments for your own account.");

            if (dto.ReservationId.HasValue)
            {
                var reservation = await _reservationRepository.GetByIdAsync(dto.ReservationId.Value);
                if (reservation == null)
                    throw new Exception("Reservation not found");
                if (!isAdmin && reservation.UserId != actingUserId)
                    throw new ForbiddenException("You can only pay for your own reservations.");
            }

            var payment = new Payment
            {
                UserId = userId,
                ReservationId = dto.ReservationId,
                Amount = dto.Amount,
                Status = "Paid",
                CreatedAt = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment);

            await _paymentLogRepository.AddAsync(new PaymentLog
            {
                PaymentId = payment.Id,
                Status = "Paid",
                Message = "Payment completed successfully",
                CreatedAt = DateTime.UtcNow
            });

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

        public async Task<IEnumerable<Payment>> GetAllForUserAsync(int actingUserId, bool isAdmin)
        {
            if (isAdmin)
                return await _paymentRepository.GetAllAsync();
            return await _paymentRepository.GetByUserIdAsync(actingUserId);
        }

        public async Task<Payment?> GetByIdForUserAsync(int id, int actingUserId, bool isAdmin)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return null;
            if (isAdmin || payment.UserId == actingUserId) return payment;
            return null;
        }

        public async Task UpdateStatusAsync(UpdatePaymentStatusDTO dto, int actingUserId, bool isAdmin)
        {
            if (!isAdmin)
                throw new ForbiddenException("Only administrators can change payment status.");

            var payment = await _paymentRepository.GetByIdAsync(dto.PaymentId);

            if (payment == null)
                throw new Exception("Payment not found");

            if (payment.Status == "Refunded")
                throw new Exception("Payment already refunded");

            if (payment.Status == "Failed")
                throw new Exception("Payment already failed");

            if (dto.Status != "Refunded" && dto.Status != "Failed")
                throw new Exception("Invalid payment status");

            payment.Status = dto.Status;
            payment.UpdatedAt = DateTime.UtcNow;

            await _paymentRepository.UpdateAsync(payment);

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
