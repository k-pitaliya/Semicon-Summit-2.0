require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// Utilities
const logger = require('./utils/logger');

// MongoDB connection
const connectDB = require('./config/database');

// Models
const User = require('./models/User');
const Event = require('./models/Event');

// Services
const { generatePassword, sendCredentialsEmail, verifyEmailTransporter } = require('./services/emailService');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const participantRoutes = require('./routes/participantRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const paymentVerificationRoutes = require('./routes/paymentVerificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Render/Heroku/etc reverse proxy — required for rate-limiting and IP detection
// Without this, express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Security headers - Protect against XSS, clickjacking, etc.
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://api.cloudinary.com"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// CORS configuration - Allow multiple origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://semicon-summit-2-0.vercel.app',
    'https://semiconsummit.vercel.app',
    'https://semisummit2026.charusat.ac.in',
    'http://semisummit2026.charusat.ac.in',
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
}));

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window per IP
    message: { error: 'Too many authentication attempts, please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // Don't count successful logins
});

// Rate limiting for general API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window per IP
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Webhook routes (must be before express.json() to handle raw body)
app.use('/api/webhooks', webhookRoutes);

// Body parsing with size limit
app.use(express.json({ limit: '10mb' }));

// Payment verification routes (after express.json so req.body is parsed)
app.use('/api', paymentVerificationRoutes);

