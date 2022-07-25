const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//Get all Products
router.post('/getProduct', async (req, res, next) => {
  const { page, limit } = req.query;
  const { initiatedBy } = req.body;

  if (initiatedBy === 'admin') {
    await Product.find()
      // .where('price')
      // .equals()
      // .lte()
      // .gte(2000)
      .select('name price _id')
      .skip(page * limit)
      .limit(limit)
      .exec()
      .then((data) => {
        const response = {
          product: data,
          message: 'Product details',
          success: true,
          count: data.length,
        };
        if (data.length != 0) {
          res.status(200).json(response);
        } else {
          res.status(404).json({
            message: 'No data found',
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
      message: 'Method Not Allowed Forbidden Access',
      failed: true,
    });
  }
});

//Add Product
router.post('/addProduct', async (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  await product
    .save()
    .then(() => {
      res.status(200).json({
        product,
        success: true,
        message: 'product created',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

//Update Product
router.post('/updateProduct', async (req, res, next) => {
  await Product.updateOne(
    { _id: req.body.id },
    { $set: { name: req.body.name, price: req.body.price } }
  )
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Updated Successfully',
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

//Delete Product
router.post('/deleteProduct', async (req, res, next) => {
  const id = req.body.id;
  await Product.remove({ _id: id })
    .exec()
    .then((data) => {
      console.log(res);
      res.status(200).json({
        message: 'Product deleted',
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        failed: true,
      });
    });
});

module.exports = router;
