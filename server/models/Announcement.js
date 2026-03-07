const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['faculty', 'coordinator'],
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Optional: target a specific event group. null = all participants
    targetEvent: {
        type: String,
        default: null
    },
    // Whether an email blast was triggered when this announcement was created
    emailSentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
