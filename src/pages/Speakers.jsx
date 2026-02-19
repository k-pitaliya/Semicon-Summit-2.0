import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import {
    Users, Mic, Sparkles, Building2, Eye, Clock,
    ChevronRight, Zap, Target
} from 'lucide-react';
import './Speakers.css';

const Speakers = () => {
    return (
        <div className="speakers-page">
            <Navbar />

            {/* Hero */}
            <section className="speakers-hero">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <ParticleField count={35} />
                </div>
                <div className="speakers-hero-content">
                    <div className="speakers-hero-badge">
                        <Sparkles size={16} />
                        <span>Speaker Lineup</span>
                    </div>
                    <h1>Meet Our <span className="text-gradient">Speakers</span></h1>
                    <p>Industry leaders, technical experts, and researchers shaping the semiconductor ecosystem.</p>
                </div>
            </section>

            {/* Speaker Reveal Section */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="hero-bg" style={{ opacity: 0.4 }}>
                    <div className="hero-grid" />
                    <ParticleField count={20} />
                </div>
                <div className="speakers-container">

                    {/* Industry Sharks */}
                    <section className="speaker-reveal-section">
                        <div className="reveal-header">
                            <div className="reveal-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b' }}>
                                <Target size={28} />
                            </div>
                            <div>
                                <h2>Industry <span className="text-gradient-amber">Sharks</span></h2>
                                <p className="reveal-subtitle">Silicon Shark Tank Evaluators</p>
                            </div>
                        </div>

                        <div className="reveal-card">
                            <div className="reveal-card-glow" />
                            <div className="reveal-badge">
                                <Clock size={16} />
                                <span>Speaker Reveal Series</span>
                            </div>
                            <h3>Profiles will be unveiled in phases</h3>
                            <p>Our industry sharks are top leaders from the semiconductor ecosystem. Their profiles will be revealed in a series of announcements leading up to the summit.</p>
                            <div className="reveal-phases">
                                <div className="reveal-phase">
                                    <div className="phase-dot active" />
                                    <span>Phase 1 — Coming Soon</span>
                                </div>
                                <div className="reveal-phase">
                                    <div className="phase-dot" />
                                    <span>Phase 2 — March 2026</span>
                                </div>
                                <div className="reveal-phase">
                                    <div className="phase-dot" />
                                    <span>Phase 3 — Pre-Event</span>
                                </div>
                            </div>

                            <div className="reveal-silhouettes">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="silhouette-card" style={{ animationDelay: `${i * 0.15}s` }}>
                                        <div className="silhouette-avatar">
                                            <span>?</span>
                                        </div>
                                        <div className="silhouette-name">Coming Soon</div>
                                        <div className="silhouette-role">Industry Expert</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Panel Discussion */}
                    <section className="speaker-reveal-section">
                        <div className="reveal-header">
                            <div className="reveal-icon-wrap" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.25)', color: '#22c55e' }}>
                                <Mic size={28} />
                            </div>
                            <div>
                                <h2>Panel <span className="text-gradient">Discussion</span></h2>
                                <p className="reveal-subtitle">Fabless Startups & MSMEs: Powering India's Semiconductor Growth</p>
                            </div>
                        </div>

                        <div className="reveal-card">
                            <div className="reveal-card-glow" />
                            <div className="reveal-badge" style={{ background: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
                                <Users size={16} />
                                <span>Panel Lineup</span>
                            </div>
                            <h3>Panelists from leading fabless startups and MSMEs</h3>
                            <p>Our panelists represent the forefront of India's semiconductor growth — from chip design startups to established MSME players.</p>

                            <div className="reveal-silhouettes">
                                {[
                                    { name: 'Marmik Bhatt', role: 'Panelist' },
                                    { name: 'Sudhir Nayak', role: 'Panelist' },
                                    { name: 'Nikul Shah', role: 'Panelist' }
                                ].map((panelist, i) => (
                                    <div key={i} className="silhouette-card panelist" style={{ animationDelay: `${i * 0.15}s` }}>
                                        <div className="silhouette-avatar">
                                            <Mic size={20} />
                                        </div>
                                        <div className="silhouette-name">{panelist.name}</div>
                                        <div className="silhouette-role">{panelist.role}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Workshop Leaders */}
                    <section className="speaker-reveal-section">
                        <div className="reveal-header">
                            <div className="reveal-icon-wrap" style={{ background: 'rgba(20, 184, 166, 0.1)', borderColor: 'rgba(20, 184, 166, 0.25)', color: '#14b8a6' }}>
                                <Zap size={28} />
                            </div>
                            <div>
                                <h2>Workshop <span style={{ color: '#14b8a6' }}>Leaders</span></h2>
                                <p className="reveal-subtitle">Hands-on technical sessions by industry practitioners</p>
                            </div>
                        </div>

                        <div className="reveal-card">
                            <div className="reveal-card-glow" />
                            <div className="reveal-badge" style={{ background: 'rgba(20, 184, 166, 0.08)', borderColor: 'rgba(20, 184, 166, 0.2)', color: '#14b8a6' }}>
                                <Building2 size={16} />
                                <span>Industry Experts</span>
                            </div>
                            <h3>Expert instructors for RTL to GDS II and Verilog & FPGA workshops</h3>
                            <p>Workshop leaders with extensive industry experience will guide participants through hands-on sessions covering complete ASIC design flow and FPGA implementation.</p>

                            <div className="reveal-silhouettes">
                                {[
                                    { name: 'Vaibhav Joshi', role: 'Workshop Leader' },
                                    { name: 'Anushka Tripathi', role: 'Workshop Leader' }
                                ].map((instructor, i) => (
                                    <div key={i} className="silhouette-card instructor" style={{ animationDelay: `${i * 0.15}s` }}>
                                        <div className="silhouette-avatar">
                                            <Zap size={20} />
                                        </div>
                                        <div className="silhouette-name">{instructor.name}</div>
                                        <div className="silhouette-role">{instructor.role}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Speakers;
