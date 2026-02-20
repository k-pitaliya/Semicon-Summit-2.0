const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

// Get all events (Public)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ isActive: true }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get registrations (Auth required) — MUST be before /:id to avoid route conflict
router.get('/registrations/all', authenticate, async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('user')
            .populate('event')
            .sort({ registrationDate: -1 });
        res.json(registrations);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get single event (Public) — AFTER all named sub-routes to avoid catching them as :id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create event (Faculty only)
router.post('/', authenticate, authorize('faculty'), async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register for event (Auth required)
router.post('/register', authenticate, async (req, res) => {
    try {
        const { eventId, paymentReference, paymentMethod, amount } = req.body;
        const userId = req.user._id;

        const existingReg = await Registration.findOne({ user: userId, event: eventId });
        if (existingReg) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }

        const registration = new Registration({
            user: userId,
            event: eventId,
            paymentReference,
            paymentMethod,
            amount,
            paymentStatus: 'completed'
        });

        await registration.save();
        await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });
        await User.findByIdAndUpdate(userId, { $push: { registeredEvents: eventId } });

        res.status(201).json(registration);
    } catch (error) {
        console.error('Event registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;
