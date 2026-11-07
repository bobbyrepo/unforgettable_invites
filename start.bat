@echo off
title Unforgettable Invites - Master Launcher
color 0b
cd /d "%~dp0"

echo ====================================================================
echo             UNFORGETTABLE INVITES - MASTER PLATFORM        
echo ====================================================================
echo.

:: 1. Detect Local IPv4 Address
set LOCAL_IP=localhost
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        if not "%%b"=="" set LOCAL_IP=%%b
    )
)

:: 2. Ensure Port 3000 is clean (free any stale/orphaned sessions)
powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue).OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }" >nul 2>&1

:: 3. Start Cloudflare R2 CDN Asset Sync Watcher in background
echo [1/3] Starting Cloudflare R2 CDN Live Asset Watcher...
start "Unforgettable Invites - CDN R2 Watcher" /min cmd /k "cd /d \"%~dp0\" && npm run cdn:watch"

:: 4. Start Cloudflare Mobile Public HTTPS Tunnel
if exist "tools\cloudflared.exe" (
    echo [2/3] Starting Cloudflare Mobile Public HTTPS Tunnel...
    del /f /q "%TEMP%\cloudflared_mobile.log" 2>nul
    start "Unforgettable Invites - Mobile Tunnel" cmd /k "cd /d \"%~dp0\" && tools\cloudflared.exe tunnel --url http://localhost:3000 --logfile \"%TEMP%\cloudflared_mobile.log\""
    echo   * Cloudflare Mobile Tunnel launched in separate window!
    echo   * Generating public mobile HTTPS link...
    powershell -NoProfile -Command "$found = $false; for ($i=0; $i -lt 12; $i++) { Start-Sleep -Seconds 1; if (Test-Path $env:TEMP\cloudflared_mobile.log) { $m = Get-Content $env:TEMP\cloudflared_mobile.log -ErrorAction SilentlyContinue | Select-String 'https://[a-zA-Z0-9-]+\.trycloudflare\.com'; if ($m) { Write-Host '  ====================================================================' -ForegroundColor Green; Write-Host '  * MOBILE HTTPS LINK: ' -NoNewline -ForegroundColor Green; Write-Host $m.Matches[0].Value -ForegroundColor Yellow; Write-Host '  ====================================================================' -ForegroundColor Green; $found = $true; break } } }; if (-not $found) { Write-Host '  * Check Mobile Tunnel window for live https://*.trycloudflare.com link' -ForegroundColor Cyan }"
    echo.
) else (
    echo [2/3] Cloudflare tunnel executable not found in tools\, skipping tunnel.
    echo.
)

:: 5. Display Access Hub Points
echo [3/3] Application Access Hub:
echo   ------------------------------------------------------------------
echo   * Main Catalog & Portal     : http://localhost:3000
echo   * Studio Flag Editor        : http://localhost:3000/studio.html
echo   * Template 08 Live Demo     : http://localhost:3000/templates/08_unforgettable_buddhist_wedding/
echo   * Template 07 Live Demo     : http://localhost:3000/templates/07_unforgettable_ram_mandir/
echo   * Local Wi-Fi (Phone/Tablet): http://%LOCAL_IP%:3000
echo   ------------------------------------------------------------------
echo.

:: 6. Open the Main Catalog in default browser
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"

:: 7. Launch Native Fast Application Server (serve.js)
echo Starting Native Fast Web Application Server (All templates & Portal)...
echo.
node serve.js

pause
