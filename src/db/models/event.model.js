module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100), // max 100 chars
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(50), // max 50 chars
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(100), // max 100 chars
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255), // max 255 chars
        allowNull: true, // Joi allows null/empty
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING(50), // Joi treats as string
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false, // Joi requires it
      },
      participants: {
        type: DataTypes.INTEGER.UNSIGNED, // Sequelize integer >= 0
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'active',
          'completed',
          'cancelled',
          'upcoming'
        ),
        allowNull: false,
        defaultValue: 'upcoming',
      },
    },
    {
      tableName: 'events',
      timestamps: true, // createdAt, updatedAt
    }
  );

  return Event;
};
