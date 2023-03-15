const allowedOrigins = require('./allowedOrigins');
module.exports = {
  origin: (origin, callback) => {
    console.log(origin);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
