namespace PrishtinaNights.Core;

/// <summary>Thrown when an authenticated user attempts an action they are not allowed to perform.</summary>
public sealed class ForbiddenException : Exception
{
    public ForbiddenException(string message = "You do not have permission to perform this action.")
        : base(message)
    {
    }
}
