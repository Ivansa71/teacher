using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduFlow.Backend.Models
{
    public class Assignment
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString(); // Меняем на string
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        public string DueDate { get; set; } = string.Empty; // string вместо DateTime
        
        public AssignmentStatus Status { get; set; } = AssignmentStatus.Draft; // Добавляем статус
        
        [Range(0, 1000)]
        public int MaxScore { get; set; } = 100; // Добавляем максимальный балл
        
        [Required]
        public int CourseId { get; set; }
        
        [Required]
        public int TeacherId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Навигационные свойства
        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;
        
        public List<AssignmentAttachment> Attachments { get; set; } = new(); // Добавляем вложения
        public List<AssignmentSubmission> Submissions { get; set; } = new();
    }

    public class AssignmentAttachment
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string AssignmentId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Url { get; set; } = string.Empty;
        
        [ForeignKey("AssignmentId")]
        public Assignment Assignment { get; set; } = null!;
    }

    public enum AssignmentStatus
    {
        Draft,
        Published
    }
}