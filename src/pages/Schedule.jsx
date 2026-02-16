import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, Clock, MapPin, Users, Award, Zap, Lightbulb, Cpu, Code,
    Trophy, Target, X, ChevronRight, ArrowRight,
    CheckCircle, Star, Sparkles, AlertTriangle, BookOpen,
    Coffee, UtensilsCrossed, Mic, PartyPopper, ZoomIn
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './Schedule.css';

// ─── IMAGE MAPPING ─────────────────────────────────
const EVENT_IMAGES = {
    'panel-discussion': '/images/panel discussion event.png',
    'rtl-gds-workshop': '/images/Hands on Workshop.png',
    'verilog-fpga-workshop': '/images/Hands on workshop-2.png',
    'embedded-vlsi': '/images/event description.png',
    'silicon-shark-tank': '/images/Silicon Shark Tank.png',
    'wafer-chip-demo': '/images/Stall Visit.png',
    'ai-vlsi': '/images/Al in VLSI.png',
    'silicon-jackpot': '/images/The Silicon Jackpot.png',
    'tech-engagement': '/images/event description.png',
    'gallery-walk': '/images/Silent Silicon Gallery.png',
};

// ─── ICON MAP ──────────────────────────────────────
const ICON_MAP = {
    'panel-discussion': Users,
    'rtl-gds-workshop': Code,
    'verilog-fpga-workshop': Cpu,
    'embedded-vlsi': Lightbulb,
    'silicon-shark-tank': Trophy,
    'wafer-chip-demo': Zap,
    'gallery-walk': Award,
    'ai-vlsi': Target,
    'silicon-jackpot': Award,
    'tech-engagement': Zap,
};

