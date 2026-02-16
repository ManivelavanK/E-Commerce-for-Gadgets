const Product = require('../Models/Product');

const getProducts = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(404).json({ message: 'Product not available' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Get low stock products for admin alerts
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      isActive: true
    }).sort({ stock: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update stock for a product
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, lowStockThreshold } = req.body;
    
    const updateData = {};
    if (stock !== undefined) updateData.stock = stock;
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = lowStockThreshold;
    
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(req.body);
    res.status(201).json({ message: 'Products seeded successfully', count: products.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getProducts,
  getProductById,
  createProduct, 
  updateProduct, 
  deleteProduct, 
  seedProducts,
  getLowStockProducts,
  updateStock
};