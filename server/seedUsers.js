const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_URI_HERE';

const users = [
  {
    name: 'Alice Customer',
    email: 'customer1@example.com',
    password: 'customer123',
    role: 'customer',
  },
  {
    name: 'Bob Retailer',
    email: 'retailer1@example.com',
    password: 'retailer123',
    role: 'retailer',
  },
  {
    name: 'Carol Manufacturer',
    email: 'manufacturer1@example.com',
    password: 'manufacturer123',
    role: 'manufacturer',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  for (const user of users) {
    const exists = await User.findOne({ email: user.email });
    if (!exists) {
      const hashed = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashed });
      console.log(`Inserted: ${user.email}`);
    } else {
      console.log(`Already exists: ${user.email}`);
    }
  }
  await mongoose.disconnect();
  console.log('Done!');
}

seed(); 