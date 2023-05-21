const mongoose = require('mongoose');

const connectDb = async () => {
  // console.log(process.env.MONGODB_URL, 'url');
  await mongoose
    .connect(
      'mongodb+srv://poojaryvineeet:WJhujRU0Zf8gKavx@cluster0.vln3vdj.mongodb.net/?retryWrites=true&w=majority',
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
