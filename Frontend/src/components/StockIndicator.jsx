import React from 'react';
import './StockIndicator.css';

const StockIndicator = ({ stock, lowStockThreshold = 10, className = '' }) => {
  const getStockStatus = () => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= lowStockThreshold) return 'low-stock';
    return 'in-stock';
  };

  const getStockMessage = () => {
    const status = getStockStatus();
    switch (status) {
      case 'out-of-stock':
        return 'Out of Stock';
      case 'low-stock':
        return `Only ${stock} left`;
      case 'in-stock':
        return stock > 50 ? 'In Stock' : `${stock} available`;
      default:
        return 'In Stock';
    }
  };

  const getStockIcon = () => {
    const status = getStockStatus();
    switch (status) {
      case 'out-of-stock':
        return '❌';
      case 'low-stock':
        return '⚠️';
      case 'in-stock':
        return '✅';
      default:
        return '✅';
    }
  };

  return (
    <div className={`stock-indicator ${getStockStatus()} ${className}`}>
      <span className="stock-icon">{getStockIcon()}</span>
      <span className="stock-message">{getStockMessage()}</span>
    </div>
  );
};

export default StockIndicator;