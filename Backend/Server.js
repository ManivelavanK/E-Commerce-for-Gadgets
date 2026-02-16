const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://mani-gadgets.netlify.app',
  'https://manigadgets.netlify.app',
  /\.netlify\.app$/,
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    )) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
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
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mani Gadgets API Server',
    version: '1.0.0',
    status: 'running'
  });
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
      console.error('Error:', err.message);
      if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.status(500).json({ message: 'Internal server error', error: err.message });
      }
    });
    
    // 404 handler
    app.use('*', (req, res) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
      }
      res.status(404).json({ message: 'Route not found' });
    });
    
    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
