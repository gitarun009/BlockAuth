const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema); 