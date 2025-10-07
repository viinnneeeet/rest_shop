module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define(
    'Gallery',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      image_url: {
        type: DataTypes.STRING(255), // max length to match Joi URI limit
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100), // max 100 chars to match Joi
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(50), // max 50 chars to match Joi
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'gallery',
      timestamps: true,
    }
  );

  return Gallery;
};
