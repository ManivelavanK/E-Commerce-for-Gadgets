require('dotenv').config();
const Product = require('./Models/Product');
const Cart = require('./Models/Cart');
const Order = require('./Models/Order');

const testDatabases = async () => {
  try {
    console.log('🔍 Testing database connections...\n');

    // Test Products Database
    const productCount = await Product.countDocuments();
    console.log(`✅ Products Database: ${productCount} products found`);

    // Test Carts Database
    const cartCount = await Cart.countDocuments();
    console.log(`✅ Carts Database: ${cartCount} carts found`);

    // Test Orders Database
    const orderCount = await Order.countDocuments();
    console.log(`✅ Orders Database: ${orderCount} orders found`);

    console.log('\n🎉 All databases are working correctly!');
    console.log('\n📊 Database Summary:');
    console.log(`   • Products stored in: products database`);
    console.log(`   • Carts stored in: carts database`);
    console.log(`   • Orders stored in: orders database`);
    console.log(`   • Users stored in: manisgadgets database`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
};

testDatabases();