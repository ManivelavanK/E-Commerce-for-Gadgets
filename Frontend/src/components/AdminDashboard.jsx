import React from 'react';
import { useProducts } from '../context/ProductsContext';
import { useTheme } from '../context/ThemeContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const { products } = useProducts();
  const { isDarkMode } = useTheme();

  const stats = {
    totalProducts: products.length,
    smartphones: products.filter(p => p.category === 'smartphones').length,
    laptops: products.filter(p => p.category === 'laptops').length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0)
  };

  return (
    <div className={`admin-dashboard ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Smartphones</h3>
          <p className="stat-number">{stats.smartphones}</p>
        </div>
        <div className="stat-card">
          <h3>Laptops</h3>
          <p className="stat-number">{stats.laptops}</p>
        </div>
        <div className="stat-card">
          <h3>Total Inventory Value</h3>
          <p className="stat-number">₹{stats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="recent-products">
        <h2>Recent Products</h2>
        <div className="products-list">
          {products.slice(-5).map(product => (
            <div key={product.id} className="product-item">
              <img src={product.img} alt={product.name} />
              <div>
                <h4>{product.name}</h4>
                <p>₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;