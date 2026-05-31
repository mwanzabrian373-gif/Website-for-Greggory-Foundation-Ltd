const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'greggory_foundation_db_main',
  multipleStatements: true
};

async function addColumnIfNotExists(connection, tableName, columnDefinition) {
  try {
    // Check if column exists
    const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [columnDefinition.name]);
    if (columns.length === 0) {
      await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition.definition}`);
      console.log(`[MIGRATION] Added column ${columnDefinition.name} to ${tableName}`);
      return true;
    } else {
      console.log(`[MIGRATION] Column ${columnDefinition.name} already exists in ${tableName}`);
      return false;
    }
  } catch (error) {
    console.log(`[MIGRATION] Note: Could not add column ${columnDefinition.name}: ${error.message}`);
    return false;
  }
}

async function addIndexIfNotExists(connection, tableName, indexName, indexDefinition) {
  try {
    // Check if index exists
    const [indexes] = await connection.query(`SHOW INDEX FROM ${tableName} WHERE Key_name = ?`, [indexName]);
    if (indexes.length === 0) {
      await connection.query(`ALTER TABLE ${tableName} ADD INDEX ${indexDefinition}`);
      console.log(`[MIGRATION] Added index ${indexName} to ${tableName}`);
    } else {
      console.log(`[MIGRATION] Index ${indexName} already exists in ${tableName}`);
    }
  } catch (error) {
    console.log(`[MIGRATION] Note: Could not add index ${indexName}: ${error.message}`);
  }
}

async function addForeignKeyIfNotExists(connection, tableName, constraintName, fkDefinition) {
  try {
    // Check if constraint exists
    const [constraints] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.table_constraints 
      WHERE table_schema = DATABASE() 
      AND table_name = ? 
      AND constraint_name = ?
    `, [tableName, constraintName]);
    
    if (constraints[0].count === 0) {
      await connection.query(`ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${fkDefinition}`);
      console.log(`[MIGRATION] Added foreign key ${constraintName} to ${tableName}`);
    } else {
      console.log(`[MIGRATION] Foreign key ${constraintName} already exists in ${tableName}`);
    }
  } catch (error) {
    console.log(`[MIGRATION] Note: Could not add foreign key ${constraintName}: ${error.message}`);
  }
}

async function createTableIfNotExists(connection, tableName, createStatement) {
  try {
    await connection.query(`CREATE TABLE IF NOT EXISTS ${tableName} ${createStatement}`);
    console.log(`[MIGRATION] Table ${tableName} created or already exists`);
  } catch (error) {
    console.log(`[MIGRATION] Note: Could not create table ${tableName}: ${error.message}`);
  }
}

