import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <h3>Gadgetory Mart</h3>
            <p>Your trusted destination for premium tech products with fast delivery and excellent customer service.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/products">Products</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/orders">My Orders</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Support</h3>
            <div className="footer-links">
              <a href="mailto:support@gadgetorymart.com">Email Support</a>
              <a href="tel:+1234567890">Call Us</a>
              <Link to="/contact">Help Center</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Gadgetory Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
