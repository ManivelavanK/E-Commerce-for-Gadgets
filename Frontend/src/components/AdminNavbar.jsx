import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './AdminNavbar.css';

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/admin-login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`admin-navbar ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="admin-nav-container">
        <div className="admin-logo">
          <h1>MANI'S GADGETS</h1>
          <span>Admin Panel</span>
        </div>
        
        <div className="admin-mobile-toggle">
          <button className="admin-menu-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>
        </div>
        
        <ul className={isOpen ? 'admin-nav-menu active' : 'admin-nav-menu'}>
          <li>
            <Link 
              to="/admin" 
              className={isActive('/admin') ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/products" 
              className={isActive('/admin/products') ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              📦 Products
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/offers" 
              className={isActive('/admin/offers') ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              🎯 Offers
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={isActive('/admin/users') ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              👥 Users
            </Link>
          </li>
          <li>
            <button onClick={toggleTheme} className="admin-theme-btn">
              {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </li>
          <li className="admin-user-info">
            <span>👤 {user?.name}</span>
          </li>
          <li>
            <button onClick={handleLogout} className="admin-logout-btn">
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;