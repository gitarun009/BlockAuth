const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Record a new sale (retailer only)
router.post('/record', auth, role(['retailer']), async (req, res) => {
  try {
    const { productId, customer } = req.body;
    if (!productId || !customer) {
      return res.status(400).json({ message: 'Product ID and customer are required.' });
    }
    // Ensure product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const sale = new Sale({
      product: productId,
      retailer: req.user._id,
      customer
    });
    await sale.save();
    return res.json({ message: 'Sale recorded successfully.', sale });
  } catch (err) {
    console.error('Sale recording error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get sales history for a product
router.get('/history/:productId', async (req, res) => {
  try {
    const sales = await Sale.find({ product: req.params.productId })
      .populate('retailer', 'email name')
      .sort({ date: -1 });
    return res.json(sales);
  } catch (err) {
    console.error('Get sales history error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 