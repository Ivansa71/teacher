using System.IO;

namespace EduFlow.Backend.Services
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly string _uploadPath = "uploads";

        public LocalFileStorageService()
        {
            // Создаем папку для загрузок
            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);
        }

        public async Task<FileUploadResult> SaveFileAsync(IFormFile file)
        {
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(_uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return new FileUploadResult
            {
                FilePath = filePath,
                FileName = file.FileName
            };
        }

        public Task<Stream> GetFileAsync(string filePath)
        {
            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return Task.FromResult<Stream>(stream);
        }

        public Task DeleteFileAsync(string filePath)
        {
            if (File.Exists(filePath))
                File.Delete(filePath);
                
            return Task.CompletedTask;
        }
    }
}