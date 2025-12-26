const Order = require('../Models/Order');
const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const User = require('../Models/User');
const { generateOrderBill } = require('../utils/pdfService');

// Email service functions (temporarily disabled)
const sendOrderConfirmation = async () => ({ success: false });
const sendOrderStatusUpdate = async () => ({ success: false });

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, upiId, selectedBank, cardDetails } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Check stock availability for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }
    
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.img
    }));
    
    // Prepare payment details based on payment method
    const paymentDetails = {};
    if (paymentMethod === 'upi' && upiId) {
      paymentDetails.upiId = upiId;
    } else if (paymentMethod === 'netbanking' && selectedBank) {
      paymentDetails.selectedBank = selectedBank;
    } else if (paymentMethod === 'card' && cardDetails) {
      // Store only safe card details (never store CVV)
      paymentDetails.cardDetails = {
        cardNumber: cardDetails.cardNumber ? `****-****-****-${cardDetails.cardNumber.slice(-4)}` : '',
        cardholderName: cardDetails.cardholderName,
        expiryDate: cardDetails.expiryDate
      };
    }
    
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
    });
    
    // Update stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalAmount: 0 }
    );
    
    // Email confirmation temporarily disabled
    console.log('Order confirmation email would be sent here');
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    console.log('Checkout request received:', req.body);
    console.log('User ID:', req.user._id);
    
    const { shippingAddress, paymentMethod, upiId, selectedBank, cardDetails } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }
    
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    console.log('Cart found:', cart ? `${cart.items.length} items` : 'No cart');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
      image: item.productId.img
    }));

    // Prepare payment details based on payment method
    const paymentDetails = {};
    if (paymentMethod === 'upi' && upiId) {
      paymentDetails.upiId = upiId;
    } else if (paymentMethod === 'netbanking' && selectedBank) {
      paymentDetails.selectedBank = selectedBank;
    } else if (paymentMethod === 'card' && cardDetails) {
      // Store only safe card details (never store CVV)
      paymentDetails.cardDetails = {
        cardNumber: cardDetails.cardNumber ? `****-****-****-${cardDetails.cardNumber.slice(-4)}` : '',
        cardholderName: cardDetails.cardholderName,
        expiryDate: cardDetails.expiryDate
      };
    }

    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'cod',
      paymentDetails,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
    });

    await order.save();

    // Update stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    // Email confirmation temporarily disabled
    console.log('Order confirmation email would be sent here');

    // Send appropriate response based on payment method
    const responseMessage = {
      'upi': 'Order placed! You will be redirected to complete UPI payment.',
      'card': 'Order placed! Card payment processed successfully.',
      'netbanking': 'Order placed! You will be redirected to your bank for payment.',
      'wallet': 'Order placed! Wallet payment processed successfully.',
      'cod': 'Order placed successfully! Pay when you receive your order.'
    };

    res.status(201).json({ 
      message: responseMessage[paymentMethod] || 'Order placed successfully!', 
      orderId: order._id,
      paymentMethod,
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Email status update temporarily disabled
    console.log('Order status update email would be sent here');
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateBillPDF = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log('Generating PDF for order:', orderId);
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      console.log('Access denied for user:', req.user._id, 'order userId:', order.userId);
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(order.userId);
    if (!user) {
      console.log('User not found for order:', order.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Generating PDF for user:', user.name);
    const pdfBuffer = await generateOrderBill(order, user);
    
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('PDF generation failed - empty buffer');
    }
    
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="bill-${orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF bill', error: error.message });
  }
};

module.exports = { createOrder, checkout, getUserOrders, getAllOrders, updateOrderStatus, generateBillPDF };