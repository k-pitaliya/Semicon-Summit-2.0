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
                            <h3>Expert Evaluators for Silicon Shark Tank</h3>
                            <p>Meet our esteemed "Sharks" — top leaders and entrepreneurs from the semiconductor ecosystem. They bring decades of experience to evaluate, critique, and guide the innovative pitches from our participants.</p>
                            <div className="speaker-profile-grid" style={{ justifyContent: 'center' }}>
                                {[
                                    { name: 'Mr. Marmik Bhatt', role: 'Founder & CEO, Monk9 Tech Private Limited', photo: '/images/panelists/panelist/marmik_bhatt.jpg' },
                                    { name: 'Mr. Nikul Shah', role: 'CEO, IndiSemic', photo: '/images/panelists/panelist/nikul_shah.jpg' }
                                ].map((shark, i) => (
                                    <div key={i} className="speaker-profile-card theme-amber" style={{ animationDelay: `${i * 0.2}s` }}>
                                        <div className="speaker-profile-photo-wrap">
                                            <img
                                                src={shark.photo}
                                                alt={shark.name}
                                                className="speaker-profile-photo"
                                                onError={e => { e.currentTarget.src = ''; e.currentTarget.parentElement.style.background = 'rgba(245, 158, 11, 0.1)'; }}
                                            />
                                            <div className="speaker-profile-glow" />
                                        </div>
                                        <div className="speaker-profile-info">
                                            <div className="speaker-profile-name">{shark.name}</div>
                                            <div className="speaker-profile-role">{shark.role}</div>
                                        </div>
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
                                <p className="reveal-subtitle">Fabless Semiconductor Innovation: RTL to ASIC / SoC Implementation</p>
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
                            <div className="speaker-profile-grid" style={{ justifyContent: 'center' }}>
                                {[
                                    { name: 'Mr. Sudhir Naik', role: 'Founder & CEO, N Cube Semicon Private Limited; Mid West Head, IESA', photo: '/images/panelists/panelist/sudhir_naik.jpg' },
                                    { name: 'Mr. Sunil Parmar', role: 'Director, Powency', photo: '/images/panelists/panelist/sunil_parmar.jpg' },
                                    { name: 'Mr. Snehal Patel', role: 'Senior Director, Engineering – ASIC, eInfochips', photo: '/images/panelists/panelist/snehal_patel.jpg' },
                                    { name: 'Mr. Nishith Shukla', role: 'Head of Engineering, VeriFast Technologies', photo: '/images/panelists/panelist/nishith_shukla.jpg' },
                                    { name: 'Mr. Mufaddal Saifee', role: 'Technical Director, SiFive', photo: '/images/panelists/panelist/mufaddal_saifee.jpg' },
                                    { name: 'Mr. Marmik Bhatt', role: 'Founder & CEO, Monk9 Tech Private Limited', photo: '/images/panelists/panelist/marmik_bhatt.jpg' }
                                ].map((panelist, i) => (
                                    <div key={i} className="speaker-profile-card theme-green" style={{ animationDelay: `${i * 0.15}s` }}>
                                        <div className="speaker-profile-photo-wrap">
                                            <img
                                                src={panelist.photo}
                                                alt={panelist.name}
                                                className="speaker-profile-photo"
                                                onError={e => { e.currentTarget.src = ''; e.currentTarget.parentElement.style.background = 'rgba(34, 197, 94, 0.1)'; }}
                                            />
                                            <div className="speaker-profile-glow" />
                                        </div>
                                        <div className="speaker-profile-info">
                                            <div className="speaker-profile-name">{panelist.name}</div>
                                            <div className="speaker-profile-role">{panelist.role}</div>
                                        </div>
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
                            <h3>Expert instructors for RTL &amp; Self-Checking Testbench and Verilog &amp; FPGA workshops</h3>
                            <p>Workshop leaders with extensive industry experience will guide participants through hands-on sessions covering industry-ready RTL design, self-checking verification, and FPGA implementation.</p>

                            <div className="speaker-profile-grid" style={{ justifyContent: 'center' }}>
                                {[
                                    { name: 'Kaushal Modi', role: 'Associate Director (Design Verification) · eInfochips (An Arrow Company)', photo: '/images/panelists/Kausal_Modi.jpeg' },
                                    { name: 'Ashish Christain', role: 'Senior Design Verification Engineer · eInfochips (An Arrow Company)', photo: '/images/panelists/Ashish_Christain.jpeg' }
                                ].map((instructor, i) => (
                                    <div key={i} className="speaker-profile-card" style={{ animationDelay: `${i * 0.2}s` }}>
                                        <div className="speaker-profile-photo-wrap">
                                            <img
                                                src={instructor.photo}
                                                alt={instructor.name}
                                                className="speaker-profile-photo"
                                                onError={e => { e.currentTarget.src = ''; e.currentTarget.parentElement.style.background = 'rgba(20,184,166,0.1)'; }}
                                            />
                                            <div className="speaker-profile-glow" />
                                        </div>
                                        <div className="speaker-profile-info">
                                            <div className="speaker-profile-name">{instructor.name}</div>
                                            <div className="speaker-profile-role">{instructor.role}</div>
                                        </div>
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
