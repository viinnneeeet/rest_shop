const mongoose = require('mongoose');

const orderItem = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const shippingInfo = new mongoose.Schema({
  address: {
    type: String,
    // required: true,
  },
  landmark: {
    type: String,
    // required: true,
  },
  city: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
  pinCode: {
    type: Number,
    // required: true,
  },
});

const paymentInfo = new mongoose.Schema({
  id: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    // required: true,
  },
  paidAt: {
    type: Date,
    // required: true,
  },
  itemsPrice: {
    type: Number,
    // required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    // required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    // required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    // required: true,
    default: 'Processing',
  },
  deliveredAt: {
    type: Date,
  },
});

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      type: shippingInfo,
      default: {},
    },
    orderItems: {
      type: [orderItem],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);
module.exports = mongoose.model('Order', orderSchema);
