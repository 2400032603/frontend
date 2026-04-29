# Student Analytics Backend - MySQL Setup

## Prerequisites
- Node.js installed
- MySQL Server installed
- MySQL Workbench installed

## MySQL Setup Steps

### 1. Start MySQL Server
Make sure your MySQL server is running.

### 2. Open MySQL Workbench
- Connect to your local MySQL server
- Open a new query tab

### 3. Find Your MySQL Credentials

**If you don't know your MySQL password:**

1. **XAMPP/WAMP users**: Usually `user: 'root'`, `password: ''` (empty)
2. **MySQL Workbench**: Check your connection settings
3. **Command line**: Run `mysql -u root -p` and enter your password
4. **Reset password**: If needed, reset MySQL root password

**Test MySQL connection:**
```bash
mysql -u root -p -e "SELECT 1"
```

### 4. Configure Database Credentials
Edit the `config.js` file with your MySQL credentials:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'your_actual_password', // Your MySQL password
  database: 'student_analytics',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
```

**Common MySQL setups:**
- **XAMPP**: user: 'root', password: '' (empty)
- **WAMP**: user: 'root', password: '' (empty)
- **MySQL Installer**: user: 'root', password: 'your_password'
- **Docker**: user: 'root', password: 'root' or custom

### 5. Test Database Connection
Run the test script to verify your MySQL setup:

```bash
node test-db.js
```

This will test:
- MySQL server connection
- Database creation
- Query execution

### 6. Install Dependencies
```bash
npm install
```

### 7. Start the Server
```bash
npm start
```

## Default MySQL Credentials
- **Host**: localhost
- **User**: root
- **Password**: (your MySQL root password)
- **Database**: student_analytics

## Testing the API

### Health Check
```bash
curl http://localhost:4000/api/health
```

### Create Account
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

1. **Connection Error**: Make sure MySQL server is running
2. **Access Denied**: Check your MySQL username and password
3. **Database Not Found**: Run the setup.sql script first
4. **Port Conflict**: Change PORT in server.js if 4000 is in use