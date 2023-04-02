const Product = require('../models/Product.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Features = require('../utils/Features');
const urlConvertor = require('../utils/urlConverter');
const deleteImageFile = require('../utils/deleteImageFile');
const { default: mongoose } = require('mongoose');
//Store

async function getImage(_id, imageId) {
  const product = await Product.findById(_id);

  const [{ url }] = product.imageUrl.filter(
    (image) => image._id.toString() == imageId
  );

  const isImage = deleteImageFile(url);

  if (isImage.success) {
    product.imageUrl = product?.imageUrl?.filter((image) => {
      return imageId !== image._id.toString();
    });
    await product.save();
  }

  return { product, isImage };
}
//create product
exports.create_product_store = catchAsyncErrors(async (req, res) => {
  let imageUrl = req?.files?.map((file) => {
    return {
      _id: new mongoose.Types.ObjectId(),
      url: urlConvertor(file?.path),
      name: file?.originalname,
    };
  });
  let product = req.body;
  const { _id } = req.user;
  product = { ...product, user: _id, imageUrl };
  await Product.create(product);
  return res.status(200).json({
    success: true,
    product,
    message: 'Product Created',
  });
});
//upload image
exports.upload_image = catchAsyncErrors(async (req, res) => {
  let imageUrl = req?.files?.map((file) => {
    return {
      _id: new mongoose.Types.ObjectId(),
      url: urlConvertor(file?.path),
      name: file?.originalname,
    };
  });
  const { _id } = req.body;

  let product = await Product.findById(_id);

  product.imageUrl.push(...imageUrl);
  // to insert new and remove previous image
  // product.imageUrl = imageUrl;

  await product.save();

  return res.status(200).json({
    success: true,
    product,
    message: 'Product updated successfully',
  });
});
//delete image
exports.deleteProductImage = catchAsyncErrors(async (req, res) => {
  const { _id, imageId } = req.body;

  const { isImage, product } = await getImage(_id, imageId);

  await product.save();
  res.status(200).json({
    success: isImage.success,
    message: isImage.message,
  });
});

//get
//get all Products
exports.get_all_products_store = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;

  const totalCount = await Product.countDocuments();

  const feature = new Features(
    Product.find().select('name description imageUrl price stock category'),
    req.query
  )
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await feature.query;
  if (products.length > 0) {
    return res.status(200).json({
      success: true,
      data: products,
      message: 'Product lists',
      count: products.length,
      totalCount,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'No products',
    });
  }
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
  const { name, description, category, stock, price } = req.body;
  let product = await Product.findById(_id);

  product = await Product.findByIdAndUpdate(
    _id,
    { name, description, price, stock, category },
    {
      new: true,
      runValidators: true,
      useUnified: false,
    }
  );
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
