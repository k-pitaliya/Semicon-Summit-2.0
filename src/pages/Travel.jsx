import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Train, Hotel, Bus, Phone, MapPin, AlertTriangle,
    ChevronDown, ExternalLink, Navigation, ArrowRight,
    Sparkles, Info, Building2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './Travel.css';

// ── Data ─────────────────────────────────────────────────────────────────────

const RAILWAY_STATIONS = [
    {
        name: 'Nadiad Railway Station',
        detail: 'Closest station to CHARUSAT campus',
        mapUrl: 'https://maps.app.goo.gl/D8GJUJxaK5CRtHmCA',
        color: '#22c55e'
    },
    {
        name: 'Anand Railway Station',
        detail: 'Well connected — ~15 min from campus',
        mapUrl: 'https://maps.app.goo.gl/2fF7846UrahZyh7TA',
        color: '#14b8a6'
    }
];

const ACCOMMODATION = [
    {
        id: 'vadtal',
        name: 'Vadtaldham Mandir – Harikrushna Utara',
        tag: 'Recommended',
        color: '#f59e0b',
        mapUrl: 'https://maps.app.goo.gl/z2SWS7D2GYKDQTr16',
        description: 'Comfortable and economical accommodation available on a sharing basis.',
        pricing: [
            { label: 'AC Room', price: '₹800', note: 'per person' },
            { label: 'Non-AC Room', price: '₹500', note: 'per person' },
        ],
        deposit: 'Security Deposit: Applicable (Refundable at checkout)',
        note: 'All room booking arrangements must be made personally by the participants.'
    },
    {
        id: 'hostel',
        name: 'CHARUSAT Hostel (Boys Section)',
        tag: 'Limited Availability',
        color: '#6366f1',
        mapUrl: 'https://www.charusat.ac.in/hostels#:~:text=Other%20Details-,Boys%27%20Hostels,-Boys%E2%80%99%20hostels%20are',
        description: 'Limited accommodation may be available in the Boys Hostel Section.',
        note: 'Participants must contact hostel authorities directly for booking and availability. All arrangements to be made individually.'
    }
];

const TRANSPORT_CITIES = [
    {
        city: 'Ahmedabad',
        color: '#22c55e',
        operators: [
            {
                name: 'Shri Brahmani Travels',
                contacts: [
                    { person: 'Jitubhai Patel', number: '9426753509' },
                    { person: 'Dipakbhai Patel', number: '9427300082' }
                ],
                routes: ['Maninagar', 'Naroda', 'S.P. Ring Road', 'Sola Road', 'R.T.O.']
            }
        ]
    },
    {
        city: 'Anand / Vidhyanagar / Bakrol',
        color: '#14b8a6',
        operators: [
            {
                name: 'Shri Dhanlaxmi Travels',
                contacts: [
                    { person: 'Indrajitbhai', number: '9979100479' },
                    { person: 'Indrajitbhai (Alt)', number: '9265250430' }
                ],
                routes: ['Anand', 'V.V. Nagar', 'Bakrol']
            },
            {
                name: 'Waiting 4 You Travels',
                contacts: [
                    { person: 'Kiritbhai Machhi', number: '9898469027' },
                    { person: 'Kiritbhai Machhi (Alt)', number: '9558227150' }
                ],
                routes: ['Anand', 'V.V. Nagar', 'Bakrol']
            }
        ]
    },
    {
        city: 'Vadodara',
        color: '#f59e0b',
        operators: [
            {
                name: 'Shri Bansari Travels',
                contacts: [
                    { person: 'Tarakbhai', number: '9825081590' },
                    { person: 'Tarakbhai (Alt)', number: '9825415074' }
                ],
                routes: ['All Routes – Vadodara']
            },
            {
                name: 'Shri Sunita Travels',
                contacts: [
                    { person: 'Jagdishbhai', number: '9426561722' },
                    { person: 'Rakeshbhai', number: '9724190723' }
                ],
                routes: ['All Routes – Vadodara']
            },
            {
                name: 'Shri Jay Mataji Travels',
                contacts: [
                    { person: 'Someshbhai', number: '9427839755' }
                ],
                routes: ['All Routes – Vadodara']
            }
        ]
    },
    {
        city: 'Khambhat',
        color: '#ec4899',
        operators: [
            {
                name: 'Roshan Travels',
                contacts: [
                    { person: 'Yunush Bhai', number: '9537788237' }
                ],
                routes: ['Khambhat', 'Dharmaj', 'Petlad']
            }
        ]
    },
    {
        city: 'Nadiad',
        color: '#8b5cf6',
        operators: [
            {
                name: 'Contact',
                contacts: [
                    { person: 'Harshadbhai Kadiya', number: '9879950580' }
                ],
                routes: ['Nadiad']
            }
        ]
    },
    {
        city: 'Borsad & Anklav Taluka',
        color: '#f97316',
        operators: [
            {
                name: 'Baba Ramdev Travels',
                contacts: [
                    { person: 'Arjun Solanki', number: '9624720956' }
                ],
                routes: [
                    'Bhadran', 'Valvod', 'Bhadraniya', 'Sisva', 'Kinkhlod',
                    'Zarola', 'Ras', 'Rudel', 'Bochasan',
                    'Asodar', 'Anklav', 'Joshikuva', 'Kanthariya', 'Khadol (H)',
                    'Davol', 'Bodal', 'Pamol', 'Dahemi',
                    'Borsad', 'Vasna (Borsad)', 'Dedarda', 'Vahera', 'Kavitha',
                    'Santokpura', 'Virol', 'Simarada', 'Rupiyapura',
                    'Nisaraya', 'Koshindra', 'Alarsa'
                ]
            }
        ]
    },
    {
        city: 'Dakor',
        color: '#06b6d4',
        operators: [
            {
                name: 'Shri Jay Ranchhod Travels',
                contacts: [
                    { person: 'Sandipkumar Parmar', number: '8511545342' },
                    { person: 'Sandipkumar Parmar (Alt)', number: '8511486892' }
                ],
                routes: ['Dakor', 'Umreth', 'Lingda', 'Pansora']
            }
        ]
    }
];

