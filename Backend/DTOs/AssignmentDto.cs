using System.ComponentModel.DataAnnotations;

namespace EduFlow.Backend.DTOs
{
    public class AssignmentDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DueDate { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int MaxScore { get; set; }
        public List<AssignmentAttachmentDto> Attachments { get; set; } = new();
    }

    public class AssignmentAttachmentDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class UpdateAssignmentRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string DueDate { get; set; } = string.Empty;
        
        [Range(1, 1000)]
        public int MaxScore { get; set; } = 100;
        
        public string Status { get; set; } = string.Empty;
    }
}