// Mock products database (in production, you'd use a real database)
let products = [];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, description, manufacturer, serialNumber } = req.body;

    // Validation
    if (!name || !description || !manufacturer || !serialNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if product with same serial number already exists
    const existingProduct = products.find(p => p.serialNumber === serialNumber);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this serial number already exists' });
    }

    // Create new product
    const newProduct = {
      id: (products.length + 1).toString(),
      name,
      description,
      manufacturer,
      serialNumber,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${serialNumber}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // Add to products array (in production, save to database)
    products.push(newProduct);

    // Return success
    res.status(201).json({
      message: 'Product registered successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Product registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
