require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./Models/Product');

const testProductsAPI = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Test product count
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);
    
    // Test product retrieval
    const products = await Product.find().limit(5);
    console.log('🛍️ Sample products:');
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - ₹${product.price}`);
    });
    
    // Test product schema
    const sampleProduct = products[0];
    if (sampleProduct) {
      console.log('📋 Sample product structure:');
      console.log(JSON.stringify(sampleProduct, null, 2));
    }
    
    console.log('✅ Products API test completed successfully');
    
  } catch (error) {
    console.error('❌ Error testing products API:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testProductsAPI();