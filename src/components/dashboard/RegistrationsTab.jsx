import { Search, Download, Users } from 'lucide-react'

const RegistrationsTab = ({
    participants,
    filteredParticipants,
    loading,
    searchTerm,
    setSearchTerm,
    handleExport
}) => (
    <>
        <div className="stats-row">
            <div className="stat-card-small card">
                <div className="stat-icon">
                    <Users size={24} />
                </div>
                <div className="stat-info">
                    <span className="stat-value-small">{participants.length}</span>
                    <span className="stat-label-small">Total Registrations</span>
                </div>
            </div>
        </div>

        <section className="dashboard-section">
            <div className="filters-row">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="input search-input"
                        placeholder="Search by name, email, or college..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleExport}>
                    <Download size={18} />
                    Export to Excel
                </button>
            </div>
        </section>

        <section className="dashboard-section">
            <div className="table-container card">
                {loading ? (
                    <div className="table-loading">
                        <div className="loading-spinner-small"></div>
                        <span>Loading registrations...</span>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Pwd Status</th>
                                <th>College</th>
                                <th>Phone</th>
                                <th>Selected Events</th>
                                <th>Payment Ref</th>
                                <th>Registered On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="table-empty">
                                        No registrations found
                                    </td>
                                </tr>
                            ) : (
                                filteredParticipants.map((participant, index) => (
                                    <tr key={participant.id || index}>
                                        <td>{index + 1}</td>
                                        <td className="name-cell">{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>
                                            {participant.mustChangePassword
                                                ? <span className="badge badge-warning">Must Change ⚠️</span>
                                                : <span className="badge badge-success">Active ✓</span>}
                                        </td>
                                        <td>{participant.college}</td>
                                        <td>{participant.phone}</td>
                                        <td>
                                            <div className="events-badges">
                                                {(participant.selectedEvents || []).length > 0 ? (
                                                    participant.selectedEvents.map((evt, i) => (
                                                        <span key={i} className="event-badge">{evt}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">All Events</span>
                                                )}
                                            </div>
                                        </td>
                                        <td><code>{participant.paymentRef}</code></td>
                                        <td className="timestamp-cell">{participant.timestamp}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="table-footer">
                <span className="results-count">
                    Showing {filteredParticipants.length} of {participants.length} registrations
                </span>
            </div>
        </section>
    </>
)

export default RegistrationsTab
