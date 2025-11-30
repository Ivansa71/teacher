using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduFlow.Backend.Models
{
    public class AssignmentSubmission
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string AssignmentId { get; set; } = string.Empty;
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        [Required]
        public string FilePath { get; set; } = string.Empty;
        
        [Required]
        public string FileName { get; set; } = string.Empty;
        
        public string? CommentFromStudent { get; set; }
        public string? TeacherComment { get; set; }
        public int? Score { get; set; }
        
        public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? GradedAt { get; set; }
        
        // Навигационные свойства
        [ForeignKey("AssignmentId")]
        public Assignment Assignment { get; set; } = null!;
        
        [ForeignKey("StudentId")]
        public User Student { get; set; } = null!;
    }

    public enum SubmissionStatus
    {
        Submitted,
        Checked,
        Returned
    }
}