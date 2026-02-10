const { Router } = require('express');
const { getPublicProducts, getPublicProductById } = require('../controllers/productsController');
const { getPublicCategories } = require('../controllers/categoriesController');

const router = Router();

router.get('/products', getPublicProducts);
router.get('/products/:id', getPublicProductById);
router.get('/categories', getPublicCategories);

module.exports = router;
