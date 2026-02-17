import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Users, Trophy, ArrowRight, Image, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './About.css';

const About = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const previousEventImages = [
        // Day 1 images (0.jpeg - 9.jpeg) - All 10 images
        { id: 1, title: 'Summit Day 1 - Session 1', image: '/images/Glimps/0.jpeg' },
        { id: 2, title: 'Summit Day 1 - Session 2', image: '/images/Glimps/1.jpeg' },
        { id: 3, title: 'Summit Day 1 - Session 3', image: '/images/Glimps/2.jpeg' },
        { id: 4, title: 'Summit Day 1 - Session 4', image: '/images/Glimps/3.jpeg' },
        { id: 5, title: 'Summit Day 1 - Session 5', image: '/images/Glimps/4.jpeg' },
        { id: 6, title: 'Summit Day 1 - Session 6', image: '/images/Glimps/5.jpeg' },
        { id: 7, title: 'Summit Day 1 - Session 7', image: '/images/Glimps/6.jpeg' },
        { id: 8, title: 'Summit Day 1 - Session 8', image: '/images/Glimps/7.jpeg' },
        { id: 9, title: 'Summit Day 1 - Session 9', image: '/images/Glimps/8.jpeg' },
        { id: 10, title: 'Summit Day 1 - Session 10', image: '/images/Glimps/9.jpeg' },
        // Day 2 images - 4 images
        { id: 11, title: 'Summit Day 2 - Highlights 2', image: '/images/Glimps/summit day 2 _2.jpg' },
        { id: 12, title: 'Summit Day 2 - Highlights 3', image: '/images/Glimps/summit day 2 _3.jpg' },
        { id: 13, title: 'Summit Day 2 - Highlights 4', image: '/images/Glimps/summit day 2 _4.jpg' },
        { id: 14, title: 'Summit Day 2 - Highlights 5', image: '/images/Glimps/summit day 2 _5.jpg' }
    ];

    return (
        <div className="about-page" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* ... (background and navbar) ... */}
            <div className="hero-bg">
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" />
                <div className="hero-glow hero-glow-2" />
                <ParticleField count={40} />
            </div>
            <Navbar />

            <div className="about-container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Hero Section - Title Removed as per request */}
                <div className="about-hero">
                    {/* Content removed */}
                </div>

                {/* About CHARUSAT Section */}
                <section className="about-charusat-section">
                    <div className="premium-content-block">
                        <h2>About <span className="text-gradient">CHARUSAT</span></h2>
                        <p className="premium-text" style={{ textAlign: 'justify' }}>
                            Charotar University of Science and Technology (CHARUSAT) is a forward-thinking institution committed to academic excellence, research innovation, and strong industry collaboration. The university fosters a dynamic ecosystem where technology, talent, and leadership converge.
                        </p>
                        <p className="premium-text" style={{ textAlign: 'justify' }}>
                            CHARUSAT offers cutting-edge undergraduate, postgraduate, and doctoral programs in engineering, technology, applied sciences, and management. With a focus on interdisciplinary research, the university actively collaborates with national and international research institutions, industry partners, and startups to drive innovation in emerging technologies such as semiconductors, VLSI, AI, IoT, and sustainable engineering.
                        </p>
                        <a href="https://www.charusat.ac.in" target="_blank" rel="noopener noreferrer" className="styled-link">
                            Explore CHARUSAT <ExternalLink size={16} />
                        </a>
                    </div>

                    <div className="premium-content-block">
                        <h2>About <span className="text-gradient">Institute</span></h2>
                        <p className="premium-text" style={{ textAlign: 'justify' }}>
                            Chandubhai S. Patel Institute of Technology (CSPIT), the flagship engineering institute of CHARUSAT, is known for its industry-aligned curriculum, research-driven education, and strong emphasis on practical learning. The institute nurtures innovation and technical excellence, preparing students to excel in advanced engineering fields including electronics, computing, and semiconductor technologies.
                        </p>
                        <p className="premium-text" style={{ textAlign: 'justify' }}>
                            CSPIT offers B.Tech, M.Tech, and Ph.D. programs across multiple engineering disciplines with state-of-the-art laboratories, innovation centers, and industry collaboration hubs. The institute actively promotes student participation in research publications, patent filings, and technical competitions, fostering a culture of innovation and entrepreneurship.
                        </p>
                        <a href="https://cspit.charusat.ac.in" target="_blank" rel="noopener noreferrer" className="styled-link">
                            Visit CSPIT <ExternalLink size={16} />
                        </a>
                    </div>

                    <div className="premium-content-block">
                        <h2>About <span className="text-gradient">V. T. Patel Department of Electronics & Communication Engineering</span></h2>
                        <p className="premium-text" style={{ textAlign: 'justify' }}>
                            The V. T. Patel Department of Electronics & Communication Engineering at CSPIT drives innovation in semiconductor technology, VLSI design, embedded systems, and advanced communication systems. With a research-oriented approach, modern laboratories, and industry engagement, the department equips students to solve real-world engineering challenges and contribute to the evolving semiconductor ecosystem.
                        </p>
                    </div>
                </section>

                {/* Mission/Vision Section - Moved Before Gallery */}
                <section className="mission-section">
                    {/* ... (rest of mission content) ... */}
                    <div className="section-icon">
                        <Target size={40} />
                    </div>
                    <h2>Our Vision</h2>
                    <p style={{ textAlign: 'justify' }}>To empower the next generation of semiconductor engineers by integrating academic excellence with industry exposure and innovation-led learning.</p>
                </section>

                {/* ====== GLIMPSES SECTION ====== */}
                <section className="glimpse-section">
                    <h2>Glimpse of <span className="text-gradient">Summit 1.0</span></h2>
                    <p className="glimpse-subtitle" style={{ textAlign: 'justify' }}>Relive the moments from our previous summit.</p>

                    <div className="glimpse-grid">
                        {previousEventImages.map((item) => (
                            <div
                                key={item.id}
                                className="about-glimpse-card"
                                onClick={() => setSelectedImage(item.image)}
                            >
                                <div className="about-glimpse-image">
                                    <img src={item.image} alt={item.title} loading="lazy" />
                                    <div className="about-glimpse-overlay"><Image size={24} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>





                {/* Who Should Attend */}
                <section className="audience-section">
                    <h2>Who Should Attend?</h2>
                    <div className="audience-grid">
                        <div className="audience-card">
                            <h3>Engineering Students</h3>
                            <p style={{ textAlign: 'justify' }}>Students from Electronics, Computer Science, and related fields interested in semiconductor technology</p>
                        </div>
                        <div className="audience-card">
                            <h3>Aspiring Engineers</h3>
                            <p style={{ textAlign: 'justify' }}>Those looking to build a career in VLSI design, chip architecture, or embedded systems</p>
                        </div>
                        <div className="audience-card">
                            <h3>Tech Enthusiasts</h3>
                            <p style={{ textAlign: 'justify' }}>Anyone passionate about learning cutting-edge semiconductor technologies and industry trends</p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="stats-section">
                    <div className="stat-item">
                        <h3>200+</h3>
                        <p>Expected Attendees</p>
                    </div>
                    <div className="stat-item">
                        <h3>15+</h3>
                        <p>Industry Experts</p>
                    </div>
                    <div className="stat-item">
                        <h3>12</h3>
                        <p>Curated Events</p>
                    </div>
                    <div className="stat-item">
                        <h3>3</h3>
                        <p>Days of Learning</p>
                    </div>
                    <div className="stat-item">
                        <h3>10+</h3>
                        <p>Internship Opportunities</p>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="about-cta">
                    <h2>Ready to Join the Summit?</h2>
                    <p style={{ textAlign: 'justify' }}>Register now and be part of this amazing learning experience</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Register Now →
                    </Link>
                </section>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
                        <img src={selectedImage} alt="Large View" />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default About;
