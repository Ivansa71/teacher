using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduFlow.Backend.Models
{
    public class LearningMaterial
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public LearningMaterialType Type { get; set; }
        
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [Url]
        public string? Url { get; set; }
        
        [Required]
        public int CourseId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Навигационные свойства
        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;
        
        public List<LearningMaterialFile> Files { get; set; } = new();
    }

    public class LearningMaterialFile
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string LearningMaterialId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        
        public string FilePath { get; set; } = string.Empty;
        
        public long Size { get; set; }
        
        // Навигационные свойства
        [ForeignKey("LearningMaterialId")]
        public LearningMaterial LearningMaterial { get; set; } = null!;
    }

    public enum LearningMaterialType
    {
        Lecture,
        Presentation, 
        Video,
        Scorm
    }
}