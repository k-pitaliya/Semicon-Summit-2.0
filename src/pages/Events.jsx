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
        title: 'Fabless Semiconductor Innovation',
        subtitle: 'RTL to ASIC / SoC Implementation',
        type: 'Industry Panel',
        icon: Users,
        poster: '/images/New posters/Final/Fabless Startups & MSMEs Powering India\'s Semiconductor Growth.png',
        prize: 'Networking',
        description: "Interact with semiconductor industry experts and innovators driving India's fabless ecosystem — exploring the journey from RTL to ASIC and SoC implementation.",
        fullDescription: `Fabless Semiconductor Innovation: RTL to ASIC / SoC Implementation

Interact with semiconductor industry experts and innovators driving India's fabless ecosystem.

This panel discussion explores:
• The journey from RTL to ASIC and SoC implementation
• Business models, design challenges and opportunities
• Fabless semiconductor company growth in India
• Startup and MSME ecosystem insights
• Policy support and talent requirements

Participants will gain insights directly from industry experts shaping India\'s semiconductor future.`,
        date: 'Tuesday, March 17, 2026',
        time: '11:30 AM – 12:30 PM',
        venue: 'Seminar Hall, First Floor, EC Dept., A6 Building, CHARUSAT',
        fee: 'Included',
        rulesUrl: null
    },
    {
        id: 'ai-vlsi',
        categoryId: 'industry-strategy',
        title: 'AI-Powered VLSI',
        subtitle: 'Shaping the Next-Gen Design Verification Engineers',
        type: 'Expert Insight',
        icon: Brain,
        poster: '/images/New posters/Final/AI vs VLSI.png',
        prize: 'Knowledge',
        description: 'Explore how Artificial Intelligence is transforming RTL design and verification workflows — and what it means for the next-gen VLSI engineer.',
        fullDescription: `AI-Powered VLSI: Shaping the Next-Gen Design Verification Engineers

Explore how Artificial Intelligence is transforming RTL design and verification workflows.

This talk addresses:
• AI-assisted verification and test generation
• Automated bug detection and coverage optimization
• AI-driven PPA prediction and analysis
• Intelligent regression and simulation acceleration
• Skills required for next-generation VLSI engineers

Participants will understand how AI is redefining semiconductor design productivity and verification efficiency.`,
        date: 'Thursday, March 19, 2026',
        time: '09:45 AM – 11:00 AM',
        venue: 'Seminar Hall, First Floor, EC Dept., A6 Building, CHARUSAT',
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
        poster: '/images/New posters/Final/Embedded vs VLSI What Should I Choose.png',
        prize: 'Career Path',
        description: 'An interactive session designed to help students understand the differences between embedded systems and VLSI domains.',
        fullDescription: `An interactive session designed to help students understand the differences between embedded systems and VLSI domains.

Key discussion points include:
• Core skill requirements
• Industry demand and growth trends
• Learning pathways
• Career progression opportunities

This session aims to provide clarity for students at early academic stages.`,
        date: 'Wednesday, March 18, 2026',
        time: '09:45 AM – 11:00 AM',
        venue: 'Seminar Hall, First Floor, EC Dept., A6 Building, CHARUSAT',
        fee: 'Included',
        rulesUrl: null
    },

    // ── Category 2: Workshops ──
    {
        id: 'rtl-gds',
        categoryId: 'workshops',
        title: 'Writing Industry-Ready RTL & Self-Checking Testbench',
        subtitle: 'Code Like a Chip Designer',
        type: 'Advanced Workshop',
        icon: Layers,
        poster: '/images/New posters/Final/Testbench workshop _ Code Like  a Chip Designer.png',
        prize: 'Certificates',
        description: 'Hands-on workshop on industry-standard RTL coding practices and modern verification methodologies. For 3rd and 4th year students.',
        fullDescription: `Writing Industry-Ready RTL & Self-Checking Testbench

This workshop focuses on industry-standard RTL coding practices and modern verification methodologies used in semiconductor companies.

The session covers:
• Writing clean, synthesizable, and modular RTL
• Parameterized and scalable design techniques
• Developing self-checking testbenches

Participants will gain practical exposure to real-world RTL design and verification strategies aligned with current industry expectations.

Recommended For: 3rd and 4th year students only.`,
        date: 'Tuesday, March 17, 2026',
        time: '01:30 PM – 04:30 PM',
        venue: 'Seminar Hall, First Floor, EC Dept., A6 Building, CHARUSAT',
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
        poster: '/images/New posters/Final/Verilog & FPGA Getting Started with Digital Design.png',
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
        date: 'Tuesday, March 17, 2026',
        time: '01:30 PM – 04:30 PM',
        venue: 'Lab No. 231, First Floor, EC Dept., A6 Building, CHARUSAT',
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
        poster: '/images/New posters/Final/Silicon Shark Tank Industry-Driven Idea Pitching.png',
        prize: 'Internships',
        description: 'Industry-Driven Idea Pitching. Winners get a FREE Internship Opportunity!',
        fullDescription: `This competition is open to undergraduate engineering students, with a maximum of two members per team. Cross-department participation is encouraged, and each team must nominate one Team Leader for official communication. Teams are required to pitch original, innovation-driven ideas related to Semiconductor Design & Technology, VLSI (RTL to GDS, Physical Design, Verification), Embedded Systems & FPGA-based solutions, Hardware–Software Co-Design, AI/ML Accelerators & Edge Computing, Low-Power and High-Performance Design, Semiconductor Manufacturing Challenges, EDA Tools & Automation, or Smart Electronic/System-Level solutions. AI-generated or plagiarized content is strictly prohibited and may lead to disqualification.
The event consists of two rounds. In Round 1 (Idea Screening), teams must submit an original idea (maximum 200 words) clearly outlining the problem statement, existing system loopholes, proposed solution, application/use-case, innovation aspect, technical domain (VLSI-focused), and a supporting visual such as a block diagram, mind map, or execution flow. Shortlisted teams will advance to Round 2, where they will deliver a 10-minute live pitch (7-minute presentation + 3-minute Q&A) before an expert jury; slides and system architecture diagrams are allowed, while a working demo is not mandatory. Final evaluation will be conducted solely by the expert jury, and their decision will be final and binding. Selected teams will receive internship opportunities (per team), industry mentorship, and technical feedback for idea refinement; however, no cash prize or financial funding will be provided. All eligible participants will receive participation certificates and digital badges, and winners will be awarded a free industry internship. Professional conduct, strict adherence to time limits, and originality are mandatory throughout the competition, and organizers reserve the right to modify rules if required.`,
        date: 'Wednesday, March 18, 2026',
        time: '12:30 PM – 04:30 PM',
        venue: 'Semiconductor Design Excellence Hub, EC Dept., A6 Building, CHARUSAT',
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
        poster: '/images/New posters/Final/The Silicon Jackpot Decode the Logic. Hunt the Clues. Complete the Silicon.png',
        prize: 'Prizes',
        description: 'An exciting multi-round technical challenge designed to test analytical skills, logic, and hardware understanding.',
        fullDescription: `The Silicon Jackpot — Decode the Logic. Hunt the Clues. Complete the Silicon.

An exciting multi-round technical challenge designed to test analytical skills, logic, and hardware understanding.

Round 1 — Where Aptitude Meets Adventure
A high-energy technical aptitude challenge combining problem-solving and logical reasoning.

Round 2 — Decode the Clues, Conquer the Flag
A clue-based technical hunt designed to test Digital Electronics skills.

Round 3 — Kaun Banega Summit Samrat – The FPGA FaceOff
No Verilog coding — just Press & Play on FPGA. Participants will compete using hands-on FPGA-based challenges focused on logic implementation and hardware interaction.`,
        date: 'Thursday, March 19, 2026',
        time: '12:10 PM – 03:30 PM',
        venue: 'EC Department, A6 Building, CHARUSAT',
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
        poster: '/images/New posters/Final/Silicon PlayZone Technical Game Arena.png',
        prize: 'Merchandise',
        description: 'Hands-On. Minds-On. A dynamic zone designed to make engineering interactive and engaging.',
        fullDescription: `A dynamic zone designed to make engineering interactive and engaging.

Activities include:
• Spin the Wheel — Technical surprise challenges
• Truth or Dare — Electronics edition
• Join the Circuit — Rapid connection logic challenge
• Mini hardware-based problem-solving tasks`,
        date: 'Thursday, March 19, 2026',
        time: '12:10 PM – 03:30 PM',
        venue: 'EC Department, A6 Building, CHARUSAT',
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
        poster: '/images/New posters/Final/Silicon Ideas Showcase Silent Feedback Edition.png',
        prize: 'Best Idea',
        description: 'Technical Poster Presentation & Live Project Demonstration. Walk through innovation and leave your insight.',
        fullDescription: `Silicon Ideas Showcase — Silent Feedback Edition
Featuring Technical Poster Presentation & Live Project Demonstration

Students present semiconductor and hardware innovation ideas through poster exhibits and live project demonstrations. Instead of traditional verbal presentations, participants receive structured written feedback from visitors via sticky notes and digital interaction.

Each poster includes a QR code enabling attendees to:
• Access detailed technical explanations
• Submit questions digitally
• Provide structured feedback`,
        date: 'March 17–19, 2026 (All Days)',
        time: '09:30 AM – 04:30 PM',
        venue: 'EC Square, EC Dept., A6 Building, CHARUSAT',
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
        poster: '/images/New posters/Final/Wafer to Chip Live Demonstration by Monk9.png',
        prize: 'Learning',
        description: 'See How a Chip Comes to Life — From Silicon Wafer to Working Chip. An industry-led demonstration by Monk9.',
        fullDescription: `Wafer to Chip — Live Demonstration by Monk9

An industry-led demonstration offering a complete view of the semiconductor lifecycle — from wafer fabrication concepts to final chip realization.

Conducted by industry experts from Monk9, this session provides participants with real-world insights into:
• Semiconductor fabrication fundamentals
• Chip design and verification workflow
• Industry toolchains and development stages`,
        date: 'March 17–19, 2026 (All Days)',
        time: '09:30 AM – 04:30 PM',
        venue: 'CSPIT Lawn, Ground Floor, CHARUSAT',
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
                                <span>10 Curated Events</span>
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
