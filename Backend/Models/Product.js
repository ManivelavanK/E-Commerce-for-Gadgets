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
      values: ['smartphones', 'laptops', 'tablets', 'headphones', 'watches', 'accessories'],
      message: 'Category must be one of: smartphones, laptops, tablets, headphones, watches, accessories'
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

module.exports = mongoose.model('Product', productSchema);