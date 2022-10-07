const Product = require('../models/Product.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Features = require('../utils/Features');

//Store

//create product
exports.create_product_store = catchAsyncErrors(async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(200).json({
    success: true,
    product,
    message: 'Product Created',
  });
});

//get all Products
exports.get_all_products_store = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 10;

  const count = await Product.countDocuments();

  const feature = new Features(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await feature.query;

  return res.status(200).json({
    success: true,
    products,
    message: 'Product lists',
    count,
  });
});

// single product
exports.get_single_product_store = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params._id);

  if (!product) {
    next(new ErrorHandler('Product not found', 404));
  } else {
    return res.status(200).json({
      success: true,
      product,
      message: 'Product found',
    });
  }
});

// update product -- admin
exports.update_product_store = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.params;

  let product = await Product.findById(_id);
  product = await Product.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
    useUnified: false,
  });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product Id invalid',
    });
  } else {
    return res.status(200).json({
      success: true,
      product,
      message: 'Product updated successfully',
    });
  }
});

//delete product
exports.delete_product_store = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params._id);
  await product.remove();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product Id invalid',
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  }
});
