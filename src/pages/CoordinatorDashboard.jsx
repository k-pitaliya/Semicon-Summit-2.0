import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Upload, Image, FileText, Bell, LogOut,
    Plus, Trash2, CheckCircle, X, AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './Dashboard.css'

const CoordinatorDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('photos')
    const [uploads, setUploads] = useState({
        photos: [],
        documents: [],
        // announcements removed from here
    })
    const [announcements, setAnnouncements] = useState([]) // Real API state
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })
    const [uploadStatus, setUploadStatus] = useState(null)
    const fileInputRef = useRef(null)
    const docInputRef = useRef(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [annRes, photosRes, docsRes] = await Promise.all([
                api.get('/announcements'),
                api.get('/gallery'),
                api.get('/uploads/documents')
            ])

            setAnnouncements(annRes.data.announcements ?? annRes.data ?? [])

            // Transform API data to match UI expected format
            const photos = (photosRes.data || []).map(p => ({
                id: p._id,
                name: p.title || 'Untitled',
                size: formatFileSize(p.bytes || 0),
                preview: p.url, // URL from server
                uploaded: new Date(p.createdAt).toLocaleDateString()
            }))

            const docs = (docsRes.data || []).map(d => ({
                id: d._id || d.id,
                name: d.originalName || d.filename,
                size: formatFileSize(d.size),
                type: (d.filename || '').split('.').pop(),
                uploaded: new Date(d.createdAt || d.uploadedAt).toLocaleDateString()
            }))

            setUploads({ photos, documents: docs })
        } catch (err) {
            console.error('Error fetching data:', err)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
    }

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            try {
                // Upload all files in a single request to /gallery endpoint
                const formData = new FormData()
                formData.append('title', 'Gallery Upload')
                formData.append('description', `Uploaded by ${user?.name || 'Coordinator'}`)
                formData.append('category', 'event')
                
                files.forEach(file => {
                    formData.append('images', file)
                })

                await api.post('/gallery', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                setUploadStatus({ type: 'success', message: `${files.length} photo(s) uploaded successfully` })
                fetchData() // Refresh list
                setTimeout(() => setUploadStatus(null), 3000)
            } catch (error) {
                console.error('Upload error:', error)
                setUploadStatus({ type: 'error', message: 'Failed to upload photos' })
            }
        }
    }

    const handleDocUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            try {
                for (const file of files) {
                    const formData = new FormData()
                    formData.append('documents', file)
                    await api.post('/uploads/documents', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                }

                setUploadStatus({ type: 'success', message: `${files.length} document(s) uploaded successfully` })
                fetchData() // Refresh list
                setTimeout(() => setUploadStatus(null), 3000)
            } catch (error) {
                console.error('Upload error:', error)
                setUploadStatus({ type: 'error', message: 'Failed to upload documents' })
            }
        }
    }

    const handleAddAnnouncement = async () => {
        if (newAnnouncement.title && newAnnouncement.content) {
            try {
                await api.post('/announcements', {
                    ...newAnnouncement,
                    role: 'coordinator',
                    postedBy: user._id
                })
                setNewAnnouncement({ title: '', content: '' })
                setUploadStatus({ type: 'success', message: 'Announcement posted successfully' })
                fetchData() // Refresh
                setTimeout(() => setUploadStatus(null), 3000)
            } catch (err) {
                setUploadStatus({ type: 'error', message: 'Failed to post announcement' })
            }
        }
    }

    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure you want to delete this item?')) return

        try {
            if (type === 'announcements') {
                await api.delete(`/announcements/${id}`)
            } else if (type === 'photos') {
                // Gallery endpoint - only faculty can delete
                alert('Only faculty members can delete gallery photos.')
                return
            } else {
                // type is 'documents'
                await api.delete(`/uploads/${type}/${id}`)
            }
            fetchData() // Refresh
        } catch (err) {
            console.error('Delete error:', err)
            alert('Failed to delete item: ' + (err.response?.data?.error || err.message))
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const tabs = [
        { id: 'photos', label: 'Photos', icon: Image },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'announcements', label: 'Announcements', icon: Bell }
    ]

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
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
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
                        <h1>Welcome, {user?.name || 'Coordinator'}!</h1>
                        <p>Student Coordinator Dashboard</p>
                    </div>
                    <div className="header-actions">
                        <span className="badge badge-primary">Coordinator</span>
                    </div>
                </header>

                {/* Upload Status */}
                {uploadStatus && (
                    <div className={`upload-status ${uploadStatus.type}`}>
                        {uploadStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{uploadStatus.message}</span>
                        <button onClick={() => setUploadStatus(null)}><X size={16} /></button>
                    </div>
                )}

                <div className="dashboard-content">
                    {/* Photos Tab */}
                    {activeTab === 'photos' && (
                        <section className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Upload Photos</h2>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Plus size={18} />
                                    Upload Photos
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handlePhotoUpload}
                                />
                            </div>

                            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={40} />
                                <p>Drag and drop photos here or click to browse</p>
                                <span>Supports: JPG, PNG, GIF (Max 10MB each)</span>
                            </div>

                            {uploads.photos.length > 0 && (
                                <div className="uploaded-grid">
                                    {uploads.photos.map(photo => (
                                        <div key={photo.id} className="uploaded-item card">
                                            <div className="uploaded-preview">
                                                <img src={photo.preview} alt={photo.name} />
                                            </div>
                                            <div className="uploaded-info">
                                                <span className="uploaded-name">{photo.name}</span>
                                                <span className="uploaded-meta">{photo.size} • {photo.uploaded}</span>
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('photos', photo.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <section className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Upload Documents</h2>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => docInputRef.current?.click()}
                                >
                                    <Plus size={18} />
                                    Upload Documents
                                </button>
                                <input
                                    ref={docInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    multiple
                                    hidden
                                    onChange={handleDocUpload}
                                />
                            </div>

                            <div className="upload-zone" onClick={() => docInputRef.current?.click()}>
                                <FileText size={40} />
                                <p>Drag and drop documents here or click to browse</p>
                                <span>Supports: PDF, DOC, DOCX, PPT, PPTX (Max 25MB each)</span>
                            </div>

                            {uploads.documents.length > 0 && (
                                <div className="documents-list">
                                    {uploads.documents.map(doc => (
                                        <div key={doc.id} className="document-item card">
                                            <div className="document-icon">
                                                <FileText size={24} />
                                            </div>
                                            <div className="document-info">
                                                <span className="document-name">{doc.name}</span>
                                                <span className="document-meta">{doc.size} • {doc.uploaded}</span>
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('documents', doc.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <section className="dashboard-section">
                            <div className="section-header-row">
                                <h2>Manage Announcements</h2>
                            </div>

                            <div className="announcement-form card">
                                <h3>Create New Announcement</h3>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Announcement title"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Content</label>
                                    <textarea
                                        className="input textarea"
                                        placeholder="Announcement content..."
                                        rows={4}
                                        value={newAnnouncement.content}
                                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                                    ></textarea>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddAnnouncement}
                                    disabled={!newAnnouncement.title || !newAnnouncement.content}
                                >
                                    <Plus size={18} />
                                    Post Announcement
                                </button>
                            </div>

                            {announcements.length > 0 && (
                                <div className="announcements-list">
                                    <h3>Posted Announcements</h3>
                                    {announcements.map(announcement => (
                                        <div key={announcement._id} className="announcement-item card">
                                            <div className="announcement-header">
                                                <h4>{announcement.title}</h4>
                                                <div className="announcement-actions">
                                                    <span className="announcement-date">
                                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDelete('announcements', announcement._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p>{announcement.content}</p>
                                            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#666' }}>
                                                Posted by: {announcement.postedBy?.name || 'Unknown'} ({announcement.role})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}

export default CoordinatorDashboard
