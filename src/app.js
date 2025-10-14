const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const credentials = require('./middlewares/credentials');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const ResponseHandler = require('./utils/responseHandler');

const app = express();

// Middleware stack
app.use(credentials);
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use(morgan('dev'));

// Static assets (uploads folder)
app.use(express.static('uploads'));

// API routes
app.use('/api/v1', routes);

// Root health-check
app.get('/', (req, res) => {
  return ResponseHandler.success(res, 'Welcome to API 🚀', '', 200);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
