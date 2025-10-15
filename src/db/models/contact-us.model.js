module.exports = (sequelize, Datatypes) => {
  const ContactUs = sequelize.define(
    'ContactUs',
    {
      id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Datatypes.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: Datatypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: Datatypes.STRING(200),
        allowNull: false,
        validate: { isEmail: true },
      },
      phone: {
        type: Datatypes.STRING(15),
        allowNull: true,
        validate: { is: /^[6-9]\d{9}$/ },
      },
      messages: {
        type: Datatypes.STRING(500),
        allowNull: false,
      },
      status: {
        type: Datatypes.ENUM('new', 'in-progress', 'resolved', 'canceled'),
        allowNull: false,
        defaultValue: 'new',
      },
      replyMessage: {
        type: Datatypes.TEXT,
        allowNull: true,
      },
      repliedAt: {
        type: Datatypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'contact_us',
      timestamps: true,
    }
  );
  return ContactUs;
};
