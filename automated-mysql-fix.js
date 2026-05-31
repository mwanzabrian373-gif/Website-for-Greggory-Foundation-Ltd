const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('============================================');
console.log('Automated XAMPP MySQL Recovery Script');
console.log('============================================\n');

const XAMPP_PATH = 'C:/xampp';
const DATA_DIR = `${XAMPP_PATH}/mysql/data`;
const PROJECT_CONFIG = path.join(__dirname, 'xampp-config/my.ini');

// Step 1: Stop MySQL processes
console.log('Step 1: Stopping MySQL processes...');
exec('taskkill /F /IM mysqld.exe', (error) => {
  if (error) {
    console.log('  [INFO] No MySQL process was running or already stopped');
  } else {
    console.log('  [OK] MySQL process stopped');
  }

  // Stop services
  exec('net stop MariaDB', (error) => {
    if (error) {
      console.log('  [INFO] MariaDB service not running or doesn\'t exist');
    } else {
      console.log('  [OK] MariaDB service stopped');
    }

    exec('net stop mysql', (error) => {
      if (error) {
        console.log('  [INFO] MySQL service not running or doesn\'t exist');
      } else {
        console.log('  [OK] MySQL service stopped');
      }

      setTimeout(step2, 3000);
    });
  });
});

// Step 2: Create backup
function step2() {
  console.log('\nStep 2: Creating emergency backup...');
  
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const BACKUP_DIR = `${XAMPP_PATH}/mysql/emergency_backup_${timestamp}`;
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  exec(`xcopy "${DATA_DIR}" "${BACKUP_DIR}" /E /I /H /Y`, (error) => {
    if (error) {
      console.log('  [WARNING] Backup had some issues - continuing');
    } else {
      console.log(`  [OK] Backup created at: ${BACKUP_DIR}`);
    }
    
    setTimeout(step3, 1000);
  });
}

// Step 3: Remove corrupted files
function step3() {
  console.log('\nStep 3: Removing corrupted MySQL files...');
  
  const filesToRemove = [
    'plugin.frm', 'plugin.MYD', 'plugin.MYI', 'plugin.ibd', 'plugin.cfg',
    'aria_log.00000001', 'aria_log.00000002', 'aria_log_control'
  ];
  
  filesToRemove.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`  [OK] Removed ${file}`);
      } catch (err) {
        console.log(`  [WARNING] Could not remove ${file}: ${err.message}`);
      }
    }
  });
  
  // Remove any aria_log files
  try {
    const files = fs.readdirSync(DATA_DIR);
    files.forEach(file => {
      if (file.startsWith('aria_log.')) {
        const filePath = path.join(DATA_DIR, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`  [OK] Removed ${file}`);
        } catch (err) {
          console.log(`  [WARNING] Could not remove ${file}: ${err.message}`);
        }
      }
    });
  } catch (err) {
    console.log('  [WARNING] Error reading data directory');
  }
  
  setTimeout(step4, 1000);
}

// Step 4: Handle InnoDB files
function step4() {
  console.log('\nStep 4: Moving corrupted InnoDB files...');
  
  const innodbFiles = ['ibdata1', 'ib_logfile0', 'ib_logfile1', 'ibtmp1'];
  
  innodbFiles.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    if (fs.existsSync(filePath)) {
      try {
        const backupPath = path.join(DATA_DIR, `${file}.corrupted`);
        if (fs.existsSync(backupPath)) {
          fs.unlinkSync(backupPath);
        }
        fs.renameSync(filePath, backupPath);
        console.log(`  [OK] Moved ${file} to ${file}.corrupted`);
      } catch (err) {
        console.log(`  [WARNING] Could not move ${file}: ${err.message}`);
      }
    }
  });
  
  setTimeout(step5, 1000);
}

// Step 5: Restore custom my.ini
function step5() {
  console.log('\nStep 5: Restoring custom my.ini configuration...');
  
  const targetMyIni = path.join(XAMPP_PATH, 'mysql', 'my.ini');
  
  if (fs.existsSync(PROJECT_CONFIG)) {
    try {
      // Backup existing my.ini
      if (fs.existsSync(targetMyIni)) {
        const backupPath = path.join(XAMPP_PATH, 'mysql', 'my.ini.backup');
        if (fs.existsSync(backupPath)) {
          fs.unlinkSync(backupPath);
        }
        fs.copyFileSync(targetMyIni, backupPath);
        console.log('  [OK] Backed up original my.ini');
      }
      
      // Copy custom configuration
      fs.copyFileSync(PROJECT_CONFIG, targetMyIni);
      console.log('  [OK] Custom my.ini configuration restored');
    } catch (err) {
      console.log(`  [ERROR] Could not restore my.ini: ${err.message}`);
      console.log('  [INFO] You may need to manually copy xampp-config/my.ini to C:/xampp/mysql/my.ini');
    }
  } else {
    console.log('  [WARNING] Custom my.ini not found at xampp-config/my.ini');
  }
  
  setTimeout(step6, 1000);
}

// Step 6: Start MySQL
function step6() {
  console.log('\nStep 6: Starting MySQL service...');
  
  // Try MariaDB first
  exec('net start MariaDB', (error, stdout, stderr) => {
    if (!error) {
      console.log('  [OK] MariaDB service started successfully');
      setTimeout(step7, 5000);
      return;
    }
    
    console.log('  [INFO] MariaDB service not available, trying MySQL...');
    
    // Try MySQL service
    exec('net start mysql', (error, stdout, stderr) => {
      if (!error) {
        console.log('  [OK] MySQL service started successfully');
        setTimeout(step7, 5000);
        return;
      }
      
      console.log('  [INFO] Automatic service start failed, you may need to start MySQL manually via XAMPP Control Panel');
      setTimeout(step7, 3000);
    });
  });
}

// Step 7: Verify MySQL is running
function step7() {
  console.log('\nStep 7: Verifying MySQL status...');
  
  exec('tasklist | findstr mysqld', (error, stdout) => {
    if (!error && stdout.includes('mysqld.exe')) {
      console.log('  [OK] MySQL process is running');
      console.log('\n============================================');
      console.log('[SUCCESS] MySQL recovery completed!');
      console.log('============================================');
      console.log('\nPlease test your database connection now.');
      console.log('You can access phpMyAdmin at: http://localhost/phpmyadmin');
    } else {
      console.log('  [ERROR] MySQL process is not running');
      console.log('\n============================================');
      console.log('[ATTENTION] Manual intervention required');
      console.log('============================================');
      console.log('\nPlease start MySQL manually via XAMPP Control Panel.');
      console.log('If it fails to start, check the error logs in XAMPP.');
    }
    
    console.log('\nRecovery process completed.\n');
  });
}