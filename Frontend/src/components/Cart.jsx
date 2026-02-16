import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Cart.css";
import "./CheckoutStyles.css";

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
  const [paymentMethod, setPaymentMethod] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        ...(paymentMethod === 'card' && { cardDetails }),
        ...(paymentMethod === 'upi' && { upiId }),
        ...(paymentMethod === 'netbanking' && { selectedBank })
      };
      const response = await checkout(orderData);
      
      // Navigate to success page with order details
      navigate('/payment-success', {
        state: {
          orderId: response.orderId,
          paymentMethod,
          totalAmount: getTotalPrice(),
          message: response.message
        }
      });
    } catch (error) {
      alert('Checkout failed: ' + error.message);
    }
  };

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      setCheckoutStep(3);
    }
  };

  const handlePrevStep = () => {
    if (checkoutStep > 1) {
      setCheckoutStep(checkoutStep - 1);
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
            <div className="checkout-header">
              <h2>Checkout</h2>
              <div className="checkout-steps">
                <div className={`step ${checkoutStep >= 1 ? 'active' : ''}`}>1. Address</div>
                <div className={`step ${checkoutStep >= 2 ? 'active' : ''}`}>2. Payment</div>
                <div className={`step ${checkoutStep >= 3 ? 'active' : ''}`}>3. Review</div>
              </div>
            </div>

            {checkoutStep === 1 && (
              <div className="step-content">
                <h3>Shipping Address</h3>
                <div className="form-grid">
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
                </div>
                <div className="step-buttons">
                  <button type="button" onClick={() => setShowCheckout(false)}>Cancel</button>
                  <button type="button" onClick={handleNextStep}>Next</button>
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="step-content">
                <h3>Select Payment Method</h3>
                <div className="payment-methods">
                  <div className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`} 
                       onClick={() => setPaymentMethod('upi')}>
                    <div className="payment-icon">📱</div>
                    <div className="payment-info">
                      <h4>UPI</h4>
                      <p>PhonePe, GPay, Paytm, BHIM</p>
                    </div>
                    {paymentMethod === 'upi' && <div className="check-mark">✓</div>}
                  </div>

                  <div className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`} 
                       onClick={() => setPaymentMethod('card')}>
                    <div className="payment-icon">💳</div>
                    <div className="payment-info">
                      <h4>Credit/Debit Card</h4>
                      <p>Visa, Mastercard, RuPay, Amex</p>
                    </div>
                    {paymentMethod === 'card' && <div className="check-mark">✓</div>}
                  </div>

                  <div className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`} 
                       onClick={() => setPaymentMethod('netbanking')}>
                    <div className="payment-icon">🏦</div>
                    <div className="payment-info">
                      <h4>Net Banking</h4>
                      <p>All major banks supported</p>
                    </div>
                    {paymentMethod === 'netbanking' && <div className="check-mark">✓</div>}
                  </div>

                  <div className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`} 
                       onClick={() => setPaymentMethod('wallet')}>
                    <div className="payment-icon">👛</div>
                    <div className="payment-info">
                      <h4>Wallets</h4>
                      <p>Paytm, PhonePe, Amazon Pay</p>
                    </div>
                    {paymentMethod === 'wallet' && <div className="check-mark">✓</div>}
                  </div>

                  <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} 
                       onClick={() => setPaymentMethod('cod')}>
                    <div className="payment-icon">💰</div>
                    <div className="payment-info">
                      <h4>Cash on Delivery</h4>
                      <p>Pay when you receive</p>
                    </div>
                    {paymentMethod === 'cod' && <div className="check-mark">✓</div>}
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="payment-details">
                    <h4>Enter UPI ID</h4>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="upi-input"
                    />
                    <p className="payment-note">You will be redirected to your UPI app to complete payment</p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="payment-details">
                    <h4>Enter Card Details</h4>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
                      maxLength="16"
                    />
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardDetails.cardholderName}
                      onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                    />
                    <div className="card-row">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                        maxLength="5"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                        maxLength="3"
                      />
                    </div>
                    <p className="payment-note">🔒 Your card details are secure and encrypted</p>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="payment-details">
                    <h4>Select Your Bank</h4>
                    <select 
                      value={selectedBank} 
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="bank-select"
                    >
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="canara">Canara Bank</option>
                      <option value="other">Other Banks</option>
                    </select>
                    <p className="payment-note">You will be redirected to your bank's secure page</p>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="payment-details">
                    <h4>Choose Wallet</h4>
                    <div className="wallet-options">
                      <button className="wallet-btn" onClick={() => alert('Redirecting to Paytm...')}>Paytm</button>
                      <button className="wallet-btn" onClick={() => alert('Redirecting to PhonePe...')}>PhonePe</button>
                      <button className="wallet-btn" onClick={() => alert('Redirecting to Amazon Pay...')}>Amazon Pay</button>
                    </div>
                    <p className="payment-note">Select your preferred wallet to continue</p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="payment-details cod-info">
                    <div className="cod-message">
                      <span className="cod-icon">ℹ️</span>
                      <div>
                        <h4>Cash on Delivery</h4>
                        <p>Pay ₹{getTotalPrice().toLocaleString()} when your order is delivered</p>
                        <p className="cod-note">Please keep exact change ready</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="step-buttons">
                  <button type="button" onClick={handlePrevStep}>Back</button>
                  <button type="button" onClick={handleNextStep} disabled={!paymentMethod}>Continue</button>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="step-content">
                <h3>Order Review</h3>
                <div className="order-summary">
                  <div className="summary-section">
                    <h4>Shipping Address</h4>
                    <p>{shippingAddress.street}, {shippingAddress.city}</p>
                    <p>{shippingAddress.state} - {shippingAddress.zipCode}</p>
                  </div>
                  <div className="summary-section">
                    <h4>Payment Method</h4>
                    <p>
                      {paymentMethod === 'card' ? '💳 Credit/Debit Card' : 
                       paymentMethod === 'upi' ? `📱 UPI (${upiId})` : 
                       paymentMethod === 'netbanking' ? '🏦 Net Banking' :
                       paymentMethod === 'wallet' ? '👛 Wallet' :
                       '💰 Cash on Delivery'}
                    </p>
                  </div>
                  <div className="summary-section">
                    <h4>Order Total</h4>
                    <p className="total-amount">₹{getTotalPrice().toLocaleString()}</p>
                  </div>
                </div>
                <form onSubmit={handleCheckout}>
                  <div className="step-buttons">
                    <button type="button" onClick={handlePrevStep}>Back</button>
                    <button type="submit" disabled={loading} className="place-order-btn">
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;