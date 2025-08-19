// Mock sales database (in production, you'd use a real database)
let sales = [
  {
    id: '1',
    productId: '1',
    retailerId: 'retailer1',
    customerId: 'customer1',
    saleDate: '2024-01-15T00:00:00.000Z',
    price: 99.99
  }
];

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Find sales for the product
    const productSales = sales.filter(sale => sale.productId === productId);

    // Return sales history
    res.status(200).json(productSales);

  } catch (error) {
    console.error('Sales history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
