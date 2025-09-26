const mongoose = require('mongoose');

const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb is connected with server:${data.connection.host}`);
    });
};

module.exports = connectDb;

module.exports = connectDb;
