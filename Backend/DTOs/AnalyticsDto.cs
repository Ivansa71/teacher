namespace EduFlow.Backend.DTOs
{
    public class GradebookDto
    {
        public int CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public List<StudentGradeDto> Students { get; set; } = new();
        public List<AssignmentGradeDto> Assignments { get; set; } = new();
    }

    public class StudentGradeDto
    {
        public string StudentId { get; set; } = string.Empty; // Меняем на string
        public string StudentName { get; set; } = string.Empty;
        public double AverageScore { get; set; }
        public int CompletedAssignments { get; set; }
        public int TotalAssignments { get; set; }
        public List<AssignmentScoreDto> AssignmentScores { get; set; } = new();
    }

    public class AssignmentGradeDto
    {
        public string AssignmentId { get; set; } = string.Empty;
        public string AssignmentTitle { get; set; } = string.Empty;
        public double AverageScore { get; set; }
        public int MaxScore { get; set; }
        public int SubmissionsCount { get; set; }
        public int TotalStudents { get; set; }
    }

    public class AssignmentScoreDto
    {
        public string AssignmentId { get; set; } = string.Empty;
        public string AssignmentTitle { get; set; } = string.Empty;
        public int? Score { get; set; }
        public int MaxScore { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ProgressDashboardDto
    {
        public int CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public CourseStatsDto CourseStats { get; set; } = new();
        public List<AssignmentProgressDto> AssignmentsProgress { get; set; } = new();
        public List<StudentProgressDto> StudentsProgress { get; set; } = new();
    }

    public class CourseStatsDto
    {
        public int TotalStudents { get; set; }
        public int TotalAssignments { get; set; }
        public int CompletedSubmissions { get; set; }
        public int GradedSubmissions { get; set; }
        public double AverageGrade { get; set; }
    }

    public class AssignmentProgressDto
    {
        public string AssignmentId { get; set; } = string.Empty;
        public string AssignmentTitle { get; set; } = string.Empty;
        public int SubmissionCount { get; set; }
        public int TotalStudents { get; set; }
        public double CompletionRate { get; set; }
        public double AverageScore { get; set; }
    }

    public class StudentProgressDto
    {
        public string StudentId { get; set; } = string.Empty; // Меняем на string
        public string StudentName { get; set; } = string.Empty;
        public int CompletedAssignments { get; set; }
        public int TotalAssignments { get; set; }
        public double AverageScore { get; set; }
        public double ProgressPercentage { get; set; }
    }
}