import bcrypt from 'bcrypt';

// Mock user database (in production, you'd use a real database)
let users = [
    {
        id: '1',
        name: 'Alice Customer',
        email: 'customer1@example.com',
        password: '$2b$10$BmfG94RW8snYKbDouwwCbOO61kt4OKWj3qwI/iyxBVjbjT63s/yJK', // customer123
        role: 'customer'
    },
    {
        id: '2',
        name: 'Bob Retailer',
        email: 'retailer1@example.com',
        password: '$2b$10$TXszEZhg05Yvihqtzej/x.dHGNuiepQHP7veLmv37zozk5ZXqW.fq', // retailer123
        role: 'retailer'
    },
    {
        id: '3',
        name: 'Carol Manufacturer',
        email: 'manufacturer1@example.com',
        password: '$2b$10$VzsjzGYvGfY9osdcIBBdZOzD95tdQuCWPJl4Z6ArziidVtHlhGKe6', // manufacturer123
        role: 'manufacturer'
    }
];

export default async function handler(req, res) {
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
