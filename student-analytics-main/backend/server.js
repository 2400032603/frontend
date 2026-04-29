const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const dbConfig = require('./config');

const app = express();
const PORT = process.env.PORT || 4000;

// Create database connection pool
let db;

async function initializeDatabase() {
  try {
    // Create connection without database first
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS student_analytics');
    await connection.end();

    // Create connection pool with database
    db = mysql.createPool(dbConfig);

    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed demo users if they don't exist
    const demoUsers = [
      { name: 'Sindhu', email: 'sindhu@gmail.com', password: 'Ss@123456', role: 'student' },
      { name: 'Sneha', email: 'sneha@gmail.com', password: 'Ss@12345', role: 'teacher' }
    ];

    for (const demoUser of demoUsers) {
      const [existing] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [demoUser.email]
      );
      if (existing.length === 0) {
        await db.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [demoUser.name, demoUser.email, demoUser.password, demoUser.role]
        );
      }
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'student']
    );

    const newUserId = result.insertId;

    res.status(201).json({
      message: 'Account created successfully',
      user: { id: newUserId, name, email, role: role || 'student' }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [users] = await db.execute(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running', database: 'connected' });
});

// Start server with database initialization
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Auth API Server is running on http://localhost:${PORT}`);
    console.log(`📊 Connected to MySQL database: student_analytics`);
    console.log(`POST /api/auth/signup - Create new account`);
    console.log(`POST /api/auth/login - Login to account`);
  });
}

startServer().catch(console.error);
