1. Общая архитектура
Backend — ASP.NET Core Web API (C#): авторизация, курсы, задания, материалы, тесты, файлы.
front — React + TypeScript + Vite: кабинет преподавателя (логин, материалы, задания, тесты и т.п.).
Есть Dockerfile / nginx.conf / docker-compose.yml для сборки фронта и (через compose) совместного запуска фронта и бэка.
docker-compose.yml — совместный запуск фронта и бэка.

2. Структура Backend
Папка: Backend/
2.1. Controllers
Backend/Controllers — API-эндпоинты, все ходит под /api/...:
AuthController.cs — логин / регистрация, выдача токена.
CoursesController.cs — курсы.
AssignmentsController.cs — задания.
SubmissionsController.cs — отправленные студентами решения.
GradebookController.cs — оценки.
MaterialsController.cs — учебные материалы (лекции, презентации, видео, SCORM и т.п.).
TestsController.cs — тесты, результат теста.
AnalyticsController.cs — аналитика по курсам/тестам.

2.2. Data
Backend/Data/ApplicationDbContext.cs
Класс ApplicationDbContext : DbContext.
Описывает DbSet’ы для сущностей (User, Course, Assignment, AssignmentSubmission, LearningMaterial, Test и т.д.).
Настройка подключения берётся из appsettings.json (строка подключения к БД).

2.3. DTOs
Backend/DTOs — модели, которые отдаются/принимаются наружу:
AuthDto.cs — запрос/ответ авторизации.
AssignmentDto.cs, SubmissionDto.cs, LearningMaterialDto.cs, TestDto.cs, AnalyticsDto.cs и т.п.

2.4. Models
Backend/Models — доменные сущности БД:
User.cs
Course.cs
Assignment.cs
AssignmentCreateRequest.cs (модель для создания задания).
AssignmentSubmission.cs
LearningMaterial.cs
Test.cs
… и т.д.

2.5. Services
Backend/Services:
IFileStorageService.cs — интерфейс работы с файлами материалов/домашек.
LocalFileStorageService.cs — реализация, сохраняет в локальную файловую систему (папка, указанная в конфиге).

2.6. Конфиги и точка входа
appsettings.json — строка подключения к БД, настройки логгера, пути для файлов и т.д.
Program.cs — точка входа .NET: регистрация сервисов, CORS, JWT-аутентификация, MapControllers(), выбор порта.
EduFlow.csproj — проектный файл:
Dockerfile — сборка backend-контейнера.
Properties/launchSettings.json — профили запуска из IDE (порт, URL).

3. Структура Front
Папка: front/

3.1. Корень front
package.json — список зависимостей и скриптов.
vite.config.ts — конфиг Vite (в т.ч. server.proxy на /api → http://localhost:4000).
Dockerfile — сборка статики и nginx.
nginx.conf — конфиг nginx (слушает 3000, раздаёт фронт и проксирует /api на backend).
tsconfig*.json, eslint.config.js — типизация и линтинг.
index.html

3.3. src/api/

client.ts — экземпляр axios:
authStorage.ts — работа с localStorage (сохранение токена и имени преподавателя).
materialsApi.ts

3.4. src/auth/

authTypes.ts — типы:
AuthSuccessPayload (token, teacherName и т.д.)
Типы запросов/ответов логина/регистрации.

3.5. src/assignments/
assignmentTypes.ts — типы заданий и решений:
Assignment, AssignmentSubmission, статусы ('draft' | 'published' и т.п.).
assignmentMocks.ts — моковые данные, имитируют уже отправленные ДЗ.

3.6. src/materials/
materialTypes.ts — типы материалов:
LearningMaterial, LearningMaterialType ('lecture' | 'presentation' | 'video' | 'scorm' и т.д.).

3.7. src/dashboard/
dashboardEventTypes.ts — типы событий для дашборда (курсы, дедлайны).
mockEvents.ts — мок-события.

3.8. src/components/
AuthForm.tsx — форма логина (валидация, отправка POST /api/auth/login).
Позже здесь могут быть общие UI-компоненты (Button.tsx, модалки и т.д.).

3.9. src/pages/
Страницы (роуты):
AuthPage.tsx — страница авторизации.
TeacherRegisterPage.tsx — регистрация преподавателя (валидация полей).
TeacherDashboardPage.tsx — дашборд.
MaterialsPage.tsx — управление материалами, работа с файлами, SCORM и т.п.
AssignmentsPage.tsx — задания (создание/редактирование, загрузка ДЗ).
PendingAssignmentsPage.tsx — просмотр присланных работ, выставление оценок, комментарии.
TestCreatePage.tsx — конструктор тестов.
TestsListPage.tsx — список тестов.
TestResultsPage.tsx — результаты тестов.

3.10. src/router/
ProtectedRoute.tsx — HOC/компонент-обёртка для роутов, которые требуют токен в localStorage. Если токена нет — редирект на /login.
3.11. src/styles/
Набор CSS-файлов под каждую страницу:
app-layout.css — общий layout (шапка, боковое меню, контейнер страницы).
auth-page.css — стили логина.
teacher-register-page.css, dashboard-page.css, materials-page.css,
assignments-page.css, pending-assignments-page.css,
test-create-page.css, test-list-page.css, test-results-page.css и т.д.
Также есть общий App.css / index.css для базовых стилей.

3.12. src/tests/
testTypes.ts — типы тестов и вопросов.
testStorage.ts — сохранение/загрузка тестов (пока из localStorage/моков).
mockTestResults.ts — моковые результаты для демо-страницы.

3.13. Корневые файлы React
App.tsx — корневой компонент: роутинг, ProtectedRoute, передача onAuthSuccess, onLogout.
main.tsx — входная точка Vite (ReactDOM.createRoot).

4. Зависимости и версии

Точные версии завязаны на файлы:

Backend — см. Backend/EduFlow.csproj

{
"name": "teacher-front",
"private": true,
"version": "0.0.0",
"type": "module",
"scripts": {
"dev": "vite",
"build": "tsc -b && vite build",
"lint": "eslint .",
"preview": "vite preview"
},
"dependencies": {
"axios": "^1.13.2",
"react": "^19.2.0",
"react-dom": "^19.2.0",
"react-router-dom": "^7.9.6"
},
"devDependencies": {
"@eslint/js": "^9.39.1",
"@types/node": "^24.10.1",
"@types/react": "^19.2.5",
"@types/react-dom": "^19.2.3",
"@vitejs/plugin-react": "^5.1.1",
"eslint": "^9.39.1",
"eslint-plugin-react-hooks": "^7.0.1",
"eslint-plugin-react-refresh": "^0.4.24",
"globals": "^16.5.0",
"typescript": "~5.9.3",
"typescript-eslint": "^8.46.4",
"vite": "^7.2.4"
}
}

5. Запуск проекта без Docker (локальная разработка)
   5.1. Предварительные требования

.NET SDK той версии, что в EduFlow.csproj (например, .NET 8 SDK).
Node.js LTS (18 или 20) + npm.

5.2. Запуск backend
cd Backend
dotnet run

http://localhost:4000.

5.3. Запуск frontend (Vite dev-режим)
cd front
npm install
npm run dev
http://localhost:5173.

6. Запуск через Docker!!!!!

Совместный запуск фронта и бэка через docker-compose

docker compose up --build

После этого:

Backend: http://localhost:4000 

Frontend: http://localhost:8080

Команда "Легенда"
Смирнов Иван - frontend
Мария Аверина - UX / UI дизайнер
Андрей Ефимов - Backend-разработчик
Юля - бизнес аналитик

https://drive.google.com/file/d/1mc3oe-rXJxwpkiuwlMSd8xNja-1G1sS1/view?usp=sharing
