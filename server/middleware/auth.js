const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Validate JWT_SECRET in production
const JWT_SECRET = process.env.JWT_SECRET || 'semiconductor_summit_2026_secret_key';
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    logger.error('CRITICAL: JWT_SECRET is not set in production environment!');
    throw new Error('JWT_SECRET must be set in production');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Check if password has expired (password rotation)
            if (user.passwordExpiresAt && new Date() > user.passwordExpiresAt) {
                return res.status(401).json({ 
                    error: 'Password expired', 
                    message: 'Your password has expired. Please reset your password.',
                    passwordExpired: true
                });
            }

            req.user = user;
            req.token = token;
            next();
        } catch (jwtError) {
            // Fallback: check if token is a valid MongoDB ObjectId (backward compatibility)
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(token)) {
                const user = await User.findById(token);
                if (user) {
                    // Check password expiration for old tokens too
                    if (user.passwordExpiresAt && new Date() > user.passwordExpiresAt) {
                        return res.status(401).json({ 
                            error: 'Password expired', 
                            message: 'Your password has expired. Please reset your password.',
                            passwordExpired: true
                        });
                    }
                    req.user = user;
                    req.token = token;
                    return next();
                }
            }
            return res.status(401).json({ error: 'Token is not valid' });
        }
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Not authorized for this action' });
        }
        next();
    };
};

module.exports = { generateToken, authenticate, authorize, JWT_SECRET };
