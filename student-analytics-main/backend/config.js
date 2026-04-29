// MySQL Database Configuration
// Update these values with your actual MySQL credentials

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'student_analytics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

module.exports = dbConfig;