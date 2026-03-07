const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { sendAnnouncementEmail } = require('../services/emailService');

// ── helper: build MongoDB filter for a targetEvent key ─────────────────────
function eventFilter(targetEvent) {
    if (!targetEvent || targetEvent === 'all') return {};
    if (targetEvent === 'rtl-gds') return { 'eventChoices.day1Workshop': 'rtl-gds' };
    if (targetEvent === 'fpga') return { 'eventChoices.day1Workshop': 'fpga' };
    if (targetEvent === 'panelDiscussion') return { 'eventChoices.panelDiscussion': true };
    if (targetEvent === 'expertInsights') return { 'eventChoices.expertInsights': true };
    if (targetEvent === 'sharkTank') return { 'eventChoices.sharkTank': true };
    if (targetEvent === 'aiInVlsi') return { 'eventChoices.aiInVlsi': true };
    if (targetEvent === 'treasureHunt') return { 'eventChoices.treasureHunt': true };
    if (targetEvent === 'silentGallery') return { 'eventChoices.silentGallery': true };
    return {};
}

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
// Optionally sends an email blast to all (or event-specific) participants
router.post('/', authenticate, authorize('coordinator', 'faculty'), async (req, res) => {
    try {
        const { title, content, role, date, targetEvent, sendEmail } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const announcement = new Announcement({
            title,
            content,
            role,
            postedBy: req.user._id,
            date: date || new Date().toISOString(),
            targetEvent: targetEvent || null
        });

        await announcement.save();
        await announcement.populate('postedBy', 'name role');

        // Optionally email participants
        let emailSentCount = 0;
        if (sendEmail) {
            const filter = { role: 'participant', ...eventFilter(targetEvent) };
            const recipients = await User.find(filter, 'name email');
            // Send in batches to avoid rate-limits; fire-and-forget but track count
            const results = await Promise.allSettled(
                recipients.map(u => sendAnnouncementEmail(u, { title, content, targetEvent }))
            );
            emailSentCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
            announcement.emailSentCount = emailSentCount;
            await announcement.save();
            console.log(`📣 Announcement emailed: ${emailSentCount}/${recipients.length} sent`);
        }

        console.log(`📢 New Announcement: ${title}`);
        res.status(201).json({ ...announcement.toObject(), emailSentCount });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Edit announcement (Coordinator/Faculty only)
router.put('/:id', authenticate, authorize('coordinator', 'faculty'), async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title && !content) {
            return res.status(400).json({ error: 'Nothing to update' });
        }
        const update = {};
        if (title) update.title = title;
        if (content) update.content = content;

        const updated = await Announcement.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            { new: true }
        ).populate('postedBy', 'name role');

        if (!updated) return res.status(404).json({ error: 'Announcement not found' });
        res.json(updated);
    } catch (error) {
        console.error('Edit announcement error:', error);
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
