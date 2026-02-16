import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const fetchReviews = async () => {
    try {
      const data = await reviewsAPI.getProductReviews(productId, sortBy);
      setReviews(data.reviews || []);
      setStats({
        average: data.averageRating || 0,
        total: data.totalReviews || 0,
        distribution: data.ratingStats || []
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setStats({ average: 0, total: 0, distribution: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await reviewsAPI.createReview({
        productId,
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim()
      });
      
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      fetchReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review');
    }
  };

  const handleVoteHelpful = async (reviewId) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    try {
      await reviewsAPI.voteHelpful(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to record vote');
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="reviews-loading">Loading reviews...</div>;

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        {user && (
          <button 
            className="write-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {stats && (
        <div className="reviews-summary">
          <div className="rating-overview">
            <div className="average-rating">
              <span className="rating-number">{(stats.average || 0).toFixed(1)}</span>
              <div className="stars">{renderStars(Math.round(stats.average || 0))}</div>
              <span className="total-reviews">{stats.total || 0} reviews</span>
            </div>
            
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(star => {
                const count = (stats.distribution || []).find(d => d._id === star)?.count || 0;
                const percentage = (stats.total || 0) > 0 ? (count / (stats.total || 1)) * 100 : 0;
                return (
                  <div key={star} className="rating-bar">
                    <span>{star} ★</span>
                    <div className="bar">
                      <div className="fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Write Your Review</h3>
          
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= newReview.rating ? 'active' : ''}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="Sum up your experience"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your thoughts about this product"
              required
              maxLength={1000}
              rows={5}
            />
          </div>

          <button type="submit" className="submit-review-btn">Submit Review</button>
        </form>
      )}

      <div className="reviews-controls">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      <div className="reviews-list">
        {(reviews || []).length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          (reviews || []).map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.userId?.name || 'Anonymous'}</span>
                  {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
                </div>
                <div className="review-rating">
                  <span className="stars">{renderStars(review.rating)}</span>
                </div>
              </div>

              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>

              <div className="review-footer">
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <button 
                  className="helpful-btn"
                  onClick={() => handleVoteHelpful(review._id)}
                >
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;