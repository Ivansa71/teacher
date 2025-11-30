namespace EduFlow.Backend.Models
{
public class Course
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int TeacherId { get; set; }
}
public class CourseCreateRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
}
}