module.exports = (sequelize, DataTypes) => {
  const SevaPayment = sequelize.define(
    'SevaPayment',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      txnid: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique transaction ID for PayU',
      },

      seva_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Name of the seva or offering',
      },

      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Transaction amount',
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Donor name',
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { isEmail: true },
      },

      phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        comment: 'Donor contact number',
      },

      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payment status',
      },

      payu_response: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Full PayU callback payload',
      },

      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'payments',
      timestamps: true, // adds createdAt & updatedAt
      indexes: [{ fields: ['txnid'] }],
    }
  );

  return SevaPayment;
};
