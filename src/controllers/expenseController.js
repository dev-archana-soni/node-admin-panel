const Expense = require('../models/Expense');
const Category = require('../models/Category');

// Get all expenses
async function getAllExpenses(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    const expenses = await Expense.find({ createdBy: userId })
      .populate('category', 'id name type')
      .populate('createdBy', 'id name email')
      .sort({ date: -1 })
      .lean();
    
    return res.json({
      expenses: expenses.map(expense => ({
        id: expense._id.toString(),
        title: expense.title,
        amount: expense.amount,
        description: expense.description || '',
        category: expense.category ? {
          id: expense.category._id?.toString(),
          name: expense.category.name,
          type: expense.category.type
        } : null,
        date: expense.date,
        createdBy: expense.createdBy ? {
          id: expense.createdBy._id?.toString(),
          name: expense.createdBy.name,
          email: expense.createdBy.email
        } : null,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all expenses error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get expense by ID
async function getExpenseById(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const expense = await Expense.findOne({ _id: id, createdBy: userId })
      .populate('category', 'id name type')
      .populate('createdBy', 'id name email')
      .lean();
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.json({
      expense: {
        id: expense._id.toString(),
        title: expense.title,
        amount: expense.amount,
        description: expense.description || '',
        category: expense.category ? {
          id: expense.category._id?.toString(),
          name: expense.category.name,
          type: expense.category.type
        } : null,
        date: expense.date,
        createdBy: expense.createdBy ? {
          id: expense.createdBy._id?.toString(),
          name: expense.createdBy.name,
          email: expense.createdBy.email
        } : null,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt
      }
    });
  } catch (error) {
    console.error('Get expense by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new expense
async function createExpense(req, res) {
  const { title, amount, description, category, date } = req.body;
  const userId = req.user?.userId || req.user?.id;

  // Validation
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }
  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  try {
    // Verify category exists and is expense type
    const categoryDoc = await Category.findOne({ _id: category, createdBy: userId });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (categoryDoc.type !== 'expense') {
      return res.status(400).json({ message: 'Selected category must be of type expense' });
    }

    const newExpense = new Expense({
      title: title.trim(),
      amount: parseFloat(amount),
      description: description?.trim() || '',
      category,
      date: date ? new Date(date) : new Date(),
      createdBy: userId
    });

    await newExpense.save();
    await newExpense.populate('category', 'id name type');
    await newExpense.populate('createdBy', 'id name email');

    return res.status(201).json({
      message: 'Expense created successfully',
      expense: {
        id: newExpense._id.toString(),
        title: newExpense.title,
        amount: newExpense.amount,
        description: newExpense.description,
        category: {
          id: newExpense.category._id.toString(),
          name: newExpense.category.name,
          type: newExpense.category.type
        },
        date: newExpense.date,
        createdBy: {
          id: newExpense.createdBy._id.toString(),
          name: newExpense.createdBy.name,
          email: newExpense.createdBy.email
        },
        createdAt: newExpense.createdAt,
        updatedAt: newExpense.updatedAt
      }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update expense
async function updateExpense(req, res) {
  const { id } = req.params;
  const { title, amount, description, category, date } = req.body;
  const userId = req.user?.userId || req.user?.id;

  try {
    const expense = await Expense.findOne({ _id: id, createdBy: userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Update fields
    if (title) expense.title = title.trim();
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      expense.amount = parseFloat(amount);
    }
    if (description !== undefined) expense.description = description?.trim() || '';
    if (date) expense.date = new Date(date);
    
    // Update category if provided
    if (category) {
      const categoryDoc = await Category.findOne({ _id: category, createdBy: userId });
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (categoryDoc.type !== 'expense') {
        return res.status(400).json({ message: 'Selected category must be of type expense' });
      }
      expense.category = category;
    }

    await expense.save();
    await expense.populate('category', 'id name type');
    await expense.populate('createdBy', 'id name email');

    return res.json({
      message: 'Expense updated successfully',
      expense: {
        id: expense._id.toString(),
        title: expense.title,
        amount: expense.amount,
        description: expense.description,
        category: {
          id: expense.category._id.toString(),
          name: expense.category.name,
          type: expense.category.type
        },
        date: expense.date,
        createdBy: {
          id: expense.createdBy._id.toString(),
          name: expense.createdBy.name,
          email: expense.createdBy.email
        },
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt
      }
    });
  } catch (error) {
    console.error('Update expense error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete expense
async function deleteExpense(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const expense = await Expense.findOneAndDelete({ _id: id, createdBy: userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