// ─── COMPLETE EVENT DATA (clickable events with cards) ──────
const EVENTS_DATA = [
    {
        id: 'panel-discussion',
        name: 'Fabless Startups and Fabless MSMEs',
        subtitle: 'Amazing Semiconductor Growth',
        tagline: 'Shaping the Future of Silicon',
        description: 'Panel discussion on fabless startups and MSMEs in semiconductor industry',
        fullDescription: 'Join industry leaders for an insightful panel discussion on the rise of fabless startups and MSMEs in the semiconductor ecosystem. Explore business models, challenges, opportunities, and the future of fabless semiconductor companies in India.',
        day: 'Day 1',
        date: 'March 17, 2026',
        weekday: 'Tuesday',
        time: '11:30 AM – 12:30 PM',
        venue: 'Seminar Hall, First Floor, EC Department (A6 Building)',
        category: 'Panel Discussion',
        color: '#3b82f6',
        highlights: [
            'Fabless business model insights',
            'Startup ecosystem in semiconductors',
            'MSME opportunities and challenges',
            'Industry expert panel',
            'Interactive Q&A session'
        ],
        rules: [
            'Open to all registered participants',
            'Questions can be submitted during the session',
            'Active participation is encouraged'
        ],
        prerequisites: 'None – Open to all'
    },
    {
        id: 'rtl-gds-workshop',
        name: 'RTL to GDS II (Open Source)',
        tagline: 'Ready to Design Your Own Chip?',
        description: 'Hands-on workshop on the complete RTL to GDS II flow using open-source EDA tools',
        fullDescription: 'Learn the complete chip design flow from RTL (Register Transfer Level) to GDSII using cutting-edge open-source EDA tools. This hands-on workshop covers the entire ASIC design flow including synthesis, place and route, and verification.',
        day: 'Day 1',
        date: 'March 17, 2026',
        weekday: 'Tuesday',
        time: '01:30 PM – 04:30 PM',
        venue: 'Seminar Hall, First Floor, EC Department (A6 Building)',
        category: 'Hands-on Workshop',
        color: '#8b5cf6',
        highlights: [
            'Complete RTL to GDSII flow',
            'Open-source EDA tools (OpenROAD, Yosys)',
            'Synthesis and Place & Route',
            'Timing analysis and verification',
            'Hands-on practical sessions'
        ],
        rules: [
            'Restricted to Final Year and Pre-Final Year students',
            'Bring your own laptop with required software pre-installed',
            'Basic Verilog knowledge is mandatory'
        ],
        prerequisites: 'Basic knowledge of digital design, Verilog (for 6th semester students)'
    },
    {
        id: 'verilog-fpga-workshop',
        name: 'Getting Started with Verilog and FPGA',
        tagline: 'Concepts Become Circuits',
        description: 'Hands-on workshop for beginners covering Verilog HDL fundamentals and FPGA programming',
        fullDescription: 'Perfect for beginners! Learn the fundamentals of Verilog HDL and FPGA development. This hands-on workshop covers Verilog syntax, combinational and sequential logic, and implementing designs on real FPGA hardware.',
        day: 'Day 1',
        date: 'March 17, 2026',
        weekday: 'Tuesday',
        time: '01:30 PM – 04:30 PM',
        venue: 'Lab No: 231, First Floor, EC Department (A6 Building)',
        category: 'Hands-on Workshop',
        color: '#8b5cf6',
        highlights: [
            'Verilog HDL fundamentals',
            'Combinational and sequential circuits',
            'FPGA architecture basics',
            'Hands-on FPGA programming',
            'Real hardware implementation'
        ],
        rules: [
            'Restricted to First and Second Year students only',
            'Bring your own laptop',
            'No prior Verilog experience needed'
        ],
        prerequisites: 'Basic digital electronics knowledge (for 3rd/4th semester students)'
    },
    {
        id: 'embedded-vlsi',
        name: 'Embedded vs VLSI — What Should I Choose?',
        tagline: 'Navigate Your Career Path',
        description: 'Career guidance session on choosing between embedded systems and VLSI',
        fullDescription: 'Confused about choosing between embedded systems and VLSI career paths? This insight session provides comprehensive guidance on both domains — career prospects, required skills, industry trends, and how to make the right choice based on your interests and strengths.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '09:45 AM – 11:00 AM',
        venue: 'Seminar Hall, EC Department (A6 Building)',
        category: 'Insight Session',
        color: '#f59e0b',
        highlights: [
            'Career path comparison',
            'Industry demand and trends',
            'Required skill sets for each domain',
            'Job roles and opportunities',
            'Expert career guidance'
        ],
        rules: [
            'Open to all registered participants',
            'Especially valuable for 2nd and 3rd year students',
            'Bring your questions about career paths'
        ],
        prerequisites: 'None – Especially valuable for 2nd and 3rd year students'
    },
    {
        id: 'silicon-shark-tank',
        name: 'Silicon Shark Tank',
        tagline: 'Think. Prepare. Pitch. Convince.',
        description: 'Industry-interactive innovation and idea-pitching event with live presentations to expert jury',
        fullDescription: 'Silicon Shark Tank is an industry-interactive innovation and idea-pitching event designed to nurture entrepreneurial thinking, system-level design approaches, and strong problem-solving skills among engineering students. The event simulates a real-world industry pitch environment where participants experience how technical ideas are evaluated by professionals from semiconductor, VLSI, embedded systems, FPGA, and hardware–software co-design domains.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '12:30 PM – 04:30 PM',
        venue: 'Seminar Hall, First Floor, EC Department (A6 Building)',
        category: 'Industry-Driven Idea Pitching',
        color: '#ef4444',
        highlights: [
            'Pitch innovative semiconductor ideas to industry experts',
            'Real-world industry pitch simulation',
            'Internship opportunities for selected teams',
            'Industry mentorship and guidance',
            'Technical feedback for idea refinement'
        ],
        themes: [
            'Semiconductor Design & Technology',
            'VLSI Design (RTL to GDS, Physical Design, Verification)',
            'Embedded Systems & FPGA-based Solutions',
            'Hardware–Software Co-Design',
            'AI / ML Accelerators & Edge Computing',
            'Low-Power & High-Performance Design',
            'Semiconductor Manufacturing Challenges',
            'EDA Tools, Automation & Innovation',
            'Smart Electronic & System-Level Solutions'
        ],
        eventStructure: [
            {
                round: 'Round 1: Idea Submission (Screening Round)',
                details: [
                    'Idea submission must be original — AI-generated content is strictly not allowed',
                    'Word limit: Maximum 200 words',
                    'Must include: Problem statement, existing system loopholes, proposed solution, application/use-case, innovation aspect, technical domain (VLSI-focused)',
                    'Supporting visuals (block diagram, mind map, or execution flow) required',
                    'Ideas must be plagiarism-free',
                    'Outcome: Shortlisting of teams for Round 2'
                ]
            },
            {
                round: 'Round 2: Live Pitch to Industry Experts',
                details: [
                    'Shortlisted teams present live before an expert jury',
                    'Pitch Duration: 10 minutes per team (7 min presentation + 3 min Q&A)',
                    'Use slides, block diagrams, or system architecture',
                    'Working demo is not mandatory'
                ]
            }
        ],
        judgingCriteria: [
            { criteria: 'Problem Relevance', marks: 8 },
            { criteria: 'Technical Depth', marks: 10 },
            { criteria: 'Innovation & Originality', marks: 10 },
            { criteria: 'Feasibility', marks: 8 },
            { criteria: 'Application Impact', marks: 5 },
            { criteria: 'Presentation & Communication', marks: 5 },
            { criteria: 'Q&A Handling', marks: 4 },
        ],
        rules: [
            'Team size: Maximum 2 students per team',
            'Cross-department teams are allowed and encouraged',
            'Each team must nominate one Team Leader for official communication',
            'Ideas must be original and not copied from existing products or published projects',
            'Reference to existing research is allowed with clear mention of innovation',
            'AI-generated ideas and plagiarized content will lead to immediate disqualification',
            'Strict adherence to time limits is mandatory',
            'Professional and ethical conduct is expected at all stages',
            'No financial funding or cash prize will be provided',
            'Organizers reserve the right to modify rules if required'
        ],
        certificates: [
            'Participation certificates for all eligible participants',
            'Excellence / Shortlisting certificates for selected teams'
        ],
        prerequisites: 'Open to undergraduate and postgraduate engineering students. Prepare your idea submission.'
    },
    {
        id: 'wafer-chip-demo',
        name: 'Wafer to Chip Demonstration by Monk9',
        tagline: 'From Sand to Silicon',
        description: 'Live demonstration of semiconductor manufacturing — from wafer fabrication to final chip',
        fullDescription: 'Witness the complete semiconductor manufacturing journey from wafer to chip! Monk9 Technologies presents a live demonstration showcasing the intricate steps of chip fabrication, packaging, and testing. A rare opportunity to see the hardware side of semiconductors up close.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '12:30 PM – 04:30 PM',
        venue: 'Left Side Lawn, Ground Floor, EC Department (A6 Building)',
        category: 'Stall Visit & Demo',
        color: '#10b981',
        highlights: [
            'Live chip manufacturing demonstration',
            'Wafer fabrication process explained',
            'Packaging and testing stages',
            'Industry equipment showcase',
            'Interactive Q&A with Monk9 team'
        ],
        rules: [
            'Open to all registered participants',
            'Follow safety guidelines at the stall',
            'Do not touch equipment without permission'
        ],
        prerequisites: 'None – Open to all'
    },
    {
        id: 'gallery-walk',
        name: 'Silent Silicon Ideas Gallery Walk',
        tagline: 'Ideas Shaped in Silicon',
        description: 'Exhibition of student projects, research posters, and semiconductor innovations',
        fullDescription: 'Explore innovative projects and ideas from students and participants! The Silent Silicon Ideas Gallery showcases creative semiconductor projects, research posters, and innovative designs. Walk through a gallery where ideas become insight and creativity meets silicon.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '12:30 PM – 04:30 PM',
        venue:'EC Department (A6 Building)',
        category: 'Gallery Walk & Exhibition',
        color: '#06b6d4',
        highlights: [
            'Student project exhibitions',
            'Innovative chip design showcases',
            'Research poster presentations',
            'Peer learning opportunities',
            'Networking with innovators'
        ],
        rules: [
            'Open to all participants and exhibitors',
            'Exhibitors must set up posters by 12:00 PM',
            'Maintain silence during the gallery walk'
        ],
        prerequisites: 'None – Open to all participants and exhibitors'
    },
    {
        id: 'ai-vlsi',
        name: 'AI in VLSI: Will it Change or Replace the VLSI Engineer?',
        tagline: 'Transforming the Engineer — Not Replacing Them',
        description: 'Exploring the impact of AI on VLSI design and engineering careers',
        fullDescription: 'Explore how artificial intelligence is transforming VLSI design. Will AI replace VLSI engineers or become a powerful tool? This session discusses AI-driven EDA tools, machine learning in chip design, and the future role of VLSI engineers in an AI-enhanced world.',
        day: 'Day 3',
        date: 'March 19, 2026',
        weekday: 'Thursday',
        time: '09:45 AM – 11:00 AM',
        venue: 'Seminar Hall, EC Department (A6 Building)',
        category: 'Insight Session',
        color: '#f59e0b',
        highlights: [
            'AI in chip design workflows',
            'Machine-learning-driven EDA tools',
            'Future of VLSI engineering careers',
            'Human-AI collaboration in design',
            'Industry perspectives and Q&A'
        ],
        rules: [
            'Open to all registered participants',
            'Q&A session at the end',
            'Career guidance included'
        ],
        prerequisites: 'None – Open to all'
    },
    {
        id: 'silicon-jackpot',
        name: 'The Silicon Jackpot',
        subtitle: 'Technical Treasure Hunt',
        tagline: 'Solve the Logic · Trace the Circuit · Find the Treasure',
        description: 'Thrilling technical treasure hunt with semiconductor-themed challenges',
        fullDescription: 'Embark on an exciting technical treasure hunt! Solve semiconductor-related technical puzzles, crack codes, and complete challenges to find the treasure. Test your knowledge, teamwork, and problem-solving skills in this thrilling campus-wide competition.',
        day: 'Day 3',
        date: 'March 19, 2026',
        weekday: 'Thursday',
        time: '12:10 PM – 03:30 PM',
        venue: 'Foyer, EC Department (A6 Building)',
        category: 'Technical Treasure Hunt',
        color: '#ec4899',
        highlights: [
            'Semiconductor-themed puzzles',
            'Team-based campus-wide competition',
            'Aptitude + Basic Digital Logic rounds',
            'Live Aptitude, Digital & Verilog on FPGA',
            'Exciting prizes for winners'
        ],
        rules: [
            'Form teams of 3–4 members',
            'Solve questions → Collect flags to advance',
            'All team members must be registered participants',
            'Use of mobile phones for internet search is prohibited during rounds'
        ],
        prerequisites: 'Form teams of 3–4 members before the event'
    },
    {
        id: 'tech-engagement',
        name: 'Interactive Technical Engagement Activities',
        subtitle: 'Problem-Solving Challenges & Tech Games',
        tagline: 'Learn. Play. Innovate.',
        description: 'Fun technical games and problem-solving challenges for all participants',
        fullDescription: 'Participate in a variety of technical challenges and tech games! From circuit debugging to algorithm challenges, these interactive activities combine learning with fun. Perfect for applying your technical knowledge in creative and competitive ways.',
        day: 'Day 3',
        date: 'March 19, 2026',
        weekday: 'Thursday',
        time: '12:10 PM – 03:30 PM',
        venue: 'Activity Zones, EC Department (A6 Building)',
        category: 'Problem-Solving Challenges',
        color: '#14b8a6',
        highlights: [
            'Technical games and challenges',
            'Circuit debugging activities',
            'Algorithmic problem solving',
            'Interactive learning experiences',
            'Individual and team competitions'
        ],
        rules: [
            'Open to all registered participants',
            'Individual and team events available',
            'Follow coordinator instructions at each station'
        ],
        prerequisites: 'None – Open to all'
    }
];

