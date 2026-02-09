const { Router } = require('express');
const { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory
} = require('../controllers/categoriesController');
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const requirePermission = require('../middleware/requirePermission');

const router = Router();

// All category routes require authentication and user role
router.use(authenticate);
router.use(requireUserRole);

// Get all categories
router.get('/', getAllCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Create new category (requires categories.create permission)
router.post('/', requirePermission('categories.create'), createCategory);

// Update category (requires categories.edit permission)
router.put('/:id', requirePermission('categories.edit'), updateCategory);

// Delete category (requires categories.delete permission)
router.delete('/:id', requirePermission('categories.delete'), deleteCategory);

module.exports = router;
