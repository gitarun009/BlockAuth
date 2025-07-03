const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serialNumber: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema); 