const express = require('express');
const router = express.Router();

const ProductsController = require('../controllers/product.controller');
const ProductReviewController = require('../controllers/product.review.controller');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { uploadImage } = require('../utils/upload');

//Store
//get all products
router.route('/').get(ProductsController.get_all_products_store);
//add new products
router
  .route('/new')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    uploadImage('image', 'products'),
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

//Create Review
router
  .route('/review')
  .post(isAuthenticatedUser, ProductReviewController.createProductReview);

//single reviews
router
  .route('/reviews/:id')
  .get(ProductReviewController.getSingleProductReviews);

//Delete reviews
router
  .route('/review/delete')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    ProductReviewController.deleteReview
  );

//upload product  image
router
  .route('/upload/image')
  .post(
    uploadImage('image', 'products'),
    isAuthenticatedUser,
    authorizeRoles('admin'),
    ProductsController.upload_image
  );

// delete product image
router
  .route('/delete/image')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    ProductsController.deleteProductImage
  );

module.exports = router;
