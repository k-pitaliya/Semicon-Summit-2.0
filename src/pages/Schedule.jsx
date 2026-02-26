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
import { EVENT_IMAGES, ICON_MAP, EVENTS_DATA, FULL_SCHEDULE, EVENTS_MAP, DAYS } from '../data/scheduleData';

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
                                {(event.highlights ?? []).map((h, i) => (
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
                                    {(event.rules ?? []).map((r, i) => (
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
                        <Sparkles size={14} /> ALL (10+ EVENTS) • ₹299 ONLY
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
                            <span className="tab-count">{EVENTS_DATA.length} events</span>
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
                                    <span className="tab-count">({eventCount} events)</span>
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
                                        ({getEventCount(day.id)} events) · {getTotalItems(day.id)} activities
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
                            <p>Register now for all 10+ events — Only ₹299</p>
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
