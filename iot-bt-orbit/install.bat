@echo off
echo 🌍 ORBIT iOS App - Installation Script
echo ======================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js found
node -v
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    exit /b 1
)

echo ✅ npm found
npm -v
echo.

echo 📦 Installing dependencies...
echo.

call npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Installation complete!
    echo.
    echo 🚀 To start the app, run:
    echo    npm start
    echo.
    echo 📱 Then:
    echo    - Press 'i' for iOS simulator
    echo    - Scan QR code with Expo Go app on iPhone
    echo.
    echo 📖 Documentation:
    echo    - README.md - Full documentation
    echo    - QUICKSTART.md - Quick reference
    echo    - IMPLEMENTATION_SUMMARY.md - Technical details
    echo    - SCREEN_FLOW.md - Navigation guide
    echo.
    echo 🌍✨ Welcome to ORBIT! ✨🌍
) else (
    echo.
    echo ❌ Installation failed. Please check the errors above.
    exit /b 1
)

pause
