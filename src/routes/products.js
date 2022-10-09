const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductsController = require('../controllers/product.controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
//Store
//get all products
router.route('/').get(ProductsController.get_all_products_store);
//add new products
router
  .route('/new')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    ProductsController.create_product_store
  );
// update delete and get product
router
  .route('/:_id')
  .get(ProductsController.get_single_product_store)
  .put(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    ProductsController.update_product_store
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    ProductsController.delete_product_store
  );

module.exports = router;
