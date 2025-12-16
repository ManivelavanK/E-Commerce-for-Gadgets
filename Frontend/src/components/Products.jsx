import React, { useEffect, useState, useMemo } from "react";
import "./Products.css";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useTheme } from "../context/ThemeContext";

const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'laptops', name: 'Laptops', icon: '💻' },
  { id: 'tablets', name: 'Tablets', icon: '📱' },
  { id: 'headphones', name: 'Headphones', icon: '🎧' },
  { id: 'watches', name: 'Watches', icon: '⌚' },
  { id: 'accessories', name: 'Accessories', icon: '🔌' }
];

function Products() {
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
    discount: product.discount || Math.floor(((product.originalPrice || product.price * 1.15) - product.price) / (product.originalPrice || product.price * 1.15) * 100)
  }));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || product.name.toLowerCase().includes(q) || product.brand.toLowerCase().includes(q);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [selectedCategory, searchTerm, priceRange]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch(sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'discount': return b.discount - a.discount;
        default: return b.reviews - a.reviews;
      }
    });
  }, [filteredProducts, sortBy]);

  return (
    <main className={`products-container ${isDarkMode ? 'dark-theme' : ''}`}>
      <section className="hero">
        <h1>Welcome to Mani's Gadgets</h1>
        <p>Discover amazing deals on premium tech products with fast delivery</p>
      </section>

      <section className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products, brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Best Discount</option>
          </select>

          <div className="price-filter">
            <label>Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="500000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
            />
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-grid">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="products" id="products">
        <div className="products-header">
          <h2>{selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name} ({sortedProducts.length})</h2>
        </div>

        <div className="product-grid">
          {loading && <div className="loading">Loading products...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && sortedProducts.length === 0 && <div className="no-products">No products available</div>}
          {sortedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img src={product.img} alt={product.name} className="product-image" />
                {product.discount > 0 && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="brand">{product.brand}</p>

                <div className="rating">
                  <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                  <span className="rating-text">{product.rating} ({product.reviews})</span>
                </div>

                <div className="price-section">
                  <span className="current-price">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <button className="buy-btn" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}
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