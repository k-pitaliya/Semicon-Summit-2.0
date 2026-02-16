import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import {
    Cpu, Code, Trophy, Zap, Users, Lightbulb, Target, Award,
    ArrowRight, X, Calendar, Clock, MapPin, IndianRupee, ExternalLink, Eye,
    Sparkles, FileText, Mic2, Gamepad2, GraduationCap, Layers, Brain,
    Filter, CircuitBoard
} from 'lucide-react';
import './Events.css';

const CATEGORIES = [
    {
        id: 'all',
        title: 'All Events',
        icon: Sparkles,
        color: '#22c55e'
    },
    {
        id: 'industry-strategy',
        title: 'Industry & Strategy',
        description: 'High-impact discussions and expert insights.',
        color: '#10b981',
        icon: Mic2
    },
    {
        id: 'workshops',
        title: 'Technical Workshops',
        description: 'Hands-on exposure to VLSI flows.',
        color: '#14b8a6',
        icon: Code
    },
    {
        id: 'innovation',
        title: 'Competitions',
        description: 'Challenges to test your skills.',
        color: '#f59e0b',
        icon: Trophy
    },
    {
        id: 'industry-experience',
        title: 'Industry Info',
        description: 'Real-world demonstrations.',
        color: '#84cc16',
        icon: Zap
    }
];

