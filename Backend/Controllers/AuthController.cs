using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using EduFlow.Backend.Models;
using EduFlow.Backend.DTOs;

namespace EduFlow.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // 🗄️ Временное хранилище пользователей
    private static List<User> _users = new List<User>();

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest(new { message = "Пароли не совпадают" });
        }
    
        if (_users.Any(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Пользователь с таким email уже существует" });
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = HashPassword(request.Password),
            Role = request.Role, // bool из DTO
            FullName = request.FullName
        };

        _users.Add(user);

        var token = GenerateJwtToken(user.Id, user.Email, user.Role);
        
        return Ok(new AuthResponse
        { 
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Ищем по полю Login (а не Email)
        var user = _users.FirstOrDefault(u => u.Email == request.Login);
    
        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Неверный логин или пароль" });
        }

        var token = GenerateJwtToken(user.Id, user.Email, user.Role);

        // Возвращаем в формате фронтенда
        return Ok(new { 
            accessToken = token,           // ← accessToken вместо token
            teacherName = user.FullName    // ← teacherName вместо fullName
        });
    }
    
    [HttpPost("register/teacher")]
    public IActionResult RegisterTeacher([FromBody] RegisterRequest request)
    {
        if (_users.Any(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Пользователь с таким email уже существует" });
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = HashPassword(request.Password),
            Role = true,  // ← всегда преподаватель (true)
            FullName = request.FullName
        };

        _users.Add(user);

        var token = GenerateJwtToken(user.Id, user.Email, user.Role);
    
        return Ok(new AuthResponse
        { 
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        });
    }

    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        return Ok(_users.Select(u => new { u.Id, u.Email, u.Role, u.FullName }));
    }

    private string GenerateJwtToken(string userId, string email, bool role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("SUPER_SECRET_KEY_FOR_EDUFLOW_2025_HACKATHON");
    
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role ? "Teacher" : "Student")
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