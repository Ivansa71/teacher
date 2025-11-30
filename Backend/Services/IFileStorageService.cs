namespace EduFlow.Backend.Services
{
    public interface IFileStorageService
    {
        Task<FileUploadResult> SaveFileAsync(IFormFile file);
        Task<Stream> GetFileAsync(string filePath);
        Task DeleteFileAsync(string filePath);
    }

    public class FileUploadResult
    {
        public string FilePath { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
    }
}