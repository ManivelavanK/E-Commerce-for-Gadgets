import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Homepage.css';

function Homepage() {
  const { isDarkMode } = useTheme();
  console.log('Homepage component is loading');
  return (
    <div className={`homepage ${isDarkMode ? 'dark-theme' : ''}`}>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">🏠 HOMEPAGE - Welcome to Mani's Gadgets</h1>
            <p className="hero-subtitle">Your Ultimate Destination for Premium Tech Products</p>
            <p className="hero-description">
              Discover the latest smartphones, laptops, headphones, and more with unbeatable prices and fast delivery.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="cta-button primary">Shop Now</Link>
              <Link to="/about" className="cta-button secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="Tech Store" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Mani's Gadgets?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Get your products delivered within 24-48 hours with our express shipping service.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Warranty Protection</h3>
              <p>All products come with manufacturer warranty and our extended protection plans.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with regular discounts and special offers on premium brands.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support to help you with any queries or issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES PREVIEW */}
      <section className="categories-preview">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products" className="category-card">
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300" alt="Smartphones" />
              <div className="category-overlay">
                <h3>Smartphones</h3>
                <p>Latest models from top brands</p>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300" alt="Laptops" />
              <div className="category-overlay">
                <h3>Laptops</h3>
                <p>Powerful computing solutions</p>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300" alt="Headphones" />
              <div className="category-overlay">
                <h3>Headphones</h3>
                <p>Premium audio experience</p>
              </div>
            </Link>
            <Link to="/products" className="category-card">
              <img src="https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300" alt="Smartwatches" />
              <div className="category-overlay">
                <h3>Smartwatches</h3>
                <p>Stay connected and fit</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Amazing service and quality products! Got my iPhone delivered the next day with excellent packaging."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨</div>
                  <div>
                    <h4>Rajesh Kumar</h4>
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Best prices in the market! Bought a MacBook Pro and saved ₹15,000 compared to other stores."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👩</div>
                  <div>
                    <h4>Priya Sharma</h4>
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Excellent customer support! They helped me choose the perfect laptop for my needs."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨</div>
                  <div>
                    <h4>Amit Patel</h4>
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50,000+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3>200+</h3>
              <p>Product Categories</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Customer Satisfaction</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated with Latest Deals</h2>
            <p>Subscribe to our newsletter and get exclusive offers, new product updates, and tech news.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
