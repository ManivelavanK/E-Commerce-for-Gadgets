const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  sendNewsletterToAll,
  getStats
} = require('../Controllers/newsletterController');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes (require authentication)
router.get('/subscribers', protect, getSubscribers);
router.post('/send', protect, sendNewsletterToAll);
router.get('/stats', protect, getStats);

module.exports = router;