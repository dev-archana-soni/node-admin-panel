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
const upload = require('../middleware/upload');

const router = Router();

// Get available roles
router.get('/roles', authenticate, getAvailableRoles);

// Get all users
router.get('/', authenticate, getAllUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Create new user
router.post('/', authenticate, upload.single('image'), createUser);

// Update user
router.put('/:id', authenticate, upload.single('image'), updateUser);

// Delete user
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
