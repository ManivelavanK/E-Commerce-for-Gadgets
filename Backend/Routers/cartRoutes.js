const express = require('express');
const { getCart, addToCart, removeFromCart, updateQuantity, clearCart } = require('../Controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.put('/update', updateQuantity);
router.delete('/clear', clearCart);

module.exports = router;