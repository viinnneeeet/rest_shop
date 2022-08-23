const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Order', orderSchema);
