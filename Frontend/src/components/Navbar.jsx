import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-theme' : ''}`}>
      <div className="nav-container">
        <h1 className="logo">Gadgetory Mart</h1>
        <div className="mobile-icons">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <Link to="/" className="mobile-home-icon">🏠</Link>
          <Link to="/cart" className="mobile-cart-icon">
            🛒 <span className="cart-badge">{totalItems}</span>
          </Link>
          {user ? (
            <button className="mobile-logout-btn" onClick={handleLogout}>🚪</button>
          ) : (
            <Link to="/login" className="mobile-login-icon">👤</Link>
          )}
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>
        </div>
        <ul className={`nav-menu ${isOpen ? 'active' : ''} ${isDarkMode ? 'dark-theme' : ''}`}>
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setIsOpen(false)}>Products</Link></li>
          <li><Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link></li>
          <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
          <li><Link to="/cart" className="cart-link" onClick={() => setIsOpen(false)}>
            🛒 Cart ({totalItems})
          </Link></li>
          {user && <li><Link to="/orders" onClick={() => setIsOpen(false)}>📦 Orders</Link></li>}
          <li>
            <button className="theme-toggle desktop-theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </li>
          {user ? (
            <li className="user-section">
              <span className="welcome-text">Welcome, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </li>
          ) : (
            <li><Link to="/login" onClick={() => setIsOpen(false)}>👤 Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
