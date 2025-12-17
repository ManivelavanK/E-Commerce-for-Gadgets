const User = require('../Models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log('📝 REGISTRATION DATA:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    console.log('Timestamp:', new Date().toLocaleString());
    console.log('-------------------');

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    console.log('✅ User registered successfully:', user.name);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('🔐 LOGIN ATTEMPT:');
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    console.log('Role:', role);
    
    // Test database connection
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // List all users for debugging
    const allUsers = await User.find({}, 'email name role');
    console.log('All users:', allUsers);
    console.log('-------------------');

    // Validation
    if (!email || !password) {
      console.log('❌ Login failed: Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User details:', { name: user.name, email: user.email, role: user.role });
    console.log('Password hash exists:', !!user.password);
    
    // Try direct bcrypt comparison
    const bcrypt = require('bcryptjs');
    const directMatch = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt match:', directMatch);
    
    const passwordMatch = await user.comparePassword(password);
    console.log('Method password match:', passwordMatch);
    
    if (!passwordMatch && !directMatch) {
      console.log('❌ Login failed: Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      console.log('❌ Login failed: Access denied for role');
      return res.status(403).json({ message: 'Access denied for this role' });
    }

    const token = generateToken(user._id);

    console.log('✅ Login successful:', user.name);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token (simplified - in production use crypto)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    
    res.json({ 
      message: 'Reset token generated', 
      resetToken // In production, send via email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    const user = await User.findOne({ 
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };