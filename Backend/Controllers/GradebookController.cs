using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using EduFlow.Backend.Models;
using EduFlow.Backend.Data;
using EduFlow.Backend.DTOs;

namespace EduFlow.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Teacher")]
    public class GradebookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GradebookController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/gradebook/course/{courseId}
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<GradebookDto>> GetGradebook(int courseId)
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            // Проверяем, что курс принадлежит преподавателю
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.TeacherId == teacherId);
            
            if (course == null) return Forbid();

            var assignments = await _context.Assignments
                .Where(a => a.CourseId == courseId)
                .ToListAsync();

            var students = await _context.Users
                .Where(u => _context.AssignmentSubmissions
                    .Any(s => s.StudentId == u.Id.ToString() && 
                             assignments.Any(a => a.Id == s.AssignmentId)))
                .ToListAsync();

            var submissions = await _context.AssignmentSubmissions
                .Where(s => assignments.Any(a => a.Id == s.AssignmentId))
                .Include(s => s.Student)
                .Include(s => s.Assignment)
                .ToListAsync();

            var gradebook = new GradebookDto
            {
                CourseId = courseId,
                CourseTitle = course.Title,
                Students = students.Select(student => new StudentGradeDto
                {
                    StudentId = student.Id,
                    StudentName = student.FullName,
                    AssignmentScores = assignments.Select(assignment => new AssignmentScoreDto
                    {
                        AssignmentId = assignment.Id,
                        AssignmentTitle = assignment.Title,
                        MaxScore = assignment.MaxScore,
                        Score = submissions
                            .FirstOrDefault(s => s.StudentId == student.Id.ToString() && 
                                               s.AssignmentId == assignment.Id)?.Score,
                        Status = submissions
                            .FirstOrDefault(s => s.StudentId == student.Id.ToString() && 
                                               s.AssignmentId == assignment.Id)?.Status.ToString() ?? "Not Submitted"
                    }).ToList(),
                    CompletedAssignments = submissions.Count(s => 
                        s.StudentId == student.Id.ToString() && 
                        s.Status == SubmissionStatus.Checked),
                    TotalAssignments = assignments.Count,
                    AverageScore = assignments.Any() ? assignments.Average(a => 
                        submissions.FirstOrDefault(s => 
                            s.StudentId == student.Id.ToString() && 
                            s.AssignmentId == a.Id)?.Score ?? 0) : 0
                }).ToList(),
                Assignments = assignments.Select(assignment => new AssignmentGradeDto
                {
                    AssignmentId = assignment.Id,
                    AssignmentTitle = assignment.Title,
                    MaxScore = assignment.MaxScore,
                    SubmissionsCount = submissions.Count(s => s.AssignmentId == assignment.Id),
                    TotalStudents = students.Count,
                    AverageScore = submissions
                        .Where(s => s.AssignmentId == assignment.Id && s.Score.HasValue)
                        .Average(s => s.Score) ?? 0
                }).ToList()
            };

            return Ok(gradebook);
        }
    }
}