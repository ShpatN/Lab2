namespace PrishtinaNights.API.Authorization;

public static class AuthorizationPolicies
{
    public const string AdminOnly = "AdminOnly";
    /// <summary>Admin or venue owner (including legacy &quot;Owner&quot; role).</summary>
    public const string VenueOwnerOrAdmin = "VenueOwnerOrAdmin";
}
