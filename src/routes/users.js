const { Router } = require('express');
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  getAvailableRoles 
} = require('../controllers/usersController');
const authenticate = require('../middleware/auth');
const requirePermission = require('../middleware/requirePermission');
const upload = require('../middleware/upload');

const router = Router();

// Get available roles
router.get('/roles', authenticate, getAvailableRoles);

// Get all users
router.get('/', authenticate, getAllUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Create new user (requires users.create permission)
router.post('/', authenticate, requirePermission('users.create'), upload.single('image'), createUser);

// Update user (requires users.edit permission)
router.put('/:id', authenticate, requirePermission('users.edit'), upload.single('image'), updateUser);

// Delete user (requires users.delete permission)
router.delete('/:id', authenticate, requirePermission('users.delete'), deleteUser);

module.exports = router;
