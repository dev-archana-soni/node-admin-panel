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

const router = Router();

// All category routes require authentication and user role
router.use(authenticate);
router.use(requireUserRole);

// Get all categories
router.get('/', getAllCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Create new category
router.post('/', createCategory);

// Update category
router.put('/:id', updateCategory);

// Delete category
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;
