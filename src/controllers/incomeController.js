const Income = require('../models/Income');
const Category = require('../models/Category');

// Get all incomes
async function getAllIncomes(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    const incomes = await Income.find({ createdBy: userId })
      .populate('category', 'id name type')
      .populate('createdBy', 'id name email')
      .sort({ date: -1 })
      .lean();
    
    return res.json({
      incomes: incomes.map(income => ({
        id: income._id.toString(),
        title: income.title,
        amount: income.amount,
        description: income.description || '',
        category: income.category ? {
          id: income.category._id?.toString(),
          name: income.category.name,
          type: income.category.type
        } : null,
        date: income.date,
        createdBy: income.createdBy ? {
          id: income.createdBy._id?.toString(),
          name: income.createdBy.name,
          email: income.createdBy.email
        } : null,
        createdAt: income.createdAt,
        updatedAt: income.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all incomes error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get income by ID
async function getIncomeById(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const income = await Income.findOne({ _id: id, createdBy: userId })
      .populate('category', 'id name type')
      .populate('createdBy', 'id name email')
      .lean();
    
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    return res.json({
      income: {
        id: income._id.toString(),
        title: income.title,
        amount: income.amount,
        description: income.description || '',
        category: income.category ? {
          id: income.category._id?.toString(),
          name: income.category.name,
          type: income.category.type
        } : null,
        date: income.date,
        createdBy: income.createdBy ? {
          id: income.createdBy._id?.toString(),
          name: income.createdBy.name,
          email: income.createdBy.email
        } : null,
        createdAt: income.createdAt,
        updatedAt: income.updatedAt
      }
    });
  } catch (error) {
    console.error('Get income by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new income
async function createIncome(req, res) {
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
    // Verify category exists and is income type
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (categoryDoc.type !== 'income') {
      return res.status(400).json({ message: 'Selected category must be of type income' });
    }

    const newIncome = new Income({
      title: title.trim(),
      amount: parseFloat(amount),
      description: description?.trim() || '',
      category,
      date: date ? new Date(date) : new Date(),
      createdBy: userId
    });

    await newIncome.save();
    await newIncome.populate('category', 'id name type');
    await newIncome.populate('createdBy', 'id name email');

    return res.status(201).json({
      message: 'Income created successfully',
      income: {
        id: newIncome._id.toString(),
        title: newIncome.title,
        amount: newIncome.amount,
        description: newIncome.description,
        category: {
          id: newIncome.category._id.toString(),
          name: newIncome.category.name,
          type: newIncome.category.type
        },
        date: newIncome.date,
        createdBy: {
          id: newIncome.createdBy._id.toString(),
          name: newIncome.createdBy.name,
          email: newIncome.createdBy.email
        },
        createdAt: newIncome.createdAt,
        updatedAt: newIncome.updatedAt
      }
    });
  } catch (error) {
    console.error('Create income error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update income
async function updateIncome(req, res) {
  const { id } = req.params;
  const { title, amount, description, category, date } = req.body;
  const userId = req.user?.userId || req.user?.id;

  try {
    const income = await Income.findOne({ _id: id, createdBy: userId });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Update fields
    if (title) income.title = title.trim();
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      income.amount = parseFloat(amount);
    }
    if (description !== undefined) income.description = description?.trim() || '';
    if (date) income.date = new Date(date);
    
    // Update category if provided
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (categoryDoc.type !== 'income') {
        return res.status(400).json({ message: 'Selected category must be of type income' });
      }
      income.category = category;
    }

    await income.save();
    await income.populate('category', 'id name type');
    await income.populate('createdBy', 'id name email');

    return res.json({
      message: 'Income updated successfully',
      income: {
        id: income._id.toString(),
        title: income.title,
        amount: income.amount,
        description: income.description,
        category: {
          id: income.category._id.toString(),
          name: income.category.name,
          type: income.category.type
        },
        date: income.date,
        createdBy: {
          id: income.createdBy._id.toString(),
          name: income.createdBy.name,
          email: income.createdBy.email
        },
        createdAt: income.createdAt,
        updatedAt: income.updatedAt
      }
    });
  } catch (error) {
    console.error('Update income error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete income
async function deleteIncome(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const income = await Income.findOneAndDelete({ _id: id, createdBy: userId });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    return res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Delete income error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
};
