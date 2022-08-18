const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/order.controller');
const checkAuth = require('../middleware/check-auth');

//Get Orders
router.post('/getOrder', checkAuth, OrdersController.orders_get_all);

//Add Orders
router.post('/addOrder', checkAuth, OrdersController.add_order);

//Update Orders
router.post('/updateOrder', checkAuth, OrdersController.update_order);

//Delete Orders
router.post('/deleteOrder', checkAuth, OrdersController.delete_order);

module.exports = router;
