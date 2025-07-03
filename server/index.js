// server/index.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const rateLimit = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5127;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit);

const productsRoute = require('./routes/products');
const salesRoute = require('./routes/sales');
const usersRoute = require('./routes/users');

app.use('/api/products', productsRoute);
app.use('/api/sales', salesRoute);
app.use('/api/users', usersRoute);

// Placeholder route
app.get('/', (req, res) => {
  res.send('BlockAuth Backend API is running');
});

// TODO: Add API routes for products, sales, users, etc.

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockauth')
  .then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 