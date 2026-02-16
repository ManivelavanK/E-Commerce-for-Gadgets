import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Orders.css';

// Error Boundary Component
class OrdersErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Orders Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="orders-container light-theme">
          <div className="error-message">
            <h2>⚠️ Something went wrong</h2>
            <p>We're having trouble loading your orders. Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const OrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadBill = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Show loading state
      const button = document.querySelector(`[data-order-id="${orderId}"]`);
      if (button) {
        button.disabled = true;
        button.textContent = '📄 Downloading...';
      }
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/bill`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        
        // Check if blob is valid
        if (blob.size === 0) {
          throw new Error('Empty PDF file received');
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bill-${orderId}.pdf`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
        
        // Show success message
        alert('Bill downloaded successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error downloading bill:', error);
      alert(`Failed to download bill: ${error.message}`);
    } finally {
      // Reset button state
      const button = document.querySelector(`[data-order-id="${orderId}"]`);
      if (button) {
        button.disabled = false;
        button.textContent = '📄 Download Bill';
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className={`orders-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="loading-spinner">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`orders-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`orders-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
      </div>
      
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div className="order-info">
              <h3>Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}</h3>
              <p className="order-date">
                {order.createdAt ? 
                  new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Date not available'
                }
              </p>
            </div>
            <div className="order-status">
              <span className={`status-badge ${order.status || 'pending'}`}>
                {getStatusIcon(order.status || 'pending')} {(order.status || 'pending').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="order-items">
            {order.items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img 
                    src={item.image || '/api/placeholder/80/80'} 
                    alt={item.name || 'Product'}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/80/80';
                    }}
                  />
                </div>
                <div className="item-info">
                  <h4 className="item-name">{item.name || 'Unknown Product'}</h4>
                  <span className="item-quantity">Qty: {item.quantity || 1}</span>
                </div>
                <div className="item-price">
                  <span className="total-price">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              </div>
            )) || []}
          </div>

          <div className="order-footer">
            <div className="shipping-address">
              <h5>📍 Delivery Address</h5>
              <p>
                {order.shippingAddress ? 
                  `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Address not provided'
                  : 'Address not provided'
                }
              </p>
            </div>
            <div className="order-total">
              <div className="total-amount">
                <span>Total Amount: </span>
                <strong>₹{order.totalAmount?.toLocaleString() || '0'}</strong>
              </div>
              <button 
                className="download-bill-btn"
                data-order-id={order._id}
                onClick={() => downloadBill(order._id)}
                title="Download Bill as PDF"
              >
                📄 Download Bill
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Orders = () => {
  return (
    <OrdersErrorBoundary>
      <OrdersComponent />
    </OrdersErrorBoundary>
  );
};

export default Orders;