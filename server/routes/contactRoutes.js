const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

// ── Rate limit: max 5 contact submissions per 15 min per IP ─────────────────
const rateLimit = require('express-rate-limit');
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: 'Too many messages sent. Please wait 15 minutes before trying again.' },
    standardHeaders: true,
    legacyHeaders: false
});

// POST /api/contact
// Public — no auth required
router.post('/', contactLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body;

    // ── Basic validation ──────────────────────────────────────────────────────
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields (name, email, subject, message) are required.' });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Length guards — prevent spam / abuse
    if (name.length > 100 || subject.length > 200 || message.length > 2000) {
        return res.status(400).json({ error: 'Input exceeds allowed length.' });
    }

    // ── Send email ────────────────────────────────────────────────────────────
    const sent = await sendContactEmail({ name, email, subject, message });

    if (sent) {
        return res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
    } else {
        return res.status(500).json({ error: 'Failed to send your message. Please try emailing us directly at semisummit.ec@charusat.ac.in' });
    }
});

module.exports = router;
