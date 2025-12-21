const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createReview,
  getProductReviews,
  voteHelpful
} = require('../Controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.post('/:reviewId/vote', protect, voteHelpful);

module.exports = router;