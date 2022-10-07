const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductsController = require('../controllers/product.controller');

//Store
//get all products
router.route('/').get(ProductsController.get_all_products_store);
//add new products
router.route('/new').post(ProductsController.create_product_store);
// update delete and get product
router
  .route('/:_id')
  .get(ProductsController.get_single_product_store)
  .put(ProductsController.update_product_store)
  .delete(ProductsController.delete_product_store);

module.exports = router;
