using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Models;


namespace AuthService.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDto request)
    {
        var httpClient = new HttpClient();

        // 🛡️ Verificare dacă userul deja există
        var checkResponse = await httpClient.GetAsync($"http://userdataservice:8080/user/{request.Username}");
        if (checkResponse.IsSuccessStatusCode)
            return BadRequest("User already exists");

        // 🔒 Creare utilizator
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var createUserResponse = await httpClient.PostAsJsonAsync("http://userdataservice:8080/user/create", new
        {
            Username = request.Username,
            Password = passwordHash
        });

        if (!createUserResponse.IsSuccessStatusCode)
            return StatusCode(500, "Failed to create user");

        return Ok("User created");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto request)
    {
        var client = new HttpClient();
        var response = await client.GetAsync($"http://userdataservice:8080/user/{request.Username}");

        if (!response.IsSuccessStatusCode)
            return Unauthorized("Invalid credentials");

        var user = await response.Content.ReadFromJsonAsync<User>();

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = CreateToken(user);
        return Ok(new { token });
    }


    private string CreateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
