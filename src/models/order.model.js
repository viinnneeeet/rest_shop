const mongoose = require('mongoose');

const orderItem = new mongoose.Schema({
  // productName: {
  //   type: String,
  //   required: true,
  // },
  // productPrice: {
  //   type: String,
  //   required: true,
  // },
  quantity: {
    type: Number,
    required: true,
  },
  // productImage: {
  //   type: String,
  //   required: true,
  // },
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
  city: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
  },
  pinCode: {
    type: Number,
    // required: true,
  },
  phoneNo: {
    type: Number,
    // required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
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
      country: {
        type: String,
        // required: true,
      },
      pinCode: {
        type: Number,
        // required: true,
      },
      phoneNo: {
        type: Number,
        // required: true,
      },
    },
    orderItems: {
      type: [orderItem],
      default: [],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentInfo: {
      id: {
        type: String,
        // required: true,
      },
      status: {
        type: String,
        // required: true,
      },
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);
module.exports = mongoose.model('Order', orderSchema);
