const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const requirePermission = require('../middleware/requirePermission');
const itemsController = require('../controllers/itemsController');

// All routes require authentication and user role
router.use(authenticate);
router.use(requireUserRole);

// GET /api/items - Get all items
router.get('/', itemsController.getAllItems);

// GET /api/items/:id - Get item by ID
router.get('/:id', itemsController.getItemById);

// POST /api/items - Create new item (requires items.create permission)
router.post('/', requirePermission('items.create'), itemsController.createItem);

// PUT /api/items/:id - Update item (requires items.edit permission)
router.put('/:id', requirePermission('items.edit'), itemsController.updateItem);

// DELETE /api/items/:id - Delete item (requires items.delete permission)
router.delete('/:id', requirePermission('items.delete'), itemsController.deleteItem);

module.exports = router;
