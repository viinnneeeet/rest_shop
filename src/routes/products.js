const express = require('express');
const router = express.Router();

const ProductsController = require('../controllers/product.controller');
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
  .post(isAuthenticatedUser, ProductsController.createProductReview);

//single reviews
router.route('/reviews/:id').get(ProductsController.getSingleProductReviews);

//Delete reviews
router
  .route('/review/delete')
  .post(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    ProductsController.deleteReview
  );

router
  .route('/upload/image')
  .post(uploadImage('image', 'products'), ProductsController.upload_image);

module.exports = router;
