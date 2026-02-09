const fs = require('fs');
const Product = require('../models/Product');
const Category = require('../models/Category');

const buildImageEntry = (req, file) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/media/${file.filename}`;
  return {
    url,
    filename: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    sizeBytes: file.size
  };
};

const toNumber = (value) => {
  if (value === '' || value === undefined || value === null) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

async function getAllProducts(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id;
    const products = await Product.find({ createdBy: userId })
      .populate('category', 'id name type')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      products: products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category ? {
          id: product.category._id?.toString(),
          name: product.category.name,
          type: product.category.type
        } : null,
        description: product.description || '',
        images: product.images || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all products error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getProductById(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const product = await Product.findOne({ _id: id, createdBy: userId })
      .populate('category', 'id name type')
      .lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({
      product: {
        id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category ? {
          id: product.category._id?.toString(),
          name: product.category.name,
          type: product.category.type
        } : null,
        description: product.description || '',
        images: product.images || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function createProduct(req, res) {
  const { name, sku, price, stock, category, description } = req.body || {};
  const userId = req.user?.userId || req.user?.id;

  if (!name || !sku) {
    return res.status(400).json({ message: 'Name and SKU are required' });
  }

  const parsedPrice = toNumber(price);
  const parsedStock = toNumber(stock);

  if (parsedPrice === null || parsedPrice < 0) {
    return res.status(400).json({ message: 'Valid price is required' });
  }

  if (parsedStock === null || parsedStock < 0) {
    return res.status(400).json({ message: 'Valid stock is required' });
  }

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  try {
    const categoryDoc = await Category.findOne({ _id: category, createdBy: userId });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const existingSku = await Product.findOne({ sku: sku.trim(), createdBy: userId });
    if (existingSku) {
      return res.status(409).json({ message: 'SKU already exists' });
    }

    const images = (req.files || []).map(file => buildImageEntry(req, file));

    const product = await Product.create({
      name: name.trim(),
      sku: sku.trim(),
      price: parsedPrice,
      stock: parsedStock,
      category,
      description: description?.trim() || '',
      images,
      createdBy: userId
    });

    await product.populate('category', 'id name type');

    return res.status(201).json({
      message: 'Product created successfully',
      product: {
        id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category ? {
          id: product.category._id?.toString(),
          name: product.category.name,
          type: product.category.type
        } : null,
        description: product.description || '',
        images: product.images || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'SKU already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, sku, price, stock, category, description, replaceImages } = req.body || {};
  const userId = req.user?.userId || req.user?.id;

  try {
    const product = await Product.findOne({ _id: id, createdBy: userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name.trim();

    if (sku && sku.trim() !== product.sku) {
      const existingSku = await Product.findOne({
        sku: sku.trim(),
        createdBy: userId,
        _id: { $ne: id }
      });
      if (existingSku) {
        return res.status(409).json({ message: 'SKU already exists' });
      }
      product.sku = sku.trim();
    }

    if (price !== undefined) {
      const parsedPrice = toNumber(price);
      if (parsedPrice === null || parsedPrice < 0) {
        return res.status(400).json({ message: 'Price must be a valid number' });
      }
      product.price = parsedPrice;
    }

    if (stock !== undefined) {
      const parsedStock = toNumber(stock);
      if (parsedStock === null || parsedStock < 0) {
        return res.status(400).json({ message: 'Stock must be a valid number' });
      }
      product.stock = parsedStock;
    }

    if (category) {
      const categoryDoc = await Category.findOne({ _id: category, createdBy: userId });
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      product.category = category;
    }

    if (description !== undefined) {
      product.description = description?.trim() || '';
    }

    const shouldReplaceImages = String(replaceImages || '').toLowerCase() === 'true' || String(replaceImages) === '1';
    const uploadedImages = (req.files || []).map(file => buildImageEntry(req, file));

    if (uploadedImages.length > 0) {
      if (shouldReplaceImages && product.images?.length) {
        product.images.forEach((image) => {
          if (image?.filePath && fs.existsSync(image.filePath)) {
            fs.unlinkSync(image.filePath);
          }
        });
        product.images = uploadedImages;
      } else {
        product.images = [...(product.images || []), ...uploadedImages];
      }
    }

    await product.save();
    await product.populate('category', 'id name type');

    return res.json({
      message: 'Product updated successfully',
      product: {
        id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category ? {
          id: product.category._id?.toString(),
          name: product.category.name,
          type: product.category.type
        } : null,
        description: product.description || '',
        images: product.images || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'SKU already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId || req.user?.id;

  try {
    const product = await Product.findOneAndDelete({ _id: id, createdBy: userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.images?.length) {
      product.images.forEach((image) => {
        if (image?.filePath && fs.existsSync(image.filePath)) {
          fs.unlinkSync(image.filePath);
        }
      });
    }

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
