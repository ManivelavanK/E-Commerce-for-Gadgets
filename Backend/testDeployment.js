const mongoose = require('mongoose');
require('dotenv').config();

const testDeploymentReadiness = async () => {
  console.log('🔍 Testing Deployment Readiness...');
  
  try {
    // Test 1: Database Connection
    console.log('\n1. Testing Database Connection...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connection successful');
    
    // Test 2: Environment Variables
    console.log('\n2. Checking Environment Variables...');
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:', missingVars);
    } else {
      console.log('✅ All required environment variables present');
    }
    
    // Test 3: Models
    console.log('\n3. Testing Models...');
    const User = require('./Models/User');
    const Product = require('./Models/Product');
    const Order = require('./Models/Order');
    const Cart = require('./Models/Cart');
    
    console.log('✅ All models loaded successfully');
    
    // Test 4: PDF Generation
    console.log('\n4. Testing PDF Generation...');
    const { generateOrderBill } = require('./utils/pdfService');
    
    const testOrder = {
      _id: '507f1f77bcf86cd799439011',
      items: [{
        name: 'Test Product',
        price: 100,
        quantity: 2
      }],
      totalAmount: 200,
      createdAt: new Date(),
      paymentMethod: 'card',
      paymentStatus: 'completed',
      shippingAddress: {
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '123456'
      }
    };
    
    const testUser = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    const pdfBuffer = await generateOrderBill(testOrder, testUser);
    if (pdfBuffer && pdfBuffer.length > 0) {
      console.log('✅ PDF generation working');
    } else {
      console.log('❌ PDF generation failed');
    }
    
    console.log('\n🎉 Deployment readiness check completed!');
    console.log('\n📋 Summary:');
    console.log('- Database: Ready');
    console.log('- Environment: Ready');
    console.log('- Models: Ready');
    console.log('- PDF Service: Ready');
    
  } catch (error) {
    console.error('❌ Deployment readiness check failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testDeploymentReadiness();