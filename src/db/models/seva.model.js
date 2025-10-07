module.exports = (sequelize, DataTypes) => {
  const Seva = sequelize.define(
    'Seva',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      benefits: {
        type: DataTypes.JSON, // stores array of strings
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      availability: {
        type: DataTypes.ENUM('available', 'unavailable', 'upcoming'),
        allowNull: false,
        defaultValue: 'available',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'sevas',
      timestamps: true,
    }
  );

  return Seva;
};
