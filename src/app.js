const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { logger } = require('./middlewares/logEvents');
const credentials = require('./middlewares/credentials');

const corsOptions = require('../src/config/corsOptions');
const ErrorHandler = require('./middlewares/error');

// Handle options credentials check - before CORS !
// and fetch cookies credentials requirements
app.use(credentials);

//Cross Origin resource Sharing
// app.use(cors(corsOptions));
app.use(cors());

//built-in middleware to handle urlencoded form data
//built-in middleware for json

app.use(cookieParser());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// parse application/json
app.use(express.json());

//Custom Middleware logger
app.use(logger);
// app.use(errorHandler);
app.use(morgan('dev'));

//static folder
app.use(express.static('uploads'));

// config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: 'backend/config/.env',
  });
}

// Route imports
const product = require('./routes/products');
const user = require('./routes/users');
const admin = require('./routes/admin');
const order = require('./routes/orders');
// const payment = require('./routes/PaymentRoute');
// const cart = require('./routes/WishListRoute');

app.use('/api/v2/product', product);

app.use('/api/v2/user', user);

app.use('/api/v2/admin', admin);

app.use('/api/v2/order', order);

// app.use('/api/v2', payment);

// app.use('/api/v2', cart);

// app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome',
  });
});

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
// });

// it's for errorHandeling
app.use(ErrorHandler);

module.exports = app;
