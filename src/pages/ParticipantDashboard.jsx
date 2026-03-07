import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Calendar, Bell, Image, LogOut,
    ChevronRight, ChevronDown, ExternalLink, Edit2, Check, X, MessageCircle, Plus, MapPin, Clock, Info
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './Dashboard.css'

const WHATSAPP_LINK = 'https://chat.whatsapp.com/EoU5wuK8RZi2TFSgJLnBcD'

const EVENT_DETAILS = {
    panelDiscussion: {
        emoji: '🎙️',
        description: 'Kick off the summit with an inspiring inaugural ceremony followed by a thought-provoking panel discussion bringing together industry leaders and academic experts in semiconductor technology.',
        venue: 'Main Auditorium, CHARUSAT',
        time: '10:00 AM – 11:30 AM',
        highlights: ['Keynote address by industry leaders', 'Multi-speaker panel on semiconductor trends', 'Live Q&A session with experts'],
        whatToBring: 'College ID, Registration ID',
    },
    'rtl-gds': {
        emoji: '🔬',
        description: 'A hands-on full-day workshop covering RTL design fundamentals through to GDSII sign-off, with self-checking testbench development using industry-standard EDA tools.',
        venue: 'Computer Lab — Block A, CHARUSAT',
        time: '1:30 PM – 4:30 PM',
        highlights: ['RTL design & synthesis flow', 'Self-checking testbench creation', 'GDSII sign-off concepts'],
        whatToBring: 'Laptop (recommended), Notebook & pen',
    },
    fpga: {
        emoji: '⚡',
        description: 'Get hands-on with FPGA interfacing techniques, learning peripheral integration and real-time hardware programming on industry-used FPGA development boards.',
        venue: 'VLSI Lab, CHARUSAT',
        time: '1:30 PM – 4:30 PM',
        highlights: ['FPGA peripheral interfacing', 'Real-time hardware programming', 'Hands-on lab sessions with boards'],
        whatToBring: 'Laptop (recommended), Notebook & pen',
    },
    expertInsights: {
        emoji: '💡',
        description: 'An expert-led technical session exploring the differences, opportunities, and career paths in VLSI design vs Embedded Systems — helping you chart your specialisation.',
        venue: 'Seminar Hall, CHARUSAT',
        time: '9:30 AM – 11:30 AM',
        highlights: ['Industry speaker panel', 'VLSI vs Embedded career comparison', 'Live Q&A with domain experts'],
        whatToBring: 'College ID, Questions for the speaker',
    },
    sharkTank: {
        emoji: '🦈',
        description: 'Pitch your semiconductor startup idea to a panel of industry investors and mentors. Top teams win prizes and mentorship opportunities in this high-energy business competition.',
        venue: 'Seminar Hall, CHARUSAT',
        time: '12:30 PM – 4:30 PM',
        highlights: ['Multiple pitch rounds', 'Panel of investor judges', 'Cash prizes & mentorship for top teams'],
        whatToBring: 'Pitch deck / presentation, Laptop',
    },
    aiInVlsi: {
        emoji: '🤖',
        description: 'Explore how Artificial Intelligence is transforming VLSI design and verification — covering AI-driven EDA tools, ML-based testing, and the future of next-gen chip design.',
        venue: 'Main Auditorium, CHARUSAT',
        time: '9:30 AM – 11:00 AM',
        highlights: ['AI-driven EDA & automation tools', 'ML-based design verification', 'Future of next-gen chip design'],
        whatToBring: 'College ID, Notebook & pen',
    },
    treasureHunt: {
        emoji: '🏆',
        description: 'An exciting team-based treasure hunt with semiconductor-themed puzzles hidden across campus. Test your knowledge, speed, and teamwork! Open to 1st and 2nd year students only.',
        venue: 'Campus-wide, CHARUSAT',
        time: 'Timing announced on Day 3 morning',
        highlights: ['Team-based puzzle solving', 'Campus-wide clue hunt', 'Prizes for top 3 teams'],
        whatToBring: 'Team of 3–4 members, College ID',
    },
    silentGallery: {
        emoji: '🖼️',
        description: 'A curated silent poster presentation where participants showcase their research and project work in semiconductor, VLSI, or embedded domains. Judges evaluate and award top posters.',
        venue: 'Exhibition Hall, CHARUSAT',
        time: 'Timing announced on Day 3 morning',
        highlights: ['Poster presentation format', 'Expert judges panel', 'Awards for top 3 entries'],
        whatToBring: 'A1/A0 printed poster, Registration ID',
    },
}

