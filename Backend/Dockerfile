# --- build stage ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# копируем csproj и восстанавливаем зависимости
COPY *.csproj ./
RUN dotnet restore

# копируем остальной код и публикуем
COPY . .
RUN dotnet publish -c Release -o /app/publish

# --- runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:4000
EXPOSE 4000

# имя dll = как имя проекта (EduFlow.csproj → EduFlow.dll)
ENTRYPOINT ["dotnet", "EduFlow.dll"]
