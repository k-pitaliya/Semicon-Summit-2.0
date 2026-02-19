import { UserCog, Key, Trash2 } from 'lucide-react'

const UsersTab = ({
    allUsers,
    loading,
    actionLoading,
    handleResetPassword,
    handleChangeRole,
    setDeleteConfirmModal
}) => (
    <section className="dashboard-section">
        <div className="section-header">
            <h2><UserCog size={20} /> User Management</h2>
            <p>Manage all users, reset passwords, and change roles</p>
        </div>

        <div className="users-stats">
            <div className="stat-card">
                <span className="stat-value">{allUsers.filter(u => u.role === 'participant').length}</span>
                <span className="stat-label">Participants</span>
            </div>
            <div className="stat-card">
                <span className="stat-value">{allUsers.filter(u => u.role === 'coordinator').length}</span>
                <span className="stat-label">Coordinators</span>
            </div>
            <div className="stat-card">
                <span className="stat-value">{allUsers.filter(u => u.role === 'faculty').length}</span>
                <span className="stat-label">Faculty</span>
            </div>
        </div>

        <div className="table-container">
            {loading ? (
                <div className="loading-state">Loading users...</div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Pwd Status</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(u => (
                            <tr key={u._id}>
                                <td>
                                    <strong>{u.name}</strong>
                                    {u.college && <span className="text-muted"><br />{u.college}</span>}
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    {u.mustChangePassword
                                        ? <span className="badge badge-warning">Must Change ⚠️</span>
                                        : <span className="badge badge-success">Active ✓</span>}
                                </td>
                                <td>
                                    <select
                                        className="role-select"
                                        value={u.role}
                                        onChange={(e) => handleChangeRole(u._id, e.target.value)}
                                        disabled={u.role === 'faculty' || actionLoading === u._id}
                                    >
                                        <option value="participant">Participant</option>
                                        <option value="coordinator">Coordinator</option>
                                        <option value="faculty">Faculty</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`badge badge-${u.verificationStatus === 'approved' ? 'success' : u.verificationStatus === 'rejected' ? 'danger' : 'warning'}`}>
                                        {u.verificationStatus || 'active'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-icon btn-warning"
                                            onClick={() => handleResetPassword(u._id)}
                                            disabled={actionLoading === u._id}
                                            title="Reset Password"
                                        >
                                            <Key size={16} />
                                        </button>
                                        {u.role !== 'faculty' && (
                                            <button
                                                className="btn-icon btn-danger"
                                                onClick={() => setDeleteConfirmModal({ open: true, user: u })}
                                                disabled={actionLoading === u._id}
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </section>
)

export default UsersTab