const ParticipantDashboard = () => {
    const { user, setUser, logout } = useAuth()
    const navigate = useNavigate()
    const [announcements, setAnnouncements] = useState([])
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)

    // Event expand/detail state
    const [expandedEvent, setExpandedEvent] = useState(null)

    // Event-update state
    const [showEventEditor, setShowEventEditor] = useState(false)
    const [eventDraft, setEventDraft] = useState({})
    const [eventSaving, setEventSaving] = useState(false)
    const [eventSaveMsg, setEventSaveMsg] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch announcements from API
                const announcementsRes = await api.get('/announcements')
                setAnnouncements(announcementsRes.data.announcements ?? announcementsRes.data ?? [])

                // Fetch gallery images from API
                const galleryRes = await api.get('/gallery')
                setPhotos(galleryRes.data || [])
            } catch (error) {
                console.error('Error fetching data:', error)
                // Fallback to empty arrays
                setAnnouncements([])
                setPhotos([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])


    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
    }

    const isTreasureHuntEligible = !['4th Year'].includes(user?.yearOfStudy)

    const openEventEditor = () => {
        // Seed draft from current choices so checkboxes reflect current state
        setEventDraft(user?.eventChoices ? { ...user.eventChoices } : {})
        setEventSaveMsg('')
        setShowEventEditor(true)
    }

    const handleEventSave = async () => {
        setEventSaving(true)
        setEventSaveMsg('')
        try {
            const res = await api.patch('/participants/me/event-choices', { updates: eventDraft })
            // Update local user object so the "Registered Events" list refreshes instantly
            if (setUser) {
                setUser(prev => ({ ...prev, eventChoices: res.data.eventChoices }))
            }
            const msg = res.data.warnings?.length
                ? `Saved. Note: ${res.data.warnings.join('; ')}`
                : 'Events updated successfully!'
            setEventSaveMsg(msg)
            setTimeout(() => {
                setShowEventEditor(false)
                setEventSaveMsg('')
            }, 2000)
        } catch (err) {
            setEventSaveMsg(err.response?.data?.error || 'Failed to save. Please try again.')
        } finally {
            setEventSaving(false)
        }
    }

    return (
        <div className="dashboard-page" style={{ position: 'relative' }}>
            {/* Background */}
            <div className="hero-bg" style={{ zIndex: 0, opacity: 0.5, overflow: 'hidden', pointerEvents: 'none' }}>
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" style={{ top: '-20%', left: '20%', opacity: 0.3 }} />
            </div>

            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon-small">SS</div>
                        <span>Summit 2.0</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a href="#profile" className="nav-item active">
                        <User size={20} />
                        <span>Profile</span>
                    </a>
                    <a href="#events" className="nav-item">
                        <Calendar size={20} />
                        <span>My Events</span>
                    </a>
                    <a href="#announcements" className="nav-item">
                        <Bell size={20} />
                        <span>Announcements</span>
                    </a>
                    <a href="#gallery" className="nav-item">
                        <Image size={20} />
                        <span>Gallery</span>
                    </a>
                    <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-item"
                        style={{ color: '#22c55e' }}
                    >
                        <MessageCircle size={20} />
                        <span>WhatsApp Group</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main" style={{ position: 'relative', zIndex: 1 }}>
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {user?.name || 'Participant'}!</h1>
                        <p>Your participant dashboard</p>
                    </div>
                    <div className="header-actions">
                        <span className="badge badge-success">Registered</span>
                    </div>
                </header>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem', color: 'rgba(148,163,184,0.8)' }}>
                        <div className="loading-spinner-small" style={{ width: '40px', height: '40px' }} />
                        <span>Loading your dashboard...</span>
                    </div>
                ) : (
                    <div className="dashboard-content">
                        {/* Profile Section */}
                        <section id="profile" className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Your Profile</h2>
                            </div>
                            <div className="profile-card card">
                                <div className="profile-avatar">
                                    <User size={32} />
                                </div>
                                {user?.registrationId && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginBottom: '1.2rem'
                                    }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                                            border: '1.5px solid rgba(99,179,237,0.5)',
                                            borderRadius: '12px',
                                            padding: '0.6rem 1.4rem',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.9)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Your Registration ID</div>
                                            <div style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '0.04em', color: '#93c5fd', fontFamily: 'monospace' }}>{user.registrationId}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="profile-info">
                                    <div className="profile-row">
                                        <span className="profile-label">Name</span>
                                        <span className="profile-value">{user?.name || 'John Doe'}</span>
                                    </div>
                                    <div className="profile-row">
                                        <span className="profile-label">Email</span>
                                        <span className="profile-value">{user?.email || 'user@example.com'}</span>
                                    </div>
                                    <div className="profile-row">
                                        <span className="profile-label">College</span>
                                        <span className="profile-value">{user?.college || '—'}</span>
                                    </div>
                                    {user?.department && (
                                        <div className="profile-row">
                                            <span className="profile-label">Department</span>
                                            <span className="profile-value">{user.department}</span>
                                        </div>
                                    )}
                                    {user?.yearOfStudy && (
                                        <div className="profile-row">
                                            <span className="profile-label">Year</span>
                                            <span className="profile-value">{user.yearOfStudy}</span>
                                        </div>
                                    )}
                                    {user?.studentId && (
                                        <div className="profile-row">
                                            <span className="profile-label">Student ID</span>
                                            <span className="profile-value">{user.studentId}</span>
                                        </div>
                                    )}
                                    {user?.universityEmail && (
                                        <div className="profile-row">
                                            <span className="profile-label">University Email</span>
                                            <span className="profile-value">{user.universityEmail}</span>
                                        </div>
                                    )}
                                    <div className="profile-row">
                                        <span className="profile-label">Phone</span>
                                        <span className="profile-value">{user?.phone || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Events Section */}
                        <section id="events" className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Registered Events</h2>
                            </div>
                            <div className="events-list">
                                {(() => {
                                    // Build event list from eventChoices (new format) or selectedEvents (legacy)
                                    const ec = user?.eventChoices || {}
                                    const derived = []
                                    // Day 1
                                    if (ec.panelDiscussion)
                                        derived.push({ key: 'panelDiscussion', name: 'Inaugural Talk & Panel Discussion', day: 'Day 1 — 17 Mar', note: '10:00 – 11:30 AM' })
                                    if (ec.day1Workshop === 'rtl-gds')
                                        derived.push({ key: 'rtl-gds', name: 'RTL & Self-Checking Testbench Workshop', day: 'Day 1 — 17 Mar', note: 'Full-day technical workshop · 1:30 – 4:30 PM' })
                                    else if (ec.day1Workshop === 'fpga')
                                        derived.push({ key: 'fpga', name: 'FPGA Interfacing Workshop', day: 'Day 1 — 17 Mar', note: 'Full-day technical workshop · 1:30 – 4:30 PM' })
                                    // Day 2
                                    if (ec.expertInsights)
                                        derived.push({ key: 'expertInsights', name: 'Expert Insights: VLSI vs Embedded', day: 'Day 2 — 18 Mar', note: '9:30 – 11:30 AM' })
                                    if (ec.sharkTank)
                                        derived.push({ key: 'sharkTank', name: 'Silicon Shark Tank', day: 'Day 2 — 18 Mar', note: 'Business pitch competition · 12:30 – 4:30 PM' })
                                    // Day 3
                                    if (ec.aiInVlsi)
                                        derived.push({ key: 'aiInVlsi', name: 'AI-Powered VLSI: Next-Gen Design Verification', day: 'Day 3 — 19 Mar', note: '9:30 – 11:00 AM' })
                                    if (ec.treasureHunt)
                                        derived.push({ key: 'treasureHunt', name: 'Silicon Jackpot (Treasure Hunt)', day: 'Day 3 — 19 Mar', note: 'Team-based treasure hunt' })
                                    if (ec.silentGallery)
                                        derived.push({ key: 'silentGallery', name: 'Silicon Silent Gallery', day: 'Day 3 — 19 Mar', note: 'Poster presentation' })

                                    // Fallback for legacy users with selectedEvents array
                                    const legacy = (user?.selectedEvents || []).filter(e =>
                                        !derived.some(d => d.name === e)
                                    ).map(e => ({ name: e, day: '', note: 'Scheduled time will be announced soon' }))

                                    const all = [...derived, ...legacy]

                                    if (all.length === 0) {
                                        return (
                                            <div className="empty-state">
                                                <Calendar size={32} />
                                                <p>No events registered yet</p>
                                            </div>
                                        )
                                    }

                                    return all.map((event, index) => {
                                        const isOpen = expandedEvent === index
                                        const details = EVENT_DETAILS[event.key]
                                        return (
                                            <div key={index} className="event-item card" style={{ flexDirection: 'column', alignItems: 'stretch', cursor: details ? 'pointer' : 'default', padding: 0, overflow: 'hidden' }}>
                                                {/* Header row — always visible */}
                                                <div
                                                    onClick={() => details && setExpandedEvent(isOpen ? null : index)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem' }}
                                                >
                                                    <div className="event-item-icon" style={{ fontSize: details?.emoji ? '1.4rem' : undefined }}>
                                                        {details?.emoji ?? <Calendar size={20} />}
                                                    </div>
                                                    <div className="event-item-info" style={{ flex: 1 }}>
                                                        <h4 style={{ margin: 0 }}>{event.name}</h4>
                                                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem' }}>
                                                            {event.day ? `${event.day} · ` : ''}{event.note}
                                                        </p>
                                                    </div>
                                                    {details && (
                                                        isOpen
                                                            ? <ChevronDown size={18} style={{ flexShrink: 0, color: '#00e5ff', transition: 'transform 0.2s' }} />
                                                            : <ChevronRight size={18} style={{ flexShrink: 0, opacity: 0.5, transition: 'transform 0.2s' }} />
                                                    )}
                                                </div>

                                                {/* Expanded detail panel */}
                                                {isOpen && details && (
                                                    <div style={{
                                                        borderTop: '1px solid rgba(148,163,184,0.12)',
                                                        padding: '1rem 1.25rem 1.25rem',
                                                        background: 'rgba(0,229,255,0.03)',
                                                        animation: 'fadeIn 0.18s ease'
                                                    }}>
                                                        <p style={{ color: 'rgba(148,163,184,0.85)', fontSize: '0.875rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
                                                            {details.description}
                                                        </p>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem' }}>
                                                                <Clock size={14} style={{ color: '#00e5ff', marginTop: 2, flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', color: 'rgba(148,163,184,0.55)', fontSize: '0.72rem', marginBottom: 1 }}>TIME</span>
                                                                    <span style={{ color: 'rgba(226,232,240,0.9)' }}>{details.time}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem' }}>
                                                                <MapPin size={14} style={{ color: '#00e5ff', marginTop: 2, flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', color: 'rgba(148,163,184,0.55)', fontSize: '0.72rem', marginBottom: 1 }}>VENUE</span>
                                                                    <span style={{ color: 'rgba(226,232,240,0.9)' }}>{details.venue}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ marginBottom: '0.85rem' }}>
                                                            <p style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.55)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>What to expect</p>
                                                            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                                {details.highlights.map((h, i) => (
                                                                    <li key={i} style={{ color: 'rgba(226,232,240,0.8)', fontSize: '0.82rem' }}>{h}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, padding: '0.6rem 0.8rem' }}>
                                                            <Info size={13} style={{ color: '#fbbf24', marginTop: 2, flexShrink: 0 }} />
                                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(251,191,36,0.9)' }}>
                                                                <strong>What to bring: </strong>{details.whatToBring}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                })()}
                            </div>
                        </section>

                        {/* Update My Events Section */}
                        <section id="update-events" className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Update My Events</h2>
                                {!showEventEditor && (
                                    <button
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={openEventEditor}
                                    >
                                        <Edit2 size={16} style={{ marginRight: 6 }} />
                                        Add Events
                                    </button>
                                )}
                            </div>
                            {showEventEditor ? (
                                <div className="card" style={{ padding: '1.5rem' }}>
                                    <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                        ✅ You can add new events. <strong>Already enrolled events cannot be removed.</strong>
                                    </p>

                                    {/* Boolean toggle events */}
                                    {[
                                        { key: 'panelDiscussion', label: 'Inaugural Talk & Panel Discussion', day: 'Day 1 — 17 Mar' },
                                        { key: 'expertInsights', label: 'Expert Insights: VLSI vs Embedded', day: 'Day 2 — 18 Mar' },
                                        { key: 'aiInVlsi', label: 'AI-Powered VLSI: Next-Gen Design Verification', day: 'Day 3 — 19 Mar' },
                                        { key: 'sharkTank', label: 'Silicon Shark Tank', day: 'Day 2 — 18 Mar' },
                                        { key: 'treasureHunt', label: 'Silicon Jackpot (Treasure Hunt)', day: 'Day 3 — 19 Mar' },
                                        { key: 'silentGallery', label: 'Silicon Silent Gallery', day: 'Day 3 — 19 Mar' },
                                    ].map(ev => {
                                        const enrolled = user?.eventChoices?.[ev.key] === true
                                        const restricted = ev.key === 'treasureHunt' && !isTreasureHuntEligible
                                        return (
                                            <div
                                                key={ev.key}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    marginBottom: '0.6rem', padding: '0.75rem', borderRadius: '8px',
                                                    background: enrolled ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                                                    border: `1px solid ${enrolled ? 'rgba(34,197,94,0.3)' : 'rgba(148,163,184,0.1)'}`,
                                                    opacity: restricted && !enrolled ? 0.6 : 1,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`ev-${ev.key}`}
                                                    checked={eventDraft[ev.key] === true}
                                                    disabled={enrolled || restricted}
                                                    onChange={e => setEventDraft(prev => ({ ...prev, [ev.key]: e.target.checked }))}
                                                    style={{ width: 16, height: 16, accentColor: '#00e5ff', flexShrink: 0 }}
                                                />
                                                <label htmlFor={`ev-${ev.key}`} style={{ flex: 1, cursor: enrolled || restricted ? 'default' : 'pointer', margin: 0 }}>
                                                    <span style={{ fontWeight: 500, color: enrolled ? '#22c55e' : 'inherit' }}>{ev.label}</span>
                                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(148,163,184,0.65)' }}>{ev.day}</span>
                                                </label>
                                                {enrolled && <span style={{ fontSize: '0.72rem', color: '#22c55e', whiteSpace: 'nowrap' }}>✓ Enrolled</span>}
                                                {restricted && !enrolled && <span style={{ fontSize: '0.72rem', color: '#f59e0b', whiteSpace: 'nowrap' }}>4th year not eligible</span>}
                                            </div>
                                        )
                                    })}

                                    {/* Day 1 Workshop (radio, add-only) */}
                                    {(() => {
                                        const current = user?.eventChoices?.day1Workshop
                                        return (
                                            <div style={{
                                                marginTop: '0.5rem', marginBottom: '0.6rem', padding: '0.75rem', borderRadius: '8px',
                                                background: current ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                                                border: `1px solid ${current ? 'rgba(34,197,94,0.3)' : 'rgba(148,163,184,0.1)'}`,
                                            }}>
                                                <p style={{ fontWeight: 500, marginBottom: '0.5rem', margin: '0 0 0.5rem' }}>
                                                    Day 1 Workshop
                                                    <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.65)', marginLeft: 8 }}>Day 1 — 17 Mar</span>
                                                </p>
                                                {current ? (
                                                    <p style={{ fontSize: '0.85rem', color: '#22c55e', margin: 0 }}>
                                                        ✓ Enrolled: {current === 'rtl-gds' ? 'RTL & Self-Checking Testbench Workshop' : 'FPGA Interfacing Workshop'}
                                                    </p>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                                                        {[
                                                            { value: 'rtl-gds', label: 'RTL & Self-Checking Testbench Workshop' },
                                                            { value: 'fpga', label: 'FPGA Interfacing Workshop' },
                                                        ].map(opt => (
                                                            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                                                <input
                                                                    type="radio"
                                                                    name="day1WorkshopDraft"
                                                                    value={opt.value}
                                                                    checked={eventDraft.day1Workshop === opt.value}
                                                                    onChange={e => setEventDraft(prev => ({ ...prev, day1Workshop: e.target.value }))}
                                                                    style={{ accentColor: '#00e5ff' }}
                                                                />
                                                                {opt.label}
                                                            </label>
                                                        ))}
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'rgba(148,163,184,0.65)' }}>
                                                            <input
                                                                type="radio"
                                                                name="day1WorkshopDraft"
                                                                value=""
                                                                checked={!eventDraft.day1Workshop}
                                                                onChange={() => setEventDraft(prev => ({ ...prev, day1Workshop: '' }))}
                                                                style={{ accentColor: '#00e5ff' }}
                                                            />
                                                            None / Skip workshop
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })()}

                                    {eventSaveMsg && (
                                        <p style={{
                                            marginTop: '1rem', padding: '0.75rem', borderRadius: '8px',
                                            background: eventSaveMsg.includes('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)',
                                            color: eventSaveMsg.includes('✅') ? '#22c55e' : '#fbbf24',
                                            fontSize: '0.875rem', margin: '1rem 0 0',
                                        }}>
                                            {eventSaveMsg}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                                        <button className="btn btn-primary" onClick={handleEventSave} disabled={eventSaving}>
                                            {eventSaving ? 'Saving...' : <><Check size={16} style={{ marginRight: 6 }} />Save Changes</>}
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => { setShowEventEditor(false); setEventSaveMsg('') }}>
                                            <X size={16} style={{ marginRight: 6 }} />Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.875rem', margin: 0 }}>
                                    Want to join more events? Click <strong>Add Events</strong> above.
                                </p>
                            )}
                        </section>

                        {/* WhatsApp Community Section */}
                        <section id="whatsapp" className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Community</h2>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', flexWrap: 'wrap' }}>
                                <MessageCircle size={36} style={{ color: '#22c55e', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 180 }}>
                                    <h4 style={{ margin: 0 }}>Join the WhatsApp Group</h4>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(148,163,184,0.8)' }}>
                                        Stay updated with real-time announcements and connect with fellow participants.
                                    </p>
                                </div>
                                <a
                                    href={WHATSAPP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ background: '#22c55e', borderColor: '#22c55e', whiteSpace: 'nowrap', marginLeft: 'auto' }}
                                >
                                    <MessageCircle size={18} style={{ marginRight: 6 }} /> Join Group
                                </a>
                            </div>
                        </section>

                        {/* Announcements Section */}
                        <section id="announcements" className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Announcements</h2>
                            </div>
                            <div className="announcements-list">
                                {announcements.length === 0 ? (
                                    <div className="empty-state">
                                        <Bell size={32} />
                                        <p>No announcements yet</p>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <div key={announcement._id || announcement.id} className="announcement-item card">
                                            <div className="announcement-header">
                                                <h4>{announcement.title}</h4>
                                                <span className="announcement-date">
                                                    {(() => {
                                                        const raw = announcement.date || announcement.createdAt;
                                                        if (!raw) return 'N/A';
                                                        return new Date(raw).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        });
                                                    })()}
                                                </span>
                                            </div>
                                            <p>{announcement.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Gallery Section */}
                        <section id="gallery" className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Photo Gallery</h2>
                            </div>
                            <div className="gallery-grid">
                                {loading ? (
                                    <div className="loading-state">
                                        <div className="loading-spinner-small"></div>
                                        <span>Loading gallery...</span>
                                    </div>
                                ) : photos.length === 0 ? (
                                    <div className="empty-state">
                                        <Image size={32} />
                                        <p>No photos uploaded yet</p>
                                    </div>
                                ) : (
                                    photos.map((photo) => (
                                        <div key={photo._id || photo.id} className="gallery-item card">
                                            <div className="gallery-image-container">
                                                <img
                                                    src={photo.thumbnailUrl || photo.url}
                                                    alt={photo.title || photo.caption || 'Gallery image'}
                                                    className="gallery-img"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>
                                            <div className="gallery-caption">
                                                <h4>{photo.title || 'Untitled'}</h4>
                                                {photo.description && <p>{photo.description}</p>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                    </div>
                )}
            </main>
        </div >
    )
}

export default ParticipantDashboard
