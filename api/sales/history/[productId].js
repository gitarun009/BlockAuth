// Mock sales database
const sales = [
  {
    _id: '1',
    productId: '1',
    seller: 'Apple Store',
    buyer: 'John Doe',
    price: 999.99,
    date: '2024-01-20T10:00:00.000Z',
    location: 'San Francisco, CA',
    transactionHash: '0x9876543210fedcba9876543210fedcba98765432'
  },
  {
    _id: '2',
    productId: '1',
    seller: 'John Doe',
    buyer: 'Jane Smith',
    price: 950.00,
    date: '2024-02-15T14:30:00.000Z',
    location: 'New York, NY',
    transactionHash: '0xfedcba9876543210fedcba9876543210fedcba98'
  },
  {
    _id: '3',
    productId: '2',
    seller: 'Samsung Store',
    buyer: 'Mike Johnson',
    price: 899.99,
    date: '2024-02-10T09:15:00.000Z',
    location: 'Los Angeles, CA',
    transactionHash: '0xba9876543210fedcba9876543210fedcba987654'
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Find sales history for the product
    const productSales = sales.filter(sale => sale.productId === productId);
    
    if (productSales.length === 0) {
      return res.status(404).json({ message: 'No sales history found for this product' });
    }

    res.status(200).json({
      message: 'Sales history retrieved successfully',
      sales: productSales
    });

  } catch (error) {
    console.error('Get sales history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
