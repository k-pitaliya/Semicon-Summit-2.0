const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        minlength: 6
    },
    mustChangePassword: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: {
        type: Date
    },
    passwordExpiresAt: {
        type: Date
    },
    passwordRotationDays: {
        type: Number,
        default: 90 // Default: password expires after 90 days
    },
    role: {
        type: String,
        enum: ['participant', 'coordinator', 'faculty'],
        default: 'participant'
    },
    phone: {
        type: String,
        trim: true
    },
    college: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    selectedEvents: [{
        type: String
    }],
    // New structured event registration fields
    studentId: {
        type: String,
        trim: true
    },
    universityEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    yearOfStudy: {
        type: String,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '']
    },
    eventChoices: {
        day1Workshop: {
            type: String,
            enum: ['rtl-gds', 'fpga', 'none', ''],
            default: ''
        },
        panelDiscussion: {         // Day 1 — Inaugural Talk & Panel Discussion
            type: Boolean,
            default: false
        },
        expertInsights: {          // Day 2 — Expert Insights: VLSI vs Embedded
            type: Boolean,
            default: false
        },
        aiInVlsi: {                // Day 3 — Impact of AI in VLSI
            type: Boolean,
            default: false
        },
        sharkTank: {
            type: Boolean,
            default: false
        },
        treasureHunt: {
            type: Boolean,
            default: false
        },
        silentGallery: {
            type: Boolean,
            default: false
        }
    },
    // Unique sequential registration ID, e.g. SS26-001
    registrationId: {
        type: String,
        unique: true,
        sparse: true,   // allows null for users created before this feature
        trim: true
    },
    registeredEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    // Verification fields
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Razorpay Payment Integration
    razorpayPaymentId: {
        type: String,
        unique: true,      // Prevent duplicate payment IDs
        sparse: true,      // Allow null values (for users who haven't paid yet)
        trim: true
    },
    razorpayOrderId: {
        type: String,
        trim: true
    },
    // Legacy manual payment fields (deprecated - keeping for backward compatibility)
    transactionId: {
        type: String,
        trim: true
    },
    paymentScreenshot: {
        type: String
    },
    paymentAmount: {
        type: Number,
        default: 299
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentReference: {
        type: String
    },
    // Email delivery tracking — set after registration / re-send
    // No default: null means "unknown" (old record), false = failed, true = sent
    credentialsEmailSent: {
        type: Boolean
    },
    credentialsEmailFailedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    // Only hash if password is modified and exists
    if (!this.isModified('password') || !this.password) return;

    // Don't re-hash if already hashed (bcrypt hashes start with $2)
    if (this.password.startsWith('$2')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Set password expiration date if rotation is enabled
    if (this.isModified('password') && this.passwordRotationDays > 0) {
        this.passwordChangedAt = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.passwordRotationDays);
        this.passwordExpiresAt = expiryDate;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
