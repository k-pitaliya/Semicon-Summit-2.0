import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Users, Download, Filter, Search, LogOut, Image,
    AlertTriangle, X, Key, Trash2, UserCog, Upload, ImagePlus, Bell, Copy, Check, Menu, UserPlus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import './Dashboard.css'
import RegistrationsTab from '../components/dashboard/RegistrationsTab'
import UsersTab from '../components/dashboard/UsersTab'
import GalleryTab from '../components/dashboard/GalleryTab'
import AnnouncementsTab from '../components/dashboard/AnnouncementsTab'


const FacultyDashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(() => {
        const tab = searchParams.get('tab')
        return ['registrations', 'users', 'announcements', 'gallery'].includes(tab) ? tab : 'registrations'
    })
    const [sidebarOpen, setSidebarOpen] = useState(false)
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
    const [passwordResetModal, setPasswordResetModal] = useState({ open: false, email: '', password: '', emailSent: false })
    const [copied, setCopied] = useState({})   // { fieldKey: true/false }

    // Add Participant Modal State
    const BLANK_ADD_FORM = {
        name: '', email: '', phone: '', college: '', department: '',
        studentId: '', universityEmail: '', yearOfStudy: '',
        razorpayPaymentId: '', paymentAmount: '299',
        eventChoices: {
            day1Workshop: '', panelDiscussion: false, expertInsights: false,
            aiInVlsi: false, sharkTank: false, treasureHunt: false, silentGallery: false
        }
    }
    const [addParticipantModal, setAddParticipantModal] = useState({ open: false })
    const [addForm, setAddForm] = useState(BLANK_ADD_FORM)
    const [addResult, setAddResult] = useState(null)  // { name, email, registrationId, password, emailSent }
    const [addLoading, setAddLoading] = useState(false)
    const [addError, setAddError] = useState(null)

    const copyToClipboard = useCallback((text, key) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(prev => ({ ...prev, [key]: true }))
            setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000)
        })
    }, [])

    // Gallery State
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryUploadModal, setGalleryUploadModal] = useState(false)
    const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'event', files: [] })

    // Announcements State
    const [announcements, setAnnouncements] = useState([])
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', targetEvent: '', sendEmail: false })

    // Event filter options — match keys used in User.eventChoices (set by 5-step registration form)
    const events = [
        { label: 'Panel Discussion (Day 1)', value: 'panelDiscussion' },
        { label: 'RTL & Self-Checking Testbench Workshop (Day 1)', value: 'rtl-gds' },
        { label: 'FPGA Interfacing Workshop (Day 1)', value: 'fpga' },
        { label: 'Expert Insights: VLSI vs Embedded (Day 2)', value: 'expertInsights' },
        { label: 'Silicon Shark Tank (Day 2)', value: 'sharkTank' },
        { label: 'AI-Powered VLSI Talk (Day 3)', value: 'aiInVlsi' },
        { label: 'Silicon Jackpot / Treasure Hunt (Day 3)', value: 'treasureHunt' },
        { label: 'Silicon Silent Gallery (Day 3)', value: 'silentGallery' },
    ]

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch all participants (role: participant)
            const participantsRes = await api.get('/participants?limit=1000')
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
                if (selectedEvent === 'panelDiscussion') return ec.panelDiscussion === true;
                if (selectedEvent === 'rtl-gds') return ec.day1Workshop === 'rtl-gds';
                if (selectedEvent === 'fpga') return ec.day1Workshop === 'fpga';
                if (selectedEvent === 'expertInsights') return ec.expertInsights === true;
                if (selectedEvent === 'sharkTank') return ec.sharkTank === true;
                if (selectedEvent === 'aiInVlsi') return ec.aiInVlsi === true;
                if (selectedEvent === 'treasureHunt') return ec.treasureHunt === true;
                if (selectedEvent === 'silentGallery') return ec.silentGallery === true;
                // fallback: legacy selectedEvents array
                return Array.isArray(p.selectedEvents) && p.selectedEvents.includes(selectedEvent);
            });
        }

        setFilteredParticipants(filtered)
    }, [searchTerm, selectedEvent, participants])

    const switchTab = (tab) => {
        setActiveTab(tab)
        setSearchParams({ tab })
        setSidebarOpen(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
    }



    const handleAddAnnouncement = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) return

        setActionLoading('announcement')
        try {
            await api.post('/announcements', {
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                targetEvent: newAnnouncement.targetEvent || null,
                sendEmail: !!newAnnouncement.sendEmail,
                role: 'faculty',
                postedBy: user._id
            })
            setNewAnnouncement({ title: '', content: '', targetEvent: '', sendEmail: false })
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

    const handleEditAnnouncement = async (id, { title, content }) => {
        try {
            await api.put(`/announcements/${id}`, { title, content })
            const annRes = await api.get('/announcements')
            setAnnouncements(annRes.data.announcements ?? annRes.data)
        } catch (error) {
            console.error('Error editing announcement:', error)
            alert('Failed to edit announcement')
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



    const handleAddParticipant = async (e) => {
        e.preventDefault()
        setAddLoading(true)
        setAddError(null)
        try {
            const payload = {
                ...addForm,
                eventChoices: addForm.eventChoices,
                paymentAmount: parseInt(addForm.paymentAmount) || 299,
            }
            // Remove empty optional fields
            if (!payload.razorpayPaymentId) delete payload.razorpayPaymentId
            if (!payload.studentId) delete payload.studentId
            if (!payload.universityEmail) delete payload.universityEmail
            if (!payload.yearOfStudy) delete payload.yearOfStudy

            const res = await api.post('/admin/add-participant', payload)
            setAddResult(res.data)
            await fetchData()  // Refresh participant list
        } catch (err) {
            setAddError(err.response?.data?.error || err.message || 'Failed to add participant')
        } finally {
            setAddLoading(false)
        }
    }

    const closeAddModal = () => {
        setAddParticipantModal({ open: false })
        setAddForm(BLANK_ADD_FORM)
        setAddResult(null)
        setAddError(null)
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

    // Resend credentials email from the Email Failed alert banner
    const handleResendEmail = async (userId, userEmail) => {
        try {
            const res = await api.post(`/participants/${userId}/resend-credentials`)
            if (res.data.emailSent) {
                alert(`✅ Credentials emailed to ${userEmail}`)
            } else {
                alert(`⚠️ Email delivery failed again.\nNew password: ${res.data.newPassword}\nShare this manually with ${userEmail}`)
            }
            await fetchData() // Refresh to clear the alert banner if email succeeded
        } catch (err) {
            alert('Resend failed: ' + (err.response?.data?.error || err.message))
        }
    }


    const handleExport = () => {
        setActionLoading('export');
        setTimeout(async () => {
            try {
                const yesNo = (val) => val ? 'Yes' : 'No';
                const excelData = filteredParticipants.map((p, index) => {
                    const ec = p.eventChoices || {};
                    return {
                        'S.No': index + 1,
                        'Reg ID': p.registrationId || '',
                        'Name': p.name || '',
                        'Email (Personal)': p.email || '',
                        'Email (University)': p.universityEmail || '',
                        'Phone': p.phone || '',
                        'College / Institution': p.college || '',
                        'Department': p.department || '',
                        'Student ID': p.studentId || '',
                        'Year of Study': p.yearOfStudy || '',
                        'Panel Discussion (D1)': yesNo(ec.panelDiscussion),
                        'Workshop (D1)': ec.day1Workshop === 'rtl-gds' ? 'RTL & Testbench Workshop' : ec.day1Workshop === 'fpga' ? 'FPGA Workshop' : ec.day1Workshop || 'None',
                        'Expert Insights (D2)': yesNo(ec.expertInsights),
                        'Shark Tank (D2)': yesNo(ec.sharkTank),
                        'AI-Powered VLSI (D3)': yesNo(ec.aiInVlsi),
                        'Treasure Hunt (D3)': yesNo(ec.treasureHunt),
                        'Silent Gallery (D3)': yesNo(ec.silentGallery),
                        'Payment ID': p.paymentRef || '',
                        'Amount Paid (₹)': p.paymentAmount || 299,
                        'Status': p.verificationStatus || 'approved',
                        'Registered On': p.timestamp ? new Date(p.timestamp).toLocaleDateString('en-IN') : '',
                    };
                });

                const columnWidths = [6, 12, 26, 32, 32, 15, 32, 22, 16, 14, 10, 18, 12, 12, 12, 14, 14, 24, 14, 12, 16];
                const headers = Object.keys(excelData[0]);
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Registrations');
                worksheet.columns = headers.map((h, i) => ({
                    header: h,
                    key: h,
                    width: columnWidths[i] || 12,
                }));
                excelData.forEach(row => worksheet.addRow(row));

                const suffix = selectedEvent !== 'all' ? `_${selectedEvent}` : '_All';
                const filename = `SS26_Registrations${suffix}_${new Date().toISOString().split('T')[0]}.xlsx`;
                const buffer = await workbook.xlsx.writeBuffer();
                saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
            } finally {
                setActionLoading(null);
            }
        }, 50);
    }



    // User Management Functions
    const handleResetPassword = async (userId) => {
        if (!confirm('Reset this user\'s password? A new password will be generated and emailed to them.')) return

        setActionLoading(userId)
        try {
            const response = await api.post(`/users/${userId}/reset-password`)
            const targetUser = allUsers.find(u => u._id === userId)
            setPasswordResetModal({
                open: true,
                email: targetUser?.email || '',
                password: response.data.newPassword,
                emailSent: response.data.emailSent
            })
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
        <div className="dashboard-page" style={{ position: 'relative' }}>
            {/* Background */}
            <div className="hero-bg" style={{ zIndex: 0, opacity: 0.5, overflow: 'hidden', pointerEvents: 'none' }}>
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" style={{ top: '-20%', left: '20%', opacity: 0.3 }} />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon-small">SS</div>
                        <span>Summit 2.0</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
                        onClick={() => switchTab('registrations')}
                    >
                        <Users size={20} />
                        <span>All Registrations</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => switchTab('users')}
                    >
                        <UserCog size={20} />
                        <span>User Management</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
                        onClick={() => switchTab('announcements')}
                    >
                        <Bell size={20} />
                        <span>Announcements</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                        onClick={() => switchTab('gallery')}
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="sidebar-mobile-toggle" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle navigation menu">
                            <Menu size={20} />
                        </button>
                        <div className="header-content">
                            <h1>Welcome, {user?.name || 'Faculty'}!</h1>
                            <p>Faculty Dashboard - {
                                activeTab === 'registrations' ? 'View All Registrations' :
                                    activeTab === 'users' ? 'User Management' :
                                        activeTab === 'announcements' ? 'Announcements' :
                                            'Gallery Management'
                            }</p>
                        </div>
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
                            actionLoading={actionLoading}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedEvent={selectedEvent}
                            setSelectedEvent={setSelectedEvent}
                            events={events}
                            handleExport={handleExport}
                            handleBackfillIds={handleBackfillIds}
                            onResendEmail={handleResendEmail}
                            onAddParticipant={() => { setAddParticipantModal({ open: true }); setAddResult(null); setAddError(null) }}
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
                            handleEditAnnouncement={handleEditAnnouncement}
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

            {/* ── Password Reset Success Modal ────────────────────────── */}
            {passwordResetModal.open && (
                <div className="modal-overlay" onClick={() => setPasswordResetModal(prev => ({ ...prev, open: false }))}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                        <button className="modal-close" onClick={() => setPasswordResetModal(prev => ({ ...prev, open: false }))}>
                            <X size={24} />
                        </button>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Key size={18} color="#22c55e" />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Password Reset Successful</h3>
                        </div>

                        {/* Email sent badge */}
                        <div style={{ marginBottom: '20px' }}>
                            {passwordResetModal.emailSent
                                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '99px', fontSize: '0.78rem', color: '#22c55e', fontWeight: 600 }}>
                                    ✓ Credentials emailed to user
                                </span>
                                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '99px', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
                                    ⚠ Email failed — share manually below
                                </span>
                            }
                        </div>

                        {/* Copy fields */}
                        {[
                            { label: 'Email / Username', value: passwordResetModal.email, key: 'email', mono: false },
                            { label: 'New Password', value: passwordResetModal.password, key: 'pwd', mono: true },
                        ].map(({ label, value, key, mono }) => (
                            <div key={key} style={{ marginBottom: '12px' }}>
                                <p style={{ margin: '0 0 5px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: '8px' }}>
                                    <span style={{ flex: 1, fontFamily: mono ? "'SF Mono', Monaco, monospace" : 'inherit', fontSize: mono ? '1rem' : '0.9rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                                        {value}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(value, key)}
                                        title="Copy to clipboard"
                                        style={{ flexShrink: 0, background: copied[key] ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.12)', border: `1px solid ${copied[key] ? 'rgba(34,197,94,0.4)' : 'rgba(99,102,241,0.3)'}`, borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: copied[key] ? '#22c55e' : '#818cf8', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}
                                    >
                                        {copied[key] ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="modal-actions" style={{ marginTop: '20px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => setPasswordResetModal(prev => ({ ...prev, open: false }))}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Done
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
            {/* ── Add Participant Modal ─────────────────────────────────────── */}
            {addParticipantModal.open && (
                <div className="modal-overlay" onClick={closeAddModal}>
                    <div className="modal-content modal-large" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button className="modal-close" onClick={closeAddModal}><X size={24} /></button>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <UserPlus size={18} color="#818cf8" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Manually Add Participant</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>For participants who paid but couldn't register — registration is closed</p>
                            </div>
                        </div>

                        {/* ── Success Card ── */}
                        {addResult ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ padding: '14px 18px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>✅</span>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, color: '#22c55e', fontSize: '0.95rem' }}>{addResult.message}</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                                            Registration ID: <code style={{ color: '#93c5fd', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: '3px' }}>{addResult.registrationId}</code>
                                        </p>
                                    </div>
                                </div>

                                {/* Copyable credentials */}
                                {[{ label: 'Email / Username', value: addResult.user?.email, key: 'add_email', mono: false },
                                  { label: 'Temporary Password', value: addResult.password, key: 'add_pwd', mono: true }].map(({ label, value, key, mono }) => (
                                    <div key={key}>
                                        <p style={{ margin: '0 0 5px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: '8px' }}>
                                            <span style={{ flex: 1, fontFamily: mono ? "'SF Mono', Monaco, monospace" : 'inherit', fontSize: mono ? '1rem' : '0.9rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value}</span>
                                            <button onClick={() => copyToClipboard(value, key)} title="Copy"
                                                style={{ flexShrink: 0, background: copied[key] ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.12)', border: `1px solid ${copied[key] ? 'rgba(34,197,94,0.4)' : 'rgba(99,102,241,0.3)'}`, borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: copied[key] ? '#22c55e' : '#818cf8', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}>
                                                {copied[key] ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {!addResult.emailSent && (
                                    <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', fontSize: '0.83rem', color: '#fbbf24' }}>
                                        ⚠️ Email delivery failed. Please share the password above manually with the participant.
                                    </div>
                                )}

                                <div className="modal-actions" style={{ marginTop: '8px' }}>
                                    <button className="btn btn-secondary" onClick={closeAddModal}>Close</button>
                                    <button className="btn btn-primary" onClick={() => { setAddResult(null); setAddForm(BLANK_ADD_FORM); setAddError(null) }}>
                                        <UserPlus size={16} /> Add Another
                                    </button>
                                </div>
                            </div>
                        ) : (
                        /* ── Form ── */
                        <form onSubmit={handleAddParticipant} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {/* Error */}
                            {addError && (
                                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={15} color="#ef4444" /> {addError}
                                </div>
                            )}

                            {/* Personal Info */}
                            <p style={{ margin: '0 0 10px', fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Personal Info</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input className="input" type="text" placeholder="Ravi Sharma" required
                                        value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Personal Email <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input className="input" type="email" placeholder="ravi@gmail.com" required
                                        value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} />
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Phone <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input className="input" type="tel" placeholder="9876543210" required
                                        value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} />
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>University Email</label>
                                    <input className="input" type="email" placeholder="21ec001@charusat.ac.in"
                                        value={addForm.universityEmail} onChange={e => setAddForm(p => ({ ...p, universityEmail: e.target.value }))} />
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>College / Institution</label>
                                    <input className="input" type="text" placeholder="CHARUSAT University"
                                        value={addForm.college} onChange={e => setAddForm(p => ({ ...p, college: e.target.value }))} />
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Department</label>
                                    <input className="input" type="text" placeholder="Electronics & Communication"
                                        value={addForm.department} onChange={e => setAddForm(p => ({ ...p, department: e.target.value }))} />
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Student ID</label>
                                    <input className="input" type="text" placeholder="21ECXXX"
                                        value={addForm.studentId} onChange={e => setAddForm(p => ({ ...p, studentId: e.target.value }))} />
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Year of Study</label>
                                    <select className="input" value={addForm.yearOfStudy} onChange={e => setAddForm(p => ({ ...p, yearOfStudy: e.target.value }))}>
                                        <option value="">Select year</option>
                                        <option>1st Year</option><option>2nd Year</option>
                                        <option>3rd Year</option><option>4th Year</option>
                                    </select>
                                </div>
                            </div>

                            {/* Payment */}
                            <p style={{ margin: '8px 0 10px', fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Razorpay Payment ID</label>
                                    <input className="input" type="text" placeholder="pay_XXXXXXXXXXXXXXXX"
                                        value={addForm.razorpayPaymentId} onChange={e => setAddForm(p => ({ ...p, razorpayPaymentId: e.target.value }))} />
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>Leave blank if payment was offline</span>
                                </div>
                                <div className="input-group" style={{ margin: 0 }}>
                                    <label>Amount Paid (₹)</label>
                                    <input className="input" type="number" min="0" placeholder="299"
                                        value={addForm.paymentAmount} onChange={e => setAddForm(p => ({ ...p, paymentAmount: e.target.value }))} />
                                </div>
                            </div>

                            {/* Event Choices */}
                            <p style={{ margin: '8px 0 10px', fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Event Choices</p>
                            <div style={{ padding: '14px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: '10px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {/* Workshop */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Day 1 Workshop</label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {[{ v: '', l: 'None' }, { v: 'rtl-gds', l: 'RTL & Testbench' }, { v: 'fpga', l: 'FPGA Interfacing' }].map(({ v, l }) => (
                                            <button type="button" key={v}
                                                onClick={() => setAddForm(p => ({ ...p, eventChoices: { ...p.eventChoices, day1Workshop: v } }))}
                                                style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', border: addForm.eventChoices.day1Workshop === v ? '1px solid #818cf8' : '1px solid var(--border-default)', background: addForm.eventChoices.day1Workshop === v ? 'rgba(99,102,241,0.18)' : 'transparent', color: addForm.eventChoices.day1Workshop === v ? '#818cf8' : 'var(--text-tertiary)' }}>
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Checkboxes */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    {[
                                        { key: 'panelDiscussion', label: 'Panel Discussion (D1)' },
                                        { key: 'expertInsights', label: 'Expert Insights: VLSI vs Embedded (D2)' },
                                        { key: 'sharkTank', label: 'Silicon Shark Tank (D2)' },
                                        { key: 'aiInVlsi', label: 'AI-Powered VLSI Talk (D3)' },
                                        { key: 'treasureHunt', label: 'Silicon Jackpot / Treasure Hunt (D3)' },
                                        { key: 'silentGallery', label: 'Silicon Silent Gallery (D3)' },
                                    ].map(({ key, label }) => (
                                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)', userSelect: 'none' }}>
                                            <input type="checkbox" checked={!!addForm.eventChoices[key]}
                                                onChange={e => setAddForm(p => ({ ...p, eventChoices: { ...p.eventChoices, [key]: e.target.checked } }))}
                                                style={{ width: '15px', height: '15px', accentColor: '#818cf8', cursor: 'pointer' }} />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeAddModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={addLoading}
                                    style={{ background: addLoading ? undefined : 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: addLoading ? 0.7 : 1 }}>
                                    {addLoading
                                        ? <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Adding…</>
                                        : <><UserPlus size={16} /> Add Participant</>}
                                </button>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FacultyDashboard