const EVENTS = [
    // ── Category 1: Industry & Strategy ──
    {
        id: 'fabless-startups',
        categoryId: 'industry-strategy',
        title: 'Fabless Startups & MSMEs',
        subtitle: "Powering India's Semiconductor Growth",
        type: 'Industry Panel',
        icon: Users,
        poster: '/images/panel discussion event.png',
        prize: 'Networking',
        description: "Powering India's Semiconductor Growth. Interact with leading semiconductor innovators and founders driving the fabless revolution.",
        fullDescription: `Fabless Startups & MSMEs
Powering India's Semiconductor Growth

Interact with leading semiconductor innovators and founders driving the fabless revolution.

Get the opportunity to ask your questions directly and explore real industry insights.

This session will address:
• Growth of fabless semiconductor startups in India
• Opportunities and challenges in the MSME ecosystem
• Policy support and industry collaborations
• Talent requirements and future demand
• Building a sustainable semiconductor value chain

Participants will gain insights directly from industry experts shaping the next phase of India’s semiconductor development.`,
        date: 'March 17, 2026',
        time: '11:30 AM - 12:30 PM',
        venue: 'Main Auditorium',
        fee: 'Included',
        rulesUrl: null
    },
    {
        id: 'ai-vlsi',
        categoryId: 'industry-strategy',
        title: 'AI in VLSI',
        subtitle: 'Will It Change the VLSI Engineer?',
        type: 'Expert Insight',
        icon: Brain,
        poster: '/images/Al in VLSI.png',
        prize: 'Knowledge',
        description: 'Artificial Intelligence is reshaping semiconductor design workflows. This session examines how AI-driven EDA tools are redefining the role of VLSI engineers.',
        fullDescription: `Artificial Intelligence is reshaping semiconductor design workflows. This session examines how AI-driven EDA tools, automation in physical design, and intelligent verification systems are redefining the role of VLSI engineers.

Participants will gain clarity on evolving skill requirements and future industry expectations.

A must-attend discussion for students preparing for careers in chip design and automation-driven environments.`,
        date: 'March 19, 2026',
        time: '11:00 AM - 12:00 PM',
        venue: 'Seminar Hall A',
        fee: 'Included',
        rulesUrl: null
    },
    {
        id: 'embedded-vlsi',
        categoryId: 'industry-strategy',
        title: 'Embedded vs VLSI',
        subtitle: 'What Should I Choose?',
        type: 'Career Guidance',
        icon: GraduationCap,
        poster: '/images/expert-1.png',
        prize: 'Career Path',
        description: 'An interactive session designed to help students understand the differences between embedded systems and VLSI domains.',
        fullDescription: `An interactive session designed to help students understand the differences between embedded systems and VLSI domains.

Key discussion points include:
• Core skill requirements
• Industry demand and growth trends
• Learning pathways
• Career progression opportunities

This session aims to provide clarity for students at early academic stages.`,
        date: 'March 18, 2026',
        time: '09:45 AM - 11:00 AM',
        venue: 'Seminar Hall B',
        fee: 'Included',
        rulesUrl: null
    },

    // ── Category 2: Workshops ──
    {
        id: 'rtl-gds',
        categoryId: 'workshops',
        title: 'RTL to GDS II',
        subtitle: 'Open Source ASIC Design Flow',
        type: 'Advanced Workshop',
        icon: Layers,
        poster: '/images/Hands on Workshop.png',
        prize: 'Certificates',
        description: 'Explore the complete open-source ASIC design flow — from RTL design to GDS II generation. Specifically for 3rd and 4th year students.',
        fullDescription: `This advanced, hands-on workshop is specifically designed for 3rd and 4th year students with prior knowledge of digital design and HDL concepts.

Participants will explore the complete open-source ASIC design flow — from RTL design to GDS II generation.

Workshop Coverage:
• RTL design concepts
• Synthesis using open-source tools
• Static timing considerations
• Floorplanning & placement basics
• Routing and layout generation
• Understanding GDS II output

Recommended For: 3rd and 4th year students only.`,
        date: 'March 18, 2026',
        time: 'Full Day (Starts 9 AM)',
        venue: 'Lab Complex 1',
        fee: 'Included',
        rulesUrl: null
    },
    {
        id: 'verilog-fpga',
        categoryId: 'workshops',
        title: 'Verilog & FPGA',
        subtitle: 'Getting Started with Digital Design',
        type: 'Beginner Workshop',
        icon: CircuitBoard,
        poster: '/images/Hands on workshop-2.png',
        prize: 'Certificates',
        description: 'Beginner-friendly workshop covering Verilog programming and basic FPGA-based system development for 1st and 2nd year students.',
        fullDescription: `This beginner-friendly workshop is designed for 1st and 2nd year students who want to build a strong foundation in digital hardware design and FPGA implementation.

Participants will be introduced to Verilog programming and basic FPGA-based system development.

Workshop Coverage:
• Introduction to digital design concepts
• Basics of Verilog HDL
• Writing simple modules
• Simulation fundamentals
• Introduction to FPGA boards
• Running and testing simple hardware designs

Recommended For: 1st and 2nd year students.`,
        date: 'March 18, 2026',
        time: 'Full Day (Starts 9 AM)',
        venue: 'Lab Complex 2',
        fee: 'Included',
        rulesUrl: null
    },

    // ── Category 3: Innovation & Competitions ──
    {
        id: 'shark-tank',
        categoryId: 'innovation',
        title: 'Silicon Shark Tank',
        subtitle: 'Industry-Driven Idea Pitching',
        type: 'Flagship Event',
        icon: Lightbulb,
        poster: '/images/Silicon Shark Tank.png',
        prize: 'Internships',
        description: 'Industry-Driven Idea Pitching. Winners get a FREE Internship Opportunity!',
        fullDescription: `This competition is open to undergraduate engineering students, with a maximum of two members per team. Cross-department participation is encouraged, and each team must nominate one Team Leader for official communication. Teams are required to pitch original, innovation-driven ideas related to Semiconductor Design & Technology, VLSI (RTL to GDS, Physical Design, Verification), Embedded Systems & FPGA-based solutions, Hardware–Software Co-Design, AI/ML Accelerators & Edge Computing, Low-Power and High-Performance Design, Semiconductor Manufacturing Challenges, EDA Tools & Automation, or Smart Electronic/System-Level solutions. AI-generated or plagiarized content is strictly prohibited and may lead to disqualification.
The event consists of two rounds. In Round 1 (Idea Screening), teams must submit an original idea (maximum 200 words) clearly outlining the problem statement, existing system loopholes, proposed solution, application/use-case, innovation aspect, technical domain (VLSI-focused), and a supporting visual such as a block diagram, mind map, or execution flow. Shortlisted teams will advance to Round 2, where they will deliver a 10-minute live pitch (7-minute presentation + 3-minute Q&A) before an expert jury; slides and system architecture diagrams are allowed, while a working demo is not mandatory. Final evaluation will be conducted solely by the expert jury, and their decision will be final and binding. Selected teams will receive internship opportunities (per team), industry mentorship, and technical feedback for idea refinement; however, no cash prize or financial funding will be provided. All eligible participants will receive participation certificates and digital badges, and winners will be awarded a free industry internship. Professional conduct, strict adherence to time limits, and originality are mandatory throughout the competition, and organizers reserve the right to modify rules if required.`,,
        date: 'March 19, 2026',
        time: '09:00 AM - 01:00 PM',
        venue: 'Main Auditorium',
        fee: 'Prize Pool',
        rulesUrl: '/images/SHARK TANK Rules.docx'
    },
    {
        id: 'silicon-jackpot',
        categoryId: 'innovation',
        title: 'The Silicon Jackpot',
        subtitle: 'Decode the Logic. Hunt the Clues. Complete the Silicon.',
        type: 'Competition',
        icon: Target,
        poster: '/images/The Silicon Jackpot.png',
        prize: '₹15,000 Pool',
        description: 'A multi-stage technical treasure challenge testing semiconductor fundamentals and digital systems.',
        fullDescription: `The Silicon Jackpot – "Decode the Logic. Hunt the Clues. Complete the Silicon." is a multi-stage technical treasure challenge designed to test students in semiconductor fundamentals and digital systems through knowledge, speed, collaboration, and practical implementation. The event unfolds across three progressive rounds where participants unlock clues, collect technical flags, and ultimately complete the word VLSI, symbolizing mastery in Very Large Scale Integration.

Round 1, The Silicon Screening – Flag Hunt, is conducted separately for First Year, Second Year, and Third Year students, each receiving curriculum-based technical questions aligned with their academic level. Participants must solve the problem to unlock the first flag containing the letter "V" and a location clue. From each year, the first students to successfully complete the challenge qualify. These qualifiers are then grouped into interdisciplinary teams consisting of one student from each academic year, forming balanced teams. This round evaluates conceptual clarity, speed, accuracy, and individual problem-solving ability.

Round 2, The Logic Conquest – Unified Challenge, brings the 20 teams together at a common location where they face a shared technical problem focused on applied digital logic, analytical reasoning, and teamwork. Upon solving the challenge, teams receive the second flag containing the letter "L" and additional clues to collect the letter "S." Based on accuracy and completion time, only the top teams advance to the final round. This stage assesses collaborative thinking, logical structuring, time management, and technical communication.

Round 3, Kaun Banega Summit Samrat – The FPGA Finale, is a KBC-inspired technical showdown where the top 5 teams compete in an FPGA-based quiz featuring progressively complex digital electronics and Verilog questions. Successful teams collect the final flag containing the letter "I," completing the word VLSI. This finale evaluates practical HDL knowledge, hardware understanding, debugging skills, and performance under pressure. The team that excels across all stages and performs best in the FPGA finale will be crowned the Summit Samrat of Silicon, symbolizing their journey from V → L → S → I and their technical excellence in the semiconductor domain.`,
        date: 'March 19, 2026',
        time: '02:00 PM - 05:00 PM',
        venue: 'Campus Grounds',
        fee: 'Prize Pool',
        rulesUrl: null
    },
    {
        id: 'playzone',
        categoryId: 'innovation',
        title: 'Silicon PlayZone',
        subtitle: 'Technical Game Arena',
        type: 'Interactive',
        icon: Gamepad2,
        poster: '/images/MAIN.png',
        prize: 'Merchandise',
        description: 'Hands-On. Minds-On. A dynamic zone designed to make engineering interactive and engaging.',
        fullDescription: `A dynamic zone designed to make engineering interactive and engaging.

Activities include:
• Spin the Wheel — Technical surprise challenges
• Truth or Dare — Electronics edition
• Join the Circuit — Rapid connection logic challenge
• Mini hardware-based problem-solving tasks`,
        date: 'All Days',
        time: 'Open All Day',
        venue: 'Expo Area',
        fee: 'Included',
        rulesUrl: null
    },
    {
        id: 'ideas-showcase',
        categoryId: 'innovation',
        title: 'Silicon Ideas Showcase',
        subtitle: 'Silent Feedback Edition',
        type: 'Exhibition',
        icon: Eye,
        poster: '/images/Silent Silicon Gallery.png',
        prize: 'Best Idea',
        description: 'Walk Through Innovation. Leave Your Insight. Silent poster exhibition with QR-based digital feedback system.',
        fullDescription: `Silent Silicon — Innovation Gallery Walk

Students present semiconductor and hardware innovation ideas through poster exhibits. Instead of traditional verbal presentations, participants receive structured written feedback from visitors via sticky notes and digital interaction.

Each poster includes a QR code enabling attendees to:
• Access detailed technical explanations
• Submit questions digitally
• Provide structured feedback`,
        date: 'All Days',
        time: 'Open All Day',
        venue: 'Corridor A',
        fee: 'Included',
        rulesUrl: null
    },

    // ── Category 4: Industry Experience ──
    {
        id: 'wafer-chip',
        categoryId: 'industry-experience',
        title: 'Wafer to Chip',
        subtitle: 'Live Demonstration by Monk9',
        type: 'Industry Demo',
        icon: Cpu,
        poster: '/images/Stall Visit.png',
        prize: 'Learning',
        description: 'See How a Chip Comes to Life — From Silicon Wafer to Working Chip. An industry-led demonstration by Monk9.',
        fullDescription: `Wafer to Chip — Live Demonstration by Monk9

An industry-led demonstration offering a complete view of the semiconductor lifecycle — from wafer fabrication concepts to final chip realization.

Conducted by industry experts from Monk9, this session provides participants with real-world insights into:
• Semiconductor fabrication fundamentals
• Chip design and verification workflow
• Industry toolchains and development stages`,
        date: 'March 19, 2026',
        time: 'Late Morning',
        venue: 'Stall Area',
        fee: 'Included',
        rulesUrl: null
    }
];

