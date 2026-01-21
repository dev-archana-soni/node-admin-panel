const express = require('express');
const auth = require('../middleware/auth');
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

// Create permission
router.post('/', createPermission);

// Update permission
router.put('/:id', updatePermission);

// Delete permission
router.delete('/:id', deletePermission);

module.exports = router;
