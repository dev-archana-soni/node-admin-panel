const Category = require('../models/Category');

// Get all categories
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find({ createdBy: req.user.userId })
      .select('-__v')
      .lean();
    
    return res.json({
      categories: categories.map(category => ({
        id: category._id.toString(),
        name: category.name,
        description: category.description || '',
        type: category.type,
        icon: category.icon || 'mdi-tag',
        color: category.color || '#2196F3',
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get category by ID
async function getCategoryById(req, res) {
  const { id } = req.params;

  try {
    const category = await Category.findOne({ _id: id, createdBy: req.user.userId })
      .select('-__v')
      .lean();
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({
      category: {
        id: category._id.toString(),
        name: category.name,
        description: category.description || '',
        type: category.type,
        icon: category.icon || 'mdi-tag',
        color: category.color || '#2196F3',
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new category
async function createCategory(req, res) {
  const { name, description, type, icon, color } = req.body || {};

  // Validation
  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Type must be either income or expense' });
  }

  try {
    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name: name.trim(),
      type,
      createdBy: req.user.userId
    });
    
    if (existingCategory) {
      return res.status(409).json({ message: 'Category with this name already exists' });
    }

    const categoryData = {
      name: name.trim(),
      description: description?.trim() || '',
      type,
      icon: icon || 'mdi-tag',
      color: color || '#2196F3',
      createdBy: req.user.userId
    };
    
    const newCategory = await Category.create(categoryData);

    return res.status(201).json({
      message: 'Category created successfully',
      category: {
        id: newCategory._id.toString(),
        name: newCategory.name,
        description: newCategory.description || '',
        type: newCategory.type,
        icon: newCategory.icon || 'mdi-tag',
        color: newCategory.color || '#2196F3',
        isActive: newCategory.isActive,
        createdAt: newCategory.createdAt,
        updatedAt: newCategory.updatedAt
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update category
async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description, type, icon, color, isActive } = req.body || {};

  try {
    // Check if category exists and belongs to user
    const category = await Category.findOne({ _id: id, createdBy: req.user.userId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        type: type || category.type,
        createdBy: req.user.userId,
        _id: { $ne: id }
      });
      
      if (existingCategory) {
        return res.status(409).json({ message: 'Category with this name already exists' });
      }
    }

    // Validate type if provided
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either income or expense' });
    }

    // Update fields
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim() || '';
    if (type) category.type = type;
    if (icon !== undefined) category.icon = icon || 'mdi-tag';
    if (color !== undefined) category.color = color || '#2196F3';
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.json({
      message: 'Category updated successfully',
      category: {
        id: category._id.toString(),
        name: category.name,
        description: category.description || '',
        type: category.type,
        icon: category.icon || 'mdi-tag',
        color: category.color || '#2196F3',
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete category
async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const category = await Category.findOneAndDelete({ _id: id, createdBy: req.user.userId });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
