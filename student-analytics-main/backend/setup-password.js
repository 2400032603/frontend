// Setup MySQL Password
// Run: node setup-password.js

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your MySQL root password: ', (password) => {
  const configContent = `// MySQL Database Configuration
// Update these values with your actual MySQL credentials

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '${password}',
  database: 'student_analytics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

module.exports = dbConfig;`;

  fs.writeFileSync('./config.js', configContent);
  console.log('✅ Password updated in config.js');
  console.log('Now run: node test-db.js');

  rl.close();
});