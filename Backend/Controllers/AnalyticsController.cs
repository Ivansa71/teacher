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
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/analytics/course/{courseId}/dashboard
        [HttpGet("course/{courseId}/dashboard")]
        public async Task<ActionResult<ProgressDashboardDto>> GetProgressDashboard(int courseId)
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

            var testResults = await _context.TestResults
                .Where(r => r.Test.CourseId == courseId)
                .Include(r => r.Student)
                .Include(r => r.Test)
                .ToListAsync();

            var dashboard = new ProgressDashboardDto
            {
                CourseId = courseId,
                CourseTitle = course.Title,
                CourseStats = new CourseStatsDto
                {
                    TotalStudents = students.Count,
                    TotalAssignments = assignments.Count,
                    CompletedSubmissions = submissions.Count(s => 
                        s.Status == SubmissionStatus.Checked || s.Status == SubmissionStatus.Submitted),
                    GradedSubmissions = submissions.Count(s => s.Status == SubmissionStatus.Checked),
                    AverageGrade = submissions.Any(s => s.Score.HasValue) ? 
                        submissions.Where(s => s.Score.HasValue).Average(s => s.Score.Value) : 0
                },
                AssignmentsProgress = assignments.Select(assignment => new AssignmentProgressDto
                {
                    AssignmentId = assignment.Id,
                    AssignmentTitle = assignment.Title,
                    SubmissionCount = submissions.Count(s => s.AssignmentId == assignment.Id),
                    TotalStudents = students.Count,
                    CompletionRate = students.Count > 0 ? 
                        (double)submissions.Count(s => s.AssignmentId == assignment.Id) / students.Count * 100 : 0,
                    AverageScore = submissions
                        .Where(s => s.AssignmentId == assignment.Id && s.Score.HasValue)
                        .Average(s => s.Score) ?? 0
                }).ToList(),
                StudentsProgress = students.Select(student => new StudentProgressDto
                {
                    StudentId = student.Id,
                    StudentName = student.FullName,
                    CompletedAssignments = submissions.Count(s => 
                        s.StudentId == student.Id.ToString() && 
                        (s.Status == SubmissionStatus.Checked || s.Status == SubmissionStatus.Submitted)),
                    TotalAssignments = assignments.Count,
                    AverageScore = submissions
                        .Where(s => s.StudentId == student.Id.ToString() && s.Score.HasValue)
                        .Average(s => s.Score) ?? 0,
                    ProgressPercentage = assignments.Count > 0 ? 
                        (double)submissions.Count(s => s.StudentId == student.Id.ToString()) / assignments.Count * 100 : 0
                }).ToList()
            };

            return Ok(dashboard);
        }

        // GET: api/analytics/course/{courseId}/test-results
        [HttpGet("course/{courseId}/test-results")]
        public async Task<ActionResult<List<TestResultDto>>> GetTestResults(int courseId)
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.TeacherId == teacherId);
            
            if (course == null) return Forbid();

            var testResults = await _context.TestResults
                .Where(r => r.Test.CourseId == courseId)
                .Include(r => r.Student)
                .Include(r => r.Test)
                .Select(r => new TestResultDto
                {
                    Id = r.Id,
                    StudentName = r.Student.FullName,
                    TestId = r.TestId,
                    Score = r.Score,
                    TotalQuestions = r.TotalQuestions,
                    Percentage = r.Percentage,
                    PassedAt = r.CompletedAt
                })
                .ToListAsync();

            return Ok(testResults);
        }

        // GET: api/analytics/course/{courseId}/submission-timeline
        [HttpGet("course/{courseId}/submission-timeline")]
        public async Task<ActionResult<object>> GetSubmissionTimeline(int courseId)
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.TeacherId == teacherId);
            
            if (course == null) return Forbid();

            var submissions = await _context.AssignmentSubmissions
                .Where(s => s.Assignment.CourseId == courseId)
                .GroupBy(s => s.SubmittedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    SubmissionsCount = g.Count(),
                    AverageScore = g.Average(s => s.Score ?? 0)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return Ok(submissions);
        }
    }
}