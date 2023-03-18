const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const OrdersController = require('../controllers/order.controller');

router.route('/new').post(isAuthenticatedUser, OrdersController.createOrder);

router
  .route('/admin')
  .get(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    OrdersController.getAdminAllOrders
  );
router.route('/me').get(isAuthenticatedUser, OrdersController.getAllOrders);

router
  .route('/:id')
  .get(isAuthenticatedUser, OrdersController.getSingleOrder)
  .delete(isAuthenticatedUser, OrdersController.deleteOrder);

router
  .route('/updateAddress/:id')
  .put(isAuthenticatedUser, OrdersController.updateOrderAddress);

router
  .route('/admin/updateOrder/:id')
  .put(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    OrdersController.updateOrderAdmin
  );
module.exports = router;
