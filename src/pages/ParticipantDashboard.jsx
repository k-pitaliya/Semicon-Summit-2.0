import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Calendar, Bell, Image, LogOut,
    ChevronRight, ExternalLink
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './Dashboard.css'

const ParticipantDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [announcements, setAnnouncements] = useState([])
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)

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

    return (
        <div className="dashboard-page" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background */}
            <div className="hero-bg" style={{ zIndex: 0, opacity: 0.5 }}>
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
                                    <span className="profile-value">{user?.college || 'Tech University'}</span>
                                </div>
                                <div className="profile-row">
                                    <span className="profile-label">Phone</span>
                                    <span className="profile-value">{user?.phone || '+91 98765 43210'}</span>
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
                            {(user?.selectedEvents || ['VLSI Design Workshop', 'Chip Architecture Talk']).map((event, index) => (
                                <div key={index} className="event-item card">
                                    <div className="event-item-icon">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="event-item-info">
                                        <h4>{event}</h4>
                                        <p>Scheduled time will be announced soon</p>
                                    </div>
                                    <ChevronRight size={20} className="event-item-arrow" />
                                </div>
                            ))}
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
                                                {announcement.date ? new Date(announcement.date).toLocaleDateString() : 'N/A'}
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
            </main>
        </div>
    )
}

export default ParticipantDashboard
