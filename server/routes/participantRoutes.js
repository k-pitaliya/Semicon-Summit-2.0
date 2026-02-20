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
        let total = 0; // declared here so it's in scope for res.json() below

        if (event && event !== 'all') {
            // Support filtering by eventChoices fields (day1Workshop, sharkTank, etc.) or legacy event title
            const eventChoiceFields = ['rtl-gds', 'fpga', 'none', 'sharkTank', 'treasureHunt', 'silentGallery'];
            if (eventChoiceFields.includes(event) || ['Silicon Shark Tank', 'Treasure Hunt', 'Silent Gallery'].includes(event)) {
                // Filter by eventChoices stored on User directly
                let filter = { role: 'participant' };
                if (event === 'rtl-gds') filter['eventChoices.day1Workshop'] = 'rtl-gds';
                else if (event === 'fpga') filter['eventChoices.day1Workshop'] = 'fpga';
                else if (event === 'sharkTank' || event === 'Silicon Shark Tank') filter['eventChoices.sharkTank'] = true;
                else if (event === 'treasureHunt' || event === 'Treasure Hunt') filter['eventChoices.treasureHunt'] = true;
                else if (event === 'silentGallery' || event === 'Silent Gallery') filter['eventChoices.silentGallery'] = true;
                total = await User.countDocuments(filter);
                const users = await User.find(filter)
                    .sort({ createdAt: -1 })
                    .skip((pageNum - 1) * limitNum)
                    .limit(limitNum);
                participants = users.map(user => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mustChangePassword: user.mustChangePassword,
                    college: user.college,
                    phone: user.phone,
                    department: user.department,
                    studentId: user.studentId,
                    yearOfStudy: user.yearOfStudy,
                    eventChoices: user.eventChoices,
                    selectedEvents: user.selectedEvents || [],
                    paymentRef: user.razorpayPaymentId || 'N/A',
                    paymentAmount: user.paymentAmount || 299,
                    verificationStatus: user.verificationStatus || 'approved',
                    timestamp: user.createdAt
                }));
            } else {
                // Legacy: filter by Registration event title
                const eventDoc = await Event.findOne({ title: event });
                if (eventDoc) {
                    const registrations = await Registration.find({ event: eventDoc._id })
                        .populate('user')
                        .populate('event');
                    total = registrations.length;
                    participants = registrations
                        .filter(reg => reg.user)
                        .slice((pageNum - 1) * limitNum, pageNum * limitNum)
                        .map(reg => ({
                            id: reg.user._id,
                            name: reg.user.name,
                            email: reg.user.email,
                            mustChangePassword: reg.user.mustChangePassword,
                            college: reg.user.college,
                            phone: reg.user.phone,
                            department: reg.user.department,
                            studentId: reg.user.studentId,
                            yearOfStudy: reg.user.yearOfStudy,
                            eventChoices: reg.user.eventChoices,
                            selectedEvents: reg.user.selectedEvents || [],
                            events: [reg.event.title],
                            paymentRef: reg.user.razorpayPaymentId || 'N/A',
                            paymentAmount: reg.user.paymentAmount || 299,
                            verificationStatus: reg.user.verificationStatus || 'approved',
                            timestamp: reg.registrationDate
                        }));
                } else {
                    participants = [];
                }
            }
        } else {
            total = await User.countDocuments({ role: 'participant' });
            const users = await User.find({ role: 'participant' })
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);
            const registrations = await Registration.find().populate('event');

            participants = users.map(user => {
                const userRegs = registrations.filter(r =>
                    r.user && r.user.toString() === user._id.toString()
                );
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mustChangePassword: user.mustChangePassword,
                    college: user.college,
                    phone: user.phone,
                    department: user.department,
                    studentId: user.studentId,
                    yearOfStudy: user.yearOfStudy,
                    eventChoices: user.eventChoices,
                    events: userRegs.map(r => r.event?.title || 'Unknown'),
                    selectedEvents: user.selectedEvents || [],
                    paymentRef: user.razorpayPaymentId || user.paymentReference || userRegs[0]?.paymentReference || 'N/A',
                    paymentAmount: user.paymentAmount || 299,
                    verificationStatus: user.verificationStatus || 'approved',
                    timestamp: user.createdAt
                };
            });
        }

        res.json({
            participants,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum) || 1
            }
        });
    } catch (error) {
        console.error('Get participants error:', error);
        res.status(500).json({ error: 'Server error fetching participants', details: error.message });
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
