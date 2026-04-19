@echo off
REM Kill any process using port 5000 before starting backend
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process on port 5000 with PID %%a
    taskkill /PID %%a /F
)
REM Start backend
npm run dev
