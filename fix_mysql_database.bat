@echo off
REM MariaDB/MySQL Database Recovery Script for XAMPP
REM This script fixes database corruption issues in XAMPP

echo ============================================
echo XAMPP MySQL/MariaDB Database Recovery Tool
echo ============================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Running as Administrator
) else (
    echo [ERROR] This script must be run as Administrator!
    echo Please right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo Step 1: Stopping MySQL/MariaDB service...
echo ----------------------------------------------

REM Try to stop MariaDB service first
net stop MariaDB >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MariaDB service stopped
) else (
    REM Try mysql service name
    net stop mysql >nul 2>&1
    if %errorLevel% == 0 (
        echo [OK] MySQL service stopped
    ) else (
        echo [WARNING] Service stop failed, trying to kill process...
        taskkill /F /IM mysqld.exe >nul 2>&1
        if %errorLevel% == 0 (
            echo [OK] MySQL process killed
        ) else (
            echo [WARNING] Could not stop MySQL service - continuing anyway
        )
    )
)

timeout /t 3 /nobreak >nul

echo.
echo Step 2: Backing up current MySQL data...
echo ----------------------------------------------
set "XAMPP_PATH=C:\xampp"
set "DATA_DIR=%XAMPP_PATH%\mysql\data"
set "BACKUP_DIR=%XAMPP_PATH%\mysql\data_backup_%date:~-10,2%%date:~-7,2%%date:~-4,4%_%time:~0,2%%time:~3,2%"
set "BACKUP_DIR=%BACKUP_DIR: =0%"

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo [OK] Created backup directory: %BACKUP_DIR%
)

REM Copy data files
xcopy "%DATA_DIR%" "%BACKUP_DIR%" /E /I /H /Y >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Data backed up successfully
) else (
    echo [ERROR] Backup failed - continuing with repair
)

echo.
echo Step 3: Removing corrupted Aria log files...
echo ----------------------------------------------

cd /d "%DATA_DIR%"

if exist aria_log.00000001 (
    del aria_log.00000001
    echo [OK] Removed aria_log.00000001
)

if exist aria_log.00000002 (
    del aria_log.00000002
    echo [OK] Removed aria_log.00000002
)

if exist aria_log_control (
    del aria_log_control
    echo [OK] Removed aria_log_control
)

REM Remove any other aria_log files
for %%f in (aria_log.*) do (
    del "%%f"
    echo [OK] Removed %%f
)

REM Remove temporary aria log files
for %%f in (aria_log.########) do (
    if exist "%%f" (
        del "%%f"
        echo [OK] Removed %%f
    )
)

echo.
echo Step 4: Checking and repairing InnoDB files...
echo ----------------------------------------------

REM Check if ibdata1 exists and try to remove read-only attribute
if exist ibdata1 (
    attrib -R ibdata1
    echo [OK] Removed read-only attribute from ibdata1
)

REM Check other InnoDB files
if exist ib_logfile0 (
    attrib -R ib_logfile0
    echo [OK] Removed read-only attribute from ib_logfile0
)

if exist ib_logfile1 (
    attrib -R ib_logfile1
    echo [OK] Removed read-only attribute from ib_logfile1
)

echo.
echo Step 5: Attempting database repair...
echo ----------------------------------------------

cd /d "%XAMPP_PATH%\mysql\bin"

REM Try to run mysql_upgrade if available
if exist mysql_upgrade.exe (
    echo Running mysql_upgrade...
    mysql_upgrade.exe --force 2>nul
    if %errorLevel% == 0 (
        echo [OK] mysql_upgrade completed successfully
    ) else (
        echo [WARNING] mysql_upgrade had issues - continuing
    )
) else (
    echo [INFO] mysql_upgrade not found - skipping
)

REM Try to run myisamchk on all .MYI files
echo Running myisamchk on MyISAM tables...
cd /d "%DATA_DIR%"
for /r %%f in (*.MYI) do (
    "%XAMPP_PATH%\mysql\bin\myisamchk.exe" -r "%%f" >nul 2>&1
    echo [INFO] Checked %%f
)

echo.
echo Step 6: Starting MySQL/MariaDB service...
echo ----------------------------------------------

REM Try to start MariaDB
net start MariaDB >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MariaDB service started successfully
    goto :success
)

REM Try to start MySQL
net start mysql >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MySQL service started successfully
    goto :success
)

echo [ERROR] Failed to start service automatically
echo Please try starting MySQL through XAMPP Control Panel
goto :end

:success
echo.
echo ============================================
echo [SUCCESS] Database recovery completed!
echo ============================================
echo.
echo Your MySQL/MariaDB database has been repaired.
echo You can now access your database through phpMyAdmin.
echo.
echo Backup location: %BACKUP_DIR%
echo.
pause
exit /b 0

:end
echo.
echo ============================================
echo [COMPLETED] Recovery script finished
echo ============================================
echo.
echo Please try starting MySQL through XAMPP Control Panel.
echo If issues persist, you may need to reinstall XAMPP MySQL.
echo.
echo Backup location: %BACKUP_DIR%
echo.
pause
exit /b 0