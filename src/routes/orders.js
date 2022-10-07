const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/order.controller');

//Get Orders
router.post('/getOrder', OrdersController.orders_get_all);

//Add Orders
router.post('/addOrder', OrdersController.add_order);

//Update Orders
router.post('/updateOrder', OrdersController.update_order);

//Delete Orders
router.post('/deleteOrder', OrdersController.delete_order);

module.exports = router;
