using Microsoft.EntityFrameworkCore;
using EduFlow.Backend.Models;

namespace EduFlow.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Test> Tests { get; set; }
        public DbSet<TestQuestion> TestQuestions { get; set; }
        public DbSet<TestOption> TestOptions { get; set; }
        public DbSet<TestResult> TestResults { get; set; }
        public DbSet<StudentAnswer> StudentAnswers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<AssignmentAttachment> AssignmentAttachments { get; set; }
        public DbSet<LearningMaterial> LearningMaterials { get; set; }
        public DbSet<LearningMaterialFile> LearningMaterialFiles { get; set; }
        public DbSet<AssignmentSubmission> AssignmentSubmissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User имеет int Id
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            // Course имеет int Id и int TeacherId
            modelBuilder.Entity<Course>()
                .HasKey(c => c.Id);
                
            modelBuilder.Entity<Course>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            // Assignment имеет string Id и int CourseId
            modelBuilder.Entity<Assignment>()
                .HasKey(a => a.Id);
                
            modelBuilder.Entity<Assignment>()
                .HasOne<Course>()
                .WithMany()
                .HasForeignKey(a => a.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // AssignmentAttachment имеет string Id и string AssignmentId
            modelBuilder.Entity<AssignmentAttachment>()
                .HasKey(a => a.Id);
                
            modelBuilder.Entity<AssignmentAttachment>()
                .HasOne<Assignment>()
                .WithMany(a => a.Attachments)
                .HasForeignKey(at => at.AssignmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // LearningMaterial имеет string Id и int CourseId
            modelBuilder.Entity<LearningMaterial>()
                .HasKey(m => m.Id);
                
            modelBuilder.Entity<LearningMaterial>()
                .HasOne<Course>()
                .WithMany()
                .HasForeignKey(m => m.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // LearningMaterialFile имеет string Id и string LearningMaterialId
            modelBuilder.Entity<LearningMaterialFile>()
                .HasKey(f => f.Id);
                
            modelBuilder.Entity<LearningMaterialFile>()
                .HasOne<LearningMaterial>()
                .WithMany(m => m.Files)
                .HasForeignKey(f => f.LearningMaterialId)
                .OnDelete(DeleteBehavior.Cascade);

            // AssignmentSubmission имеет string Id, string AssignmentId, string StudentId
            modelBuilder.Entity<AssignmentSubmission>()
                .HasKey(s => s.Id);
                
            modelBuilder.Entity<AssignmentSubmission>()
                .HasOne<Assignment>()
                .WithMany()
                .HasForeignKey(s => s.AssignmentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AssignmentSubmission>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Test имеет string Id и int CourseId, int TeacherId
            modelBuilder.Entity<Test>()
                .HasKey(t => t.Id);
                
            modelBuilder.Entity<Test>()
                .HasOne<Course>()
                .WithMany()
                .HasForeignKey(t => t.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // TestQuestion имеет string Id и string TestId
            modelBuilder.Entity<TestQuestion>()
                .HasKey(q => q.Id);
                
            modelBuilder.Entity<TestQuestion>()
                .HasOne<Test>()
                .WithMany(t => t.Questions)
                .HasForeignKey(q => q.TestId)
                .OnDelete(DeleteBehavior.Cascade);

            // TestOption имеет string Id и string QuestionId
            modelBuilder.Entity<TestOption>()
                .HasKey(o => o.Id);
                
            modelBuilder.Entity<TestOption>()
                .HasOne<TestQuestion>()
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // TestResult имеет string Id, string TestId, int StudentId
            modelBuilder.Entity<TestResult>()
                .HasKey(r => r.Id);
                
            modelBuilder.Entity<TestResult>()
                .HasOne<Test>()
                .WithMany(t => t.Results)
                .HasForeignKey(r => r.TestId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<TestResult>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(r => r.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // StudentAnswer имеет string Id, string TestResultId, string QuestionId, string SelectedOptionId
            modelBuilder.Entity<StudentAnswer>()
                .HasKey(a => a.Id);
                
            modelBuilder.Entity<StudentAnswer>()
                .HasOne<TestResult>()
                .WithMany(r => r.StudentAnswers)
                .HasForeignKey(a => a.TestResultId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<StudentAnswer>()
                .HasOne<TestQuestion>()
                .WithMany()
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<StudentAnswer>()
                .HasOne<TestOption>()
                .WithMany()
                .HasForeignKey(a => a.SelectedOptionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}