// Static uploads
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Ensure uploads directories exist
const paymentsDir = path.join(uploadsDir, 'payments');
const receiptsDir = path.join(uploadsDir, 'receipts');
[uploadsDir, paymentsDir, receiptsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// ==========================================
// MOUNT ROUTE FILES
// ==========================================
app.use('/api/auth', authLimiter, authRoutes); // Rate limit auth routes
app.use('/api', apiLimiter); // Rate limit all other API routes
app.use('/api/users', userRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/uploads', uploadRoutes);

// ==========================================
// PUBLIC REGISTRATION (kept inline for PDF receipt handling)
// ==========================================
const receiptStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }
        cb(null, receiptsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadReceipt = multer({
    storage: receiptStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

app.post('/api/register', uploadReceipt.single('pdfReceipt'), async (req, res) => {
    try {
        const { name, email, phone, college, department, selectedEvents, paymentAmount, paymentId } = req.body;
        const pdfFile = req.file;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email, and phone are required' });
        }

        if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }

        const normalizedPaymentId = paymentId.trim();

        if (!/^pay_[A-Za-z0-9]+$/.test(normalizedPaymentId)) {
            return res.status(400).json({ error: 'Invalid Payment ID format. Please enter the ID starting with "pay_".' });
        }

        if (!pdfFile) {
            return res.status(400).json({ error: 'PDF receipt is required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered. If you have already submitted, please wait for payment confirmation.' });
        }

        const existingPayment = await User.findOne({ razorpayPaymentId: normalizedPaymentId });
        if (existingPayment) {
            return res.status(400).json({ error: 'This Payment ID has already been used. Please contact support if you believe this is an error.' });
        }

        // Extract text from PDF and verify payment ID
        let pdfText = '';
        try {
            // Wait a moment for file to be fully written (prevents intermittent read errors)
            await new Promise(resolve => setTimeout(resolve, 100));

            // Read file with retry logic
            let dataBuffer;
            let retries = 3;
            while (retries > 0) {
                try {
                    dataBuffer = fs.readFileSync(pdfFile.path);
                    break;
                } catch (readError) {
                    retries--;
                    if (retries === 0) throw readError;
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            const pdfData = await pdfParse(dataBuffer);
            pdfText = pdfData.text;
            logger.debug('PDF text extracted', { length: pdfText.length });
        } catch (pdfError) {
            logger.error('PDF parsing error:', pdfError);
            return res.status(400).json({ error: 'Unable to read PDF. Please ensure you uploaded a valid PDF receipt.' });
        }

        const escapedId = normalizedPaymentId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const paymentIdRegex = new RegExp(escapedId, 'i');
        if (!paymentIdRegex.test(pdfText)) {
            return res.status(400).json({ error: 'Payment ID not found in the uploaded PDF. Please verify the Payment ID and try again.' });
        }

        // All checks passed — Create user and auto-approve
        const password = generatePassword();

        const user = new User({
            name,
            email: email.toLowerCase(),
            phone,
            college,
            department,
            selectedEvents: Array.isArray(selectedEvents) ? selectedEvents :
                (typeof selectedEvents === 'string' ? JSON.parse(selectedEvents) : []),
            verificationStatus: 'approved',
            paymentStatus: 'completed',
            paymentAmount: 299,
            role: 'participant',
            razorpayPaymentId: normalizedPaymentId,
            paymentScreenshot: `/uploads/receipts/${pdfFile.filename}`,
            password: password,
            generatedPassword: password,
            verifiedAt: new Date()
        });

        await user.save();

        // Send email asynchronously (don't block response)
        sendCredentialsEmail(user, password)
            .then((emailSent) => {
                logger.info('Credentials email sent', { success: emailSent, userId: user._id });
            })
            .catch((emailError) => {
                logger.error('Email sending failed (async)', { error: emailError, userId: user._id });
            });

        logger.info('User registered and auto-approved', { userId: user._id, email: user.email });

        res.status(201).json({
            message: 'Registration successful! Check your email for login credentials.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                verificationStatus: user.verificationStatus
            },
            password: password
        });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// ==========================================
// ADMIN VERIFICATION ROUTES (kept for backward compat)
// ==========================================
app.get('/api/admin/pending', async (req, res) => {
    try {
        const pending = await User.find({ verificationStatus: 'pending' })
            .sort({ createdAt: -1 });
        res.json(pending);
    } catch (error) {
        logger.error('Error fetching pending:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/verify/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.verificationStatus !== 'pending') {
            return res.status(400).json({ error: 'User already processed' });
        }

        const password = generatePassword();
        user.password = password;
        user.generatedPassword = password;
        user.verificationStatus = 'approved';
        user.paymentStatus = 'completed';
        user.verifiedAt = new Date();

        await user.save();

        // Send email asynchronously (don't block response)
        sendCredentialsEmail(user, password)
            .then((emailSent) => {
                logger.info('Credentials email sent', { success: emailSent, userId: user._id });
            })
            .catch((emailError) => {
                logger.error('Email sending failed (async)', { error: emailError, userId: user._id });
            });

        logger.info('User verified by admin', { userId: user._id, email: user.email });
        res.json({
            message: 'User verified successfully',
            user,
            generatedPassword: password
        });
    } catch (error) {
        logger.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed: ' + error.message });
    }
});

app.post('/api/admin/reject/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const { sendRejectionEmail } = require('./services/emailService');

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.verificationStatus !== 'pending') {
            return res.status(400).json({ error: 'User already processed' });
        }

        user.verificationStatus = 'rejected';
        user.rejectionReason = reason || 'Payment verification failed';
        user.verifiedAt = new Date();

        await user.save();

        await sendRejectionEmail(user, reason);

        logger.info('User rejected by admin', { userId: user._id, email: user.email, reason });
        res.json({ message: 'User rejected', user });
    } catch (error) {
        logger.error('Rejection error:', error);
        res.status(500).json({ error: 'Rejection failed: ' + error.message });
    }
});

// ==========================================
// SEED DATABASE WITH DEMO DATA
// ==========================================
app.post('/api/seed', async (req, res) => {
    try {
        const demoUsers = [
            { name: 'John Participant', email: 'participant@demo.com', password: 'demo123', role: 'participant', college: 'Tech University', phone: '9876543210' },
            { name: 'Jane Coordinator', email: 'coordinator@demo.com', password: 'demo123', role: 'coordinator' },
            { name: 'Dr. Faculty', email: 'faculty@demo.com', password: 'demo123', role: 'faculty' }
        ];

        for (const userData of demoUsers) {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                const user = new User(userData);
                await user.save();
                logger.info('Created demo user', { email: userData.email });
            }
        }

        const demoEvents = [
            { title: 'VLSI Design Workshop', description: 'Learn VLSI design fundamentals', date: new Date('2026-03-15'), time: '10:00 AM', venue: 'Hall A', category: 'workshop', capacity: 100, registrationFee: 400 },
            { title: 'Chip Architecture Talk', description: 'Expert talk on modern chip architectures', date: new Date('2026-03-15'), time: '2:00 PM', venue: 'Hall B', category: 'talk', capacity: 200, registrationFee: 0 },
            { title: 'Embedded Systems Hackathon', description: '24-hour hackathon', date: new Date('2026-03-16'), time: '9:00 AM', venue: 'Lab 1', category: 'hackathon', capacity: 50, registrationFee: 200 },
            { title: 'Industry Panel Discussion', description: 'Panel with industry leaders', date: new Date('2026-03-16'), time: '4:00 PM', venue: 'Main Hall', category: 'networking', capacity: 300, registrationFee: 0 }
        ];

        for (const eventData of demoEvents) {
            const exists = await Event.findOne({ title: eventData.title });
            if (!exists) {
                const event = new Event(eventData);
                await event.save();
                logger.info('Created demo event', { title: eventData.title });
            }
        }

        res.json({ success: true, message: 'Demo data seeded successfully' });
    } catch (error) {
        logger.error('Seed error:', error);
        res.status(500).json({ error: 'Seed failed: ' + error.message });
    }
});

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'MongoDB',
        cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME)
    });
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Uploads directory: ${uploadsDir}`);
    logger.info('Database: MongoDB');
    logger.info(`Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}`);
    // Verify SMTP on startup so email failures show in logs immediately
    verifyEmailTransporter();
});