async function runMigration() {
  let connection;
  
  try {
    console.log('[MIGRATION] Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('[MIGRATION] Database connection successful');
    
    // =============================================
    // UPDATE ADMIN_USERS TABLE
    // =============================================
    console.log('\n[MIGRATION] Updating admin_users table...');
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'display_name',
      definition: 'VARCHAR(255) DEFAULT NULL AFTER last_name'
    });
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'phone_number',
      definition: 'VARCHAR(20) DEFAULT NULL AFTER email'
    });
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'department',
      definition: 'VARCHAR(100) DEFAULT "General" AFTER admin_level'
    });
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'access_level',
      definition: 'VARCHAR(50) DEFAULT "full" AFTER department'
    });
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'profile_image_id',
      definition: 'INT DEFAULT NULL AFTER access_level'
    });
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'last_login_ip',
      definition: 'VARCHAR(45) DEFAULT NULL AFTER last_login_at'
    });
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'updated_at',
      definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at'
    });
    
    await addColumnIfNotExists(connection, 'admin_users', {
      name: 'deleted_at',
      definition: 'TIMESTAMP NULL AFTER updated_at'
    });
    
    await addIndexIfNotExists(connection, 'admin_users', 'idx_admin_email', 'idx_admin_email (email)');
    await addIndexIfNotExists(connection, 'admin_users', 'idx_admin_deleted', 'idx_admin_deleted (deleted_at)');
    
    await addForeignKeyIfNotExists(connection, 'admin_users', 'fk_admin_profile_image',
      'FOREIGN KEY (profile_image_id) REFERENCES images(id) ON DELETE SET NULL');
    
    // =============================================
    // UPDATE DEVELOPER_USERS TABLE
    // =============================================
    console.log('\n[MIGRATION] Updating developer_users table...');
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'display_name',
      definition: 'VARCHAR(255) DEFAULT NULL AFTER last_name'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'phone_number',
      definition: 'VARCHAR(20) DEFAULT NULL AFTER email'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'github_username',
      definition: 'VARCHAR(100) DEFAULT NULL AFTER specialization'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'linkedin_url',
      definition: 'VARCHAR(255) DEFAULT NULL AFTER github_username'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'profile_image_id',
      definition: 'INT DEFAULT NULL AFTER team_id'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'access_level',
      definition: 'VARCHAR(50) DEFAULT "limited" AFTER tech_stack'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'last_login_ip',
      definition: 'VARCHAR(45) DEFAULT NULL AFTER last_login_at'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'updated_at',
      definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at'
    });
    
    await addColumnIfNotExists(connection, 'developer_users', {
      name: 'deleted_at',
      definition: 'TIMESTAMP NULL AFTER updated_at'
    });
    
    await addIndexIfNotExists(connection, 'developer_users', 'idx_developer_email', 'idx_developer_email (email)');
    await addIndexIfNotExists(connection, 'developer_users', 'idx_developer_deleted', 'idx_developer_deleted (deleted_at)');
    
    await addForeignKeyIfNotExists(connection, 'developer_users', 'fk_developer_profile_image',
      'FOREIGN KEY (profile_image_id) REFERENCES images(id) ON DELETE SET NULL');
    
    // =============================================
    // UPDATE USERS TABLE (Regular Users)
    // =============================================
    console.log('\n[MIGRATION] Updating users table...');
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'display_name',
      definition: 'VARCHAR(255) DEFAULT NULL AFTER last_name'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'phone_number',
      definition: 'VARCHAR(20) DEFAULT NULL AFTER email'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'primary_role',
      definition: 'VARCHAR(50) DEFAULT "user" AFTER email'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'department',
      definition: 'VARCHAR(100) DEFAULT NULL AFTER primary_role'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'job_id',
      definition: 'INT DEFAULT NULL AFTER department'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'profile_image_id',
      definition: 'INT DEFAULT NULL AFTER job_id'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'last_login_ip',
      definition: 'VARCHAR(45) DEFAULT NULL AFTER last_login'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'updated_at',
      definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at'
    });
    
    await addColumnIfNotExists(connection, 'users', {
      name: 'deleted_at',
      definition: 'TIMESTAMP NULL AFTER updated_at'
    });
    
    await addIndexIfNotExists(connection, 'users', 'idx_users_email', 'idx_users_email (email)');
    await addIndexIfNotExists(connection, 'users', 'idx_users_deleted', 'idx_users_deleted (deleted_at)');
    await addIndexIfNotExists(connection, 'users', 'idx_users_role', 'idx_users_role (primary_role)');
    
    await addForeignKeyIfNotExists(connection, 'users', 'fk_user_profile_image',
      'FOREIGN KEY (profile_image_id) REFERENCES images(id) ON DELETE SET NULL');
    
    await addForeignKeyIfNotExists(connection, 'users', 'fk_user_job',
      'FOREIGN KEY (job_id) REFERENCES team_members(id) ON DELETE SET NULL');
    
    // =============================================
    // CREATE NEW TABLES (without problematic foreign keys)
    // =============================================
    console.log('\n[MIGRATION] Creating new tables...');
    
    await createTableIfNotExists(connection, 'user_activity_logs', `(
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      user_type ENUM('admin', 'developer', 'user') NOT NULL,
      action VARCHAR(255) NOT NULL,
      details TEXT,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_activity_user (user_id),
      INDEX idx_activity_type (user_type),
      INDEX idx_activity_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    
    await createTableIfNotExists(connection, 'user_notifications', `(
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      notification_type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_notification_user (user_id),
      INDEX idx_notification_read (is_read),
      INDEX idx_notification_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    
    await createTableIfNotExists(connection, 'project_assignments', `(
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      user_id INT NOT NULL,
      user_type ENUM('admin', 'developer', 'user') NOT NULL,
      project_role ENUM('Project Manager', 'Developer', 'Designer', 'QA', 'Client', 'Consultant') DEFAULT 'Consultant',
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      assigned_by INT,
      status ENUM('active', 'completed', 'removed') DEFAULT 'active',
      INDEX idx_assignment_project (project_id),
      INDEX idx_assignment_user (user_id),
      INDEX idx_assignment_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    
    await createTableIfNotExists(connection, 'user_permissions', `(
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      user_type ENUM('admin', 'developer', 'user') NOT NULL,
      permission_name VARCHAR(255) NOT NULL,
      permission_value ENUM('read', 'write', 'admin', 'none') DEFAULT 'none',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_permission (user_id, user_type, permission_name),
      INDEX idx_permission_user (user_id),
      INDEX idx_permission_type (user_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    
    console.log('\n[MIGRATION] Migration completed successfully');
    
  } catch (error) {
    console.error('[MIGRATION] Error:', error.message);
    if (error.code) {
      console.error('[MIGRATION] MySQL Error Code:', error.code);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('[MIGRATION] Database connection closed');
    }
  }
}

// Run the migration
runMigration();
