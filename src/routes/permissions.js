const express = require('express');
const auth = require('../middleware/auth');
const requirePermission = require('../middleware/requirePermission');
const {
  getAllPermissions,
  getPermissionsByModule,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permissionsController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all permissions
router.get('/', getAllPermissions);

// Get permissions by module
router.get('/module/:moduleId', getPermissionsByModule);

// Get permission by ID
router.get('/:id', getPermissionById);

// Create permission (requires permissions.create permission)
router.post('/', requirePermission('permissions.create'), createPermission);

// Update permission (requires permissions.edit permission)
router.put('/:id', requirePermission('permissions.edit'), updatePermission);

// Delete permission (requires permissions.delete permission)
router.delete('/:id', requirePermission('permissions.delete'), deletePermission);

module.exports = router;
