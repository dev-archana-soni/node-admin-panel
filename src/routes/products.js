const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const requireUserRole = require('../middleware/requireUserRole');
const requirePermission = require('../middleware/requirePermission');
const uploadMedia = require('../middleware/uploadMedia');
const productsController = require('../controllers/productsController');

router.use(authenticate);
router.use(requireUserRole);

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.post('/', requirePermission('products.create'), uploadMedia.array('images'), productsController.createProduct);
router.put('/:id', requirePermission('products.edit'), uploadMedia.array('images'), productsController.updateProduct);
router.delete('/:id', requirePermission('products.delete'), productsController.deleteProduct);

module.exports = router;
