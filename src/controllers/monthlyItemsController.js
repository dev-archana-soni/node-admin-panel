const MonthlyItem = require('../models/MonthlyItem');
const Item = require('../models/Item');

const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

// Get all monthly items
async function getAllMonthlyItems(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    const monthlyItems = await MonthlyItem.find({ createdBy: userId })
      .populate('item', 'id name description quantity unit price category')
      .populate('createdBy', 'id name email')
      .sort({ createdAt: -1 })
      .lean();
    
    return res.json({
      monthlyItems: monthlyItems.map(mi => ({
        id: mi._id.toString(),
        item: mi.item ? {
          id: mi.item._id?.toString(),
          name: mi.item.name,
          description: mi.item.description,
          quantity: mi.item.quantity,
          unit: mi.item.unit,
          price: mi.item.price,
          category: mi.item.category
        } : null,
        months: mi.months,
        createdBy: mi.createdBy ? {
          id: mi.createdBy._id?.toString(),
          name: mi.createdBy.name,
          email: mi.createdBy.email
        } : null,
        createdAt: mi.createdAt,
        updatedAt: mi.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all monthly items error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get monthly item by ID
async function getMonthlyItemById(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const monthlyItem = await MonthlyItem.findOne({ _id: id, createdBy: userId })
      .populate('item', 'id name description quantity unit price category')
      .populate('createdBy', 'id name email')
      .lean();
    
    if (!monthlyItem) {
      return res.status(404).json({ message: 'Monthly item not found' });
    }

    return res.json({
      monthlyItem: {
        id: monthlyItem._id.toString(),
        item: monthlyItem.item ? {
          id: monthlyItem.item._id?.toString(),
          name: monthlyItem.item.name,
          description: monthlyItem.item.description,
          quantity: monthlyItem.item.quantity,
          unit: monthlyItem.item.unit,
          price: monthlyItem.item.price,
          category: monthlyItem.item.category
        } : null,
        months: monthlyItem.months,
        createdBy: monthlyItem.createdBy ? {
          id: monthlyItem.createdBy._id?.toString(),
          name: monthlyItem.createdBy.name,
          email: monthlyItem.createdBy.email
        } : null,
        createdAt: monthlyItem.createdAt,
        updatedAt: monthlyItem.updatedAt
      }
    });
  } catch (error) {
    console.error('Get monthly item by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new monthly item
async function createMonthlyItem(req, res) {
  const { itemId, monthlyData } = req.body;
  const userId = req.user?.userId || req.user?.id;

  // Validation
  if (!itemId) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    // Verify item exists
    const itemDoc = await Item.findOne({ _id: itemId, createdBy: userId });
    if (!itemDoc) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if monthly item already exists for this item
    const existing = await MonthlyItem.findOne({ item: itemId, createdBy: userId });
    if (existing) {
      return res.status(400).json({ message: 'Monthly item already exists for this item' });
    }

    const monthsData = {};
    months.forEach(month => {
      monthsData[month] = monthlyData?.[month] || false;
    });

    const newMonthlyItem = new MonthlyItem({
      item: itemId,
      months: monthsData,
      createdBy: userId
    });

    await newMonthlyItem.save();
    await newMonthlyItem.populate('item', 'id name description quantity unit price category');
    await newMonthlyItem.populate('createdBy', 'id name email');

    return res.status(201).json({
      message: 'Monthly item created successfully',
      monthlyItem: {
        id: newMonthlyItem._id.toString(),
        item: {
          id: newMonthlyItem.item._id.toString(),
          name: newMonthlyItem.item.name,
          description: newMonthlyItem.item.description,
          quantity: newMonthlyItem.item.quantity,
          unit: newMonthlyItem.item.unit,
          price: newMonthlyItem.item.price,
          category: newMonthlyItem.item.category
        },
        months: newMonthlyItem.months,
        createdBy: {
          id: newMonthlyItem.createdBy._id.toString(),
          name: newMonthlyItem.createdBy.name,
          email: newMonthlyItem.createdBy.email
        },
        createdAt: newMonthlyItem.createdAt,
        updatedAt: newMonthlyItem.updatedAt
      }
    });
  } catch (error) {
    console.error('Create monthly item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update monthly item
async function updateMonthlyItem(req, res) {
  const { id } = req.params;
  const { monthlyData } = req.body;
  const userId = req.user?.userId || req.user?.id;

  try {
    const monthlyItem = await MonthlyItem.findOne({ _id: id, createdBy: userId });

    if (!monthlyItem) {
      return res.status(404).json({ message: 'Monthly item not found' });
    }

    // Update months
    if (monthlyData) {
      months.forEach(month => {
        if (monthlyData.hasOwnProperty(month)) {
          monthlyItem.months[month] = monthlyData[month];
        }
      });
    }

    await monthlyItem.save();
    await monthlyItem.populate('item', 'id name description quantity unit price category');
    await monthlyItem.populate('createdBy', 'id name email');

    return res.json({
      message: 'Monthly item updated successfully',
      monthlyItem: {
        id: monthlyItem._id.toString(),
        item: {
          id: monthlyItem.item._id.toString(),
          name: monthlyItem.item.name,
          description: monthlyItem.item.description,
          quantity: monthlyItem.item.quantity,
          unit: monthlyItem.item.unit,
          price: monthlyItem.item.price,
          category: monthlyItem.item.category
        },
        months: monthlyItem.months,
        createdBy: {
          id: monthlyItem.createdBy._id.toString(),
          name: monthlyItem.createdBy.name,
          email: monthlyItem.createdBy.email
        },
        createdAt: monthlyItem.createdAt,
        updatedAt: monthlyItem.updatedAt
      }
    });
  } catch (error) {
    console.error('Update monthly item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete monthly item
async function deleteMonthlyItem(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const monthlyItem = await MonthlyItem.findOneAndDelete({ _id: id, createdBy: userId });

    if (!monthlyItem) {
      return res.status(404).json({ message: 'Monthly item not found' });
    }

    return res.json({ message: 'Monthly item deleted successfully' });
  } catch (error) {
    console.error('Delete monthly item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllMonthlyItems,
  getMonthlyItemById,
  createMonthlyItem,
  updateMonthlyItem,
  deleteMonthlyItem
};
