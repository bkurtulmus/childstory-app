@echo off
echo Building Flutter Web for Production...
echo.

REM Update this URL with your actual Render backend URL after deployment
set API_URL=https://childstory-backend.onrender.com

echo Using API URL: %API_URL%
echo.

cd child_story_mobile

echo Cleaning previous build...
call flutter clean

echo Building for web with production API...
call flutter build web --release --dart-define=API_BASE_URL=%API_URL%

echo.
echo ✅ Build complete!
echo.
echo Next steps:
echo 1. Go to app.netlify.com/drop
echo 2. Drag and drop the 'build/web' folder
echo 3. Your app will be live in seconds!
echo.
pause
