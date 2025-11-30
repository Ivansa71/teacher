using System.ComponentModel.DataAnnotations;

namespace EduFlow.Backend.DTOs
{
    public class SubmissionDto
    {
        public string Id { get; set; } = string.Empty;
        public string AssignmentId { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string? CommentFromStudent { get; set; }
        public string? TeacherComment { get; set; }
        public int? Score { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public string DownloadUrl { get; set; } = string.Empty;
    }

    public class GradeSubmissionRequest
    {
        [Range(0, 100, ErrorMessage = "Оценка должна быть от 0 до 100")]
        public int? Score { get; set; }
        
        [MaxLength(1000, ErrorMessage = "Комментарий не более 1000 символов")]
        public string? TeacherComment { get; set; }
    }

    public class CreateSubmissionRequest
    {
        [Required(ErrorMessage = "ID задания обязателен")]
        public string AssignmentId { get; set; } = string.Empty;
        
        [MaxLength(1000, ErrorMessage = "Комментарий не более 1000 символов")]
        public string? CommentFromStudent { get; set; }
        
        [Required(ErrorMessage = "Файл обязателен")]
        public IFormFile File { get; set; } = null!;
    }
}