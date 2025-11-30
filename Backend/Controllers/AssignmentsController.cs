using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using EduFlow.Backend.Models;
using EduFlow.Backend.Data;
using EduFlow.Backend.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace EduFlow.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AssignmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<List<AssignmentDto>>> GetAssignments()
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var assignments = await _context.Assignments
                .Include(a => a.Attachments)
                .Include(a => a.Course)
                .Where(a => a.TeacherId == teacherId)
                .Select(a => new AssignmentDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    DueDate = a.DueDate,
                    Status = a.Status.ToString(),
                    MaxScore = a.MaxScore,
                    Attachments = a.Attachments.Select(at => new AssignmentAttachmentDto
                    {
                        Id = at.Id,
                        Name = at.Name,
                        Url = at.Url
                    }).ToList()
                })
                .ToListAsync();

            return Ok(assignments);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<AssignmentDto>> CreateAssignment([FromBody] AssignmentCreateRequest request)
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var assignment = new Assignment
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title,
                Description = request.Description,
                DueDate = request.DueDate,
                Status = AssignmentStatus.Draft,
                MaxScore = request.MaxScore,
                CourseId = request.CourseId,
                TeacherId = teacherId,
                CreatedAt = DateTime.UtcNow
            };

            // Добавляем вложения
            foreach (var attachmentRequest in request.Attachments)
            {
                assignment.Attachments.Add(new AssignmentAttachment
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = attachmentRequest.Name,
                    Url = attachmentRequest.Url
                });
            }

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            var result = new AssignmentDto
            {
                Id = assignment.Id,
                Title = assignment.Title,
                Description = assignment.Description,
                DueDate = assignment.DueDate,
                Status = assignment.Status.ToString(),
                MaxScore = assignment.MaxScore,
                Attachments = assignment.Attachments.Select(at => new AssignmentAttachmentDto
                {
                    Id = at.Id,
                    Name = at.Name,
                    Url = at.Url
                }).ToList()
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<AssignmentDto>> UpdateAssignment(string id, [FromBody] UpdateAssignmentRequest request)
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var assignment = await _context.Assignments
                .Include(a => a.Attachments)
                .FirstOrDefaultAsync(a => a.Id == id && a.TeacherId == teacherId);

            if (assignment == null) return NotFound();

            assignment.Title = request.Title;
            assignment.Description = request.Description;
            assignment.DueDate = request.DueDate;
            assignment.MaxScore = request.MaxScore;
            assignment.Status = Enum.Parse<AssignmentStatus>(request.Status);

            await _context.SaveChangesAsync();

            var result = new AssignmentDto
            {
                Id = assignment.Id,
                Title = assignment.Title,
                Description = assignment.Description,
                DueDate = assignment.DueDate,
                Status = assignment.Status.ToString(),
                MaxScore = assignment.MaxScore,
                Attachments = assignment.Attachments.Select(at => new AssignmentAttachmentDto
                {
                    Id = at.Id,
                    Name = at.Name,
                    Url = at.Url
                }).ToList()
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteAssignment(string id)
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var assignment = await _context.Assignments
                .FirstOrDefaultAsync(a => a.Id == id && a.TeacherId == teacherId);

            if (assignment == null) return NotFound();

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}