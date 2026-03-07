import { useState } from 'react'
import { Bell, Trash2, Edit2, Check, X, Mail } from 'lucide-react'

const EVENT_OPTIONS = [
    { value: '', label: 'All Participants' },
    { value: 'panelDiscussion', label: 'Panel Discussion (Day 1)' },
    { value: 'rtl-gds', label: 'RTL & Testbench Workshop (Day 1)' },
    { value: 'fpga', label: 'FPGA Interfacing Workshop (Day 1)' },
    { value: 'expertInsights', label: 'Expert Insights: VLSI vs Embedded (Day 2)' },
    { value: 'sharkTank', label: 'Silicon Shark Tank (Day 2)' },
    { value: 'aiInVlsi', label: 'AI-Powered VLSI Talk (Day 3)' },
    { value: 'treasureHunt', label: 'Silicon Jackpot / Treasure Hunt (Day 3)' },
    { value: 'silentGallery', label: 'Silicon Silent Gallery (Day 3)' },
]

const AnnouncementsTab = ({
    announcements,
    newAnnouncement,
    setNewAnnouncement,
    handleAddAnnouncement,
    handleDeleteAnnouncement,
    handleEditAnnouncement,
    actionLoading
}) => {
    const [editingId, setEditingId] = useState(null)
    const [editDraft, setEditDraft] = useState({ title: '', content: '' })
    const [saving, setSaving] = useState(false)

    const startEdit = (ann) => {
        setEditingId(ann._id)
        setEditDraft({ title: ann.title, content: ann.content })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditDraft({ title: '', content: '' })
    }

    const saveEdit = async () => {
        if (!editDraft.title || !editDraft.content) return
        setSaving(true)
        try {
            await handleEditAnnouncement(editingId, editDraft)
            setEditingId(null)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="dashboard-section">
            <div className="section-header-row">
                <h2>Manage Announcements</h2>
            </div>

            <div className="announcement-form card" style={{ marginBottom: '2rem' }}>
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
                <div className="form-group">
                    <label>Target Audience</label>
                    <select
                        className="input"
                        value={newAnnouncement.targetEvent || ''}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, targetEvent: e.target.value }))}
                    >
                        {EVENT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                        type="checkbox"
                        id="sendEmail"
                        checked={!!newAnnouncement.sendEmail}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, sendEmail: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: '#00e5ff' }}
                    />
                    <label htmlFor="sendEmail" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={15} />
                        <span>Send email notification to participants now</span>
                    </label>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleAddAnnouncement}
                    disabled={!newAnnouncement.title || !newAnnouncement.content || actionLoading === 'announcement'}
                >
                    {actionLoading === 'announcement' ? 'Posting...' : 'Post Announcement'}
                </button>
            </div>

            <h3>Posted Announcements</h3>
            {announcements.length > 0 ? (
                <div className="announcements-list">
                    {announcements.map(announcement => (
                        <div key={announcement._id} className="announcement-item card">
                            {editingId === announcement._id ? (
                                <>
                                    <input
                                        type="text"
                                        className="input"
                                        value={editDraft.title}
                                        onChange={e => setEditDraft(prev => ({ ...prev, title: e.target.value }))}
                                        style={{ marginBottom: '0.5rem', fontWeight: 600 }}
                                        placeholder="Title"
                                    />
                                    <textarea
                                        className="input textarea"
                                        rows={3}
                                        value={editDraft.content}
                                        onChange={e => setEditDraft(prev => ({ ...prev, content: e.target.value }))}
                                        style={{ marginBottom: '0.75rem' }}
                                        placeholder="Content"
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={saveEdit} disabled={saving}>
                                            <Check size={14} style={{ marginRight: 4 }} />{saving ? 'Saving…' : 'Save'}
                                        </button>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={cancelEdit}>
                                            <X size={14} style={{ marginRight: 4 }} />Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="announcement-header">
                                        <h4>{announcement.title}</h4>
                                        <div className="announcement-actions">
                                            <span className="announcement-date">
                                                {new Date(announcement.createdAt).toLocaleDateString()}
                                            </span>
                                            <button
                                                className="delete-btn"
                                                style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                                onClick={() => startEdit(announcement)}
                                                title="Edit announcement"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteAnnouncement(announcement._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p>{announcement.content}</p>
                                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#666', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                                        <span>Posted by: {announcement.postedBy?.name || 'Unknown'} ({announcement.role})</span>
                                        {announcement.targetEvent && (
                                            <span style={{ color: '#00e5ff', background: 'rgba(0,229,255,0.08)', padding: '2px 7px', borderRadius: 4 }}>
                                                🎯 {EVENT_OPTIONS.find(o => o.value === announcement.targetEvent)?.label || announcement.targetEvent}
                                            </span>
                                        )}
                                        {announcement.emailSentCount > 0 && (
                                            <span style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)', padding: '2px 7px', borderRadius: 4 }}>
                                                📧 Emailed to {announcement.emailSentCount} participant{announcement.emailSentCount !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Bell size={48} />
                    <p>No announcements yet</p>
                </div>
            )}
        </div>
    )
}

export default AnnouncementsTab

