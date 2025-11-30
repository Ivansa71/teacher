using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduFlow.Backend.Models
{
    public class Test
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public int CourseId { get; set; }
        
        [Required]
        public int TeacherId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Навигационные свойства
        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;
        
        public List<TestQuestion> Questions { get; set; } = new();
        public List<TestResult> Results { get; set; } = new();
    }

    public class TestQuestion
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TestId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Text { get; set; } = string.Empty;
        
        public int Order { get; set; }
        
        // Навигационные свойства
        [ForeignKey("TestId")]
        public Test Test { get; set; } = null!;
        
        public List<TestOption> Options { get; set; } = new();
    }

    public class TestOption
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string QuestionId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(300)]
        public string Text { get; set; } = string.Empty;
        
        [Required]
        public bool IsCorrect { get; set; }
        
        public int Order { get; set; }
        
        // Навигационные свойства
        [ForeignKey("QuestionId")]
        public TestQuestion Question { get; set; } = null!;
    }

    public class TestResult
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TestId { get; set; } = string.Empty;
        
        [Required]
        public int StudentId { get; set; }
        
        [Required]
        public int Score { get; set; }
        
        [Required]
        public int TotalQuestions { get; set; }
        
        public double Percentage => TotalQuestions > 0 ? (Score * 100.0) / TotalQuestions : 0;
        
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
        
        // Навигационные свойства
        [ForeignKey("TestId")]
        public Test Test { get; set; } = null!;
        
        [ForeignKey("StudentId")]
        public User Student { get; set; } = null!;
        
        public List<StudentAnswer> StudentAnswers { get; set; } = new();
    }

    public class StudentAnswer
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TestResultId { get; set; } = string.Empty;
        
        [Required]
        public string QuestionId { get; set; } = string.Empty;
        
        [Required]
        public string SelectedOptionId { get; set; } = string.Empty;
        
        public bool IsCorrect { get; set; }
        
        // Навигационные свойства
        [ForeignKey("TestResultId")]
        public TestResult TestResult { get; set; } = null!;
        
        [ForeignKey("QuestionId")]
        public TestQuestion Question { get; set; } = null!;
        
        [ForeignKey("SelectedOptionId")]
        public TestOption SelectedOption { get; set; } = null!;
    }
}