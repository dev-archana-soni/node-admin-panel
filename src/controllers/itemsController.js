const Item = require('../models/Item');
const Category = require('../models/Category');

// Get all items
async function getAllItems(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    const items = await Item.find({ createdBy: userId })
      .populate('category', 'id name type')
      .populate('createdBy', 'id name email')
      .sort({ createdAt: -1 })
      .lean();
    
    return res.json({
      items: items.map(item => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        unit: item.unit || 'pcs',
        price: item.price,
        category: item.category ? {
          id: item.category._id?.toString(),
          name: item.category.name,
          type: item.category.type
        } : null,
        createdBy: item.createdBy ? {
          id: item.createdBy._id?.toString(),
          name: item.createdBy.name,
          email: item.createdBy.email
        } : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all items error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get item by ID
async function getItemById(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const item = await Item.findOne({ _id: id, createdBy: userId })
      .populate('category', 'id name type')
      .populate('createdBy', 'id name email')
      .lean();
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({
      item: {
        id: item._id.toString(),
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        unit: item.unit || 'pcs',
        price: item.price,
        category: item.category ? {
          id: item.category._id?.toString(),
          name: item.category.name,
          type: item.category.type
        } : null,
        createdBy: item.createdBy ? {
          id: item.createdBy._id?.toString(),
          name: item.createdBy.name,
          email: item.createdBy.email
        } : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new item
async function createItem(req, res) {
  const { name, description, quantity, unit, price, category } = req.body;
  const userId = req.user?.userId || req.user?.id;

  // Validation
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  if (quantity === undefined || quantity < 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }
  if (!unit || !['pcs', 'grams', 'kilos'].includes(unit)) {
    return res.status(400).json({ message: 'Valid unit is required (pcs, grams, or kilos)' });
  }
  if (price === undefined || price < 0) {
    return res.status(400).json({ message: 'Valid price is required' });
  }

  try {
    // Verify category exists if provided
    if (category) {
      const categoryDoc = await Category.findOne({ _id: category, createdBy: userId });
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    const newItem = new Item({
      name: name.trim(),
      description: description?.trim() || '',
      quantity: parseInt(quantity),
      unit: unit,
      price: parseFloat(price),
      category: category || null,
      createdBy: userId
    });

    await newItem.save();
    
    if (category) {
      await newItem.populate('category', 'id name type');
    }
    await newItem.populate('createdBy', 'id name email');

    return res.status(201).json({
      message: 'Item created successfully',
      item: {
        id: newItem._id.toString(),
        name: newItem.name,
        description: newItem.description,
        quantity: newItem.quantity,
        unit: newItem.unit,
        price: newItem.price,
        category: newItem.category ? {
          id: newItem.category._id.toString(),
          name: newItem.category.name,
          type: newItem.category.type
        } : null,
        createdBy: {
          id: newItem.createdBy._id.toString(),
          name: newItem.createdBy.name,
          email: newItem.createdBy.email
        },
        createdAt: newItem.createdAt,
        updatedAt: newItem.updatedAt
      }
    });
  } catch (error) {
    console.error('Create item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update item
async function updateItem(req, res) {
  const { id } = req.params;
  const { name, description, quantity, unit, price, category } = req.body;
  const userId = req.user?.userId || req.user?.id;

  try {
    const item = await Item.findOne({ _id: id, createdBy: userId });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update fields
    if (name) item.name = name.trim();
    if (description !== undefined) item.description = description?.trim() || '';
    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity must be greater than or equal to 0' });
      }
      item.quantity = parseInt(quantity);
    }
    if (unit) {
      if (!['pcs', 'grams', 'kilos'].includes(unit)) {
        return res.status(400).json({ message: 'Valid unit is required (pcs, grams, or kilos)' });
      }
      item.unit = unit;
    }
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ message: 'Price must be greater than or equal to 0' });
      }
      item.price = parseFloat(price);
    }
    
    // Update category if provided
    if (category) {
      const categoryDoc = await Category.findOne({ _id: category, createdBy: userId });
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      item.category = category;
    }

    await item.save();
    
    if (item.category) {
      await item.populate('category', 'id name type');
    }
    await item.populate('createdBy', 'id name email');

    return res.json({
      message: 'Item updated successfully',
      item: {
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        category: item.category ? {
          id: item.category._id.toString(),
          name: item.category.name,
          type: item.category.type
        } : null,
        createdBy: {
          id: item.createdBy._id.toString(),
          name: item.createdBy.name,
          email: item.createdBy.email
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    });
  } catch (error) {
    console.error('Update item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete item
async function deleteItem(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const item = await Item.findOneAndDelete({ _id: id, createdBy: userId });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
