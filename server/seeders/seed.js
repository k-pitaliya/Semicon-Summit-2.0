/**
 * Database Seeder for Semiconductor Summit 2.0
 * 
 * This script seeds the database with initial data for development and testing.
 * Run with: node seeders/seed.js
 * 
 * Options:
 *   --fresh    Drop all collections before seeding
 *   --users    Seed only users
 *   --gallery  Seed only gallery
 *   --all      Seed everything (default)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Gallery = require('../models/Gallery');
const Announcement = require('../models/Announcement');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/semiconductor_summit';

// Parse command line arguments
const args = process.argv.slice(2);
const isFresh = args.includes('--fresh');

// Check if any specific seed target is specified
const hasSpecificTarget = args.includes('--users') || args.includes('--gallery') || args.includes('--announcements');

// If no specific target, seed everything. If --fresh only, also seed everything.
const seedUsers = args.includes('--users') || args.includes('--all') || !hasSpecificTarget;
const seedGallery = args.includes('--gallery') || args.includes('--all') || !hasSpecificTarget;
const seedAnnouncements = args.includes('--announcements') || args.includes('--all') || !hasSpecificTarget;

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`)
};

// ============================================
// SEED DATA
// ============================================

const usersData = [
    {
        name: 'Dr. Rajesh Kumar',
        email: 'faculty@demo.com',
        password: 'demo123',
        role: 'faculty',
        phone: '9876543210',
        college: 'Indian Institute of Technology',
        department: 'Electronics Engineering',
        verificationStatus: 'approved',
        paymentStatus: 'completed'
    },
    {
        name: 'Prof. Anita Sharma',
        email: 'faculty2@demo.com',
        password: 'demo123',
        role: 'faculty',
        phone: '9876543211',
        college: 'National Institute of Technology',
        department: 'VLSI Design',
        verificationStatus: 'approved',
        paymentStatus: 'completed'
    },
    {
        name: 'Priya Coordinator',
        email: 'coordinator@demo.com',
        password: 'demo123',
        role: 'coordinator',
        phone: '9876543212',
        college: 'VIT University',
        department: 'Electronics and Communication',
        verificationStatus: 'approved',
        paymentStatus: 'completed'
    },
    {
        name: 'Rahul Coordinator',
        email: 'coordinator2@demo.com',
        password: 'demo123',
        role: 'coordinator',
        phone: '9876543213',
        college: 'SRM University',
        department: 'Electronics',
        verificationStatus: 'approved',
        paymentStatus: 'completed'
    },
    {
        name: 'Amit Participant',
        email: 'participant@demo.com',
        password: 'demo123',
        role: 'participant',
        phone: '9876543214',
        college: 'Anna University',
        department: 'ECE',
        yearOfStudy: '3rd Year',
        eventChoices: {
            day1Workshop: 'rtl-gds',
            panelDiscussion: true,
            expertInsights: true,
            aiInVlsi: false,
            sharkTank: false,
            treasureHunt: true,
            silentGallery: false,
        },
        verificationStatus: 'approved',
        paymentStatus: 'completed',
        paymentAmount: 299,
        paymentRef: 'pay_DEMO123456789'
    },
    {
        name: 'Sneha Patel',
        email: 'participant2@demo.com',
        password: 'demo123',
        role: 'participant',
        phone: '9876543215',
        college: 'Gujarat Technological University',
        department: 'Electronics',
        yearOfStudy: '2nd Year',
        eventChoices: {
            day1Workshop: 'fpga',
            panelDiscussion: true,
            expertInsights: false,
            aiInVlsi: true,
            sharkTank: true,
            treasureHunt: true,
            silentGallery: true,
        },
        verificationStatus: 'approved',
        paymentStatus: 'completed',
        paymentAmount: 299,
        paymentRef: 'pay_DEMO987654321'
    },
    {
        name: 'Vikram Singh',
        email: 'pending@demo.com',
        password: 'demo123',
        role: 'participant',
        phone: '9876543216',
        college: 'Delhi Technological University',
        department: 'Computer Engineering',
        yearOfStudy: '4th Year',
        eventChoices: {
            day1Workshop: 'rtl-gds',
            panelDiscussion: false,
            expertInsights: true,
            aiInVlsi: false,
            sharkTank: false,
            treasureHunt: false, // 4th year — not eligible
            silentGallery: false,
        },
        verificationStatus: 'pending',
        paymentStatus: 'pending',
        paymentAmount: 299,
        paymentRef: 'pay_PENDING123456'
    },
    {
        name: 'Meera Krishnan',
        email: 'pending2@demo.com',
        password: 'demo123',
        role: 'participant',
        phone: '9876543217',
        college: 'IIT Madras',
        department: 'Electrical Engineering',
        yearOfStudy: '1st Year',
        eventChoices: {
            day1Workshop: 'fpga',
            panelDiscussion: true,
            expertInsights: true,
            aiInVlsi: true,
            sharkTank: false,
            treasureHunt: true,
            silentGallery: true,
        },
        verificationStatus: 'pending',
        paymentStatus: 'pending',
        paymentAmount: 299,
        paymentRef: 'pay_PENDING654321'
    }
];

const galleryData = [
    {
        title: 'Opening Ceremony',
        description: 'The grand opening ceremony of Semiconductor Summit 1.0 with distinguished guests.',
        category: 'event',
        publicId: 'seed/opening_ceremony',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        tags: ['opening', 'ceremony', 'summit'],
        isFeatured: true
    },
    {
        title: 'VLSI Workshop Session',
        description: 'Hands-on workshop on advanced VLSI design techniques.',
        category: 'workshop',
        publicId: 'seed/vlsi_workshop',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        tags: ['workshop', 'vlsi', 'hands-on'],
        isFeatured: true
    },
    {
        title: 'Industry Expert Panel',
        description: 'Industry leaders discussing the future of semiconductor technology.',
        category: 'speaker',
        publicId: 'seed/expert_panel',
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
        tags: ['panel', 'discussion', 'experts'],
        isFeatured: true
    },
    {
        title: 'Networking Session',
        description: 'Participants networking during the coffee break.',
        category: 'networking',
        publicId: 'seed/networking',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
        tags: ['networking', 'coffee', 'break'],
        isFeatured: false
    },
    {
        title: 'Hackathon Winners',
        description: 'The winning team of the Embedded Systems Hackathon.',
        category: 'event',
        publicId: 'seed/hackathon_winners',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
        tags: ['hackathon', 'winners', 'team'],
        isFeatured: true
    },
    {
        title: 'Conference Venue',
        description: 'The beautiful venue hosting Semiconductor Summit.',
        category: 'venue',
        publicId: 'seed/venue',
        url: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=400',
        tags: ['venue', 'conference', 'hall'],
        isFeatured: false
    }
];

const announcementsData = [
    {
        title: 'Registration Now Open!',
        content: 'We are excited to announce that registration for Semiconductor Summit 2.0 is now open. Register before 10 March 2026 to secure your spot!',
        date: '2026-02-21',
        role: 'faculty'
    },
    {
        title: 'Workshop Schedule Released',
        content: 'The detailed workshop schedule has been released. Choose between the RTL to GDS II Flow or FPGA Interfacing Workshop on Day 1 (17 March 2026).',
        date: '2026-02-21',
        role: 'faculty'
    },
    {
        title: 'Expert Speakers Confirmed for Summit',
        content: 'We are thrilled to confirm expert speakers for the Panel Discussion (Day 1), Expert Insights: VLSI vs Embedded (Day 2), and Impact of AI in VLSI talk (Day 3). Stay tuned!',
        date: '2026-02-21',
        role: 'faculty'
    }
];

// ============================================
// SEEDER FUNCTIONS
// ============================================

async function connectDB() {
    log.info('Connecting to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI);
        log.success(`Connected to MongoDB: ${MONGODB_URI.replace(/\/\/.*:.*@/, '//<credentials>@')}`);
    } catch (error) {
        log.error(`Failed to connect: ${error.message}`);
        process.exit(1);
    }
}

async function clearCollections() {
    if (isFresh) {
        log.warn('Dropping all collections (--fresh mode)...');

        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const collection of collections) {
            await mongoose.connection.db.dropCollection(collection.name);
            log.info(`  Dropped: ${collection.name}`);
        }
        log.success('All collections cleared');
    }
}

async function seedUsersCollection() {
    log.title('📦 Seeding Users');

    let created = 0;
    let skipped = 0;

    for (const userData of usersData) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                log.warn(`  Skipped (exists): ${userData.email}`);
                skipped++;
                continue;
            }

            // Create user - password will be hashed by the User model's pre-save hook
            const user = new User(userData);

            await user.save();
            log.success(`  Created: ${userData.name} (${userData.email}) - ${userData.role}`);
            created++;

        } catch (error) {
            log.error(`  Failed to create ${userData.email}: ${error.message}`);
        }
    }

    log.info(`Users: ${created} created, ${skipped} skipped`);
}

async function seedGalleryCollection() {
    log.title('🖼️  Seeding Gallery');

    let created = 0;
    let skipped = 0;

    // Get a faculty user to set as uploader
    const faculty = await User.findOne({ role: 'faculty' });

    for (const imageData of galleryData) {
        try {
            // Check if image with same title exists
            const existingImage = await Gallery.findOne({ title: imageData.title });

            if (existingImage) {
                log.warn(`  Skipped (exists): ${imageData.title}`);
                skipped++;
                continue;
            }

            // Create gallery entry
            const image = new Gallery({
                ...imageData,
                uploadedBy: faculty?._id
            });

            await image.save();
            log.success(`  Created: ${imageData.title} (${imageData.category})`);
            created++;

        } catch (error) {
            log.error(`  Failed to create ${imageData.title}: ${error.message}`);
        }
    }

    log.info(`Gallery: ${created} created, ${skipped} skipped`);
}

async function seedAnnouncementsCollection() {
    log.title('📢 Seeding Announcements');

    let created = 0;
    let skipped = 0;

    // Get a faculty user to set as author
    const faculty = await User.findOne({ role: 'faculty' });

    for (const announcementData of announcementsData) {
        try {
            // Check if announcement with same title exists
            const existingAnnouncement = await Announcement.findOne({ title: announcementData.title });

            if (existingAnnouncement) {
                log.warn(`  Skipped (exists): ${announcementData.title}`);
                skipped++;
                continue;
            }

            // Create announcement
            const announcement = new Announcement({
                ...announcementData,
                postedBy: faculty?._id
            });

            await announcement.save();
            log.success(`  Created: ${announcementData.title}`);
            created++;

        } catch (error) {
            log.error(`  Failed to create ${announcementData.title}: ${error.message}`);
        }
    }

    log.info(`Announcements: ${created} created, ${skipped} skipped`);
}

async function printSummary() {
    log.title('📊 Database Summary');

    const userCount = await User.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    const announcementCount = await Announcement.countDocuments();

    console.log(`  Users:         ${userCount}`);
    console.log(`  Gallery:       ${galleryCount}`);
    console.log(`  Announcements: ${announcementCount}`);

    log.title('🔐 Demo Credentials');
    console.log('  ┌────────────────────────────────────────────────────┐');
    console.log('  │  Role         │  Email                │  Password │');
    console.log('  ├────────────────────────────────────────────────────┤');
    console.log('  │  Faculty      │  faculty@demo.com     │  demo123  │');
    console.log('  │  Coordinator  │  coordinator@demo.com │  demo123  │');
    console.log('  │  Participant  │  participant@demo.com │  demo123  │');
    console.log('  │  Pending      │  pending@demo.com     │  demo123  │');
    console.log('  └────────────────────────────────────────────────────┘');
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
    console.log('\n');
    log.title('🌱 Semiconductor Summit 2.0 - Database Seeder');
    console.log('─'.repeat(50));

    try {
        await connectDB();
        await clearCollections();

        if (seedUsers) await seedUsersCollection();
        if (seedGallery) await seedGalleryCollection();
        if (seedAnnouncements) await seedAnnouncementsCollection();

        await printSummary();

        log.success('\n✨ Seeding completed successfully!\n');

    } catch (error) {
        log.error(`Seeding failed: ${error.message}`);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        log.info('Database connection closed');
        process.exit(0);
    }
}

main();
