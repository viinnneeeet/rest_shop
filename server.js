const { createServer } = require('http');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = require('./src/app');
const connectDatabase = require('./src/config/db'); // Mongo
const sequelize = require('./src/config/mysqlDb'); // MySQL/Sequelize
const { PORT, NODE_ENV } = require('./src/config/env');

// --------------------
// Handle uncaught exceptions
// --------------------
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// --------------------
// Cloudinary Config
// --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------
// Database Connections
// --------------------
(async () => {
  try {
    // MongoDB
    await connectDatabase();

    // Sequelize (MySQL)
    await sequelize.authenticate();
    console.log('✅ MySQL connection established');

    // Optionally sync models
    // await sequelize.sync({ alter: true });
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
})();

// --------------------
// Start Server
// --------------------
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT} in ${NODE_ENV} mode`
  );
});

// --------------------
// Handle unhandled promise rejections
// --------------------
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});
