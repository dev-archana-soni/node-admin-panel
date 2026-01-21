const { Router } = require('express');
const { 
  getAllRoles, 
  getActiveRoles,
  getRoleById, 
  createRole, 
  updateRole, 
  deleteRole
} = require('../controllers/rolesController');
const authenticate = require('../middleware/auth');

const router = Router();

// Get active roles (for dropdowns)
router.get('/active', authenticate, getActiveRoles);

// Get all roles
router.get('/', authenticate, getAllRoles);

// Get role by ID
router.get('/:id', authenticate, getRoleById);

// Create new role
router.post('/', authenticate, createRole);

// Update role
router.put('/:id', authenticate, updateRole);

// Delete role
router.delete('/:id', authenticate, deleteRole);

module.exports = router;
