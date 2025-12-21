const express = require('express');
const { createOrder, checkout, getUserOrders, getAllOrders, updateOrderStatus, generateBillPDF } = require('../Controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/checkout', protect, checkout);
router.get('/my-orders', protect, getUserOrders);
router.get('/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/:orderId/bill', protect, generateBillPDF);

// Get all orders (for testing)
router.get('/all-orders', async (req, res) => {
  try {
    const Order = require('../Models/Order');
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ orders, count: orders.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Simple view orders endpoint
router.get('/view', async (req, res) => {
  try {
    const Order = require('../Models/Order');
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;