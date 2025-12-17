import { memo, useState } from "react";
import "./ProductCard.css";

const ProductCard = memo(({ product = {}, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div className="product-card">
      <img src="https://imgs.search.brave.com/2M1Jiq1jnIQlHRhqWYceaF7DBH13QTwqcF8OFYCmMrI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzUv/NzIxLzI3Mi9zbWFs/bC90b3Atdmlldy1v/ZmdyYXBoZXItcy12/aWRlb2dyYXBoZXIt/cy1vci12aWRlby1i/bG9nZ2VyLXMtd29y/a3BsYWNlLWRpZ2l0/YWwtZ2FkZ2V0cy1s/eWluZy1vbi1ibHVl/LXRhYmxlLWZsYXQt/bGF5LXBob3RvLmpw/Zw" alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        <div className="product-features">
          {product.features?.map((feature, index) => (
            <span key={index} className="feature-tag">{feature}</span>
          ))}
        </div>
        <div className="product-price">₹{product.price.toLocaleString()}</div>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;