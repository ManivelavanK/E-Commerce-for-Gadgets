import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import StockIndicator from './StockIndicator';
import './AdminInventory.css';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState(null);
  const [stockForm, setStockForm] = useState({ stock: '', lowStockThreshold: '' });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchProducts();
    fetchLowStockProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products?includeInactive=true`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/low-stock`);
      const data = await response.json();
      setLowStockProducts(data);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  const handleEditStock = (product) => {
    setEditingStock(product._id);
    setStockForm({
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString()
    });
  };

  const handleUpdateStock = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stock: parseInt(stockForm.stock),
          lowStockThreshold: parseInt(stockForm.lowStockThreshold)
        })
      });

      if (response.ok) {
        setEditingStock(null);
        fetchProducts();
        fetchLowStockProducts();
        alert('Stock updated successfully!');
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock');
    }
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setStockForm({ stock: '', lowStockThreshold: '' });
  };

  const getStockStatusCount = (status) => {
    return products.filter(product => {
      if (status === 'out-of-stock') return product.stock === 0;
      if (status === 'low-stock') return product.stock > 0 && product.stock <= product.lowStockThreshold;
      if (status === 'in-stock') return product.stock > product.lowStockThreshold;
      return false;
    }).length;
  };

  if (loading) {
    return (
      <div className={`admin-inventory ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="loading">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className={`admin-inventory ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <div className="inventory-stats">
          <div className="stat-card in-stock">
            <span className="stat-number">{getStockStatusCount('in-stock')}</span>
            <span className="stat-label">In Stock</span>
          </div>
          <div className="stat-card low-stock">
            <span className="stat-number">{getStockStatusCount('low-stock')}</span>
            <span className="stat-label">Low Stock</span>
          </div>
          <div className="stat-card out-of-stock">
            <span className="stat-number">{getStockStatusCount('out-of-stock')}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="low-stock-alerts">
          <h2>⚠️ Low Stock Alerts</h2>
          <div className="alert-products">
            {lowStockProducts.map(product => (
              <div key={product._id} className="alert-item">
                <img src={product.img} alt={product.name} />
                <div className="alert-info">
                  <h4>{product.name}</h4>
                  <StockIndicator stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
                </div>
                <button 
                  className="restock-btn"
                  onClick={() => handleEditStock(product)}
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="inventory-table">
        <h2>All Products</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.img} alt={product.name} />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>₹{product.price.toLocaleString()}</td>
                  <td>
                    {editingStock === product._id ? (
                      <div className="stock-edit">
                        <input
                          type="number"
                          value={stockForm.stock}
                          onChange={(e) => setStockForm({...stockForm, stock: e.target.value})}
                          placeholder="Stock"
                          min="0"
                        />
                        <input
                          type="number"
                          value={stockForm.lowStockThreshold}
                          onChange={(e) => setStockForm({...stockForm, lowStockThreshold: e.target.value})}
                          placeholder="Low stock threshold"
                          min="1"
                        />
                      </div>
                    ) : (
                      <span className="stock-number">{product.stock}</span>
                    )}
                  </td>
                  <td>
                    <StockIndicator 
                      stock={product.stock} 
                      lowStockThreshold={product.lowStockThreshold}
                    />
                  </td>
                  <td>
                    {editingStock === product._id ? (
                      <div className="edit-actions">
                        <button 
                          className="save-btn"
                          onClick={() => handleUpdateStock(product._id)}
                        >
                          Save
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditStock(product)}
                      >
                        Edit Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;