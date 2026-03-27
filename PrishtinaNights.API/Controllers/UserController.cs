using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PrishtinaNights.Core.Services.Interfaces;
using PrishtinaNights.Core.DTOs;

namespace PrishtinaNights.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] //  All endpoints require JWT
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        //  GET ALL USERS
        [HttpGet]
        [Authorize(Policy = "CanViewUsers")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        //  GET USER BY ID
        [HttpGet("{id}")]
        [Authorize(Policy = "CanViewUsers")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        //  UPDATE USER
        [HttpPut]
        [Authorize(Policy = "CanUpdateUser")]
        public async Task<IActionResult> Update([FromBody] UserDTO userDto)
        {
            await _userService.UpdateAsync(userDto);
            return Ok("User updated successfully");
        }

        //  DELETE USER
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var exists = await _userService.ExistsAsync(id);

            if (!exists)
                throw new Exception("User not found");

            await _userService.DeleteAsync(id);
            return Ok("User deleted successfully");
        }
    }
}