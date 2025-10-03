const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: 'backend/config/.env' }); // adjust path if needed
}

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
