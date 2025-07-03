const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Product = require('../models/Product');

// Register a new product (manufacturer only)
router.post('/register', auth, role(['manufacturer']), async (req, res) => {
  try {
    const { name, serialNumber } = req.body;
    if (!name || !serialNumber) {
      return res.status(400).json({ message: 'Name and serial number are required.' });
    }
    // Ensure serial number is unique
    const existing = await Product.findOne({ serialNumber });
    if (existing) {
      return res.status(409).json({ message: 'Product with this serial number already exists.' });
    }
    const product = new Product({
      name,
      serialNumber,
      manufacturer: req.user._id
    });
    await product.save();
    return res.json({ message: 'Product registered successfully.', product });
  } catch (err) {
    console.error('Product registration error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('manufacturer', 'email name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 