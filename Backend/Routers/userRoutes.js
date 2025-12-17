const express = require('express');
const { getAllUsers, createUser, deleteUser } = require('../Controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!', timestamp: new Date().toISOString() });
});

router.get('/', protect, admin, getAllUsers);
router.post('/', protect, admin, createUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;