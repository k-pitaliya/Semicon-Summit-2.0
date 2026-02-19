const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { authenticate, authorize } = require('../middleware/auth');
const { generatePassword, sendCredentialsEmail, sendRejectionEmail } = require('../services/emailService');

// Get all participants (Faculty/Coordinator) — supports ?page=&limit=&event=
router.get('/', authenticate, authorize('faculty', 'coordinator'), async (req, res) => {
    try {
        const { event, page, limit } = req.query;
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(200, parseInt(limit) || 100);
        let participants;

        if (event && event !== 'all') {
            const eventDoc = await Event.findOne({ title: event });
            if (eventDoc) {
                const registrations = await Registration.find({ event: eventDoc._id })
                    .populate('user')
                    .populate('event');
                participants = registrations.map(reg => ({
                    id: reg.user._id,
                    name: reg.user.name,
                    email: reg.user.email,
                    mustChangePassword: reg.user.mustChangePassword,
                    college: reg.user.college,
                    phone: reg.user.phone,
                    events: [reg.event.title],
                    paymentRef: reg.user.razorpayPaymentId || reg.user.paymentReference || 'N/A',
                    timestamp: reg.registrationDate
                }));
            } else {
                participants = [];
            }
        } else {
            const total = await User.countDocuments({ role: 'participant' });
            const users = await User.find({ role: 'participant' })
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);
            const registrations = await Registration.find().populate('event');

            participants = users.map(user => {
                const userRegs = registrations.filter(r => r.user.toString() === user._id.toString());
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mustChangePassword: user.mustChangePassword,
                    college: user.college,
                    phone: user.phone,
                    events: userRegs.map(r => r.event?.title || 'Unknown'),
                    selectedEvents: user.selectedEvents || [],
                    paymentRef: user.razorpayPaymentId || user.paymentReference || userRegs[0]?.paymentReference || 'N/A',
                    timestamp: user.createdAt
                };
            });
        }

        res.json({
            participants,
            pagination: {
                total: event && event !== 'all' ? participants.length : total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil((event && event !== 'all' ? participants.length : total) / limitNum)
            }
        });
    } catch (error) {
        console.error('Get participants error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Export participants to CSV (Faculty only)
router.get('/export', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const users = await User.find({ role: 'participant' }).sort({ createdAt: -1 });
        const registrations = await Registration.find().populate('event');

        const participants = users.map(user => {
            const userRegs = registrations.filter(r => r.user.toString() === user._id.toString());
            return {
                name: user.name,
                email: user.email,
                college: user.college,
                phone: user.phone,
                events: userRegs.map(r => r.event?.title || 'Unknown').join('; '),
                selectedEvents: (user.selectedEvents || []).join('; '),
                paymentRef: user.razorpayPaymentId || user.paymentReference || userRegs[0]?.paymentReference || '',
                timestamp: user.createdAt
            };
        });

        const headers = ['Name', 'Email', 'College', 'Phone', 'Registered Events', 'Selected Events', 'Payment Ref', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...participants.map(p => [
                `"${p.name}"`,
                p.email,
                `"${p.college || ''}"`,
                p.phone || '',
                `"${p.events}"`,
                `"${p.selectedEvents}"`,
                p.paymentRef,
                p.timestamp
            ].join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
        res.send(csvContent);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify participant (Faculty only)
router.put('/:id/verify', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.verificationStatus !== 'pending') {
            return res.status(400).json({ error: 'User already processed' });
        }

        const password = generatePassword();
        user.password = password;
        user.mustChangePassword = true;
        user.verificationStatus = 'approved';
        user.paymentStatus = 'completed';
        user.verifiedBy = req.user._id;
        user.verifiedAt = new Date();

        await user.save();

        const emailSent = await sendCredentialsEmail(user, password);

        console.log(`✅ User verified: ${user.name} (${user.email})`);
        res.json({
            message: 'User verified successfully',
            user,
            emailSent,
            generatedPassword: password
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed: ' + error.message });
    }
});

// Reject participant (Faculty only)
router.put('/:id/reject', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const { reason } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.verificationStatus !== 'pending') {
            return res.status(400).json({ error: 'User already processed' });
        }

        user.verificationStatus = 'rejected';
        user.rejectionReason = reason || 'Payment verification failed';
        user.verifiedBy = req.user._id;
        user.verifiedAt = new Date();

        await user.save();

        await sendRejectionEmail(user, reason);

        console.log(`❌ User rejected: ${user.name} (${user.email})`);
        res.json({ message: 'User rejected', user });
    } catch (error) {
        console.error('Rejection error:', error);
        res.status(500).json({ error: 'Rejection failed: ' + error.message });
    }
});

module.exports = router;
