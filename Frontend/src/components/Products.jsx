import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Products.css";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "./SearchBar";
import ProductFilters from "./ProductFilters";
import StockIndicator from "./StockIndicator";

const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'laptops', name: 'Laptops', icon: '💻' },
  { id: 'tablets', name: 'Tablets', icon: '📱' },
  { id: 'headphones', name: 'Headphones', icon: '🎧' },
  { id: 'watches', name: 'Watches', icon: '⌚' },
  { id: 'accessories', name: 'Accessories', icon: '🔌' },
  { id: 'cameras', name: 'Cameras', icon: '📷' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'speakers', name: 'Speakers', icon: '🔊' }
];

function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const { isDarkMode } = useTheme();
  
  // Debug logging
  console.log('📺 Products Component State:', {
    products: products,
    productsCount: products?.length || 0,
    loading: loading,
    error: error,
    productsType: typeof products
  });
  
  // Add missing fields to products for display
  const allProducts = (products || []).map(product => ({
    ...product,
    rating: product.rating || 4.5,
    reviews: product.reviews || Math.floor(Math.random() * 2000) + 500,
    originalPrice: product.originalPrice || Math.floor(product.price * 1.15),
    discount: product.discount || Math.floor(((product.originalPrice || product.price * 1.15) - product.price) / (product.originalPrice || product.price * 1.15) * 100),
    stock: product.stock || 0,
    lowStockThreshold: product.lowStockThreshold || 10
  }));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    brands: [],
    priceRange: [0, 500000],
    rating: 0,
    sortBy: 'featured'
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      alert('This product is out of stock!');
      return;
    }
    
    const productForCart = {
      _id: product._id,
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      img: product.img,
    };
    addToCart(productForCart);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Search filter
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || 
        product.name.toLowerCase().includes(q) || 
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      
      // Category filter
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      
      // Brand filter
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      
      // Price filter
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      
      // Rating filter
      const matchesRating = filters.rating === 0 || product.rating >= filters.rating;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
    });

    // Sort products
    return filtered.sort((a, b) => {
      switch(filters.sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'popularity': return b.reviews - a.reviews;
        default: return b.reviews - a.reviews; // featured = most popular
      }
    });
  }, [allProducts, searchTerm, filters]);

  return (
    <main className={`products-container ${isDarkMode ? 'dark-theme' : ''}`}>
      <section className="hero">
        <h1>Welcome to Gadgetory Mart</h1>
        <p>Discover amazing deals on premium tech products with fast delivery</p>
      </section>

      <section className="search-section">
        <SearchBar 
          products={allProducts}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />
      </section>

      <ProductFilters 
        products={allProducts}
        onFiltersChange={setFilters}
        filters={filters}
      />

      <section className="categories-section">
        <div className="categories-grid">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${filters.category === category.id ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="products" id="products">
        <div className="products-header">
          <h2>
            {filters.category === 'all' ? 'All Products' : categories.find(c => c.id === filters.category)?.name} 
            ({filteredAndSortedProducts.length})
          </h2>
          {searchTerm && (
            <p className="search-results">Search results for "{searchTerm}"</p>
          )}
        </div>

        <div className="product-grid">
          {loading && <div className="loading">Loading products...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && filteredAndSortedProducts.length === 0 && (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={() => {
                setSearchTerm('');
                setFilters({
                  category: 'all',
                  brands: [],
                  priceRange: [0, 500000],
                  rating: 0,
                  sortBy: 'featured'
                });
              }}>Clear all filters</button>
            </div>
          )}
          {filteredAndSortedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div 
                className="product-image-container"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img src={product.img} alt={product.name} className="product-image" />
                {product.discount > 0 && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
              </div>

              <div className="product-info">
                <h3 
                  className="product-title"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.name}
                </h3>
                <p className="brand">{product.brand}</p>

                <div className="rating">
                  <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                  <span className="rating-text">{product.rating} ({product.reviews})</span>
                </div>

                <StockIndicator 
                  stock={product.stock} 
                  lowStockThreshold={product.lowStockThreshold}
                  className="small"
                />

                <div className="price-section">
                  <span className="current-price">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <div className="product-actions">
                  <button className="view-btn" onClick={() => navigate(`/product/${product._id}`)}>
                    View Details
                  </button>
                  <button 
                    className={`buy-btn ${product.stock === 0 ? 'disabled' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </main>
  );
}

export default Products;