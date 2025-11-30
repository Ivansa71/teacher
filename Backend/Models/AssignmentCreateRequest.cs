using System.ComponentModel.DataAnnotations;

namespace EduFlow.Backend.Models
{
    public class AssignmentCreateRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string DueDate { get; set; } = string.Empty; // string вместо DateTime
        
        [Required]
        public int CourseId { get; set; }
        
        [Range(1, 1000)]
        public int MaxScore { get; set; } = 100;
        
        public List<AttachmentRequest> Attachments { get; set; } = new();
    }

    public class AttachmentRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Url { get; set; } = string.Empty;
    }
}