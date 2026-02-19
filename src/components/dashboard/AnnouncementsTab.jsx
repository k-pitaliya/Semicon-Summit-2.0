import { Bell, Trash2 } from 'lucide-react'

const AnnouncementsTab = ({
    announcements,
    newAnnouncement,
    setNewAnnouncement,
    handleAddAnnouncement,
    handleDeleteAnnouncement,
    actionLoading
}) => (
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
                        <div className="announcement-header">
                            <h4>{announcement.title}</h4>
                            <div className="announcement-actions">
                                <span className="announcement-date">
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                </span>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteAnnouncement(announcement._id)}
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
        ) : (
            <div className="empty-state">
                <Bell size={48} />
                <p>No announcements yet</p>
            </div>
        )}
    </div>
)

export default AnnouncementsTab