// ─── FULL SCHEDULE WITH BREAKS ─────────────────────
// type: 'event' → clickable, opens modal
// type: 'break' → not clickable, simple display
// type: 'ceremony' → clickable but no poster modal, just info
const FULL_SCHEDULE = {
    'Day 1': [
        { type: 'break', time: '09:15 AM – 10:30 AM', title: 'Welcome of Guests & Refreshments ☕', icon: Coffee, color: '#22c55e' },
        { type: 'ceremony', time: '10:30 AM – 10:40 AM', title: 'Address by the Principal', icon: Mic, color: '#3b82f6', venue: 'Seminar Hall, First Floor, EC Department (A6 Building)', description: 'Welcome address by the Principal of CSPIT, CHARUSAT.' },
        { type: 'ceremony', time: '10:45 AM – 10:50 AM', title: 'Address by the Provost & Registrar', icon: Mic, color: '#3b82f6', venue: 'Seminar Hall, First Floor, EC Department (A6 Building)', description: 'Address by the Provost and Registrar of CHARUSAT.' },
        { type: 'ceremony', time: '10:50 AM – 11:30 AM', title: 'Inaugural Talk', icon: Mic, color: '#8b5cf6', venue: 'Seminar Hall, First Floor, EC Department (A6 Building)', description: 'The inaugural keynote talk of Semiconductor Summit 2.0, setting the stage for three days of learning, innovation, and industry interaction.' },
        { type: 'event', eventId: 'panel-discussion' },
        { type: 'break', time: '12:30 PM – 01:30 PM', title: 'Lunch Break and Networking 🍽️', icon: UtensilsCrossed, color: '#f97316' },
        { type: 'event', eventId: 'rtl-gds-workshop' },
        { type: 'event', eventId: 'verilog-fpga-workshop' },
    ],
    'Day 2': [
        { type: 'break', time: '09:00 AM – 09:30 AM', title: 'Refreshment ☕', icon: Coffee, color: '#a78bfa' },
        { type: 'event', eventId: 'embedded-vlsi' },
        { type: 'break', time: '11:00 AM – 12:10 PM', title: 'Lunch Break and Networking 🍽️', icon: UtensilsCrossed, color: '#f97316' },
        { type: 'event', eventId: 'silicon-shark-tank' },
        { type: 'event', eventId: 'wafer-chip-demo' },
        { type: 'event', eventId: 'gallery-walk' },
    ],
    'Day 3': [
        { type: 'break', time: '09:00 AM – 09:30 AM', title: 'Refreshment ☕', icon: Coffee, color: '#a78bfa' },
        { type: 'event', eventId: 'ai-vlsi' },
        { type: 'break', time: '11:00 AM – 12:00 Noon', title: 'Lunch Break and Networking 🍽️', icon: UtensilsCrossed, color: '#f97316' },
        { type: 'event', eventId: 'silicon-jackpot' },
        { type: 'event', eventId: 'tech-engagement' },
        { type: 'ceremony', time: '03:30 PM – 04:30 PM', title: 'Awards & Closing Ceremony 🏆', icon: PartyPopper, color: '#f59e0b', venue: 'Seminar Hall, EC Department (A6 Building)', description: 'The grand closing ceremony featuring prize distribution, certificates, recognition of outstanding participants, and a summary of the summit highlights.' },
    ],
};

