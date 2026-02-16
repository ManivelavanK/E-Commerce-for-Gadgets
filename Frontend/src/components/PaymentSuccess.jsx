import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  const orderData = location.state || {};
  const { orderId, paymentMethod, totalAmount } = orderData;

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'upi': '📱 UPI Payment',
      'card': '💳 Card Payment',
      'netbanking': '🏦 Net Banking',
      'wallet': '👛 Wallet',
      'cod': '💰 Cash on Delivery'
    };
    return methods[method] || 'Payment';
  };

  const getSuccessMessage = (method) => {
    const messages = {
      'upi': 'Your UPI payment has been processed successfully!',
      'card': 'Your card payment has been processed successfully!',
      'netbanking': 'Your net banking payment has been processed successfully!',
      'wallet': 'Your wallet payment has been processed successfully!',
      'cod': 'Your order has been placed successfully! Pay when you receive your order.'
    };
    return messages[method] || 'Your order has been placed successfully!';
  };

  return (
    <div className={`payment-success-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="success-card">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">{getSuccessMessage(paymentMethod)}</p>
        
        {orderId && (
          <div className="order-details">
            <div className="detail-row">
              <span className="label">Order ID:</span>
              <span className="value">#{orderId.slice(-8).toUpperCase()}</span>
            </div>
            
            {paymentMethod && (
              <div className="detail-row">
                <span className="label">Payment Method:</span>
                <span className="value">{getPaymentMethodDisplay(paymentMethod)}</span>
              </div>
            )}
            
            {totalAmount && (
              <div className="detail-row">
                <span className="label">Total Amount:</span>
                <span className="value amount">₹{totalAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>📧 You'll receive an order confirmation email shortly</li>
            <li>📦 We'll prepare your order for shipping</li>
            <li>🚚 Track your order status in the Orders section</li>
            {paymentMethod === 'cod' && (
              <li>💰 Keep exact change ready for delivery</li>
            )}
          </ul>
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn-primary" 
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;