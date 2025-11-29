@echo off
echo ========================================
echo   Starting Spring Boot Backend
echo ========================================
echo.
cd ChildStoryApp\ChildStoryApp
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
echo Backend will start on http://localhost:8080
echo.
mvnw.cmd spring-boot:run -DskipTests
