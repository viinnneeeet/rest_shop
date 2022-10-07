const mongoose = require('mongoose');

const connectDb = async () => {
  await mongoose
    .connect(
      'mongodb+srv://node-shop:node-shop@cluster1.wep5a.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((data) => {
      console.log(`Mongodb is connected with server:${data.connection.host}`);
    });
};

module.exports = connectDb;
