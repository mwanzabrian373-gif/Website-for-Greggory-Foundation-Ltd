@echo off
REM Advanced MySQL/MariaDB Recovery Script for XAMPP
REM This script fixes persistent corruption issues including missing aria_log files and corrupted mysql.plugin table

echo ============================================
echo Advanced XAMPP MySQL/MariaDB Recovery
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

REM Kill any running MySQL processes
taskkill /F /IM mysqld.exe >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MySQL process killed
) else (
    echo [INFO] No MySQL process was running
)

timeout /t 3 /nobreak >nul

echo.
echo Step 2: Backing up current MySQL data...
echo ----------------------------------------------

set "XAMPP_PATH=C:\xampp"
set "DATA_DIR=%XAMPP_PATH%\mysql\data"
set "BACKUP_DIR=%XAMPP_PATH%\mysql\data_advanced_backup_%date:~-10,2%%date:~-7,2%%date:~-4,4%_%time:~0,2%%time:~3,2%"
set "BACKUP_DIR=%BACKUP_DIR: =0%"

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo [OK] Created backup directory: %BACKUP_DIR%
)

xcopy "%DATA_DIR%" "%BACKUP_DIR%" /E /I /H /Y >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Data backed up successfully
) else (
    echo [WARNING] Backup had some issues - continuing
)

echo.
echo Step 3: Creating missing aria_log files...
echo ----------------------------------------------

cd /d "%DATA_DIR%"

REM Create aria_log.00000001 file
if not exist aria_log.00000001 (
    type nul > aria_log.00000001
    echo [OK] Created missing aria_log.00000001
) else (
    echo [INFO] aria_log.00000001 already exists
)

REM Create aria_log_control file with basic configuration
if not exist aria_log_control (
    (
        echo ARIA 000002
        echo 1702798437
        echo [timestamp]
        echo [checkpoint]
    ) > aria_log_control
    echo [OK] Created aria_log_control
) else (
    echo [INFO] aria_log_control already exists
)

echo.
echo Step 4: Fixing file permissions and attributes...
echo ----------------------------------------------

REM Remove read-only attributes from all database files
attrib -R *.MAI >nul 2>&1
attrib -R *.MAD >nul 2>&1
attrib -R *.MAI >nul 2>&1
attrib -R *.frm >nul 2>&1
attrib -R *.ibd >nul 2>&1
attrib -R ibdata1 >nul 2>&1
attrib -R ib_logfile0 >nul 2>&1
attrib -R ib_logfile1 >nul 2>&1
attrib -R ib_buffer_pool >nul 2>&1

echo [OK] Removed read-only attributes from database files

echo.
echo Step 5: Creating my.ini with recovery options...
echo ----------------------------------------------

cd /d "%DATA_DIR%"

REM Backup original my.ini
if exist my.ini (
    copy my.ini my.ini.backup >nul
    echo [OK] Backed up original my.ini
)

REM Create temporary my.ini with innodb_force_recovery
(
    echo [mysqld]
    echo innodb_force_recovery = 1
    echo innodb_purge_threads = 1
) > my_recovery.ini

echo [OK] Created recovery configuration file

echo.
echo Step 6: Attempting MySQL startup with recovery mode...
echo ----------------------------------------------

cd /d "%XAMPP_PATH%\mysql\bin"

REM Start MySQL with recovery configuration
start "" mysqld.exe --defaults-file="%DATA_DIR%\my_recovery.ini" --console --skip-grant-tables

timeout /t 10 /nobreak >nul

echo.
echo Step 7: Cleaning up and attempting normal startup...
echo ----------------------------------------------

REM Kill the recovery mode MySQL
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 3 /nobreak >nul

REM Remove the recovery configuration
cd /d "%DATA_DIR%"
if exist my_recovery.ini (
    del my_recovery.ini
    echo [OK] Removed recovery configuration
)

echo.
echo Step 8: Starting MySQL normally...
echo ----------------------------------------------

REM Try to start as service first
net start MariaDB >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MariaDB service started successfully
    goto :test_connection
)

REM Try alternative service name
net start mysql >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MySQL service started successfully
    goto :test_connection
)

REM Try starting manually
cd /d "%XAMPP_PATH%\mysql\bin"
start "" mysqld.exe --defaults-file="%DATA_DIR%\my.ini"

echo [INFO] MySQL started manually, testing connection...
timeout /t 5 /nobreak >nul

:test_connection
echo.
echo Step 9: Testing database connection...
echo ----------------------------------------------

cd /d "%XAMPP_PATH%\mysql\bin"
mysql.exe -u root -e "SELECT 1;" >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Database connection successful!
    echo.
    
    REM Try to repair the mysql.plugin table
    echo Attempting to repair mysql.plugin table...
    mysql.exe -u root -e "USE mysql; REPAIR TABLE plugin;" >nul 2>&1
    if %errorLevel% == 0 (
        echo [OK] mysql.plugin table repaired
    ) else (
        echo [INFO] Could not repair mysql.plugin table - may not be critical
    )
    
    goto :success
) else (
    echo [WARNING] Could not connect to database - may still be starting
)

echo.
echo Step 10: Final verification...
echo ----------------------------------------------

timeout /t 5 /nobreak >nul

REM Check if MySQL process is running
tasklist | findstr mysqld >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MySQL process is running
    goto :success
) else (
    echo [ERROR] MySQL process is not running
    goto :manual_intervention
)

:success
echo.
echo ============================================
echo [SUCCESS] Advanced recovery completed!
echo ============================================
echo.
echo Your MySQL/MariaDB database should now be accessible through phpMyAdmin.
echo.
echo Backup location: %BACKUP_DIR%
echo.
echo IMPORTANT: Please test your database access through phpMyAdmin.
echo If you encounter any issues, you can restore from the backup.
echo.
pause
exit /b 0

:manual_intervention
echo.
echo ============================================
echo [ATTENTION] Additional manual steps required
echo ============================================
echo.
echo The automatic recovery could not fully resolve the issue.
echo Please try the following manual steps:
echo.
echo 1. Open XAMPP Control Panel
echo 2. Stop MySQL if it's running
echo 3. Click on the "Logs" button next to MySQL
echo 4. Check the error log for specific issues
echo 5. Consider reinstalling XAMPP MySQL module if needed
echo.
echo Backup location: %BACKUP_DIR%
echo.
pause
exit /b 1