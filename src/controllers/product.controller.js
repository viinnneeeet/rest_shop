const Product = require('../models/Product.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
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
  const resultPerPage = 5;

  const totalCount = await Product.countDocuments();

  const feature = new Features(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await feature.query;

  return res.status(200).json({
    success: true,
    products,
    message: 'Product lists',
    count: products.length,
    totalCount,
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
  const {} = req.body;
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

//Create review and update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev?.user.toString() === req.user?._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev?.user.toString() === req.user?._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.rating = avg / product.reviews.length;

  await product.save({
    validateBeforeSave: false,
  });

  return res.status(200).json({
    success: true,
    message: 'Review updated successfully',
  });
});

// Get all review of a single product
exports.getSingleProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  // const { id } = req.query;
  console.log(req);
  const product = await Product.findById(id);

  if (!product) {
    next(new ErrorHandler('Product not found with this id'), 404);
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
    message: 'Product reviews',
  });
});

//Delete Review -- Admin
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, id } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found with this id', 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  return res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});
