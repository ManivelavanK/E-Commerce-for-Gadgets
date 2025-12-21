const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');

// Suppress mongoose duplicate index warnings
process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
const mongoose = require('mongoose');
mongoose.set('suppressWarning.deprecation', true);

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-netlify-app.netlify.app',
    /\.netlify\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add preflight handling
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (disabled in production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const startServer = async () => {
  try {
    await connectDB();
    
    // Import routes after DB connection
    const authRoutes = require('./Routers/authRoutes');
    const contactRoutes = require('./Routers/contactRoutes');
    const productRoutes = require('./Routers/productRoutes');
    const orderRoutes = require('./Routers/orderRoutes');
    const cartRoutes = require('./Routers/cartRoutes');
    const userRoutes = require('./Routers/userRoutes');
    const newsletterRoutes = require('./Routers/newsletterRoutes');
    const reviewRoutes = require('./Routers/reviewRoutes');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/newsletter', newsletterRoutes);
    app.use('/api/reviews', reviewRoutes);
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    });
    
    // 404 handler
    app.use('*', (req, res) => {
      console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({ message: 'Route not found', path: req.originalUrl });
    });
    
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
