const mongoose = require('mongoose');
const Product = require('../models/product.model');

exports.get_products = async (req, res, next) => {
  const { page, limit } = req.query;
  const { initiatedBy } = req.body;
  if (initiatedBy === 'admin') {
    try {
      const product = await Product.find()
        // .where('price')
        // .equals()
        // .lte()
        // .gte(2000)
        .select('name price _id')
        .skip(page * limit)
        .limit(limit);
      // .exec();

      if (product.length != 0) {
        res.status(200).json({
          product,
          message: 'Product details',
          success: true,
        });
      } else {
        res.status(404).json({
          message: 'No data found',
          failed: true,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
        network: true,
      });
    }
  } else {
    return res.status(404).json({
      message: 'Method Not Allowed Forbidden Access',
      failed: true,
    });
  }
};

exports.add_product = async (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    isActive: true,
  });
  try {
    const result = await product.save();

    res.status(200).json({
      message: 'product created',
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
      failed: true,
    });
  }
};

exports.update_product = async (req, res, next) => {
  try {
    const { name, price, _id } = req.body;
    const result = await Product.findOneAndUpdate(
      { _id },
      { $set: { name, price } }
    ).exec();
    res.status(200).json({
      message: 'Updated Successfully',
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      failed: true,
    });
  }
};

exports.delete_product = async (req, res, next) => {
  const _id = req.body.id;
  try {
    const result = await Product.remove({ _id }).exec();
    res.status(200).json({
      message: 'Product deleted',
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      failed: true,
    });
  }
};
