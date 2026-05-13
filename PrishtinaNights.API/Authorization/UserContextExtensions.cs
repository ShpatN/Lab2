using System.Security.Claims;
using PrishtinaNights.Core;

namespace PrishtinaNights.API.Authorization;

public static class UserContextExtensions
{
    public static bool TryGetUserId(this ClaimsPrincipal user, out int userId)
    {
        userId = 0;
        var sub = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return !string.IsNullOrEmpty(sub) && int.TryParse(sub, out userId);
    }

    public static bool IsAdmin(this ClaimsPrincipal user) => user.IsInRole(AppRoles.Admin);
    public static bool IsVenueOwner(this ClaimsPrincipal user) =>
        user.IsInRole(AppRoles.VenueOwner) || user.IsInRole(AppRoles.Owner);
}
