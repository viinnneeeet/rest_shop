const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost', // Your MySQL host
  user: 'your_username', // Your MySQL username
  password: 'your_password', // Your MySQL password
  database: 'your_database_name', // Your database name
});

// To use promises (optional, but recommended for async/await):
const promisePool = pool.promise();

module.exports = promisePool;
