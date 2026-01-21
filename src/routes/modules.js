const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllModules,
  getActiveModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule
} = require('../controllers/modulesController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all modules
router.get('/', getAllModules);

// Get active modules only
router.get('/active/list', getActiveModules);

// Get module by ID
router.get('/:id', getModuleById);

// Create module
router.post('/', createModule);

// Update module
router.put('/:id', updateModule);

// Delete module
router.delete('/:id', deleteModule);

module.exports = router;
