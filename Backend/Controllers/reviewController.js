const Review = require('../Models/Review');
const Product = require('../Models/Product');
const mongoose = require('mongoose');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user._id;

    console.log('Creating review:', { productId, userId, rating, title, comment });

    // Validate required fields
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      productId,
      userId,
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim()
    });

    const savedReview = await review.save();
    await savedReview.populate('userId', 'name');

    console.log('Review saved successfully:', savedReview._id);
    res.status(201).json({ message: 'Review created successfully', review: savedReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = 'newest' } = req.query;

    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'oldest': sortOption = { createdAt: 1 }; break;
      case 'rating-high': sortOption = { rating: -1 }; break;
      case 'rating-low': sortOption = { rating: 1 }; break;
      case 'helpful': sortOption = { helpful: -1 }; break;
    }

    const reviews = await Review.find({ productId })
      .populate('userId', 'name')
      .sort(sortOption);

    // Calculate stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingStats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      reviews,
      totalReviews,
      averageRating,
      ratingStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vote helpful on a review
const voteHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    await Review.findByIdAndUpdate(reviewId, { $inc: { helpful: 1 } });
    
    res.json({ message: 'Vote recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  voteHelpful
};