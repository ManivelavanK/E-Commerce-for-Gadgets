import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useTheme } from '../context/ThemeContext';
import './AdminProducts.css';

function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { isDarkMode } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'smartphones', brand: '', img: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { ...formData, price: parseInt(formData.price) };
    
    if (editingProduct) {
      updateProduct(editingProduct._id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }
    
    setFormData({ name: '', price: '', category: 'smartphones', brand: '', img: '' });
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      img: product.img
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`admin-products ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="admin-products-header">
        <h1>Manage Products ({(products || []).length})</h1>
        <button 
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Product
        </button>
      </div>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
          <option value="tablets">Tablets</option>
          <option value="watches">Watches</option>
          <option value="headphones">Headphones</option>
          <option value="accessories">Accessories</option>
          <option value="cameras">Cameras</option>
          <option value="gaming">Gaming</option>
          <option value="speakers">Speakers</option>
        </select>
      </div>

      {showForm && (
        <div className="product-form-overlay">
          <div className="product-form">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="tablets">Tablets</option>
                <option value="watches">Watches</option>
                <option value="headphones">Headphones</option>
                <option value="accessories">Accessories</option>
                <option value="cameras">Cameras</option>
                <option value="gaming">Gaming</option>
                <option value="speakers">Speakers</option>
              </select>
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.img}
                onChange={(e) => setFormData({...formData, img: e.target.value})}
                required
              />

              <div className="form-buttons">
                <button type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setFormData({ name: '', price: '', category: 'smartphones', brand: '', img: '' });
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found</p>
          </div>
        ) : (
          filteredProducts.map(product => (
          <div key={product._id} className="admin-product-card">
            <img src={product.img} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="brand">{product.brand}</p>
              <p className="price">₹{product.price.toLocaleString()}</p>
              <p className="category">{product.category}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}

export default AdminProducts;