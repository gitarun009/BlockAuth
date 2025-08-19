// Mock product database
let products = [
  {
    _id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features',
    manufacturer: 'Apple Inc.',
    serialNumber: 'IP15P001',
    manufacturingDate: '2024-01-15',
    blockchainHash: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'active'
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, description, manufacturer, serialNumber, manufacturingDate } = req.body;

    // Validation
    if (!name || !description || !manufacturer || !serialNumber || !manufacturingDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if product already exists
    const existingProduct = products.find(p => p.serialNumber === serialNumber);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this serial number already exists' });
    }

    // Create new product
    const newProduct = {
      _id: (products.length + 1).toString(),
      name,
      description,
      manufacturer,
      serialNumber,
      manufacturingDate,
      blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Add to products array
    products.push(newProduct);

    res.status(201).json({
      message: 'Product registered successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Product registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
