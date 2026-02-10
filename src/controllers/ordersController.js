const Order = require('../models/Order');
const Product = require('../models/Product');

const toNumber = (value) => {
  if (value === '' || value === undefined || value === null) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const normalizeStatus = (value) => {
  if (!value) return null;
  return String(value).toLowerCase();
};

const buildOrderItems = async (items, userId) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('At least one item is required');
    error.status = 400;
    throw error;
  }

  const productIds = items.map(item => item.product).filter(Boolean);
  if (productIds.length !== items.length) {
    const error = new Error('Each item must reference a product');
    error.status = 400;
    throw error;
  }

  const products = await Product.find({ _id: { $in: productIds }, createdBy: userId }).lean();
  const productMap = new Map(products.map(product => [product._id.toString(), product]));

  return items.map((item) => {
    const productId = String(item.product);
    const product = productMap.get(productId);
    if (!product) {
      const error = new Error('Product not found for one or more items');
      error.status = 404;
      throw error;
    }

    const quantity = Number.parseInt(item.quantity, 10);
    if (Number.isNaN(quantity) || quantity < 1) {
      const error = new Error('Each item must have a valid quantity');
      error.status = 400;
      throw error;
    }

    const priceCandidate = toNumber(item.price);
    const price = priceCandidate === null ? product.price : priceCandidate;
    if (price === null || price < 0) {
      const error = new Error('Each item must have a valid price');
      error.status = 400;
      throw error;
    }

    const subtotal = Number((price * quantity).toFixed(2));

    return {
      product: product._id,
      productName: product.name,
      sku: product.sku,
      price,
      quantity,
      subtotal
    };
  });
};

const computeTotals = (items, taxValue, discountValue) => {
  const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const tax = taxValue || 0;
  const discount = discountValue || 0;
  const totalAmount = Math.max(subtotal + tax - discount, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2))
  };
};

async function getAllOrders(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    const orders = await Order.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      orders: orders.map(order => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail || '',
        status: order.status,
        items: order.items || [],
        itemsCount: order.items?.length || 0,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        totalAmount: order.totalAmount,
        notes: order.notes || '',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getOrderById(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const order = await Order.findOne({ _id: id, createdBy: userId }).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail || '',
        status: order.status,
        items: order.items || [],
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        totalAmount: order.totalAmount,
        notes: order.notes || '',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function createOrder(req, res) {
  const { orderNumber, customerName, customerEmail, status, items, tax, discount, notes } = req.body || {};
  const userId = req.user?.userId || req.user?.id;

  if (!orderNumber || !customerName) {
    return res.status(400).json({ message: 'Order number and customer name are required' });
  }

  const normalizedStatus = normalizeStatus(status) || 'pending';
  if (!['pending', 'processing', 'completed', 'cancelled'].includes(normalizedStatus)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const taxValue = toNumber(tax) || 0;
  const discountValue = toNumber(discount) || 0;

  if (taxValue < 0 || discountValue < 0) {
    return res.status(400).json({ message: 'Tax and discount must be valid numbers' });
  }

  try {
    const existingOrder = await Order.findOne({ orderNumber: orderNumber.trim(), createdBy: userId });
    if (existingOrder) {
      return res.status(409).json({ message: 'Order number already exists' });
    }

    const orderItems = await buildOrderItems(items, userId);
    const totals = computeTotals(orderItems, taxValue, discountValue);

    const order = await Order.create({
      orderNumber: orderNumber.trim(),
      customerName: customerName.trim(),
      customerEmail: customerEmail?.trim() || '',
      status: normalizedStatus,
      items: orderItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      totalAmount: totals.totalAmount,
      notes: notes?.trim() || '',
      createdBy: userId
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail || '',
        status: order.status,
        items: order.items || [],
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        totalAmount: order.totalAmount,
        notes: order.notes || '',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error?.status) {
      return res.status(error.status).json({ message: error.message });
    }
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Order number already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateOrder(req, res) {
  const { id } = req.params;
  const { orderNumber, customerName, customerEmail, status, items, tax, discount, notes } = req.body || {};
  const userId = req.user?.userId || req.user?.id;

  try {
    const order = await Order.findOne({ _id: id, createdBy: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderNumber && orderNumber.trim() !== order.orderNumber) {
      const existingOrder = await Order.findOne({
        orderNumber: orderNumber.trim(),
        createdBy: userId,
        _id: { $ne: id }
      });
      if (existingOrder) {
        return res.status(409).json({ message: 'Order number already exists' });
      }
      order.orderNumber = orderNumber.trim();
    }

    if (customerName) {
      order.customerName = customerName.trim();
    }

    if (customerEmail !== undefined) {
      order.customerEmail = customerEmail?.trim() || '';
    }

    if (status) {
      const normalizedStatus = normalizeStatus(status);
      if (!['pending', 'processing', 'completed', 'cancelled'].includes(normalizedStatus)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      order.status = normalizedStatus;
    }

    if (notes !== undefined) {
      order.notes = notes?.trim() || '';
    }

    let orderItems = order.items;
    if (items !== undefined) {
      orderItems = await buildOrderItems(items, userId);
      order.items = orderItems;
    }

    const taxValue = tax === undefined ? order.tax : toNumber(tax);
    const discountValue = discount === undefined ? order.discount : toNumber(discount);

    if (taxValue === null || discountValue === null || taxValue < 0 || discountValue < 0) {
      return res.status(400).json({ message: 'Tax and discount must be valid numbers' });
    }

    const totals = computeTotals(orderItems, taxValue, discountValue);
    order.subtotal = totals.subtotal;
    order.tax = totals.tax;
    order.discount = totals.discount;
    order.totalAmount = totals.totalAmount;

    await order.save();

    return res.json({
      message: 'Order updated successfully',
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail || '',
        status: order.status,
        items: order.items || [],
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        totalAmount: order.totalAmount,
        notes: order.notes || '',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Update order error:', error);
    if (error?.status) {
      return res.status(error.status).json({ message: error.message });
    }
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Order number already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteOrder(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const order = await Order.findOneAndDelete({ _id: id, createdBy: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
