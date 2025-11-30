using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EduFlow.Backend.Models;
using Microsoft.AspNetCore.Authorization;


namespace EduFlow.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Teacher")]
public class CoursesController : ControllerBase
{
    private static List<Course> _courses = new List<Course>();

    [HttpGet]
    public IActionResult GetCourses()
    {
        var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var teacherCourses = _courses.Where(c => c.TeacherId == teacherId).ToList();
        return Ok(teacherCourses);
    }

    [HttpPost]
    public IActionResult CreateCourse([FromBody] CourseCreateRequest request)
    {
        var course = new Course
        {
            Id = _courses.Count + 1,
            Title = request.Title,
            Description = request.Description,
            TeacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0")
        };
        
        _courses.Add(course);
        return Ok(course);
    }
}