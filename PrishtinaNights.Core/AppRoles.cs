namespace PrishtinaNights.Core;

/// <summary>Role names must match JWT role claims (database Role.Name).</summary>
public static class AppRoles
{
    public const string Admin = "Admin";
    public const string User = "User";
    /// <summary>Primary name for venue owners in new deployments.</summary>
    public const string VenueOwner = "VenueOwner";
    /// <summary>Legacy / alternate name used in some seeds.</summary>
    public const string Owner = "Owner";
}
