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
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY, // only date
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME, // HH:MM:SS
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true, // URL/path
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'upcoming',
      },
      participants: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'events',
      timestamps: true, // createdAt, updatedAt
    }
  );

  return Event;
};
