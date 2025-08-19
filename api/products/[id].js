// Mock products database (in production, you'd use a real database)
let products = [
  {
    id: '1',
    name: 'Sample Product',
    description: 'A sample product for testing',
    manufacturer: 'Sample Manufacturer',
    serialNumber: 'SAMPLE001',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SAMPLE001',
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'active'
  }
];

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Find product by ID
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return product data
    res.status(200).json(product);

  } catch (error) {
    console.error('Product verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
