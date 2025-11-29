# ChildStory App Launcher
# Starts both backend and frontend automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ChildStory App Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Write-Host "[1/2] Starting Spring Boot Backend..." -ForegroundColor Yellow

# Using absolute paths to avoid variable expansion errors
$javaPath = "C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot"
$command = "cd '$PSScriptRoot\ChildStoryApp\ChildStoryApp'; `$env:JAVA_HOME='$javaPath'; `$env:PATH='$javaPath\bin;' + `$env:PATH; Write-Host 'Backend starting on http://localhost:8080' -ForegroundColor Green; .\mvnw.cmd spring-boot:run -DskipTests"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $command

# Wait for backend to initialize
Write-Host "[2/2] Waiting 15 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start frontend
Write-Host "Starting Flutter app in Chrome..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Both apps are starting!" -ForegroundColor Green
Write-Host "  Backend: http://localhost:8080" -ForegroundColor White
Write-Host "  Frontend: Opening in Chrome..." -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd child_story_mobile
flutter run -d chrome