// ── Component ─────────────────────────────────────────────────────────────────

const Travel = () => {
    const [openCity, setOpenCity] = useState(0); // first city open by default

    const toggleCity = (idx) => {
        setOpenCity(openCity === idx ? null : idx);
    };

    return (
        <div className="travel-page">
            <Navbar />

            {/* ── HERO ── */}
            <section className="travel-hero">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    <ParticleField count={35} />
                </div>
                <div className="travel-hero-content">
                    <div className="travel-hero-badge">
                        <Navigation size={16} />
                        <span>Getting Here</span>
                    </div>
                    <h1>Travel <span className="text-gradient">&amp; Stay</span></h1>
                    <p>Everything you need to plan your trip to Semiconductor Summit 2.0 at CHARUSAT, Changa.</p>
                </div>
            </section>

            <div className="travel-container">

                {/* ── IMPORTANT NOTICE ── */}
                <div className="travel-notice">
                    <div className="notice-icon">
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <strong>Accommodation Notice</strong>
                        <p>CHARUSAT will <strong>not</strong> provide accommodation. All participants must arrange their own stay well in advance. Refer to the options below for suggested places.</p>
                    </div>
                </div>

                {/* ── RAILWAY STATIONS ── */}
                <section className="travel-section">
                    <div className="travel-section-header">
                        <div className="travel-section-icon" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#22c55e' }}>
                            <Train size={24} />
                        </div>
                        <div>
                            <h2>Nearest <span className="text-gradient">Railway Stations</span></h2>
                            <p className="travel-section-sub">Both stations are well connected to major cities and located near CHARUSAT campus.</p>
                        </div>
                    </div>

                    <div className="station-grid">
                        {RAILWAY_STATIONS.map((stn, i) => (
                            <a
                                key={i}
                                href={stn.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="station-card"
                                style={{ '--accent': stn.color }}
                            >
                                <div className="station-icon">
                                    <Train size={20} />
                                </div>
                                <div className="station-info">
                                    <div className="station-name">{stn.name}</div>
                                    <div className="station-detail">{stn.detail}</div>
                                </div>
                                <div className="station-link">
                                    <MapPin size={14} />
                                    <span>Open Map</span>
                                    <ExternalLink size={12} />
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* ── ACCOMMODATION ── */}
                <section className="travel-section">
                    <div className="travel-section-header">
                        <div className="travel-section-icon" style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.25)', color: '#f59e0b' }}>
                            <Hotel size={24} />
                        </div>
                        <div>
                            <h2>Accommodation <span style={{ color: '#f59e0b' }}>Options</span></h2>
                            <p className="travel-section-sub">Suggested places to stay near CHARUSAT — all bookings to be made directly by participants.</p>
                        </div>
                    </div>

                    <div className="accom-grid">
                        {ACCOMMODATION.map((place) => (
                            <div key={place.id} className="accom-card" style={{ '--accent': place.color }}>
                                <div className="accom-card-glow" />
                                <div className="accom-header">
                                    <div>
                                        <span className="accom-tag" style={{ color: place.color, background: `${place.color}18`, borderColor: `${place.color}30` }}>
                                            {place.tag}
                                        </span>
                                        <h3>{place.name}</h3>
                                        <p>{place.description}</p>
                                    </div>
                                </div>

                                {place.pricing && (
                                    <div className="accom-pricing">
                                        {place.pricing.map((p, i) => (
                                            <div key={i} className="price-row">
                                                <span className="price-label">{p.label}</span>
                                                <span className="price-value" style={{ color: place.color }}>{p.price}</span>
                                                <span className="price-note">{p.note}</span>
                                            </div>
                                        ))}
                                        {place.deposit && (
                                            <div className="price-deposit">
                                                <Info size={13} />
                                                <span>{place.deposit}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="accom-note">
                                    <Info size={14} />
                                    <span>{place.note}</span>
                                </div>

                                <a href={place.mapUrl} target="_blank" rel="noopener noreferrer" className="accom-map-btn" style={{ color: place.color, borderColor: `${place.color}40` }}>
                                    <MapPin size={15} />
                                    View on Map
                                    <ExternalLink size={13} />
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── TRANSPORTATION ── */}
                <section className="travel-section">
                    <div className="travel-section-header">
                        <div className="travel-section-icon" style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.25)', color: '#818cf8' }}>
                            <Bus size={24} />
                        </div>
                        <div>
                            <h2>Transportation <span style={{ color: '#818cf8' }}>by City</span></h2>
                            <p className="travel-section-sub">Private travel agencies operating routes to CHARUSAT. Contact them directly for schedules and booking.</p>
                        </div>
                    </div>

                    <div className="transport-accordion">
                        {TRANSPORT_CITIES.map((entry, idx) => (
                            <div
                                key={idx}
                                className={`transport-item ${openCity === idx ? 'open' : ''}`}
                                style={{ '--accent': entry.color }}
                            >
                                <button
                                    className="transport-toggle"
                                    onClick={() => toggleCity(idx)}
                                    aria-expanded={openCity === idx}
                                >
                                    <div className="transport-toggle-left">
                                        <div className="transport-city-dot" />
                                        <span className="transport-city-name">{entry.city}</span>
                                        <span className="transport-op-count">
                                            {entry.operators.length} {entry.operators.length === 1 ? 'operator' : 'operators'}
                                        </span>
                                    </div>
                                    <ChevronDown size={18} className="transport-chevron" />
                                </button>

                                <div className="transport-body">
                                    <div className="transport-operators">
                                        {entry.operators.map((op, oi) => (
                                            <div key={oi} className="operator-card">
                                                <div className="operator-name">
                                                    <Building2 size={15} />
                                                    {op.name}
                                                </div>
                                                <div className="operator-contacts">
                                                    {op.contacts.map((c, ci) => (
                                                        <a
                                                            key={ci}
                                                            href={`tel:${c.number}`}
                                                            className="contact-chip"
                                                        >
                                                            <Phone size={12} />
                                                            <span className="contact-person">{c.person}</span>
                                                            <span className="contact-number">{c.number}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                                <div className="operator-routes">
                                                    <span className="routes-label">Routes Covered:</span>
                                                    <div className="routes-tags">
                                                        {op.routes.map((r, ri) => (
                                                            <span key={ri} className="route-tag">{r}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transport disclaimer */}
                    <div className="transport-disclaimer">
                        <AlertTriangle size={16} />
                        <p>All transportation facilities are provided by <strong>private agencies</strong>. Participants must contact operators directly for updated schedules, availability, and booking details.</p>
                    </div>
                </section>

                {/* ── CTA ── */}
                <div className="travel-cta">
                    <Sparkles size={28} className="travel-cta-icon" />
                    <h3>Ready to Attend?</h3>
                    <p>Secure your spot at Semiconductor Summit 2.0</p>
                    <div className="travel-cta-btns">
                        <Link to="/register" className="btn btn-primary">
                            Register Now — ₹299 <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn btn-secondary">
                            Have Questions?
                        </Link>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Travel;
