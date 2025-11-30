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
    [Authorize]
    public class TestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/tests/course/{courseId}
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<List<TestDto>>> GetCourseTests(int courseId)
        {
            var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == "Teacher")
            {
                // Проверяем, что курс принадлежит преподавателю
                var course = await _context.Courses
                    .FirstOrDefaultAsync(c => c.Id == courseId && c.TeacherId == int.Parse(teacherId));
                
                if (course == null) return Forbid();
            }

            var tests = await _context.Tests
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Options)
                .Where(t => t.CourseId == courseId)
                .Select(t => new TestDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Questions = t.Questions.Select(q => new TestQuestionDto
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Options = q.Options.Select(o => new TestOptionDto
                        {
                            Id = o.Id,
                            Text = o.Text,
                            IsCorrect = o.IsCorrect
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            return Ok(tests);
        }

        // GET: api/tests/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TestDto>> GetTest(string id)
        {
            var test = await _context.Tests
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (test == null) return NotFound();

            // Для студентов скрываем правильные ответы
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var isTeacher = userRole == "Teacher";

            var result = new TestDto
            {
                Id = test.Id,
                Title = test.Title,
                Description = test.Description,
                Questions = test.Questions.Select(q => new TestQuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Options = q.Options.Select(o => new TestOptionDto
                    {
                        Id = o.Id,
                        Text = o.Text,
                        IsCorrect = isTeacher ? o.IsCorrect : false // Скрываем для студентов
                    }).ToList()
                }).ToList()
            };

            return Ok(result);
        }

        // POST: api/tests
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<TestDto>> CreateTest([FromBody] CreateTestRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Проверяем, что курс принадлежит преподавателю
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == request.CourseId && c.TeacherId == int.Parse(teacherId));
            
            if (course == null) return Forbid();

            var test = new Test
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title,
                Description = request.Description,
                CourseId = request.CourseId,
                TeacherId = int.Parse(teacherId),
                CreatedAt = DateTime.UtcNow
            };

            // Добавляем вопросы
            for (int i = 0; i < request.Questions.Count; i++)
            {
                var questionRequest = request.Questions[i];
                var question = new TestQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    TestId = test.Id,
                    Text = questionRequest.Text,
                    Order = i
                };

                // Добавляем варианты ответов
                for (int j = 0; j < questionRequest.Options.Count; j++)
                {
                    var optionRequest = questionRequest.Options[j];
                    question.Options.Add(new TestOption
                    {
                        Id = Guid.NewGuid().ToString(),
                        QuestionId = question.Id,
                        Text = optionRequest.Text,
                        IsCorrect = optionRequest.IsCorrect,
                        Order = j
                    });
                }

                test.Questions.Add(question);
            }

            _context.Tests.Add(test);
            await _context.SaveChangesAsync();

            var result = new TestDto
            {
                Id = test.Id,
                Title = test.Title,
                Description = test.Description,
                Questions = test.Questions.Select(q => new TestQuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Options = q.Options.Select(o => new TestOptionDto
                    {
                        Id = o.Id,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            return Ok(result);
        }

        // POST: api/tests/{id}/submit
        [HttpPost("{id}/submit")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<TestResultDto>> SubmitTest(string id, [FromBody] SubmitTestRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var test = await _context.Tests
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (test == null) return NotFound("Тест не найден");

            // Проверяем, не проходил ли студент уже этот тест
            var existingResult = await _context.TestResults
                .FirstOrDefaultAsync(r => r.TestId == id && r.StudentId == int.Parse(studentId));
            
            if (existingResult != null)
                return BadRequest("Вы уже проходили этот тест");

            int score = 0;
            var studentAnswers = new List<StudentAnswer>();

            // Проверяем ответы
            foreach (var answer in request.Answers)
            {
                var question = test.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null) continue;

                var selectedOption = question.Options.FirstOrDefault(o => o.Id == answer.SelectedOptionId);
                if (selectedOption == null) continue;

                if (selectedOption.IsCorrect) score++;

                studentAnswers.Add(new StudentAnswer
                {
                    Id = Guid.NewGuid().ToString(),
                    QuestionId = answer.QuestionId,
                    SelectedOptionId = answer.SelectedOptionId,
                    IsCorrect = selectedOption.IsCorrect
                });
            }

            var result = new TestResult
            {
                Id = Guid.NewGuid().ToString(),
                TestId = id,
                StudentId = int.Parse(studentId),
                Score = score,
                TotalQuestions = test.Questions.Count,
                CompletedAt = DateTime.UtcNow,
                StudentAnswers = studentAnswers
            };

            _context.TestResults.Add(result);
            await _context.SaveChangesAsync();

            var student = await _context.Users.FindAsync(int.Parse(studentId));

            var resultDto = new TestResultDto
            {
                Id = result.Id,
                StudentName = student?.FullName ?? "Unknown",
                TestId = result.TestId,
                Score = result.Score,
                TotalQuestions = result.TotalQuestions,
                Percentage = result.Percentage,
                PassedAt = result.CompletedAt
            };

            return Ok(resultDto);
        }

        // GET: api/tests/{id}/results
        [HttpGet("{id}/results")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<TestWithResultsDto>> GetTestResults(string id)
        {
            var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Проверяем, что тест принадлежит преподавателю
            var test = await _context.Tests
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Options)
                .Include(t => t.Results)
                    .ThenInclude(r => r.Student)
                .FirstOrDefaultAsync(t => t.Id == id && t.TeacherId == int.Parse(teacherId));

            if (test == null) return NotFound();

            var testDto = new TestDto
            {
                Id = test.Id,
                Title = test.Title,
                Description = test.Description,
                Questions = test.Questions.Select(q => new TestQuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Options = q.Options.Select(o => new TestOptionDto
                    {
                        Id = o.Id,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            var resultsDto = test.Results.Select(r => new TestResultDto
            {
                Id = r.Id,
                StudentName = r.Student.FullName,
                TestId = r.TestId,
                Score = r.Score,
                TotalQuestions = r.TotalQuestions,
                Percentage = r.Percentage,
                PassedAt = r.CompletedAt
            }).ToList();

            return Ok(new TestWithResultsDto
            {
                Test = testDto,
                Results = resultsDto
            });
        }

        // DELETE: api/tests/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteTest(string id)
        {
            var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var test = await _context.Tests
                .FirstOrDefaultAsync(t => t.Id == id && t.TeacherId == int.Parse(teacherId));

            if (test == null) return NotFound();

            _context.Tests.Remove(test);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}