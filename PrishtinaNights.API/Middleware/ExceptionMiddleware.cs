using System.Net;
using System.Text.Json;

namespace PrishtinaNights.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var statusCode = HttpStatusCode.InternalServerError;
            var message = ex.Message;

            if (ex.Message.Contains("User not found"))
            {
                statusCode = HttpStatusCode.NotFound;
                message = ex.Message;
            }

            if (ex.Message.Contains("conflicted"))
            {
                statusCode = HttpStatusCode.BadRequest;
                message = "Cannot delete entity due to related data.";
            }

            var response = new
            {
                statusCode = (int)statusCode,
                message = message
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}