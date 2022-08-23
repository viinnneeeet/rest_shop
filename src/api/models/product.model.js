const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean },
    image: { type: String },
    // timeStamp: mongoose.Schema.Types.Date,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Product', productSchema);
