const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const monthlyItemsController = require('../controllers/monthlyItemsController');

// All routes require authentication and user role
router.use(authenticate);
router.use(requireUserRole);

// GET /api/monthly-items - Get all monthly items
router.get('/', monthlyItemsController.getAllMonthlyItems);

// GET /api/monthly-items/:id - Get monthly item by ID
router.get('/:id', monthlyItemsController.getMonthlyItemById);

// POST /api/monthly-items - Create new monthly item
router.post('/', monthlyItemsController.createMonthlyItem);

// PUT /api/monthly-items/:id - Update monthly item
router.put('/:id', monthlyItemsController.updateMonthlyItem);

// DELETE /api/monthly-items/:id - Delete monthly item
router.delete('/:id', monthlyItemsController.deleteMonthlyItem);

module.exports = router;
