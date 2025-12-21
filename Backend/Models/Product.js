const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['smartphones', 'laptops', 'tablets', 'headphones', 'watches', 'accessories', 'cameras', 'gaming', 'speakers'],
      message: 'Category must be one of: smartphones, laptops, tablets, headphones, watches, accessories, cameras, gaming, speakers'
    }
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required'],
    trim: true
  },
  img: {
    type: String,
    required: [true, 'Product image is required']
  },
  stock: {
    type: Number,
    default: 50,
    min: [0, 'Stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: '',
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Index for better performance
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);