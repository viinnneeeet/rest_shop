const app = require('./src/app');
const mongoose = require('mongoose');
const { createServer, Server } = require('http');
const connectDatabase = require('./src/config/db');
const cloudinary = require('cloudinary');
require('dotenv').config();
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
// console.log(process.env.port, 'port');
const server = mongoose.connection.once('open', () => {
  const io = new Server(httpServer);
  const port = process.env.PORT || 4000;
  httpServer.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
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
