const mongoose = require('mongoose');
//Store Model

const ImageSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.ObjectId,
  },
  url: {
    type: String,
    required: [true, 'Please upload product image'],
  },
  name: {
    type: String,
    required: [true, 'Please enter product image title'],
    minLength: [3, 'Please Enter a product '],
  },
});

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name of a product'],
      trim: true,
      unique: [true, 'Product Already exists'],
      maxLength: [20, 'Product cannot exceed than 20 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description of your product'],
      maxLength: [4000, 'Description cannot exceed than 4000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price for your product'],
      maxLength: [8, 'Price cannot exceed than 8 characters'],
    },
    discountPrice: {
      type: String,
      maxLength: [4, 'Discount price cannot exceed than 4 characters'],
    },
    color: { type: String },
    size: { type: String },
    rating: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: [ImageSchema],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Please add a category of your product'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add some stock for your product'],
      maxLength: [3, 'Stock cannot exceed than 3 characters'],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [ReviewSchema],
      default: [],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Product', ProductSchema);
