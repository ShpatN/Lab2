namespace PrishtinaNights.Core.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; } // for update

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}