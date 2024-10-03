const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage (replace with a database in a real application)
const users = [];
const posts = [];

const SECRET_KEY = 'your_secret_key'; // Replace with a strong, unique key in production
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return res.status(400).send('User already exists');
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).send('Password must be at least 8 characters long');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Store the new user
        users.push({ email, password: hashedPassword });

        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error creating user');
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ token });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).send('Error during signin');
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

app.post('/post', authenticateToken, (req, res) => {
    const { content } = req.body;
    const post = { content, user: req.user.email, createdAt: new Date() };
    posts.push(post);
    res.status(201).json(post);
});

app.get('/post', authenticateToken, (req, res) => {
    res.json(posts);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));