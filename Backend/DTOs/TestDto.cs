using System.ComponentModel.DataAnnotations;

namespace EduFlow.Backend.DTOs
{
    public class TestDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<TestQuestionDto> Questions { get; set; } = new();
    }

    public class TestQuestionDto
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public List<TestOptionDto> Options { get; set; } = new();
    }

    public class TestOptionDto
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    public class CreateTestRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public int CourseId { get; set; }
        
        [Required]
        [MinLength(1, ErrorMessage = "Добавьте хотя бы один вопрос")]
        public List<CreateQuestionRequest> Questions { get; set; } = new();
    }

    public class CreateQuestionRequest
    {
        [Required]
        public string Text { get; set; } = string.Empty;
        
        [Required]
        [MinLength(2, ErrorMessage = "Добавьте минимум 2 варианта ответа")]
        public List<CreateOptionRequest> Options { get; set; } = new();
    }

    public class CreateOptionRequest
    {
        [Required]
        public string Text { get; set; } = string.Empty;
        
        [Required]
        public bool IsCorrect { get; set; }
    }

    public class SubmitTestRequest
    {
        [Required]
        public string TestId { get; set; } = string.Empty;
        
        [Required]
        public List<QuestionAnswer> Answers { get; set; } = new();
    }

    public class QuestionAnswer
    {
        [Required]
        public string QuestionId { get; set; } = string.Empty;
        
        [Required]
        public string SelectedOptionId { get; set; } = string.Empty;
    }

    public class TestResultDto
    {
        public string Id { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string TestId { get; set; } = string.Empty;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public double Percentage { get; set; }
        public DateTime PassedAt { get; set; }
    }

    public class TestWithResultsDto
    {
        public TestDto Test { get; set; } = new();
        public List<TestResultDto> Results { get; set; } = new();
    }
}