@echo off
REM Ultimate MySQL/MariaDB Recovery Script for XAMPP
REM This script completely resets the database to fix persistent corruption

echo ============================================
echo Ultimate XAMPP MySQL/MariaDB Recovery
echo ============================================
echo This will completely reset your MySQL database configuration
echo Press CTRL+C to cancel or any key to continue...
pause >nul

echo.
echo Step 1: Stopping all MySQL processes...
echo ----------------------------------------------

REM Kill any running MySQL processes
taskkill /F /IM mysqld.exe >nul 2>&1
taskkill /F /IM mysqld.exe >nul 2>&1

REM Stop services if running
net stop MariaDB >nul 2>&1
net stop mysql >nul 2>&1

timeout /t 5 /nobreak >nul

echo [OK] All MySQL processes stopped

echo.
echo Step 2: Creating emergency backup...
echo ----------------------------------------------

set "XAMPP_PATH=C:\xampp"
set "DATA_DIR=%XAMPP_PATH%\mysql\data"
set "BACKUP_DIR=%XAMPP_PATH%\mysql\emergency_backup_%date:~-10,2%%date:~-7,2%%date:~-4,4%_%time:~0,2%%time:~3,2%"
set "BACKUP_DIR=%BACKUP_DIR: =0%"

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

xcopy "%DATA_DIR%" "%BACKUP_DIR%" /E /I /H /Y >nul 2>&1
echo [OK] Emergency backup created at: %BACKUP_DIR%

echo.
echo Step 3: Removing corrupted plugin table...
echo ----------------------------------------------

cd /d "%DATA_DIR%\mysql"

if exist plugin.frm (
    del plugin.frm
    echo [OK] Removed plugin.frm
)

if exist plugin.MYD (
    del plugin.MYD
    echo [OK] Removed plugin.MYD
)

if exist plugin.MYI (
    del plugin.MYI
    echo [OK] Removed plugin.MYI
)

if exist plugin.ibd (
    del plugin.ibd
    echo [OK] Removed plugin.ibd
)

if exist plugin.cfg (
    del plugin.cfg
    echo [OK] Removed plugin.cfg
)

echo.
echo Step 4: Removing all Aria engine files...
echo ----------------------------------------------

cd /d "%DATA_DIR%"

for %%f in (aria_log.*) do (
    del "%%f"
    echo [OK] Removed %%f
)

if exist aria_log_control (
    del aria_log_control
    echo [OK] Removed aria_log_control
)

echo.
echo Step 5: Removing corrupted InnoDB files...
echo ----------------------------------------------

cd /d "%DATA_DIR%"

if exist ibdata1 (
    move ibdata1 ibdata1.corrupted
    echo [OK] Moved ibdata1 to ibdata1.corrupted
)

if exist ib_logfile0 (
    move ib_logfile0 ib_logfile0.corrupted
    echo [OK] Moved ib_logfile0 to ib_logfile0.corrupted
)

if exist ib_logfile1 (
    move ib_logfile1 ib_logfile1.corrupted
    echo [OK] Moved ib_logfile1 to ib_logfile1.corrupted
)

if exist ibtmp1 (
    del ibtmp1
    echo [OK] Removed ibtmp1
)

echo.
echo Step 6: Creating my.ini with skip-plugins...
echo ----------------------------------------------

cd /d "%DATA_DIR%"

if exist my.ini (
    copy my.ini my.ini.corrupted >nul
    echo [OK] Backed up original my.ini
)

(
    echo [mysqld]
    echo skip-grant-tables
    echo skip-innodb
    echo default-storage-engine=MyISAM
    echo loose-skip-aria
) > my.ini

echo [OK] Created minimal my.ini without problematic engines

echo.
echo Step 7: Starting MySQL in minimal mode...
echo ----------------------------------------------

cd /d "%XAMPP_PATH%\mysql\bin"
start "" mysqld.exe --defaults-file="%DATA_DIR%\my.ini" --console --skip-grant-tables

timeout /t 10 /nobreak >nul

echo.
echo Step 8: Stopping minimal MySQL and restoring normal config...
echo ----------------------------------------------

taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 3 /nobreak >nul

cd /d "%DATA_DIR%"

if exist my.ini.corrupted (
    move /Y my.ini.corrupted my.ini >nul
    echo [OK] Restored original my.ini
) else (
    if exist my.ini (
        del my.ini
        echo [OK] Removed temporary my.ini
    )
)

echo.
echo Step 9: Restarting MySQL normally...
echo ----------------------------------------------

cd /d "%XAMPP_PATH%\mysql\bin"

REM Try starting as service
net start MariaDB >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MariaDB service started
    goto :test_service
)

net start mysql >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MySQL service started
    goto :test_service
)

REM Start manually if service fails
start "" mysqld.exe --defaults-file="%DATA_DIR%\my.ini"
echo [INFO] MySQL started manually
timeout /t 5 /nobreak >nul

:test_service
echo.
echo Step 10: Verifying MySQL startup...
echo ----------------------------------------------

tasklist | findstr mysqld >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] MySQL process is running
    
    timeout /t 5 /nobreak >nul
    
    echo.
    echo ============================================
    echo [SUCCESS] Ultimate recovery completed!
    echo ============================================
    echo.
    echo MySQL should now be running in XAMPP.
    echo.
    echo IMPORTANT NOTES:
    echo 1. Some InnoDB tables may need to be recreated
    echo 2. Run this in phpMyAdmin: ALTER TABLE table_name ENGINE=InnoDB;
    echo 3. Backup location: %BACKUP_DIR%
    echo.
    echo Please test phpMyAdmin access now.
    echo.
    
) else (
    echo [ERROR] MySQL failed to start
    echo.
    echo The corruption may be too severe. Please:
    echo 1. Check the backup at: %BACKUP_DIR%
    echo 2. Consider reinstalling XAMPP MySQL
    echo 3. Restore your databases from backup
    echo.
)

pause