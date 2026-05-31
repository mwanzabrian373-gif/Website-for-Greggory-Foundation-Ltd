const mysql = require('mysql2/promise');

async function checkDatabase() {
  let connection;
  
  try {
    console.log('[CHECK] Connecting to database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'greggory_foundation_db_main'
    });
    console.log('[CHECK] Database connection successful');
    
    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n[CHECK] Tables in database:');
    tables.forEach(row => {
      console.log(`  - ${Object.values(row)[0]}`);
    });
    
    // Check for specific tables
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    if (tableNames.includes('images')) {
      console.log('\n[CHECK] images table exists');
      const [columns] = await connection.query('DESCRIBE images');
      console.log('[CHECK] images table structure:');
      columns.forEach(col => console.log(`  - ${col.Field}: ${col.Type}`));
    } else {
      console.log('\n[CHECK] images table does NOT exist');
    }
    
    if (tableNames.includes('team_members')) {
      console.log('\n[CHECK] team_members table exists');
      const [columns] = await connection.query('DESCRIBE team_members');
      console.log('[CHECK] team_members table structure:');
      columns.forEach(col => console.log(`  - ${col.Field}: ${col.Type}`));
    } else {
      console.log('\n[CHECK] team_members table does NOT exist');
    }
    
  } catch (error) {
    console.error('[CHECK] Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabase();
