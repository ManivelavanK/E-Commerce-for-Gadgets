import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, checkout, loading } = useCart();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      await checkout(shippingAddress);
      alert('Order placed successfully!');
      navigate('/products');
    } catch (error) {
      alert('Checkout failed: ' + error.message);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className={`cart-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add some products to get started!</p>
          <button className="continue-shopping" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`cart-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <p className="item-price">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="item-total">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
              <button className="remove-item" onClick={() => removeFromCart(item.id)}>×</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{getTotalPrice().toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{getTotalPrice().toLocaleString()}</span>
          </div>
          <button 
            className="checkout-btn" 
            onClick={() => setShowCheckout(true)}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          <button className="continue-shopping" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </div>
      
      {showCheckout && (
        <div className="checkout-modal">
          <div className="checkout-form">
            <h3>Shipping Address</h3>
            <form onSubmit={handleCheckout}>
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={shippingAddress.zipCode}
                onChange={handleAddressChange}
                required
              />
              <div className="checkout-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
                <button type="button" onClick={() => setShowCheckout(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;