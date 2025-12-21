const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, seedProducts, getLowStockProducts, updateStock } = require('../Controllers/productController');

const router = express.Router();

router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/seed', seedProducts);
router.get('/low-stock', getLowStockProducts);
router.put('/:id/stock', updateStock);

module.exports = router;