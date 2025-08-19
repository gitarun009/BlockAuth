// Mock products database
const products = [
  {
    _id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features',
    manufacturer: 'Apple Inc.',
    serialNumber: 'IP15P001',
    manufacturingDate: '2024-01-15',
    blockchainHash: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'active',
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone',
    manufacturer: 'Samsung Electronics',
    serialNumber: 'SGS24001',
    manufacturingDate: '2024-02-01',
    blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    status: 'active',
    createdAt: '2024-02-01T10:00:00.000Z'
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Find product by ID
    const product = products.find(p => p._id === id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product found',
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
