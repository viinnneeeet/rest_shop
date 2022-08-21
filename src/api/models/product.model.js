const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
  image: { type: String, required: true },
  // timeStamp: mongoose.Schema.Types.Date,
});

module.exports = mongoose.model('Product', productSchema);
