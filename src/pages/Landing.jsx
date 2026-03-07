import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Cpu, Calendar, MapPin, Users, Zap, Award,
    ArrowRight, Sparkles, CircuitBoard, ChevronRight,
    CheckCircle2, Target, Building2, GraduationCap, Globe,
    Linkedin, BookOpen, Mic2, Trophy, Handshake, Eye
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ParticleField from '../components/ParticleField'
import useScrollReveal from '../hooks/useScrollReveal'

import './Landing.css'

// Event Date - March 17, 2026
const EVENT_DATE = new Date('2026-03-17T09:00:00')

const Landing = () => {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useScrollReveal()

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const difference = EVENT_DATE - now
            if (difference > 0) {
                setCountdown({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            }
        }
        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [])

    const stats = [
        { value: '100+', label: 'Expected Attendees' },
        { value: '15+', label: 'Industry Experts' },
        { value: '10', label: 'Curated Events' },
        { value: '3', label: 'Days of Learning' },
        { value: '10+', label: 'Internship Opportunities' },
        { value: '₹299', label: 'Registration Fee', subtitle: 'Included all events' }
    ]

    const features = [
        { icon: BookOpen, title: 'Industry-Led Workshops', description: 'Hands-on RTL & Self-Checking Testbench and FPGA sessions under expert guidance.' },
        { icon: Mic2, title: 'Panel Discussions', description: 'Insightful conversations with leaders from the semiconductor ecosystem.' },
        { icon: Trophy, title: 'Technical Competitions', description: 'Silicon Shark Tank, treasure hunts, and innovation challenges.' },
        { icon: Handshake, title: 'Executive Networking', description: 'Connect with industry experts, peers, and potential employers.' }
    ]

    const whyAttend = [
        { icon: Zap, title: 'Structured Industry Exposure', description: 'Gain insights from panel discussions and expert sessions with industry leaders.' },
        { icon: Sparkles, title: 'Practical Learning', description: 'Hands-on workshops covering Industry-Ready RTL & Testbench and FPGA design.' },
        { icon: Target, title: 'Career Clarity', description: 'Guidance on choosing between Embedded Systems and VLSI domains.' },
        { icon: Users, title: 'Networking Opportunities', description: 'Connect with peers, mentors, and potential employers.' }
    ]

    const venue = {
        name: 'Electronics and Communication Department (A6 Building), CHARUSAT',
        address: 'Department of EC Engineering - CSPIT, Electronics and Communication Department (A6 Building), CHARUSAT, Changa, Gujarat - 388421',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.8!2d72.8168!3d22.5988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4e7439a2e021%3A0x9f4c4b1dfb8a586a!2sCHARUSAT!5e0!3m2!1sen!2sin!4v1700000000000'
    }

    return (
        <div className="landing-page">
            <Navbar />

            {/* ── Single fullpage particle canvas — shared by all sections ── */}
            {/* Renders ONE canvas fixed behind everything: 1 RAF loop instead of 7 */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <ParticleField count={50} />
            </div>

            {/* ====== HERO SECTION ====== */}
            <section id="home" className="hero-section">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    {/* Animated circuit lines */}
                    <div className="hero-circuit-lines">
                        <div className="circuit-line circuit-line-1" />
                        <div className="circuit-line circuit-line-2" />
                        <div className="circuit-line circuit-line-3" />
                    </div>
                </div>

                <div className="container hero-content">
                    <div className="hero-university-logo hero-animate hero-animate-delay-0" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <img
                            src="/images/Logo/Charusat logo.png"
                            alt="CHARUSAT"
                            style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
                        />
                    </div>

                    <div className="hero-title-wrapper hero-animate hero-animate-delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}>
                        <img
                            src="/images/Logo/Logo of SS.png"
                            alt="Semiconductor Summit 2.0"
                            className="hero-logo-img"
                        />
                    </div>

                    <div className="hero-info hero-animate hero-animate-delay-3">
                        <div className="hero-info-item">
                            <Calendar size={20} />
                            <span>March 17-19, 2026</span>
                        </div>
                        <div className="hero-info-divider" />
                        <div className="hero-info-item">
                            <MapPin size={20} />
                            <span>Electronics and Communication Department (A6 Building), CHARUSAT</span>
                        </div>
                    </div>

                    {/* Hero CTA — visible above the fold */}
                    <div className="hero-cta-inline hero-animate hero-animate-delay-4">
                        <Link to="/register" className="btn btn-primary btn-lg hero-register-btn">
                            Register Now — ₹299 <ArrowRight size={20} />
                        </Link>
                        <Link to="/events" className="btn btn-secondary hero-events-btn">
                            <Eye size={18} /> View Events
                        </Link>
                    </div>
                </div>

                <div className="hero-floating">
                    <div className="floating-chip floating-chip-1"><Cpu size={32} /></div>
                    <div className="floating-chip floating-chip-2"><CircuitBoard size={28} /></div>
                    <div className="floating-chip floating-chip-3"><Sparkles size={24} /></div>
                </div>
            </section>

            {/* ====== STATS ====== */}
            <section className="landing-stats reveal">
                <div className="section-bg">
                    <div className="section-grid" />
                    <div className="section-glow section-glow-center" />
                </div>
                <div className="landing-stats-row">
                    {stats.map((stat, i) => (
                        <div key={i} className="landing-stat-item">
                            <span className="landing-stat-num text-gradient">{stat.value}</span>
                            <span className="landing-stat-text">{stat.label}</span>
                            {stat.subtitle && <span className="landing-stat-subtitle">{stat.subtitle}</span>}
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== REGISTRATION CTA CARD ====== */}
            <section className="registration-cta-section reveal">                <div className="section-bg">
                <div className="section-grid" />
                <div className="section-glow section-glow-left" />
            </div>                <div className="container">
                    <div className="hero-cta-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="cta-card-inner">
                            <h3>Ready to Join the <span className="text-gradient">Future of Tech?</span></h3>
                            <p>Secure your spot at Semiconductor Summit 2.0 for just ₹299.</p>

                            <div className="cta-steps">
                                <div className="cta-step">
                                    <div className="cta-step-num">1</div>
                                    <span>Pay ₹299</span>
                                </div>
                                <div className="cta-step-connector" />
                                <div className="cta-step">
                                    <div className="cta-step-num">2</div>
                                    <span>Fill form & upload receipt</span>
                                </div>
                                <div className="cta-step-connector" />
                                <div className="cta-step">
                                    <div className="cta-step-num">3</div>
                                    <span>Get verified</span>
                                </div>
                            </div>

                            <div className="cta-buttons">
                                <Link to="/register" className="btn btn-primary btn-lg cta-register-btn">
                                    Register Now — ₹299 <ArrowRight size={20} />
                                </Link>
                                <Link to="/events" className="btn btn-secondary cta-events-btn">
                                    <Eye size={18} /> View Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== ABOUT SECTION ====== */}
            <section id="about-summit" className="about-summit-section reveal">
                <div className="section-bg">
                    <div className="section-grid" />
                    <div className="section-glow section-glow-center" />
                </div>
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">About The Summit</span>
                        <h2>Semiconductor <span className="text-gradient">Summit 2.0</span></h2>
                    </div>

                    <div className="about-summit-content">
                        <div className="about-summit-text" style={{ textAlign: 'justify' }}>
                            <p className="about-lead" style={{ textAlign: 'justify' }}>
                                Semiconductor Summit 2.0 is a premier technology convergence platform curated to bridge academia and the semiconductor industry.
                            </p>
                            <p style={{ textAlign: 'justify' }}>
                                Over three focused days, the summit brings together industry leaders, technical experts, researchers, and aspiring engineers to explore the future of chip design, manufacturing, verification, and emerging semiconductor technologies.
                            </p>
                            <p className="about-closing" style={{ textAlign: 'justify' }}>
                                <em>Semiconductor Summit 2.0 is not just an event — it is a platform for collaboration, innovation, and impact.</em>
                            </p>
                        </div>

                        <div className="about-features-grid">
                            {features.map((feat, i) => (
                                <div key={i} className="about-feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="about-feature-icon">
                                        <feat.icon size={22} />
                                    </div>
                                    <div>
                                        <h4>{feat.title}</h4>
                                        <p>{feat.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== WHY ATTEND ====== */}
            <section id="why-attend" className="vision-section reveal">
                <div className="section-bg">
                    <div className="section-grid" />
                    <div className="section-glow section-glow-right" />
                </div>
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Benefits</span>
                        <h2>Why <span className="text-gradient">Attend?</span></h2>
                        <p>Unlock your potential in the semiconductor industry.</p>
                    </div>

                    <div className="vision-grid">
                        {whyAttend.map((item, i) => (
                            <div key={i} className="vision-card">
                                <div className="vision-icon"><item.icon size={24} /></div>
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== INDUSTRY PARTNERS ====== */}
            <section className="partners-section reveal">
                <div className="section-bg">
                    <div className="section-grid" />
                    <div className="section-glow section-glow-center" />
                </div>
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Our Partners</span>
                        <h2>Industry <span className="text-gradient">Partners</span></h2>
                        <p>Proud to collaborate with leading organizations in the semiconductor ecosystem.</p>
                    </div>

                    <div className="partners-grid">
                        <div className="partner-card">
                            <div className="partner-logo">
                                <img src="/images/Logo/companys/IndieSemicLogo.jpg" alt="IndieSemic" />
                            </div>
                            <h3 className="partner-name">IndieSemic</h3>
                        </div>
                        <div className="partner-card">
                            <div className="partner-logo">
                                <img src="/images/Logo/companys/eInfochips-Logo-white.png" alt="eInfochips" />
                            </div>
                            <h3 className="partner-name">E infochips</h3>
                        </div>
                        <div className="partner-card">
                            <div className="partner-logo">
                                <img src="/images/Logo/companys/Monk-white.png" alt="Monk" />
                            </div>
                            <h3 className="partner-name">Monk 9</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== LOCATION MAP ====== */}
            <section id="location" className="location-section reveal">
                <div className="section-bg">
                    <div className="section-grid" />
                    <div className="section-glow section-glow-left" />
                </div>
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Event Venue</span>
                        <h2>Find Us <span className="text-gradient">Here</span></h2>
                        <p>Join us at our venue for an unforgettable experience.</p>
                    </div>

                    <div className="location-content">
                        <div className="location-info">
                            <div className="location-icon"><MapPin size={28} /></div>
                            <h3>{venue.name}</h3>
                            <p>{venue.address}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                Get Directions <ArrowRight size={16} />
                            </a>
                        </div>
                        <div className="location-map">
                            <iframe
                                src={venue.mapEmbedUrl}
                                width="100%"
                                height="350"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Event Location"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== COUNTDOWN ====== */}
            <section className="countdown-section reveal">
                <div className="section-bg">
                    <div className="section-grid" />
                    <div className="section-glow section-glow-center" />
                </div>
                <div className="container">
                    <div className="countdown-wrapper">
                        <h3 className="countdown-title">Event Starts In <span style={{ fontSize: '0.6em', fontWeight: 400, color: 'rgba(148,163,184,0.55)', letterSpacing: '0.04em' }}>IST</span></h3>
                        <div className="countdown-grid">
                            {[
                                { val: countdown.days, label: 'Days' },
                                { val: countdown.hours, label: 'Hours' },
                                { val: countdown.minutes, label: 'Minutes' },
                                { val: countdown.seconds, label: 'Seconds' }
                            ].map((item, i) => (
                                <React.Fragment key={item.label}>
                                    {i > 0 && <div className="countdown-separator">:</div>}
                                    <div className="countdown-item">
                                        <span className="countdown-value text-gradient">{String(item.val).padStart(2, '0')}</span>
                                        <span className="countdown-label">{item.label}</span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== REGISTER CTA - REMOVED ====== */}
            <section id="register" className="register-section reveal" style={{ display: 'none' }}>
                <div className="register-bg"><div className="register-glow" /></div>
                <div className="container">
                    <div className="register-content">
                        <h2>Ready to Join the <span className="text-gradient">Future of Tech?</span></h2>
                        <p>Secure your spot at Semiconductor Summit 2.0 for just ₹299.</p>

                        <div className="register-steps">
                            <div className="register-step"><div className="step-number">1</div><span>Pay ₹299</span></div>
                            <div className="register-step"><div className="step-number">2</div><span>Fill form & upload receipt</span></div>
                            <div className="register-step"><div className="step-number">3</div><span>Get verified</span></div>
                        </div>

                        <Link to="/register" className="btn btn-primary btn-lg">
                            Register Now — ₹299 <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Landing
