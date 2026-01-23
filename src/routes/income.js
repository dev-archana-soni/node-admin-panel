const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const incomeController = require('../controllers/incomeController');

// All routes require authentication and user role
router.use(authenticate);
router.use(requireUserRole);

// GET /api/income - Get all incomes
router.get('/', incomeController.getAllIncomes);

// GET /api/income/:id - Get income by ID
router.get('/:id', incomeController.getIncomeById);

// POST /api/income - Create new income
router.post('/', incomeController.createIncome);

// PUT /api/income/:id - Update income
router.put('/:id', incomeController.updateIncome);

// DELETE /api/income/:id - Delete income
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
