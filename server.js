require('dotenv').config();
const { createServer, Server } = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const { logger } = require('../node-rest-shop/src/api/middleware/logEvents');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('../node-rest-shop/src/api/routes/products');
const orderRoutes = require('../node-rest-shop/src/api/routes/orders');
const userRoutes = require('../node-rest-shop/src/api/routes/users');
const errorHandler = require('./src/api/middleware/errorHandler');
const corsOptions = require('./src/api/config/corsOptions');
const credentials = require('./src/api/middleware/credentials');

const httpServer = createServer(app);

(async () => {
  try {
    mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
})();

//Custom Middleware logger
app.use(logger);
app.use(errorHandler);
app.use(morgan('dev'));

// Handle options credentials check - before CORS !
// and fetch cookies credentials requirements
app.use(credentials);

//Cross Origin resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

//built-in middleware for json
app.use(express.json({ limit: '50mb' }));

app.use(cookieParser());

app.get('/favicon.ico', (req, res) => res.status(204)); // favicon 404 fix

//Routes
app.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Welcome User',
  });
});

app.use('/api/register', require('./src/api/routes/register'));
app.use('/api/login', require('./src/api/routes/auth'));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

mongoose.connection.once('open', () => {
  const io = new Server(httpServer);

  httpServer.listen(process.env.PORT || 8000);
  console.log(
    `Server Started at ${process.env.PORT ? process.env.PORT : '8000'}`
  );
});

module.exports = app;
