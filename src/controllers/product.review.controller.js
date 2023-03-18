const Product = require('../models/Product.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
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
