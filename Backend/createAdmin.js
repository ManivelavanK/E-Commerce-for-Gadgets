const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./Models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@test.com');
    console.log('Password: admin123');
    
    // Create a regular user too
    const user = new User({
      name: 'Test User',
      email: 'user@test.com', 
      password: 'user123',
      role: 'user'
    });
    
    await user.save();
    console.log('Test user created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createAdmin();