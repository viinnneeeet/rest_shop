// src/db/models/SevaBooking.js
module.exports = (sequelize, DataTypes) => {
  const SevaBooking = sequelize.define(
    'SevaBooking',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // User info
      userName: { type: DataTypes.STRING(100), allowNull: false },
      userEmail: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { isEmail: true },
        unique: true,
      },
      userMobile: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: { is: /^[6-9]\d{9}$/ },
      },

      // Seva info
      sevaTitle: { type: DataTypes.STRING(150), allowNull: false },
      sevaDescription: { type: DataTypes.TEXT, allowNull: true },
      sevaAmount: { type: DataTypes.FLOAT, allowNull: false },
      sevaDate: { type: DataTypes.DATEONLY, allowNull: false },

      // PDF URL
      invoiceUrl: { type: DataTypes.STRING(255), allowNull: true },

      // Optional payment info
      paymentStatus: {
        type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
        defaultValue: 'PENDING',
      },
      paymentMethod: {
        type: DataTypes.ENUM('UPI', 'CARD', 'CASH'),
        allowNull: true,
      },
    },
    {
      tableName: 'seva_bookings',
      timestamps: true,
    }
  );

  return SevaBooking;
};
