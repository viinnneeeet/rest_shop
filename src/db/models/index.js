const { Sequelize } = require('sequelize');
const sequelize = require('../../config/mysqlDb');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Gallery = require('./gallery.model')(sequelize, Sequelize);
db.Events = require('./event.model')(sequelize, Sequelize);
db.Sevas = require('./seva.model')(sequelize, Sequelize);
db.SevaPayment = require('./seva-payment.model')(sequelize, Sequelize);
db.SevaBooking = require('./seva-booking.model')(sequelize, Sequelize);
db.ContactUs = require('./contact-us.model')(sequelize, Sequelize);

module.exports = db;
