using Microsoft.AspNetCore.Mvc;
using PrishtinaNights.Core.Services.Interfaces;
using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;

namespace PrishtinaNights.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/user
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // GET: api/user/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: api/user
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserDTO userDto)
        {
            await _userService.AddAsync(userDto);
            return Ok("User created successfully");
        }

        // PUT: api/user
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserDTO userDto)
        {
            await _userService.UpdateAsync(userDto);
            return Ok("User updated successfully");
        }

        // DELETE: api/user/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var exists = await _userService.ExistsAsync(id);

            if (!exists)
                return NotFound();

            await _userService.DeleteAsync(id);
            return Ok("User deleted successfully");
        }
    }
}