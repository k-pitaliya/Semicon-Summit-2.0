import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import {
    Users, Mic, Sparkles, Building2, Clock,
    Zap, Target, GraduationCap, Mail, ExternalLink,
    PlayCircle, BookOpen, Award, MapPin, Linkedin
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

                    {/* ─── Expert Insights: Alumni Keynote ──────────────────────────── */}
                    <section className="speaker-reveal-section expert-keynote-section">
                        <div className="reveal-header">
                            <div className="reveal-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.25)', color: '#a78bfa' }}>
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <h2>Expert <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Insights</span></h2>
                                <p className="reveal-subtitle">Semiconductors in the AI Era — Alumni Keynote from Silicon Valley</p>
                            </div>
                        </div>

                        <div className="expert-hero-card">
                            <div className="expert-hero-glow" />

                            {/* Badges Row */}
                            <div className="expert-badges-row">
                                <span className="expert-badge expert-badge-alumni"><GraduationCap size={12} /> CHARUSAT Alumni</span>
                                <span className="expert-badge expert-badge-location"><MapPin size={12} /> Silicon Valley, CA</span>
                                <span className="expert-badge expert-badge-session"><BookOpen size={12} /> Day 2 · Expert Insights Session</span>
                            </div>

                            {/* Speaker Profile Layout */}
                            <div className="expert-profile-layout">
                                {/* Photo Column */}
                                <div className="expert-photo-col">
                                    <div className="expert-photo-wrap">
                                        <img
                                            src="/images/panelists/panelist/krunal_patel.jpeg"
                                            alt="Krunal Patel"
                                            className="expert-photo"
                                            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.classList.add('expert-photo-fallback'); }}
                                        />
                                        <div className="expert-photo-ring" />
                                    </div>
                                    <div className="expert-memberships">
                                        {['Forbes Tech Council', 'IEEE Senior Member', 'Sigma Xi', 'SCRS Distinguished'].map(m => (
                                            <span key={m} className="expert-membership-badge">{m}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bio Column */}
                                <div className="expert-bio-col">
                                    <h3 className="expert-name">Mr. Krunal Patel</h3>
                                    <p className="expert-title">Technical Program Manager · Applied Materials</p>
                                    <p className="expert-edu">B.E. — CHARUSAT University &nbsp;·&nbsp; MS — New York University (NYU)</p>

                                    <p className="expert-bio-text">
                                        Krunal is a Technical Program Manager and engineer based in Silicon Valley, currently working at Applied Materials. He has led complex hardware and systems programs across consumer electronics, semiconductor, and electric vehicle industries — giving him an end-to-end view of how advanced technologies move from concept to large-scale deployment.
                                    </p>
                                    <p className="expert-bio-text">
                                        His work has been featured in <em>ISE Magazine</em> and <em>IntechOpen (UK)</em>, and he has authored papers published with <strong>IEEE</strong> and <strong>Springer</strong>. He is a Distinguished SCRS Member, Full Member of Sigma Xi, Forbes Technology Council Member, and Senior Member of both IISE and IEEE.
                                    </p>

                                    <div className="expert-cta-row">
                                        <a href="https://www.linkedin.com/in/krunalpatel1860" target="_blank" rel="noopener noreferrer" className="expert-btn expert-btn-linkedin">
                                            <Linkedin size={15} /> LinkedIn
                                        </a>
                                        <a href="mailto:krunalpatel1860@gmail.com" className="expert-btn expert-btn-email">
                                            <Mail size={15} /> Get in Touch
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Keynote Resources CTA */}
                            <div className="keynote-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 2rem', background: 'rgba(139, 92, 246, 0.04)', borderRadius: '16px', marginTop: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                    <PlayCircle size={32} color="#a78bfa" />
                                </div>
                                <h4 className="keynote-title" style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                                    Semiconductors in the AI Era: From Moore's Law Limits to the Full Industry Value Chain
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '650px', lineHeight: '1.6', fontSize: '0.9rem' }}>
                                    Access the complete outline document and the explainer video detailing the industry value chain, emerging career opportunities, and how core EC subjects map to real semiconductor jobs.
                                </p>
                                <a 
                                    href="https://drive.google.com/drive/folders/1w8C9ibbm74XdiFM9RsyKug3tr4652aMT" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="expert-btn"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', fontSize: '0.95rem', padding: '0.7rem 1.6rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)' }}
                                >
                                    <ExternalLink size={18} /> Access Keynote Materials (G-Drive)
                                </a>
                            </div>

                            {/* Footer CTA */}
                            <div className="expert-footer-cta">
                                <p>Want to connect or ask questions after the session?</p>
                                <div className="expert-cta-row">
                                    <a href="mailto:krunalpatel1860@gmail.com" className="expert-btn expert-btn-email">
                                        <Mail size={15} /> krunalpatel1860@gmail.com
                                    </a>
                                    <a href="https://www.linkedin.com/in/krunalpatel1860" target="_blank" rel="noopener noreferrer" className="expert-btn expert-btn-linkedin">
                                        <ExternalLink size={15} /> LinkedIn Profile
                                    </a>
                                </div>
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
