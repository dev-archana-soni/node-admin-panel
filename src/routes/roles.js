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
const requirePermission = require('../middleware/requirePermission');

const router = Router();

// Get active roles (for dropdowns)
router.get('/active', authenticate, getActiveRoles);

// Get all roles
router.get('/', authenticate, getAllRoles);

// Get role by ID
router.get('/:id', authenticate, getRoleById);

// Create new role (requires roles.create permission)
router.post('/', authenticate, requirePermission('roles.create'), createRole);

// Update role (requires roles.edit permission)
router.put('/:id', authenticate, requirePermission('roles.edit'), updateRole);

// Delete role (requires roles.delete permission)
router.delete('/:id', authenticate, requirePermission('roles.delete'), deleteRole);

module.exports = router;
