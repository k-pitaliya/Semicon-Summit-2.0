const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth');
const UploadedFile = require('../models/UploadedFile');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const photosDir = path.join(uploadsDir, 'photos');
const docsDir = path.join(uploadsDir, 'documents');

// Ensure directories exist
[photosDir, docsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.path.includes('photos') ? 'photos' : 'documents';
        cb(null, path.join(uploadsDir, type));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const type = req.path.includes('photos') ? 'photos' : 'documents';
        if (type === 'photos') {
            const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            cb(null, allowed.includes(file.mimetype));
        } else {
            const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
            cb(null, allowed.includes(file.mimetype));
        }
    }
});

// Upload photos (Auth required)
router.post('/photos', authenticate, upload.array('photos', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    try {
        const newPhotos = await UploadedFile.insertMany(req.files.map(file => ({
            type: 'photos',
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            url: `/uploads/photos/${file.filename}`,
            uploadedBy: req.user._id
        })));
        res.status(201).json(newPhotos);
    } catch (error) {
        console.error('Upload photos error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload documents (Auth required)
router.post('/documents', authenticate, upload.array('documents', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    try {
        const newDocs = await UploadedFile.insertMany(req.files.map(file => ({
            type: 'documents',
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            url: `/uploads/documents/${file.filename}`,
            uploadedBy: req.user._id
        })));
        res.status(201).json(newDocs);
    } catch (error) {
        console.error('Upload documents error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get uploaded photos (Auth required)
router.get('/photos', authenticate, async (req, res) => {
    try {
        const photos = await UploadedFile.find({ type: 'photos' }).sort({ createdAt: -1 });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get uploaded documents (Auth required)
router.get('/documents', authenticate, async (req, res) => {
    try {
        const docs = await UploadedFile.find({ type: 'documents' }).sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete uploaded file (Auth required)
router.delete('/:type/:id', authenticate, async (req, res) => {
    const { type, id } = req.params;

    if (!['photos', 'documents'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const file = await UploadedFile.findById(id);
        if (!file || file.type !== type) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(uploadsDir, type, file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await file.deleteOne();
        res.json({ success: true });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