/* ─── EVENT MODAL (2-Column) ─── */
const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleViewRules = (e) => {
        e.stopPropagation();
        if (event.rulesUrl) window.open(event.rulesUrl, '_blank');
    };

    const category = CATEGORIES.find(c => c.id === event.categoryId);
    const catColor = category?.color || '#22c55e';

    return (
        <div className="ev-modal-overlay" onClick={onClose}>
            <div className="ev-modal-container-2col" onClick={e => e.stopPropagation()}>
                <button className="ev-modal-close-btn" onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>

                {/* Left Column: Poster */}
                <div className="ev-modal-left">
                    <img src={event.poster || 'https://placehold.co/600x800/102030/22c55e?text=No+Poster'} alt={event.title} className="ev-modal-poster-img" />
                    <div className="ev-modal-poster-overlay-grad" />
                </div>

                {/* Right Column: Details */}
                <div className="ev-modal-right">
                    <div className="ev-modal-header-section">
                        <span className="ev-modal-badge" style={{ borderColor: catColor, color: catColor }}>{event.type}</span>
                        <h2 className="ev-modal-title">{event.title}</h2>
                        <h3 className="ev-modal-subtitle" style={{ color: catColor }}>{event.subtitle}</h3>
                    </div>

                    <div className="ev-modal-info-grid">
                        <div className="ev-modal-info-box">
                            <Calendar size={18} className="ev-icon" />
                            <div>
                                <span className="ev-label">Date</span>
                                <span className="ev-value">{event.date}</span>
                            </div>
                        </div>
                        <div className="ev-modal-info-box">
                            <Clock size={18} className="ev-icon" />
                            <div>
                                <span className="ev-label">Time</span>
                                <span className="ev-value">{event.time}</span>
                            </div>
                        </div>
                        <div className="ev-modal-info-box">
                            <MapPin size={18} className="ev-icon" />
                            <div>
                                <span className="ev-label">Venue</span>
                                <span className="ev-value">{event.venue}</span>
                            </div>
                        </div>
                    </div>

                    <div className="ev-modal-desc">
                        <h4>Description</h4>
                        <div className="ev-desc-text">
                            {event.fullDescription.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>

                    <div className="ev-modal-actions">
                        {event.rulesUrl && (
                            <button className="ev-btn-outline" onClick={handleViewRules}>
                                <FileText size={18} /> Event Rules
                            </button>
                        )}
                        <Link to="/register" className="ev-btn-primary">
                            Register Now <ExternalLink size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── EVENT CARD (Restructured) ─── */
const EventCard = ({ event, category, index, onClick }) => {
    return (
        <div
            className="ev-card-modern"
            onClick={onClick}
            style={{ '--delay': `${index * 0.1}s` }}
        >
            <div className="ev-card-modern-poster-wrap">
                <img src={event.poster || 'https://placehold.co/400x400/102030/22c55e?text=No+Poster'} alt={event.title} loading="lazy" />
                <div className="ev-card-overlay-grad" />
            </div>

            <div className="ev-card-modern-content">
                <div className="ev-card-badge-wrapper">
                    <span className="ev-card-badge">{category.title}</span>
                    <button className="ev-btn-view-full">
                        View Details <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── EVENTS PAGE ─── */
const Events = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredEvents = activeCategory === 'all'
        ? EVENTS
        : EVENTS.filter(e => e.categoryId === activeCategory);

    return (
        <div className="events-page-new">
            <Navbar />

            <section className="events-hero-mini">
                <ParticleField count={30} />
                <div className="events-hero-wrap">
                    <h1>Explore <span className="text-gradient">Events</span></h1>
                    <p>Workshops, Competitions & Panels</p>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="events-filter-bar-sticky">
                <div className="events-filter-container">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <cat.icon size={16} />
                            <span>{cat.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="events-main-container">
                <div className="events-grid-modern">
                    {filteredEvents.map((event, index) => {
                        const cat = CATEGORIES.find(c => c.id === event.categoryId);
                        return (
                            <EventCard
                                key={event.id}
                                event={event}
                                category={cat}
                                index={index}
                                onClick={() => setSelectedEvent(event)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Registration CTA Section */}
            <section className="events-register-cta-section">
                <div className="events-cta-bg">
                    <div className="events-cta-grid" />
                    <div className="events-cta-glow" />
                    <ParticleField count={40} />
                </div>
                <div className="events-cta-container">
                    <div className="events-cta-content">
                        <h2>Ready to Join the <span className="text-gradient">Future of Tech?</span></h2>
                        <p>Secure your spot at Semiconductor Summit 2.0 and be part of India's semiconductor revolution.</p>
                        <div className="events-cta-features">
                            <div className="events-cta-feature">
                                <div className="events-cta-icon">
                                    <Sparkles size={20} />
                                </div>
                                <span>12 Curated Events</span>
                            </div>
                            <div className="events-cta-feature">
                                <div className="events-cta-icon">
                                    <Users size={20} />
                                </div>
                                <span>15+ Industry Experts</span>
                            </div>
                            <div className="events-cta-feature">
                                <div className="events-cta-icon">
                                    <Trophy size={20} />
                                </div>
                                <span>Internship Opportunities</span>
                            </div>
                        </div>
                        <Link to="/register" className="events-cta-button">
                            Register Now - ₹299 <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}

            <Footer />
        </div>
    );
};

export default Events;
