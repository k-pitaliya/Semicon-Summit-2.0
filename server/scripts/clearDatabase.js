/**
 * Clear Database Script
 * 
 * WARNING: This will DELETE ALL DATA from the database
 * Use this to prepare for production launch
 * 
 * Run with: node scripts/clearDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

// Import models
const User = require('../models/User');
const Registration = require('../models/Registration');
const Gallery = require('../models/Gallery');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const UploadedFile = require('../models/UploadedFile');

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/semiconductor_summit';

// Colors for console
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    cyan: '\x1b[36m'
};

const log = {
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
};

async function clearDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        log.success('Connected to MongoDB');

        // Get counts before deletion
        const counts = {
            users: await User.countDocuments(),
            registrations: await Registration.countDocuments(),
            gallery: await Gallery.countDocuments(),
            announcements: await Announcement.countDocuments(),
            events: await Event.countDocuments(),
            uploadedFiles: await UploadedFile.countDocuments()
        };

        console.log('\n' + colors.bright + '📊 Current Database State:' + colors.reset);
        console.log(`   Users: ${counts.users}`);
        console.log(`   Registrations: ${counts.registrations}`);
        console.log(`   Gallery: ${counts.gallery}`);
        console.log(`   Announcements: ${counts.announcements}`);
        console.log(`   Events: ${counts.events}`);
        console.log(`   Uploaded Files: ${counts.uploadedFiles}`);

        // Confirmation prompt
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const answer = await new Promise((resolve) => {
            rl.question(
                `\n${colors.red}${colors.bright}⚠️  WARNING: This will DELETE ALL DATA!${colors.reset}\n` +
                `Type "DELETE" to confirm: `,
                (ans) => {
                    rl.close();
                    resolve(ans);
                }
            );
        });

        if (answer.trim() !== 'DELETE') {
            log.warn('Operation cancelled');
            process.exit(0);
        }

        console.log('\n' + colors.bright + '🗑️  Deleting all data...' + colors.reset + '\n');

        // Delete all data
        await User.deleteMany({});
        log.success('Deleted all users');

        await Registration.deleteMany({});
        log.success('Deleted all registrations');

        await Gallery.deleteMany({});
        log.success('Deleted all gallery items');

        await Announcement.deleteMany({});
        log.success('Deleted all announcements');

        await Event.deleteMany({});
        log.success('Deleted all events');

        await UploadedFile.deleteMany({});
        log.success('Deleted all uploaded file records');

        console.log('\n' + colors.green + colors.bright + '✓ Database cleared successfully!' + colors.reset);
        console.log(colors.cyan + '\nYour site is now ready for production registrations.' + colors.reset);

    } catch (error) {
        log.error(`Failed to clear database: ${error.message}`);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        log.info('Database connection closed');
        process.exit(0);
    }
}

// Run the script
clearDatabase();
