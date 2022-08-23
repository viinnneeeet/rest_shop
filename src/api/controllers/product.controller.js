const mongoose = require('mongoose');
const Product = require('../models/product.model');

exports.get_products = async (req, res, next) => {
  const { page, limit } = req.query;
  const { initiatedBy } = req.body;

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

    if (product) {
      if ((initiatedBy === 'admin ') | (initiatedBy === 'user')) {
        return res.status(200).json({
          product,
          message: 'Product details',
          success: true,
        });
      } else {
        res.status(403).json({
          message: 'Forbidden Access',
          failed: true,
        });
      }
    }
    if (product.length === 0) {
      return res.status(404).json({
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
};

exports.add_product = async (req, res, next) => {
  const { name, price, image, isActive } = req.body;
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name,
    price,
    image,
    isActive,
  });
  try {
    const productData = await Product.find({ name });
    if (productData.name === name) {
      return res.status(400).json({
        message: 'Product name already exists',
        failed: true,
      });
    }
    const result = await product.save();
    if (result) {
      return res.status(200).json({
        message: 'product created',
        success: true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      failed: true,
    });
  }
};

exports.update_product = async (req, res, next) => {
  try {
    let { name, price, _id } = req.body;
    const product = await Product.findById({ _id });
    if (!name) {
      name = product.name;
    } else if (!price) {
      price = product.price;
    }
    if (product.name === name && product.price === price) {
      return res.status(400).json({
        message: 'No Changes Found',
        failed: true,
      });
    }

    const result = await Product.findByIdAndUpdate(
      { _id },
      { $set: { name, price } }
    );

    if (result) {
      return res.status(200).json({
        message: 'Updated Successfully',
        success: true,
      });
    }
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
    const product = Product.findById({ _id });
    if (!product) {
      res.status(404).json({
        message: 'Product Not Found',
        failed: true,
      });
    }
    const result = await Product.remove({ _id });
    if (result) {
      res.status(200).json({
        message: 'Product deleted',
        success: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      failed: true,
    });
  }
};
