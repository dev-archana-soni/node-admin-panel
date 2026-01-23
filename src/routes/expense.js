const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const expenseController = require('../controllers/expenseController');

// All routes require authentication and user role
router.use(authenticate);
router.use(requireUserRole);

// GET /api/expense - Get all expenses
router.get('/', expenseController.getAllExpenses);

// GET /api/expense/:id - Get expense by ID
router.get('/:id', expenseController.getExpenseById);

// POST /api/expense - Create new expense
router.post('/', expenseController.createExpense);

// PUT /api/expense/:id - Update expense
router.put('/:id', expenseController.updateExpense);

// DELETE /api/expense/:id - Delete expense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
