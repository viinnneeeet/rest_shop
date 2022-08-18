const mongoose = require('mongoose');
// const Order = require('../models/order');
const Order = require('../models/order.model');

exports.orders_get_all = async (req, res, next) => {
  const { page, limit } = req.query;

  const { initiatedBy } = req.body;
  if (initiatedBy === 'admin') {
    await Order.find()
      .select('productId quantity _id')
      .populate('productId', 'name price')
      .skip(page * limit)
      .limit(limit)
      .exec()
      .then((data) => {
        const response = {
          order: data.map((doc) => {
            return {
              _id: doc._id,
              productId: doc.productId._id,
              productName: doc.productId.name,
              quantity: doc.quantity,
              price: doc.productId.price,
              totalPrice: doc.productId.price * doc.quantity,
            };
          }),
          message: 'Order details',
          success: true,
          count: data.length,
        };
        if (data.length > 0) {
          res.status(200).json(response);
        } else {
          res.status(404).json({
            message: 'No Data Found',
            failed: true,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
          network: true,
        });
      });
  } else {
    res.status(404).json({
      message: 'Forbidden Access',
      failed: true,
    });
  }
};

exports.add_order = async (req, res, next) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    productId: req.body.productId,
  });
  try {
    await order.save().then((result) => {
      res.status(200).json({
        message: 'Order Added Successfully',
        success: true,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.update_order = async (req, res, next) => {
  const { _id, quantity, productId } = req.body;
  Order.updateOne({ _id }, { $set: { quantity, productId } })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Updated Successfully',
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
};

exports.delete_order = async (req, res, next) => {};
