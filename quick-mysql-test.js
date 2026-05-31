const mysql = require('mysql2');

console.log('Quick MySQL Connection Test...');

// Test connection without database first
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  connectTimeout: 5000
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ MySQL Connection Successful!');
    
    // Check if database exists
    connection.query('SHOW DATABASES LIKE "greggory_foundation_db_main"', (err, results) => {
      if (err) {
        console.error('❌ Database check failed:', err.message);
      } else {
        if (results.length > 0) {
          console.log('✅ Database greggory_foundation_db_main exists');
        } else {
          console.log('⚠️  Database greggory_foundation_db_main does not exist - needs to be created');
        }
      }
      
      connection.end();
      process.exit(0);
    });
  }
});