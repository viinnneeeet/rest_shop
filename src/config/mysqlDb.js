const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.AIVEN_DB,
  process.env.AIVEN_USER,
  process.env.AIVEN_PASSWORD,
  {
    host: process.env.AIVEN_HOST,
    port: process.env.AIVEN_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: {
      max: 10, // maximum number of connections in pool
      min: 0, // minimum number of connections
      acquire: 30000, // maximum time (ms) that pool will try to get connection before throwing error
      idle: 10000, // maximum time (ms) a connection can be idle before being released
    },
  }
);

module.exports = sequelize;
