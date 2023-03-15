const Order = require('../models/order.model');
const Product = require('../models/Product.model');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    product,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    product,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  return res.status(200).json({
    success: true,
    message: 'Order added successfully',
  });
});
//Update orders shipping address
exports.updateOrderAddress = catchAsyncErrors(async (req, res, next) => {
  const { shippingInfo, id } = req.body;
  //address

  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }

  order.shippingInfo = shippingInfo;

  await order.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: 'Order address updated successfully',
  });
});

exports.generateOrderItems = catchAsyncErrors(async (req, res, next) => {
  const { product, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  const { _id } = req.user;

  // const orderItems = [
  //   {
  //     productName,
  //     productPrice,
  //     quantity,
  //     productImage,
  //     productId,
  //   },
  // ];
  const order = await Order.create({
    orderItems,
    product,
    user: _id,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  return res.status(200).json({
    success: true,
    message: 'Order created',
  });
});

//Get all orders --- Admin
exports.getAdminAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate('orderItems.product', 'name price image')
    .populate('user', 'name email')
    .select('orderItems user product shippingInfo');

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  if (orders.length != 0) {
    return res.status(200).json({
      success: true,
      totalAmount,
      orders,
      count: orders.length,
      message: 'Order items',
    });
  } else {
    return next(new ErrorHandler('Order items not found', 404));
  }
});

//Get All order
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;

  const order = await Order.find(user)
    .populate('orderItems.product', 'name price image')
    .populate('user', 'name email')
    .select('orderItems user product shippingInfo');

  if (order.length != 0) {
    return res.status(200).json({
      success: true,
      order,
      count: order.length,
      message: 'Order items',
    });
  } else {
    return next(new ErrorHandler('Order items not found', 404));
  }
});

//Get single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate('orderItems.product', 'name price image')
    .populate('user', 'name email')
    .select('orderItems user product shippingInfo');

  if (!order) {
    return next(new ErrorHandler('Order items not found', 404));
  }

  return res.status(200).json({
    success: true,
    order,
    message: 'Order items',
  });
});

//Update order --- Admin
exports.updateOrderAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404));
  }
  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Your order has been delivered', 404));
  }
  if (order.orderStatus === 'Shipped') {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = status;

  if (status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({
    validateBeforeSave: false,
  });

  return res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({
    validateBeforeSave: false,
  });
}

//Delete order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  await order.remove();
  if (!order) {
    next(new ErrorHandler('Order not found', 404));
  } else {
    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  }
});
