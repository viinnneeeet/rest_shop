const app = require('./src/app');
const mongoose = require('mongoose');
const { createServer, Server } = require('http');
const connectDatabase = require('./src/config/db');
const cloudinary = require('cloudinary');

const httpServer = createServer(app);

// Handling uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server for Handling uncaught Exception`);
});

// config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: 'backend/config/.env',
  });
}
// connect database

(() => {
  connectDatabase();
})();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create server

const server = mongoose.connection.once('open', () => {
  const io = new Server(httpServer);
  httpServer.listen(process.env.PORT || 8626, () => {
    console.log(
      `Server is working on http://localhost:${process.env.PORT || 8626}`
    );
  });
});

// const server = app.listen(process.env.PORT || 8626, () => {
//   console.log(
//     `Server is working on http://localhost:${process.env.PORT || 8626}`
//   );
// });

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Shutting down server for ${err.message}`);
  console.log(`Shutting down the server due to Unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
