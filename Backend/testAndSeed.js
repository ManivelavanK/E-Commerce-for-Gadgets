require('dotenv').config();
const { connectDB } = require('./config/database');
const Product = require('./Models/Product');

const testProducts = [
  {
    name: "Test Product 1",
    price: 29.99,
    description: "A test product",
    category: "Electronics",
    image: "https://via.placeholder.com/300x200",
    inStock: true
  },
  {
    name: "Test Product 2", 
    price: 49.99,
    description: "Another test product",
    category: "Clothing",
    image: "https://via.placeholder.com/300x200",
    inStock: true
  }
];

const testAndSeed = async () => {
  try {
    await connectDB();
    
    // Check existing products
    const existingProducts = await Product.find();
    console.log(`Found ${existingProducts.length} existing products`);
    
    if (existingProducts.length === 0) {
      console.log('No products found. Seeding test products...');
      await Product.insertMany(testProducts);
      console.log('✅ Test products seeded successfully');
    } else {
      console.log('Products already exist:');
      existingProducts.forEach(p => console.log(`- ${p.name}: $${p.price}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testAndSeed();