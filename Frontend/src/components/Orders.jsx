import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/orders/my-orders', {
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
              <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
              <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
            <div className="order-status">
              <span className={`status-badge ${order.status}`}>
                {getStatusIcon(order.status)} {order.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img 
                    src={item.image || '/api/placeholder/80/80'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/80/80';
                    }}
                  />
                </div>
                <div className="item-info">
                  <h4 className="item-name">{item.name}</h4>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <div className="item-price">
                  <span className="total-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="shipping-address">
              <h5>📍 Delivery Address</h5>
              <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
            </div>
            <div className="order-total">
              <div className="total-amount">
                <span>Total Amount: </span>
                <strong>₹{order.totalAmount.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;