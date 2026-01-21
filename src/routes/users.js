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

const router = Router();

// Get available roles
router.get('/roles', authenticate, getAvailableRoles);

// Get all users
router.get('/', authenticate, getAllUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Create new user
router.post('/', authenticate, createUser);

// Update user
router.put('/:id', authenticate, updateUser);

// Delete user
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
