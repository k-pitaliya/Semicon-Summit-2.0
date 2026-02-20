import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users, Download, Filter, Search, LogOut, Image,
    AlertTriangle, X, Key, Trash2, UserCog, Upload, ImagePlus, Bell
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import * as XLSX from 'xlsx'
import './Dashboard.css'
import RegistrationsTab from '../components/dashboard/RegistrationsTab'
import UsersTab from '../components/dashboard/UsersTab'
import GalleryTab from '../components/dashboard/GalleryTab'
import AnnouncementsTab from '../components/dashboard/AnnouncementsTab'


const FacultyDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('registrations')
    const [participants, setParticipants] = useState([])
    const [filteredParticipants, setFilteredParticipants] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEvent, setSelectedEvent] = useState('all')
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [error, setError] = useState(null)


    // User Management State
    const [allUsers, setAllUsers] = useState([])
    const [userManagementModal, setUserManagementModal] = useState({ open: false, user: null, action: null })
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, user: null })

    // Gallery State
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryUploadModal, setGalleryUploadModal] = useState(false)
    const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'event', files: [] })

    // Announcements State
    const [announcements, setAnnouncements] = useState([])
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })

    // Event filter options — match keys used in User.eventChoices (set by 5-step registration form)
    const events = [
        { label: 'RTL to GDS II Workshop (Day 1)', value: 'rtl-gds' },
        { label: 'FPGA Interfacing Workshop (Day 1)', value: 'fpga' },
        { label: 'Silicon Shark Tank (Day 2)', value: 'Silicon Shark Tank' },
        { label: 'Silicon Jackpot / Treasure Hunt (Day 3)', value: 'Treasure Hunt' },
        { label: 'Silicon Silent Gallery (Day 3)', value: 'Silent Gallery' },
    ]

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch all participants (role: participant)
            const participantsRes = await api.get('/participants')
            const participantsData = Array.isArray(participantsRes.data)
                ? participantsRes.data
                : (participantsRes.data?.participants ?? [])
            setParticipants(participantsData)
            setFilteredParticipants(participantsData)

            // Fetch all users for user management
            const usersRes = await api.get('/users')
            const usersData = Array.isArray(usersRes.data) ? usersRes.data : []
            setAllUsers(usersData)

            // Fetch announcements
            const annRes = await api.get('/announcements')
            setAnnouncements(Array.isArray(annRes.data)
                ? annRes.data
                : (annRes.data?.announcements ?? []))

            // Fetch gallery images
            const galleryRes = await api.get('/gallery')
            setGalleryImages(Array.isArray(galleryRes.data) ? galleryRes.data : [])
        } catch (err) {
            console.error('❌ Dashboard fetch error:', err)
            const msg = err.response?.data?.error || err.message || 'Unknown error'
            const status = err.response?.status
            if (status === 401 || status === 403) {
                setError(`Authentication error (${status}): ${msg}. Please log out and log back in.`)
            } else {
                setError(`Failed to load data: ${msg}`)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let filtered = participants

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.college?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedEvent !== 'all') {
            filtered = filtered.filter(p => {
                const ec = p.eventChoices || {};
                if (selectedEvent === 'rtl-gds') return ec.day1Workshop === 'rtl-gds';
                if (selectedEvent === 'fpga') return ec.day1Workshop === 'fpga';
                if (selectedEvent === 'Silicon Shark Tank') return ec.sharkTank === true;
                if (selectedEvent === 'Treasure Hunt') return ec.treasureHunt === true;
                if (selectedEvent === 'Silent Gallery') return ec.silentGallery === true;
                // fallback: legacy selectedEvents array
                return Array.isArray(p.selectedEvents) && p.selectedEvents.includes(selectedEvent);
            });
        }

        setFilteredParticipants(filtered)
    }, [searchTerm, selectedEvent, participants])

    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
    }



    const handleAddAnnouncement = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) return

        setActionLoading('announcement')
        try {
            await api.post('/announcements', {
                ...newAnnouncement,
                role: 'faculty',
                postedBy: user._id
            })
            setNewAnnouncement({ title: '', content: '' })
            // Refresh
            const annRes = await api.get('/announcements')
            setAnnouncements(annRes.data.announcements ?? annRes.data)
        } catch (error) {
            console.error('Error creating announcement:', error)
            alert('Failed to create announcement')
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Delete this announcement?')) return
        try {
            await api.delete(`/announcements/${id}`)
            // Refresh
            const annRes = await api.get('/announcements')
            setAnnouncements(annRes.data.announcements ?? annRes.data)
        } catch (error) {
            console.error('Error deleting announcement:', error)
            alert('Failed to delete announcement')
        }
    }



    const handleBackfillIds = async () => {
        if (!confirm('Assign SS26-XXX registration IDs to all participants who are missing one?')) return;
        try {
            const res = await api.post('/admin/backfill-registration-ids');
            alert(res.data.message + (res.data.range ? `\nRange: ${res.data.range}` : ''));
            await fetchData();
        } catch (err) {
            alert('Backfill failed: ' + (err.response?.data?.error || err.message));
        }
    }


    const handleExport = () => {
        // Prepare data for Excel
        const eventChoiceSummary = (ec) => {
            if (!ec) return '';
            const parts = [];
            if (ec.day1Workshop === 'rtl-gds') parts.push('RTL to GDS II');
            else if (ec.day1Workshop === 'fpga') parts.push('FPGA Workshop');
            if (ec.sharkTank) parts.push('Shark Tank');
            if (ec.treasureHunt) parts.push('Treasure Hunt');
            if (ec.silentGallery) parts.push('Silent Gallery');
            return parts.join(', ');
        };
        const excelData = filteredParticipants.map((p, index) => ({
            'S.No': index + 1,
            'Reg ID': p.registrationId || '',
            'Name': p.name || '',
            'Email': p.email || '',
            'Phone': p.phone || '',
            'College': p.college || '',
            'Department': p.department || '',
            'Student ID': p.studentId || '',
            'Year': p.yearOfStudy || '',
            'Workshop (Day 1)': p.eventChoices?.day1Workshop || '',
            'Event Choices': eventChoiceSummary(p.eventChoices),
            'Payment ID': p.paymentRef || '',
            'Amount Paid': p.paymentAmount || 299,
            'Status': p.verificationStatus || 'approved',
            'Registered On': p.timestamp ? new Date(p.timestamp).toLocaleDateString('en-IN') : ''
        }))

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData)

        // Set column widths
        worksheet['!cols'] = [
            { wch: 6 },   // S.No
            { wch: 12 },  // Reg ID
            { wch: 25 },  // Name
            { wch: 30 },  // Email
            { wch: 15 },  // Phone
            { wch: 28 },  // College
            { wch: 22 },  // Department
            { wch: 14 },  // Student ID
            { wch: 10 },  // Year
            { wch: 14 },  // Workshop
            { wch: 36 },  // Event Choices
            { wch: 22 },  // Payment ID
            { wch: 12 },  // Amount
            { wch: 12 },  // Status
            { wch: 15 },  // Date
        ]

        // Create workbook
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')

        // Generate filename with date
        const filename = `Summit_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`

        // Download file
        XLSX.writeFile(workbook, filename)
    }


    // User Management Functions
    const handleResetPassword = async (userId) => {
        if (!confirm('Are you sure you want to reset this user\'s password? A new password will be emailed to them.')) {
            return
        }

        setActionLoading(userId)
        try {
            const response = await api.post(`/users/${userId}/reset-password`)
            alert(`✅ Password reset successful!\n\nNew password: ${response.data.newPassword}\n\n${response.data.emailSent ? 'Email sent to user.' : 'Email sending failed - please share password manually.'}`)
        } catch (error) {
            alert('Error resetting password: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteUser = async () => {
        if (!deleteConfirmModal.user) return

        setActionLoading(deleteConfirmModal.user._id)
        try {
            await api.delete(`/users/${deleteConfirmModal.user._id}`)
            alert('User deleted successfully.')
            setDeleteConfirmModal({ open: false, user: null })
            await fetchData()
        } catch (error) {
            alert('Error deleting user: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleChangeRole = async (userId, newRole) => {
        setActionLoading(userId)
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole })
            alert(`Role changed to ${newRole} successfully.`)
            await fetchData()
        } catch (error) {
            alert('Error changing role: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    // Gallery Functions
    const handleGalleryUpload = async (e) => {
        e.preventDefault()
        if (galleryForm.files.length === 0) {
            alert('Please select at least one image.')
            return
        }

        setActionLoading('gallery')
        try {
            const formData = new FormData()
            formData.append('title', galleryForm.title)
            formData.append('description', galleryForm.description)
            formData.append('category', galleryForm.category)
            formData.append('uploadedBy', user?._id)

            for (const file of galleryForm.files) {
                formData.append('images', file)
            }

            await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            alert('Images uploaded successfully!')
            setGalleryUploadModal(false)
            setGalleryForm({ title: '', description: '', category: 'event', files: [] })
            await fetchData()
        } catch (error) {
            alert('Error uploading images: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteGalleryImage = async (imageId) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        setActionLoading(imageId)
        try {
            await api.delete(`/gallery/${imageId}`)
            await fetchData()
        } catch (error) {
            alert('Error deleting image: ' + (error.response?.data?.error || error.message))
        } finally {
            setActionLoading(null)
        }
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
                    <button
                        className={`nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registrations')}
                    >
                        <Users size={20} />
                        <span>All Registrations</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <UserCog size={20} />
                        <span>User Management</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('announcements')}
                    >
                        <Bell size={20} />
                        <span>Announcements</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gallery')}
                    >
                        <Image size={20} />
                        <span>Gallery</span>
                    </button>
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
                        <h1>Welcome, {user?.name || 'Faculty'}!</h1>
                        <p>Faculty Dashboard - {
                            activeTab === 'registrations' ? 'View All Registrations' :
                                activeTab === 'users' ? 'User Management' :
                                    activeTab === 'announcements' ? 'Announcements' :
                                        'Gallery Management'
                        }</p>
                    </div>
                    <div className="header-actions">
                        <span className="badge badge-warning">Faculty</span>
                    </div>
                </header>

                {/* Error Banner */}
                {error && (
                    <div className="error-banner" style={{
                        margin: '1rem 2rem',
                        padding: '1rem 1.25rem',
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.4)',
                        borderRadius: '8px',
                        color: '#fca5a5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.9rem'
                    }}>
                        <AlertTriangle size={18} color="#ef4444" />
                        <span>{error}</span>
                        <button
                            onClick={() => { setError(null); fetchData() }}
                            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer' }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="dashboard-content">
                    {/* All Registrations Tab */}
                    {activeTab === 'registrations' && (
                        <RegistrationsTab
                            participants={participants}
                            filteredParticipants={filteredParticipants}
                            loading={loading}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedEvent={selectedEvent}
                            setSelectedEvent={setSelectedEvent}
                            events={events}
                            handleExport={handleExport}
                            handleBackfillIds={handleBackfillIds}
                        />
                    )}

                    {/* User Management Tab */}
                    {activeTab === 'users' && (
                        <UsersTab
                            allUsers={allUsers}
                            loading={loading}
                            actionLoading={actionLoading}
                            handleResetPassword={handleResetPassword}
                            handleChangeRole={handleChangeRole}
                            setDeleteConfirmModal={setDeleteConfirmModal}
                        />
                    )}

                    {/* Gallery Management Tab */}
                    {activeTab === 'gallery' && (
                        <GalleryTab
                            galleryImages={galleryImages}
                            loading={loading}
                            actionLoading={actionLoading}
                            setGalleryUploadModal={setGalleryUploadModal}
                            handleDeleteGalleryImage={handleDeleteGalleryImage}
                        />
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <AnnouncementsTab
                            announcements={announcements}
                            newAnnouncement={newAnnouncement}
                            setNewAnnouncement={setNewAnnouncement}
                            handleAddAnnouncement={handleAddAnnouncement}
                            handleDeleteAnnouncement={handleDeleteAnnouncement}
                            actionLoading={actionLoading}
                        />
                    )}
                </div>
            </main>


            {/* Delete Confirmation Modal */}
            {deleteConfirmModal.open && (
                <div className="modal-overlay" onClick={() => setDeleteConfirmModal({ open: false, user: null })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setDeleteConfirmModal({ open: false, user: null })}>
                            <X size={24} />
                        </button>
                        <h3><AlertTriangle color="#ef4444" /> Delete User</h3>
                        <p>Are you sure you want to delete <strong>{deleteConfirmModal.user?.name}</strong>?</p>
                        <p className="text-muted">This action cannot be undone. All associated registrations will also be deleted.</p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteConfirmModal({ open: false, user: null })}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteUser}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Upload Modal */}
            {galleryUploadModal && (
                <div className="modal-overlay" onClick={() => setGalleryUploadModal(false)}>
                    <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setGalleryUploadModal(false)}>
                            <X size={24} />
                        </button>
                        <h3><ImagePlus size={24} /> Upload Gallery Images</h3>
                        <form onSubmit={handleGalleryUpload}>
                            <div className="input-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enter image title..."
                                    value={galleryForm.title}
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Description (optional)</label>
                                <textarea
                                    className="input"
                                    rows={2}
                                    placeholder="Enter description..."
                                    value={galleryForm.description}
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <select
                                    className="input"
                                    value={galleryForm.category}
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <option value="event">Event</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="networking">Networking</option>
                                    <option value="venue">Venue</option>
                                    <option value="speaker">Speaker</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Images</label>
                                <input
                                    type="file"
                                    className="input"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setGalleryForm(prev => ({ ...prev, files: Array.from(e.target.files) }))}
                                />
                                {galleryForm.files.length > 0 && (
                                    <p className="text-muted">{galleryForm.files.length} file(s) selected</p>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setGalleryUploadModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={actionLoading === 'gallery'}
                                >
                                    {actionLoading === 'gallery' ? 'Uploading...' : 'Upload Images'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FacultyDashboard
