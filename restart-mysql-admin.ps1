# Restart MySQL/MariaDB Service - Must be run as Administrator
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "MySQL/MariaDB Service Restart Script" -ForegroundColor Cyan  
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Please right-click and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "[OK] Running as Administrator`n" -ForegroundColor Green

# Stop MariaDB service
Write-Host "Step 1: Stopping MariaDB service..." -ForegroundColor Yellow
try {
    Stop-Service MariaDB -Force -ErrorAction Stop
    Write-Host "[OK] MariaDB service stopped`n" -ForegroundColor Green
    Start-Sleep -Seconds 3
} catch {
    Write-Host "[WARNING] Could not stop MariaDB service: $($_.Exception.Message)`n" -ForegroundColor Yellow
}

# Kill any remaining MySQL processes
Write-Host "Step 2: Killing any remaining MySQL processes..." -ForegroundColor Yellow
try {
    Get-Process mysqld -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "[OK] MySQL processes killed`n" -ForegroundColor Green
    Start-Sleep -Seconds 2
} catch {
    Write-Host "[INFO] No MySQL processes to kill`n" -ForegroundColor Cyan
}

# Start MariaDB service
Write-Host "Step 3: Starting MariaDB service..." -ForegroundColor Yellow
try {
    Start-Service MariaDB -ErrorAction Stop
    Write-Host "[OK] MariaDB service started`n" -ForegroundColor Green
    Start-Sleep -Seconds 5
} catch {
    Write-Host "[ERROR] Could not start MariaDB service: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nPlease start MySQL manually from XAMPP Control Panel" -ForegroundColor Yellow
    pause
    exit 1
}

# Verify service status
Write-Host "Step 4: Verifying service status..." -ForegroundColor Yellow
$service = Get-Service MariaDB
if ($service.Status -eq 'Running') {
    Write-Host "[OK] MariaDB service is running`n" -ForegroundColor Green
} else {
    Write-Host "[ERROR] MariaDB service status: $($service.Status)" -ForegroundColor Red
    pause
    exit 1
}

# Test port listening
Write-Host "Step 5: Checking if port 3306 is listening..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
$portListening = netstat -an | Select-String "3306" | Select-String "LISTENING"
if ($portListening) {
    Write-Host "[OK] Port 3306 is listening`n" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Port 3306 is not yet listening (may still be starting)`n" -ForegroundColor Yellow
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] MySQL restart completed!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan
Write-Host "Please test your database connection now." -ForegroundColor White
Write-Host "You can access phpMyAdmin at: http://localhost/phpmyadmin`n" -ForegroundColor White

pause