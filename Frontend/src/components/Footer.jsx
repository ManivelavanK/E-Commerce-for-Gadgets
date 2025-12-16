import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Mani's Gadgets. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
