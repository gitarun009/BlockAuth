const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock user database (in production, you'd use a real database)
const users = [
    {
        id: '1',
        name: 'Alice Customer',
        email: 'customer1@example.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', // password: 'customer123'
        role: 'customer'
    },
    {
        id: '2',
        name: 'Bob Retailer',
        email: 'retailer1@example.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', // password: 'retailer123'
        role: 'retailer'
    },
    {
        id: '3',
        name: 'Carol Manufacturer',
        email: 'manufacturer1@example.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', // password: 'manufacturer123'
        role: 'manufacturer'
    }
];

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password (using bcrypt.compare for the hashed passwords)
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return user data and token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
