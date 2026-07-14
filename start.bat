@echo off
echo Starting AI Streaming UI Demo...
echo.
echo This will open TWO terminal windows:
echo 1. Backend Server (port 3001)
echo 2. Frontend Dev Server (port 3000)
echo.
echo Make sure you have added your OpenAI API key to the .env file!
echo.
pause

start "Backend Server" cmd /k "npm run server"
timeout /t 3 /nobreak >nul
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo The app will be available at http://localhost:3000
echo.
echo Keep both terminal windows open while using the app.
echo Close this window to stop.
pause
