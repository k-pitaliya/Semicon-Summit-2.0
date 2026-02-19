const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { authenticate, authorize } = require('../middleware/auth');

// Get all announcements (Auth required) — supports ?page=&limit=
router.get('/', authenticate, async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, parseInt(limit) || 20);
        const total = await Announcement.countDocuments();
        const announcements = await Announcement.find()
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);
        res.json({
            announcements,
            pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
        });
    } catch (error) {
        console.error('Fetch announcements error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create announcement (Coordinator/Faculty only)
router.post('/', authenticate, authorize('coordinator', 'faculty'), async (req, res) => {
    try {
        const { title, content, role, date } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const announcement = new Announcement({
            title,
            content,
            role,
            postedBy: req.user._id,
            date: date || new Date().toISOString()
        });

        await announcement.save();
        await announcement.populate('postedBy', 'name role');

        console.log(`📢 New Announcement: ${title}`);
        res.status(201).json(announcement);
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete announcement (Coordinator/Faculty only)
router.delete('/:id', authenticate, authorize('coordinator', 'faculty'), async (req, res) => {
    try {
        const deleted = await Announcement.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        res.json({ success: true, message: 'Announcement deleted' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