// Build an events lookup
const EVENTS_MAP = {};
EVENTS_DATA.forEach(ev => { EVENTS_MAP[ev.id] = ev; });

// ─── DAY INFO ──────────────────────────────────────
const DAYS = [
    { id: 'Day 1', label: 'Day 1', date: 'March 17', weekday: 'Tuesday', color: '#3b82f6' },
    { id: 'Day 2', label: 'Day 2', date: 'March 18', weekday: 'Wednesday', color: '#8b5cf6' },
    { id: 'Day 3', label: 'Day 3', date: 'March 19', weekday: 'Thursday', color: '#ec4899' },
];

// ─── FULLSCREEN IMAGE VIEWER ───────────────────────
const ImageViewer = ({ src, alt, onClose }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div
            className="image-viewer-overlay"
            ref={overlayRef}
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            <button className="image-viewer-close" onClick={onClose} aria-label="Close image">
                <X size={24} />
            </button>
            <div className="image-viewer-container">
                <img src={src} alt={alt} className="image-viewer-img" />
            </div>
        </div>
    );
};


// ─── EVENT MODAL ───────────────────────────────────
const EventModal = ({ event, onClose }) => {
    const overlayRef = useRef(null);
    const [viewingImage, setViewingImage] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e) => {
            if (viewingImage) {
                setViewingImage(false);
            } else {
                e.key === 'Escape' && onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose, viewingImage]);

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (!event) return null;

    const totalMarks = event.judgingCriteria
        ? event.judgingCriteria.reduce((sum, c) => sum + c.marks, 0)
        : 0;

    const posterSrc = EVENT_IMAGES[event.id];

    return (
        <>
            <div className="ev-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
                <div className="ev-modal">
                    {/* Close */}
                    <button className="ev-modal-close" onClick={onClose} aria-label="Close">
                        <X size={22} />
                    </button>

                    {/* Poster — clickable for full-screen */}
                    {posterSrc && (
                        <div
                            className="ev-modal-poster"
                            onClick={() => setViewingImage(true)}
                            title="Click to view full image"
                        >
                            <img src={posterSrc} alt={event.name} />
                            <div className="ev-modal-poster-fade" />
                            <span className="ev-modal-category" style={{ background: event.color }}>
                                {event.category}
                            </span>
                            <div className="ev-modal-poster-zoom">
                                <ZoomIn size={20} />
                                <span>View Full Image</span>
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div className="ev-modal-body">
                        {/* Header */}
                        <div className="ev-modal-header">
                            <div className="ev-modal-day-badge" style={{ borderColor: event.color, color: event.color }}>
                                {event.day} · {event.date} ({event.weekday})
                            </div>
                            {event.tagline && <p className="ev-modal-tagline">"{event.tagline}"</p>}
                            <h2 className="ev-modal-title">{event.name}</h2>
                            {event.subtitle && <p className="ev-modal-subtitle">{event.subtitle}</p>}
                        </div>

                        {/* Meta bar */}
                        <div className="ev-modal-meta">
                            <div className="ev-modal-meta-item">
                                <Clock size={16} />
                                <span>{event.time}</span>
                            </div>
                            <div className="ev-modal-meta-item">
                                <MapPin size={16} />
                                <span>{event.venue}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="ev-modal-desc">
                            <p>{event.fullDescription}</p>
                        </div>

                        {/* Themes (Shark Tank) */}
                        {event.themes && (
                            <div className="ev-modal-section">
                                <h3><BookOpen size={18} /> Themes & Focus Areas</h3>
                                <div className="ev-modal-themes">
                                    {event.themes.map((theme, i) => (
                                        <span key={i} className="ev-theme-tag">{theme}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Event Structure (Shark Tank) */}
                        {event.eventStructure && (
                            <div className="ev-modal-section">
                                <h3><Star size={18} /> Event Structure</h3>
                                {event.eventStructure.map((round, i) => (
                                    <div key={i} className="ev-round-block">
                                        <h4>🔹 {round.round}</h4>
                                        <ul>
                                            {round.details.map((d, j) => (
                                                <li key={j}>
                                                    <ChevronRight size={14} />
                                                    <span>{d}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Judging Criteria (Shark Tank) */}
                        {event.judgingCriteria && (
                            <div className="ev-modal-section">
                                <h3><Trophy size={18} /> Judging Criteria</h3>
                                <div className="ev-judging-table">
                                    <div className="ev-judging-header">
                                        <span>Criteria</span>
                                        <span>Marks</span>
                                    </div>
                                    {event.judgingCriteria.map((c, i) => (
                                        <div key={i} className="ev-judging-row">
                                            <span>{c.criteria}</span>
                                            <span className="ev-judging-marks">{c.marks}</span>
                                        </div>
                                    ))}
                                    <div className="ev-judging-total">
                                        <span>Total</span>
                                        <span>{totalMarks} Marks</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Highlights */}
                        <div className="ev-modal-section">
                            <h3><Star size={18} /> What You'll Experience</h3>
                            <ul className="ev-modal-highlights">
                                {event.highlights.map((h, i) => (
                                    <li key={i}>
                                        <CheckCircle size={15} />
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Rules */}
                        {event.rules && event.rules.length > 0 && (
                            <div className="ev-modal-section ev-modal-rules-section">
                                <h3><AlertTriangle size={18} /> Rules & Guidelines</h3>
                                <ul className="ev-modal-rules-list">
                                    {event.rules.map((r, i) => (
                                        <li key={i}>
                                            <ChevronRight size={14} />
                                            <span>{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Certificates (Shark Tank) */}
                        {event.certificates && (
                            <div className="ev-modal-section ev-modal-certs">
                                <h3><Award size={18} /> Certificates & Recognition</h3>
                                <ul className="ev-modal-highlights">
                                    {event.certificates.map((c, i) => (
                                        <li key={i}>
                                            <CheckCircle size={15} />
                                            <span>{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Prerequisites */}
                        {event.prerequisites && (
                            <div className="ev-modal-prereq">
                                <strong>Prerequisites:</strong> {event.prerequisites}
                            </div>
                        )}

                        {/* CTA */}
                        <Link to="/register" className="ev-modal-cta" onClick={onClose}>
                            Register Now <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Viewer */}
            {viewingImage && posterSrc && (
                <ImageViewer
                    src={posterSrc}
                    alt={event.name}
                    onClose={() => setViewingImage(false)}
                />
            )}
        </>
    );
};

// ─── CEREMONY INFO MODAL (for inauguration, valedictory, etc.) ───
const CeremonyModal = ({ item, onClose }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!item) return null;
    const IconComp = item.icon || Mic;

    return (
        <div className="ev-modal-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && onClose()}>
            <div className="ev-modal ev-modal-compact">
                <button className="ev-modal-close" onClick={onClose} aria-label="Close">
                    <X size={22} />
                </button>
                <div className="ev-modal-body">
                    <div className="ceremony-modal-icon" style={{ borderColor: item.color, color: item.color }}>
                        <IconComp size={36} />
                    </div>
                    <h2 className="ev-modal-title" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                        {item.title}
                    </h2>
                    <div className="ev-modal-meta" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div className="ev-modal-meta-item">
                            <Clock size={16} />
                            <span>{item.time}</span>
                        </div>
                        {item.venue && (
                            <div className="ev-modal-meta-item">
                                <MapPin size={16} />
                                <span>{item.venue}</span>
                            </div>
                        )}
                    </div>
                    {item.description && (
                        <div className="ev-modal-desc" style={{ textAlign: 'center' }}>
                            <p>{item.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// ─── MAIN EVENTS PAGE ─────────────────────────────
const Schedule = () => {
    const [selectedDay, setSelectedDay] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedCeremony, setSelectedCeremony] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Count actual events (not breaks) per day
    const getEventCount = (dayId) => {
        const schedule = FULL_SCHEDULE[dayId] || [];
        return schedule.filter(item => item.type === 'event').length;
    };

    const getTotalItems = (dayId) => {
        return (FULL_SCHEDULE[dayId] || []).length;
    };

    return (
        <div className="events-page">
            <Navbar />

            {/* Hero */}
            <section className={`events-hero ${isLoaded ? 'loaded' : ''}`}>
                <div className="events-hero-bg">
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    <div className="hero-grid" />
                    <ParticleField count={30} />
                </div>
                <div className="events-hero-content">
                    <span className="events-tag">
                        <Sparkles size={14} /> ALL 10 EVENTS • ₹299 ONLY
                    </span>
                    <h1>Event <span className="text-gradient">Schedule</span></h1>
                    <p>Semiconductor Summit 2.0 · March 17–19, 2026 · CHARUSAT</p>
                </div>
            </section>

            {/* Main Schedule Section with Background */}
            <section className="schedule-main-section">
                <div className="schedule-section-bg">
                    <div className="schedule-section-grid" />
                    <div className="schedule-section-glow schedule-section-glow-center" />
                    <ParticleField count={40} />
                </div>
                <div className="events-container">
                {/* Day Filter Tabs */}
                <div className="day-tabs">
                    <button
                        className={`day-tab ${selectedDay === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedDay('all')}
                    >
                        <span className="tab-label">All Days</span>
                        <span className="tab-count">{EVENTS_DATA.length}</span>
                    </button>
                    {DAYS.map(day => {
                        const eventCount = getEventCount(day.id);
                        return (
                            <button
                                key={day.id}
                                className={`day-tab ${selectedDay === day.id ? 'active' : ''}`}
                                onClick={() => setSelectedDay(day.id)}
                                style={{ '--tab-accent': day.color }}
                            >
                                <span className="tab-label">{day.label}</span>
                                <span className="tab-date">{day.date} ({day.weekday})</span>
                                <span className="tab-count">{eventCount} events</span>
                            </button>
                        );
                    })}
                </div>

                {/* Schedule Timeline */}
                {(selectedDay === 'all' ? DAYS : DAYS.filter(d => d.id === selectedDay)).map(day => {
                    const scheduleItems = FULL_SCHEDULE[day.id] || [];
                    if (scheduleItems.length === 0) return null;

                    return (
                        <div key={day.id} className="schedule-day">
                            {/* Day header */}
                            <div className="schedule-day-header" style={{ '--day-color': day.color }}>
                                <div className="schedule-day-badge">
                                    <Calendar size={18} />
                                    <span className="schedule-day-label">{day.label}</span>
                                </div>
                                <span className="schedule-day-date">{day.date}, 2026 · {day.weekday}</span>
                                <span className="schedule-day-count">
                                    {getEventCount(day.id)} events · {getTotalItems(day.id)} activities
                                </span>
                            </div>

                            {/* Timeline items */}
                            <div className="schedule-timeline">
                                {scheduleItems.map((item, idx) => {
                                    // ─── BREAK ITEM (non-clickable) ───
                                    if (item.type === 'break') {
                                        const BreakIcon = item.icon || Coffee;
                                        return (
                                            <div
                                                key={`break-${idx}`}
                                                className="schedule-item schedule-break"
                                                style={{ '--item-color': item.color, animationDelay: `${idx * 0.06}s` }}
                                            >
                                                <div className="schedule-time">
                                                    <span className="schedule-time-text">{item.time}</span>
                                                </div>
                                                <div className="schedule-dot-col">
                                                    <div className="schedule-dot schedule-dot-break">
                                                        <BreakIcon size={14} />
                                                    </div>
                                                    {idx < scheduleItems.length - 1 && <div className="schedule-line schedule-line-break" />}
                                                </div>
                                                <div className="schedule-content schedule-break-content">
                                                    <span className="schedule-break-title">{item.title}</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // ─── CEREMONY ITEM (clickable, mini modal) ───
                                    if (item.type === 'ceremony') {
                                        const CeremonyIcon = item.icon || Mic;
                                        return (
                                            <div
                                                key={`ceremony-${idx}`}
                                                className="schedule-item schedule-ceremony"
                                                onClick={() => setSelectedCeremony(item)}
                                                style={{ '--item-color': item.color, animationDelay: `${idx * 0.06}s` }}
                                            >
                                                <div className="schedule-time">
                                                    <span className="schedule-time-text">{item.time}</span>
                                                </div>
                                                <div className="schedule-dot-col">
                                                    <div className="schedule-dot">
                                                        <CeremonyIcon size={14} />
                                                    </div>
                                                    {idx < scheduleItems.length - 1 && <div className="schedule-line" />}
                                                </div>
                                                <div className="schedule-content">
                                                    <span className="schedule-category" style={{ background: `${item.color}15`, color: item.color, borderColor: `${item.color}30` }}>
                                                        Ceremony
                                                    </span>
                                                    <h3 className="schedule-event-name">{item.title}</h3>
                                                    {item.description && <p className="schedule-desc">{item.description}</p>}
                                                    {item.venue && (
                                                        <div className="schedule-venue-row">
                                                            <MapPin size={13} />
                                                            <span>{item.venue}</span>
                                                        </div>
                                                    )}
                                                    <span className="schedule-view-btn">
                                                        View Details <ChevronRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // ─── EVENT ITEM (clickable, full modal) ───
                                    const event = EVENTS_MAP[item.eventId];
                                    if (!event) return null;
                                    const IconComp = ICON_MAP[event.id] || Zap;

                                    return (
                                        <div
                                            key={event.id}
                                            className="schedule-item"
                                            onClick={() => setSelectedEvent(event)}
                                            style={{ '--item-color': event.color, animationDelay: `${idx * 0.06}s` }}
                                        >
                                            {/* Time column */}
                                            <div className="schedule-time">
                                                <span className="schedule-time-text">{event.time}</span>
                                            </div>

                                            {/* Dot & line */}
                                            <div className="schedule-dot-col">
                                                <div className="schedule-dot">
                                                    <IconComp size={14} />
                                                </div>
                                                {idx < scheduleItems.length - 1 && <div className="schedule-line" />}
                                            </div>

                                            {/* Content */}
                                            <div className="schedule-content">
                                                <span className="schedule-category">{event.category}</span>
                                                <h3 className="schedule-event-name">{event.name}</h3>
                                                {event.tagline && <p className="schedule-tagline">{event.tagline}</p>}
                                                <p className="schedule-desc">{event.description}</p>
                                                <div className="schedule-venue-row">
                                                    <MapPin size={13} />
                                                    <span>{event.venue}</span>
                                                </div>
                                                <span className="schedule-view-btn">
                                                    View Details <ChevronRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* CTA */}
                <div className="events-cta-section">
                    <div className="cta-glass">
                        <Sparkles size={32} className="cta-icon" />
                        <h2>Ready to Join the Summit?</h2>
                        <p>Register now for all 10 events — Only ₹299</p>
                        <Link to="/register" className="btn btn-primary btn-large cta-btn">
                            Register Now <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
            </section>

            <Footer />

            {/* Event Modal */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}

            {/* Ceremony Modal */}
            {selectedCeremony && (
                <CeremonyModal
                    item={selectedCeremony}
                    onClose={() => setSelectedCeremony(null)}
                />
            )}
        </div>
    );
};

export default Schedule;
