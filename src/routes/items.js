const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const itemsController = require('../controllers/itemsController');

// All routes require authentication and user role
router.use(authenticate);
router.use(requireUserRole);

// GET /api/items - Get all items
router.get('/', itemsController.getAllItems);

// GET /api/items/:id - Get item by ID
router.get('/:id', itemsController.getItemById);

// POST /api/items - Create new item
router.post('/', itemsController.createItem);

// PUT /api/items/:id - Update item
router.put('/:id', itemsController.updateItem);

// DELETE /api/items/:id - Delete item
router.delete('/:id', itemsController.deleteItem);

module.exports = router;
