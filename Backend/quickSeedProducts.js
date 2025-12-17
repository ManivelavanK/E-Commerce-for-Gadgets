require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./Models/Product');

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    price: 134900,
    category: "smartphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    description: "Latest iPhone with titanium design and A17 Pro chip"
  },
  {
    name: "Samsung Galaxy S24",
    price: 79999,
    category: "smartphones",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
    description: "Flagship Android phone with AI features"
  },
  {
    name: "MacBook Pro M3",
    price: 199900,
    category: "laptops",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    description: "Professional laptop with M3 chip for creators"
  },
  {
    name: "Dell XPS 13",
    price: 124999,
    category: "laptops",
    brand: "Dell",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    description: "Ultra-portable laptop with stunning display"
  },
  {
    name: "AirPods Pro 2",
    price: 24900,
    category: "headphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
    description: "Wireless earbuds with adaptive transparency"
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Connected to MongoDB');
    
    // Check if products already exist
    const existingCount = await Product.countDocuments();
    console.log(`Existing products: ${existingCount}`);
    
    if (existingCount === 0) {
      console.log('No products found, seeding database...');
      const products = await Product.insertMany(sampleProducts);
      console.log(`✅ Successfully seeded ${products.length} products`);
    } else {
      console.log('Products already exist in database');
    }
    
    // Show current products
    const allProducts = await Product.find().select('name price category');
    console.log('Current products in database:');
    allProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - ₹${product.price}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedProducts();