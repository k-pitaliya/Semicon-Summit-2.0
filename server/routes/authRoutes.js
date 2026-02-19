const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');
const { generatePassword, sendPasswordResetEmail } = require('../services/emailService');

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Return user data + token
        const userData = user.toJSON();
        userData.token = token;
        res.json(userData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Validate Token
router.get('/validate', authenticate, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Auth validate error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register new user (basic)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, college, department } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            college,
            department,
            role: 'participant'
        });

        await user.save();

        const token = generateToken(user._id);
        const userData = user.toJSON();
        userData.token = token;
        res.status(201).json(userData);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password (Public)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newPassword = generatePassword();
        user.password = newPassword;
        user.mustChangePassword = true;
        await user.save();

        await sendPasswordResetEmail(user, newPassword);

        console.log(`🔐 Public password reset request for: ${user.email}`);
        res.json({ message: 'If an account exists with this email, a new password has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
