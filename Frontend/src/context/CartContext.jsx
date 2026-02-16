import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { ordersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!user) throw new Error('Please login to add items to cart');
    try {
      setLoading(true);
      const response = await cartAPI.addToCart({
        productId: product._id,
        quantity: 1,
        price: product.price
      });
      setCart(response);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(productId);
      setCart(response);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateQuantity(productId, quantity);
      setCart(response);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.clearCart();
      setCart(response);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.totalAmount;
  };

  const checkout = async (orderData) => {
    try {
      setLoading(true);
      const result = await ordersAPI.checkout(orderData);
      // Clear cart after successful checkout
      setCart({ items: [], totalAmount: 0 });
      return result;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartItems: cart.items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      getTotalItems,
      getTotalPrice,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};