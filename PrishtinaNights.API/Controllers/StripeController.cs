using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace PrishtinaNights.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StripeController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public StripeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Creates a Stripe PaymentIntent. Frontend uses clientSecret with Stripe.js.
    /// Set Stripe:SecretKey (User Secrets in dev) before calling.
    /// </summary>
    [HttpPost("payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentBody body)
    {
        var secretKey = _configuration["Stripe:SecretKey"];
        if (string.IsNullOrWhiteSpace(secretKey))
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                new { message = "Stripe:SecretKey is not configured." });
        }

        if (body.AmountCents is < 50 or > 99999999)
        {
            return BadRequest(new { message = "AmountCents must be between 50 and 99999999." });
        }

        StripeConfiguration.ApiKey = secretKey;

        var options = new PaymentIntentCreateOptions
        {
            Amount = body.AmountCents,
            Currency = string.IsNullOrWhiteSpace(body.Currency) ? "eur" : body.Currency!.ToLowerInvariant(),
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options);

        return Ok(new { clientSecret = intent.ClientSecret });
    }
}

public class CreatePaymentIntentBody
{
    public long AmountCents { get; set; }
    public string? Currency { get; set; }
}
