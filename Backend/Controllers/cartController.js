const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const mongoose = require('mongoose');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    
    const formattedItems = cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.img
    }));
    
    res.json({ items: formattedItems, totalAmount: cart.totalAmount });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, price } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ 
        productId: new mongoose.Types.ObjectId(productId), 
        quantity, 
        price: price || product.price 
      });
    }
    
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    await cart.populate('items.productId');
    
    const formattedItems = cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.img
    }));
    
    res.json({ items: formattedItems, totalAmount: cart.totalAmount });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    await cart.populate('items.productId');
    
    const formattedItems = cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.img
    }));
    
    res.json({ items: formattedItems, totalAmount: cart.totalAmount });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    await cart.populate('items.productId');
    
    const formattedItems = cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.img
    }));
    
    res.json({ items: formattedItems, totalAmount: cart.totalAmount });
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalAmount: 0 }
    );
    res.json({ items: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateQuantity, clearCart };