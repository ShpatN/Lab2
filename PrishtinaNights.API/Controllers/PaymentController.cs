using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var payments = await _paymentService.GetAllForUserAsync(userId, User.IsAdmin());
            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var payment = await _paymentService.GetByIdForUserAsync(id, userId, User.IsAdmin());

            if (payment == null)
                return NotFound();

            return Ok(payment);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePaymentDTO dto)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var id = await _paymentService.CreatePaymentAsync(dto, userId, User.IsAdmin());
            return Ok(new { PaymentId = id });
        }

        [HttpPut("status")]
        [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdatePaymentStatusDTO dto)
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            await _paymentService.UpdateStatusAsync(dto, userId, User.IsAdmin());
            return Ok("Payment status updated successfully");
        }
    }
}
