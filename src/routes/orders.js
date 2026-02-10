const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const requirePermission = require('../middleware/requirePermission');
const ordersController = require('../controllers/ordersController');

router.use(authenticate);
router.use(requireUserRole);

router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', requirePermission('orders.create'), ordersController.createOrder);
router.put('/:id', requirePermission('orders.edit'), ordersController.updateOrder);
router.delete('/:id', requirePermission('orders.delete'), ordersController.deleteOrder);

module.exports = router;
