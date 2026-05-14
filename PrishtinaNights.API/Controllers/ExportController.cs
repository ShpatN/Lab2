using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.API.Authorization;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.API.Controllers
{
    [ApiController]
    [Route("api/exports")]
    [Authorize]
    public class ExportController : ControllerBase
    {
        private readonly IExportService _exportService;

        public ExportController(IExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("reservations")]
        public async Task<IActionResult> ExportReservations([FromQuery] string format = "csv", [FromQuery] string scope = "mine")
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var rows = await _exportService.GetReservationsAsync(userId, User.IsAdmin(), User.IsVenueOwner(), scope);
            return BuildFileResponse(rows, "reservations", format);
        }

        [HttpGet("payments")]
        public async Task<IActionResult> ExportPayments([FromQuery] string format = "csv", [FromQuery] string scope = "mine")
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var rows = await _exportService.GetPaymentsAsync(userId, User.IsAdmin(), User.IsVenueOwner(), scope);
            return BuildFileResponse(rows, "payments", format);
        }

        [HttpGet("events")]
        public async Task<IActionResult> ExportEvents([FromQuery] string format = "csv", [FromQuery] string scope = "mine")
        {
            if (!User.TryGetUserId(out var userId))
                return Unauthorized();

            var rows = await _exportService.GetEventsAsync(userId, User.IsAdmin(), User.IsVenueOwner(), scope);
            return BuildFileResponse(rows, "events", format);
        }

        private IActionResult BuildFileResponse<T>(IReadOnlyList<T> rows, string baseName, string format)
        {
            var stamp = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss", CultureInfo.InvariantCulture);
            var normalizedFormat = format.Trim().ToLowerInvariant();
            return normalizedFormat switch
            {
                "json" => File(
                    Encoding.UTF8.GetBytes(JsonSerializer.Serialize(rows, new JsonSerializerOptions { WriteIndented = true })),
                    "application/json",
                    $"{baseName}-{stamp}.json"),
                "csv" => File(
                    Encoding.UTF8.GetBytes(ToCsv(rows)),
                    "text/csv",
                    $"{baseName}-{stamp}.csv"),
                _ => BadRequest(new { message = "Unsupported format. Use csv or json." }),
            };
        }

        private static string ToCsv<T>(IReadOnlyList<T> rows)
        {
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var sb = new StringBuilder();
            sb.AppendLine(string.Join(",", properties.Select(p => EscapeCsv(p.Name))));

            foreach (var row in rows)
            {
                var values = properties.Select(p =>
                {
                    var value = p.GetValue(row);
                    return EscapeCsv(value switch
                    {
                        null => string.Empty,
                        DateTime dt => dt.ToString("O", CultureInfo.InvariantCulture),
                        DateTimeOffset dto => dto.ToString("O", CultureInfo.InvariantCulture),
                        _ => Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty,
                    });
                });
                sb.AppendLine(string.Join(",", values));
            }

            return sb.ToString();
        }

        private static string EscapeCsv(string value)
        {
            if (value.Contains('"'))
            {
                value = value.Replace("\"", "\"\"");
            }

            if (value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
            {
                return $"\"{value}\"";
            }

            return value;
        }
    }
}
