@echo off
title Unforgettable Invites - Launcher
color 0b
cd /d "%~dp0"

echo ====================================================================
echo             UNFORGETTABLE INVITES - DEVELOPMENT ENVIRONMENT        
echo ====================================================================
echo.

:: Detect Local IPv4 Address for Mobile Devices
set LOCAL_IP=localhost
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        if not "%%b"=="" set LOCAL_IP=%%b
    )
)

echo [1/3] Starting Cloudflare R2 CDN Live Asset Watcher...
start "Unforgettable Invites - CDN R2 Watcher" cmd /k "cd /d \"%~dp0\" && npm run cdn:watch"

echo.
echo [2/3] Local and Mobile Access Points:
echo   ------------------------------------------------------------------
echo   * Desktop Browser : http://localhost:3000
echo   * Admin Studio    : http://localhost:3000/admin
echo   * Mobile Phone    : http://%LOCAL_IP%:3000
echo   * Mobile Preview  : http://%LOCAL_IP%:3000/templates/08_unforgettable_buddhist_wedding
echo   ------------------------------------------------------------------
echo   (Connect your phone or tablet to the same Wi-Fi network)
echo.

:: Check if cloudflared.exe exists for remote mobile public HTTPS tunnel
if exist "tools\cloudflared.exe" (
    echo [3/3] Starting Mobile Public HTTPS Tunnel (Zero-config Remote Testing)...
    start "Unforgettable Invites - Mobile Public Tunnel" cmd /k "cd /d \"%~dp0\" && tools\cloudflared.exe tunnel --url http://localhost:3000"
    echo   * Public HTTPS Tunnel launched in a separate window!
    echo.
)

echo Starting Web Application Server (Next.js)...
echo.
npm run dev -- -H 0.0.0.0 -p 3000

pause
