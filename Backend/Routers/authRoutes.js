const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../Controllers/authController');
const User = require('../Models/User');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Test route to check users
router.get('/test-users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;