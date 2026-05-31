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

async function runMigration() {
  let connection;
  
  try {
    console.log('[MIGRATION] Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('[MIGRATION] Database connection successful');
    
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, 'backend', 'migrations', 'update-users-tables.sql');
    console.log('[MIGRATION] Reading migration file:', migrationPath);
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('[MIGRATION] Executing migration script...');
    await connection.query(sql);
    console.log('[MIGRATION] Migration completed successfully');
    
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
