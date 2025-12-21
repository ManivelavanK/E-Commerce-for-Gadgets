require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/User');
const Product = require('./Models/Product');

const seedData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log('✅ Created test user:', testUser.email);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Created admin user:', adminUser.email);

    // Create test products
    const products = [
      {
        name: 'iPhone 15 Pro',
        price: 99999,
        category: 'smartphones',
        brand: 'Apple',
        img: 'https://example.com/iphone15.jpg',
        stock: 50,
        description: 'Latest iPhone with advanced features'
      },
      {
        name: 'MacBook Pro M3',
        price: 199999,
        category: 'laptops',
        brand: 'Apple',
        img: 'https://example.com/macbook.jpg',
        stock: 30,
        description: 'Powerful laptop for professionals'
      },
      {
        name: 'AirPods Pro',
        price: 24999,
        category: 'headphones',
        brand: 'Apple',
        img: 'https://example.com/airpods.jpg',
        stock: 100,
        description: 'Wireless earbuds with noise cancellation'
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log('✅ Created products:', createdProducts.length);

    console.log('🎉 Seed data created successfully!');
    console.log('Test credentials:');
    console.log('User: test@example.com / password123');
    console.log('Admin: admin@example.com / admin123');

    await mongoose.connection.close();
    console.log('✅ Connection closed');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();