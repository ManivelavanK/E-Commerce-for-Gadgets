import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { productsAPI } from '../services/api';
import ProductReviews from './ProductReviews';
import StockIndicator from './StockIndicator';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isDarkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const foundProduct = await productsAPI.getById(id);
      setProduct({
        ...foundProduct,
        price: foundProduct.price || 0,
        rating: foundProduct.rating || 4.5,
        reviews: foundProduct.reviews || Math.floor(Math.random() * 2000) + 500,
        originalPrice: foundProduct.originalPrice || Math.floor((foundProduct.price || 0) * 1.15),
        discount: foundProduct.discount || Math.floor(((foundProduct.originalPrice || (foundProduct.price || 0) * 1.15) - (foundProduct.price || 0)) / (foundProduct.originalPrice || (foundProduct.price || 0) * 1.15) * 100),
        stock: foundProduct.stock || 0,
        lowStockThreshold: foundProduct.lowStockThreshold || 10
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock === 0) {
      alert('This product is out of stock!');
      return;
    }
    
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      setQuantity(product.stock);
      return;
    }
    
    const productForCart = {
      _id: product._id,
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      img: product.img,
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productForCart);
    }
    
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className={`product-detail-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`product-detail-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-detail-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <button className="back-btn" onClick={() => navigate('/products')}>
        ← Back to Products
      </button>

      <div className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img src={product.img} alt={product.name} />
            {product.discount > 0 && (
              <span className="discount-badge">{product.discount}% OFF</span>
            )}
          </div>
        </div>

        <div className="product-info">
          <div className="breadcrumb">
            <span>{product.category}</span> › <span>{product.brand}</span>
          </div>

          <h1>{product.name}</h1>
          
          <div className="rating-section">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <StockIndicator 
            stock={product.stock} 
            lowStockThreshold={product.lowStockThreshold}
            className="large"
          />

          <div className="price-section">
            <span className="current-price">₹{(product.price || 0).toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > (product.price || 0) && (
              <>
                <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                <span className="savings">You save ₹{(product.originalPrice - (product.price || 0)).toLocaleString()}</span>
              </>
            )}
          </div>

          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              <li>Premium {product.category} from {product.brand}</li>
              <li>High-quality materials and construction</li>
              <li>1 year manufacturer warranty</li>
              <li>Free shipping and easy returns</li>
            </ul>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button 
              className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 
                ? 'Out of Stock' 
                : `Add to Cart - ₹${((product.price || 0) * quantity).toLocaleString()}`
              }
            </button>

            <div className="delivery-info">
              <div className="delivery-item">
                <span className="icon">🚚</span>
                <span>Free delivery by tomorrow</span>
              </div>
              <div className="delivery-item">
                <span className="icon">↩️</span>
                <span>Easy 30-day returns</span>
              </div>
              <div className="delivery-item">
                <span className="icon">🛡️</span>
                <span>1 year warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />
    </div>
  );
};

export default ProductDetail;