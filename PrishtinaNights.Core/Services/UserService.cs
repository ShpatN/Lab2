using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;
using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        //  GET ALL USERS
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        //  GET USER BY ID
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        //  GET USER BY EMAIL
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        // ADD USER (not recommended for auth users)
        public async Task AddAsync(UserDTO userDto)
        {
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                IsActive = true,
                CreatedAt = DateTime.UtcNow

                // ❗ No PasswordHash here → only AuthController handles it
            };

            await _userRepository.AddAsync(user);
        }

        //  UPDATE USER (FIXED)
        public async Task UpdateAsync(UserDTO userDto)
        {
            var existingUser = await _userRepository.GetByIdAsync(userDto.Id);

            if (existingUser == null)
                throw new Exception("User not found");

            // Update ONLY allowed fields
            existingUser.FirstName = userDto.FirstName;
            existingUser.LastName = userDto.LastName;
            existingUser.Email = userDto.Email;
            existingUser.IsActive = userDto.IsActive;
            existingUser.UpdatedAt = DateTime.UtcNow;

            // ❗ DO NOT TOUCH PasswordHash

            await _userRepository.UpdateAsync(existingUser);
        }

        //  DELETE USER
        public async Task DeleteAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }

        //  CHECK IF EXISTS
        public async Task<bool> ExistsAsync(int id)
        {
            return await _userRepository.ExistsAsync(id);
        }
    }
}