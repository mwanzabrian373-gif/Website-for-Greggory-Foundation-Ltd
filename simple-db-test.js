const mysql = require('mysql2');

console.log('Simple Database Connection Test');
console.log('===============================\n');

// Test with localhost instead of 127.0.0.1
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'greggory_foundation_db_main',
  connectTimeout: 10000
});

console.log('Attempting to connect to MySQL...');
console.log('Host: localhost');
console.log('Port: 3306');
console.log('Database: greggory_foundation_db_main\n');

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('\nError details:');
    console.error('  Code:', err.code);
    console.error('  Errno:', err.errno);
    console.error('  SQL State:', err.sqlState);
    
    // Try without database
    console.log('\nTrying to connect without specifying database...');
    const connection2 = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      connectTimeout: 10000
    });
    
    connection2.connect((err2) => {
      if (err2) {
        console.error('❌ Connection without database also failed:', err2.message);
        process.exit(1);
      } else {
        console.log('✅ Connected to MySQL server successfully');
        
        // Try to use the database
        connection2.query('USE greggory_foundation_db_main', (err3) => {
          if (err3) {
            console.error('❌ Could not select database:', err3.message);
          } else {
            console.log('✅ Database greggory_foundation_db_main selected');
            
            // Test a simple query
            connection2.query('SELECT COUNT(*) as count FROM users', (err4, results) => {
              if (err4) {
                console.error('❌ Query failed:', err4.message);
              } else {
                console.log(`✅ Query successful - found ${results[0].count} users`);
              }
              
              connection2.end();
              process.exit(0);
            });
          }
          
          connection2.end();
          process.exit(0);
        });
      }
    });
    
  } else {
    console.log('✅ Connected to database successfully!');
    
    // Test a simple query
    connection.query('SELECT COUNT(*) as count FROM users', (err, results) => {
      if (err) {
        console.error('❌ Query failed:', err.message);
      } else {
        console.log(`✅ Query successful - found ${results[0].count} users`);
      }
      
      connection.end();
      process.exit(0);
    });
  }
});