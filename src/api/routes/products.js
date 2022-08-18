const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductsController = require('../controllers/product.controller');
const checkAuth = require('../middleware/check-auth');

//Get all Products
router.post('/getProduct', checkAuth, ProductsController.get_products);

//Add Product
router.post('/addProduct', checkAuth, ProductsController.add_product);

//Update Product
router.post('/updateProduct', checkAuth, ProductsController.update_product);

//Delete Product
router.post('/deleteProduct', checkAuth, ProductsController.delete_product);

module.exports = router;
