-- MySQL Setup Script for Student Analytics
-- Run this in MySQL Workbench to set up the database

-- Create database
CREATE DATABASE IF NOT EXISTS student_analytics;

-- Use the database
USE student_analytics;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert some test data
INSERT INTO users (name, email, password, role) VALUES
('Test Student', 'student@test.com', 'password123', 'student'),
('Test Teacher', 'teacher@test.com', 'password123', 'teacher')
ON DUPLICATE KEY UPDATE name = name;

-- Show created table
DESCRIBE users;

-- Show test data
SELECT * FROM users;