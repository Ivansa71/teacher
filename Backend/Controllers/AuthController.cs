using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using EduFlow.Models;

namespace EduFlow.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // 🗄️ Временное хранилище пользователей
    private static List<User> _users = new List<User>();

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (_users.Any(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Пользователь с таким email уже существует" });
        }

        // 🔧 УПРОЩЕННАЯ ГЕНЕРАЦИЯ ID
        var user = new User
        {
            Id = _users.Count + 1, // ← ПРОСТО И ЭЛЕГАНТНО
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            Role = request.Role,
            FullName = request.FullName
        };

        _users.Add(user);

        var token = GenerateJwtToken(user.Email, user.Role);
        
        return Ok(new { 
            token, 
            role = user.Role, 
            email = user.Email,
            fullName = user.FullName,
            message = "Регистрация успешна" 
        });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _users.FirstOrDefault(u => u.Email == request.Email);
        
        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Неверный email или пароль" });
        }

        var token = GenerateJwtToken(user.Email, user.Role);
        
        return Ok(new { 
            token, 
            role = user.Role, 
            email = user.Email,
            fullName = user.FullName
        });
    }

    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        return Ok(_users.Select(u => new { u.Id, u.Email, u.Role, u.FullName }));
    }

    private string GenerateJwtToken(string email, string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("SUPER_SECRET_KEY_FOR_EDUFLOW");
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, email),
                new Claim(ClaimTypes.Role, role)
            }),
            Expires = DateTime.UtcNow.AddHours(24),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private bool VerifyPassword(string password, string passwordHash)
    {
        return HashPassword(password) == passwordHash;
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public string FullName { get; set; }
}