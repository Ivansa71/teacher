using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using EduFlow.Backend.Models;
using EduFlow.Backend.DTOs;
using EduFlow.Backend.Data;
using EduFlow.Backend.Services;

namespace EduFlow.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubmissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileStorageService _fileStorage;

        public SubmissionsController(ApplicationDbContext context, IFileStorageService fileStorage)
        {
            _context = context;
            _fileStorage = fileStorage;
        }

        // GET: api/submissions/assignment/{assignmentId}
        [HttpGet("assignment/{assignmentId}")]
        public async Task<ActionResult<List<SubmissionDto>>> GetSubmissions(string assignmentId) // Изменил на string
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            // Преподаватель видит все решения по своему заданию
            if (userRole == "Teacher")
            {
                var assignment = await _context.Assignments
                    .Include(a => a.Course)
                    .FirstOrDefaultAsync(a => a.Id == assignmentId && a.Course.TeacherId == int.Parse(userId)); // Убрал int.Parse
                
                if (assignment == null) return Forbid();
            }

            var submissions = await _context.AssignmentSubmissions
                .Include(s => s.Student)
                .Include(s => s.Assignment)
                    .ThenInclude(a => a.Course)
                .Where(s => s.AssignmentId == assignmentId) // Убрал .ToString()
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    AssignmentId = s.AssignmentId,
                    StudentId = s.StudentId,
                    StudentName = s.Student.FullName,
                    FileName = s.FileName,
                    FileSize = GetFileSize(s.FilePath),
                    CommentFromStudent = s.CommentFromStudent,
                    TeacherComment = s.TeacherComment,
                    Score = s.Score,
                    Status = s.Status.ToString(),
                    SubmittedAt = s.SubmittedAt,
                    DownloadUrl = $"/api/submissions/{s.Id}/download"
                })
                .ToListAsync();

            return Ok(submissions);
        }

        // POST: api/submissions
        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<SubmissionDto>> CreateSubmission([FromForm] CreateSubmissionRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentId)) return Unauthorized();
            
            // Проверка что задание существует
            var assignment = await _context.Assignments
                .FirstOrDefaultAsync(a => a.Id == request.AssignmentId); // Убрал int.Parse
            if (assignment == null)
                return NotFound("Задание не найдено");

            // Проверка размера файла
            if (request.File.Length > 100 * 1024 * 1024)
                return BadRequest("Размер файла превышает 100MB");

            // Сохранение файла
            var uploadResult = await _fileStorage.SaveFileAsync(request.File);

            var submission = new AssignmentSubmission
            {
                Id = Guid.NewGuid().ToString(),
                AssignmentId = request.AssignmentId,
                StudentId = studentId,
                FilePath = uploadResult.FilePath,
                FileName = request.File.FileName,
                CommentFromStudent = request.CommentFromStudent,
                Status = SubmissionStatus.Submitted,
                SubmittedAt = DateTime.UtcNow
            };

            _context.AssignmentSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            var student = await _context.Users.FindAsync(int.Parse(studentId));

            var result = new SubmissionDto
            {
                Id = submission.Id,
                AssignmentId = submission.AssignmentId,
                StudentId = submission.StudentId,
                StudentName = student?.FullName ?? "Unknown",
                FileName = submission.FileName,
                FileSize = request.File.Length,
                CommentFromStudent = submission.CommentFromStudent,
                Status = submission.Status.ToString(),
                SubmittedAt = submission.SubmittedAt,
                DownloadUrl = $"/api/submissions/{submission.Id}/download"
            };

            return Ok(result);
        }

        // PUT: api/submissions/{id}/grade
        [HttpPut("{id}/grade")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<SubmissionDto>> GradeSubmission(string id, [FromBody] GradeSubmissionRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherId)) return Unauthorized();
            
            var submission = await _context.AssignmentSubmissions
                .Include(s => s.Assignment)
                    .ThenInclude(a => a.Course)
                .Include(s => s.Student)
                .FirstOrDefaultAsync(s => s.Id == id && s.Assignment.Course.TeacherId == int.Parse(teacherId));

            if (submission == null)
                return NotFound("Решение не найдено или доступ запрещен");

            submission.Score = request.Score;
            submission.TeacherComment = request.TeacherComment;
            submission.Status = SubmissionStatus.Checked;
            submission.GradedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var result = new SubmissionDto
            {
                Id = submission.Id,
                AssignmentId = submission.AssignmentId,
                StudentId = submission.StudentId,
                StudentName = submission.Student.FullName,
                FileName = submission.FileName,
                FileSize = GetFileSize(submission.FilePath),
                CommentFromStudent = submission.CommentFromStudent,
                TeacherComment = submission.TeacherComment,
                Score = submission.Score,
                Status = submission.Status.ToString(),
                SubmittedAt = submission.SubmittedAt,
                DownloadUrl = $"/api/submissions/{submission.Id}/download"
            };

            return Ok(result);
        }

        // GET: api/submissions/{id}/download
        [HttpGet("{id}/download")]
        public async Task<IActionResult> DownloadSubmission(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var submission = await _context.AssignmentSubmissions
                .Include(s => s.Assignment)
                    .ThenInclude(a => a.Course)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (submission == null)
                return NotFound();

            // Проверка доступа
            if (userRole == "Student" && submission.StudentId != userId)
                return Forbid();
            
            if (userRole == "Teacher" && submission.Assignment.Course.TeacherId != int.Parse(userId))
                return Forbid();

            var fileStream = await _fileStorage.GetFileAsync(submission.FilePath);
            return File(fileStream, "application/octet-stream", submission.FileName);
        }

        private long GetFileSize(string filePath)
        {
            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    return new FileInfo(filePath).Length;
                }
                return 0;
            }
            catch
            {
                return 0;
            }
        }
    }
}