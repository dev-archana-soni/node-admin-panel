const Expense = require('../models/Expense');
const Category = require('../models/Category');

// Get all expenses
async function getAllExpenses(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    const expenses = await Expense.find({ createdBy: userId })
      .populate('category', 'id name type')
      .populate('createdBy', 'id name email')
      .populate('userGroup', 'id name')
      .populate('participants', 'id name email')
      .sort({ date: -1 })
      .lean();
    
    return res.json({
      expenses: expenses.map(expense => ({
        id: expense._id.toString(),
        title: expense.title,
        amount: expense.amount,
        amountPerPerson: expense.amountPerPerson,
        totalAmount: expense.totalAmount || expense.amount,
        type: expense.type || 'own',
        description: expense.description || '',
        category: expense.category ? {
          id: expense.category._id?.toString(),
          name: expense.category.name,
          type: expense.category.type
        } : null,
        userGroup: expense.userGroup ? {
          id: expense.userGroup._id?.toString(),
          name: expense.userGroup.name
        } : null,
        participants: (expense.participants || []).map(p => ({
          id: p._id?.toString() || p,
          name: p.name || '',
          email: p.email || ''
        })),
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
      .populate('userGroup', 'id name')
      .populate('participants', 'id name email')
      .lean();
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.json({
      expense: {
        id: expense._id.toString(),
        title: expense.title,
        amount: expense.amount,
        amountPerPerson: expense.amountPerPerson,
        totalAmount: expense.totalAmount || expense.amount,
        type: expense.type || 'own',
        description: expense.description || '',
        category: expense.category ? {
          id: expense.category._id?.toString(),
          name: expense.category.name,
          type: expense.category.type
        } : null,
        userGroup: expense.userGroup ? {
          id: expense.userGroup._id?.toString(),
          name: expense.userGroup.name
        } : null,
        participants: (expense.participants || []).map(p => ({
          id: p._id?.toString() || p,
          name: p.name || '',
          email: p.email || ''
        })),
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
  const { title, amount, description, category, date, type, userGroup, participants } = req.body;
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

    const totalAmount = parseFloat(amount);
    let expenseType = type || 'own';
    let participantsList = [];
    let amountPerPerson = totalAmount;
    let groupId = null;

    // Handle group expense
    if (expenseType === 'group') {
      if (!userGroup) {
        return res.status(400).json({ message: 'User group is required for group expense' });
      }
      if (!participants || participants.length === 0) {
        return res.status(400).json({ message: 'At least one participant is required' });
      }

      // Verify user group exists
      const UserGroup = require('../models/UserGroup');
      const groupDoc = await UserGroup.findOne({ _id: userGroup, createdBy: userId });
      if (!groupDoc) {
        return res.status(404).json({ message: 'User group not found' });
      }

      // Include the creator in the split count
      participantsList = [...new Set((participants || []).map(String))];
      groupId = userGroup;
      const splitCount = (participantsList.length || 0) + 1; // include creator
      amountPerPerson = totalAmount / splitCount;

      // Create individual expenses for each participant (excluding creator)
      const User = require('../models/User');
      for (const participantId of participantsList) {
        const participantUser = await User.findById(participantId);
        if (!participantUser) continue;

        const individualExpense = new Expense({
          title: `${title} (Split from ${groupDoc.name})`,
          amount: amountPerPerson,
          totalAmount: amountPerPerson,
          description: description?.trim() || '',
          category,
          date: date ? new Date(date) : new Date(),
          type: 'own',
          amountPerPerson,
          createdBy: participantId
        });

        await individualExpense.save();
      }
    }

    const newExpense = new Expense({
      title: title.trim(),
      amount: amountPerPerson,
      totalAmount,
      description: description?.trim() || '',
      category,
      date: date ? new Date(date) : new Date(),
      type: expenseType,
      userGroup: groupId,
      participants: participantsList,
      amountPerPerson: amountPerPerson,
      createdBy: userId
    });

    await newExpense.save();
    await newExpense.populate('category', 'id name type');
    await newExpense.populate('userGroup', 'id name');
    await newExpense.populate('participants', 'id name email');
    await newExpense.populate('createdBy', 'id name email');

    return res.status(201).json({
      message: 'Expense created successfully',
      expense: {
        id: newExpense._id.toString(),
        title: newExpense.title,
        amount: newExpense.amount,
        description: newExpense.description,
        type: newExpense.type,
        amountPerPerson: newExpense.amountPerPerson,
        category: {
          id: newExpense.category._id.toString(),
          name: newExpense.category.name,
          type: newExpense.category.type
        },
        userGroup: newExpense.userGroup ? {
          id: newExpense.userGroup._id.toString(),
          name: newExpense.userGroup.name
        } : null,
        participants: newExpense.participants.map(p => ({
          id: p._id.toString(),
          name: p.name,
          email: p.email
        })),
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
      const totalAmount = parseFloat(amount);
      expense.totalAmount = totalAmount;

      if (expense.type === 'group' && expense.participants?.length) {
        const splitCount = (expense.participants.length || 0) + 1;
        const perPerson = totalAmount / splitCount;
        expense.amount = perPerson;
        expense.amountPerPerson = perPerson;
      } else {
        expense.amount = totalAmount;
        expense.amountPerPerson = totalAmount;
      }
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
        amountPerPerson: expense.amountPerPerson,
        totalAmount: expense.totalAmount || expense.amount,
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
