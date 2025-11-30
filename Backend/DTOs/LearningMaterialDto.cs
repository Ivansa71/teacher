using System.ComponentModel.DataAnnotations;

namespace EduFlow.Backend.DTOs
{
    public class LearningMaterialDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Url { get; set; }
        public List<LearningMaterialFileDto> Files { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public string DownloadUrl { get; set; } = string.Empty;
    }

    public class LearningMaterialFileDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public long Size { get; set; }
        public string DownloadUrl { get; set; } = string.Empty;
    }

    public class CreateLearningMaterialRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Type { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [Url]
        public string? Url { get; set; }
        
        [Required]
        public int CourseId { get; set; }
        
        public List<IFormFile>? Files { get; set; }
    }
}