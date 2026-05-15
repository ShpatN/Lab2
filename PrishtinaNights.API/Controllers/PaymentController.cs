using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    /// <summary>Records a completed payment (after Stripe.js confirms the PaymentIntent).</summary>
    [HttpPost]
    [Consumes("application/json")]
    public async Task<IActionResult> Create([FromBody] CreatePaymentDTO? body)
    {
        if (body is null)
            return BadRequest(new { message = "Send a JSON body with userId, amount, and optional reservationId." });

        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var paymentId = await _paymentService.CreatePaymentAsync(body, userId, User.IsAdmin());
        return Ok(new { paymentId });
    }
}
