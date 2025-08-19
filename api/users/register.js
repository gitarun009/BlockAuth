const bcrypt = require('bcrypt');

// Mock user database (in production, you'd use a real database)
let users = [
    {
        id: '1',
        name: 'Alice Customer',
        email: 'customer1@example.com',
        password: '$2b$10$rQZ8K9mN2pL3vX7yJ1hG4qR5tU6wE8sA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW0xY1zA2bC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ',
        role: 'customer'
    },
    {
        id: '2',
        name: 'Bob Retailer',
        email: 'retailer1@example.com',
        password: '$2b$10$rQZ8K9mN2pL3vX7yJ1hG4qR5tU6wE8sA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW0xY1zA2bC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ',
        role: 'retailer'
    },
    {
        id: '3',
        name: 'Carol Manufacturer',
        email: 'manufacturer1@example.com',
        password: '$2b$10$rQZ8K9mN2pL3vX7yJ1hG4qR5tU6wE8sA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW0xY1zA2bC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ',
        role: 'manufacturer'
    }
];

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        if (!['customer', 'retailer', 'manufacturer'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: (users.length + 1).toString(),
            name,
            email,
            password: hashedPassword,
            role
        };

        // Add to users array (in production, save to database)
        users.push(newUser);

        // Return success (don't return password)
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
