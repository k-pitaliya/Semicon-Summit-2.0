import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ submitted: false, error: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormStatus({ submitted: false, error: '' });

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setFormStatus({ submitted: true, error: '' });
            setLoading(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const venue = {
        name: 'Electronics and Communication Department (A6 Building), CHARUSAT',
        address: 'Department of EC Engineering - CSPIT, EC Department (A6 Building), CHARUSAT, Changa, Gujarat - 388421',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.8!2d72.8168!3d22.5988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4e7439a2e021%3A0x9f4c4b1dfb8a586a!2sCHARUSAT!5e0!3m2!1sen!2sin!4v1700000000000'
    };

    return (
        <div className="contact-page" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-bg">
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" />
                <div className="hero-glow hero-glow-2" />
                <ParticleField count={40} />
            </div>
            <Navbar />
            <div className="contact-container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="contact-header">
                    <h1>Get in <span className="text-gradient">Touch</span></h1>
                    <p>Have questions? We'd love to hear from you</p>
                </div>

                <div className="contact-content">
                    {/* Contact Info */}
                    <div className="contact-info-section">
                        <h2>Contact Information</h2>
                        <p className="info-subtitle">Reach out to us through any of these channels</p>

                        <div className="contact-cards">
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3>Email</h3>
                                    <a href="mailto:semisummit.ec@charusat.ac.in">semisummit.ec@charusat.ac.in</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3>Phone</h3>
                                    <a href="tel:+916353933976">Dhruv Rupapara: +91 63539 33976</a>
                                    <br />
                                    <a href="tel:+918320166738">Man Bhimani: +91 83201 66738</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3>Location</h3>
                                    <p>Department of Electronics and Communication Engineering - CSPIT<br />EC Department (A6 Building), CHARUSAT<br />Changa, Gujarat - 388421</p>
                                </div>
                            </div>
                        </div>

                        <div className="office-hours">
                            <h3>Office Hours</h3>
                            <p><strong>Monday - Saturday:</strong> 9:10 AM - 4:20 PM</p>
                            <p><strong>Sunday:</strong> Closed</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>

                        {formStatus.submitted ? (
                            <div className="success-message">
                                <CheckCircle size={48} />
                                <h3>Message Sent Successfully!</h3>
                                <p>Thank you for reaching out. We'll get back to you soon.</p>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setFormStatus({ submitted: false, error: '' })}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email <span className="required">*</span></label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message <span className="required">*</span></label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>

                                {formStatus.error && (
                                    <div className="error-message">
                                        {formStatus.error}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    <Send size={20} />
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Map Section */}
                <div className="contact-map-section">
                    <h2>Find Us <span className="text-gradient">Here</span></h2>
                    <div className="contact-map-wrapper">
                        <div className="contact-map-info">
                            <div className="map-info-icon"><MapPin size={28} /></div>
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
                        <div className="contact-map">
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

                {/* CTA */}
                <div className="contact-cta">
                    <h2>Ready to Register?</h2>
                    <p>Join us for an amazing learning experience</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Register Now
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
