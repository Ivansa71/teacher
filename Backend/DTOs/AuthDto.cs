using System.ComponentModel.DataAnnotations;

namespace EduFlow.Backend.DTOs
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "ФИО обязательно")]
        [MaxLength(100, ErrorMessage = "ФИО не более 100 символов")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Телефон обязателен")]
        [Phone(ErrorMessage = "Неверный формат телефона")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Неверный формат email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        [MinLength(6, ErrorMessage = "Пароль минимум 6 символов")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Подтверждение пароля обязательно")]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Роль обязательна")]
        public bool Role { get; set; } = false; // false = Student, true = Teacher
    }

    public class LoginRequest
    {
        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Неверный формат email")]
        public string Login { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool Role { get; set; } // true = Teacher, false = Student
        public DateTime ExpiresAt { get; set; }
    }
}