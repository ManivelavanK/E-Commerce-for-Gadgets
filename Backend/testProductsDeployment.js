require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./Models/Product');

const testProducts = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('📊 Checking products collection...');
    const productCount = await Product.countDocuments();
    console.log(`📦 Total products in database: ${productCount}`);
    
    if (productCount > 0) {
      console.log('🔍 Sample products:');
      const sampleProducts = await Product.find().limit(3);
      sampleProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.category})`);
      });
    } else {
      console.log('⚠️ No products found in database!');
      console.log('🔧 Running seed script...');
      
      const sampleProducts = [
        {
          name: "iPhone 15 Pro",
          price: 134900,
          category: "smartphones",
          brand: "Apple",
          img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
          stock: 25
        },
        {
          name: "MacBook Pro M3",
          price: 199900,
          category: "laptops", 
          brand: "Apple",
          img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
          stock: 15
        },
        {
          name: "AirPods Pro",
          price: 24900,
          category: "headphones",
          brand: "Apple", 
          img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
          stock: 50
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products added successfully!');
    }
    
    console.log('🧪 Testing API endpoint simulation...');
    const allProducts = await Product.find();
    console.log(`✅ API would return ${allProducts.length} products`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testProducts();