const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['photos', 'documents'],
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UploadedFile', uploadedFileSchema);
