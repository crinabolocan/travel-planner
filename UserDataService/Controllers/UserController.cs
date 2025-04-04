using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDataService.Data;
using UserDataService.Models;
using UserDataService.DTOs;

namespace UserDataService.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
	private readonly UserDbContext _context;

	public UserController(UserDbContext context)
	{
		_context = context;
	}

	// POST /user/create
	[HttpPost("create")]
	public async Task<IActionResult> Create([FromBody] UserDto userDto)
	{
		var existing = await _context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);
		if (existing != null)
			return Conflict("User already exists");

		var user = new User
		{
			Username = userDto.Username,
			PasswordHash = userDto.Password
		};

		_context.Users.Add(user);
		await _context.SaveChangesAsync();

		return Ok(new { message = "User created" });
	}

	// GET /user/{username}
	[HttpGet("{username}")]
	public async Task<IActionResult> GetByUsername(string username)
	{
		var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
		if (user == null)
			return NotFound();

		return Ok(user);
	}

	[HttpDelete("deleteAll")]
	public async Task<IActionResult> DeleteAll()
	{
		_context.Users.RemoveRange(_context.Users);
		await _context.SaveChangesAsync();
		return Ok("All users deleted.");
	}
}

