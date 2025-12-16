const mongoose = require('mongoose');
require('dotenv').config();

const { ordersDB } = require('./config/database');

// Test script to check orders in database
const checkOrders = async () => {
  try {
    const Order = ordersDB.model('Order', new mongoose.Schema({}, { strict: false }));
    const orders = await Order.find({});
    
    console.log('📦 Total Orders Found:', orders.length);
    console.log('📋 Orders:');
    orders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order ID: ${order._id}`);
      console.log(`   User ID: ${order.userId}`);
      console.log(`   Total: ₹${order.totalAmount}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Items: ${order.items?.length || 0}`);
      console.log(`   Created: ${order.createdAt}`);
      if (order.shippingAddress) {
        console.log(`   Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}`);
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkOrders();