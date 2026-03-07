const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require('../services/emailService');

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

// Forgot Password (Public) — user supplies their own new password
// NOTE: Always returns the same success message to prevent user enumeration attacks
router.post('/forgot-password', async (req, res) => {
    const SAFE_MESSAGE = 'Password updated successfully. You can now sign in with your new password.';
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email) return res.status(400).json({ error: 'Email is required' });
        if (!newPassword) return res.status(400).json({ error: 'New password is required' });
        if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
        if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

        const user = await User.findOne({ email: email.toLowerCase() });
        // Always return the same message — never reveal whether the email exists
        if (!user) return res.json({ message: SAFE_MESSAGE });

        user.password = newPassword; // bcrypt hashing runs via pre-save hook
        user.mustChangePassword = false;
        await user.save();

        // Send a confirmation-only email (no password shown)
        await sendPasswordChangedEmail(user);

        console.log(`🔐 Password reset (user-chosen) for: ${user.email}`);
        res.json({ message: SAFE_MESSAGE });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Change Password (Authenticated) — enforces mustChangePassword after first login
router.put('/change-password', authenticate, async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();

        console.log(`🔑 User changed password: ${user.email}`);
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
