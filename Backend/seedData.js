const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./Models/Product');

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    price: 99999,
    category: "smartphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    stock: 50,
    description: "Latest iPhone with advanced features"
  },
  {
    name: "MacBook Pro M3",
    price: 199999,
    category: "laptops", 
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    stock: 30,
    description: "Powerful laptop for professionals"
  },
  {
    name: "Samsung Galaxy S24",
    price: 79999,
    category: "smartphones",
    brand: "Samsung", 
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    stock: 40,
    description: "Premium Android smartphone"
  },
  {
    name: "iPad Air",
    price: 59999,
    category: "tablets",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", 
    stock: 25,
    description: "Versatile tablet for work and play"
  },
  {
    name: "AirPods Pro",
    price: 24999,
    category: "headphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
    stock: 100,
    description: "Wireless earbuds with noise cancellation"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/mani-gadgets');
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();