// Test MySQL Connection
// Run with: node test-db.js

const mysql = require('mysql2/promise');
const dbConfig = require('./config');

async function testConnection() {
  try {
    console.log('🔄 Testing MySQL connection...');

    // Test basic connection
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('✅ MySQL connection successful!');

    // Test database creation
    await connection.execute('CREATE DATABASE IF NOT EXISTS student_analytics');
    console.log('✅ Database creation successful!');

    // Close connection
    await connection.end();

    // Test database connection
    const db = mysql.createPool(dbConfig);
    const [rows] = await db.execute('SELECT 1 as test');
    console.log('✅ Database query successful!');

    await db.end();

    console.log('🎉 All tests passed! Your MySQL setup is ready.');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check your username and password in config.js');
    console.log('3. Try connecting with: mysql -u root -p');
    process.exit(1);
  }
}

testConnection();