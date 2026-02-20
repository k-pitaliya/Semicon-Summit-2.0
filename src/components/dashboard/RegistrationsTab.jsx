import { Search, Download, Users, Filter } from 'lucide-react'

const RegistrationsTab = ({
    participants,
    filteredParticipants,
    loading,
    searchTerm,
    setSearchTerm,
    selectedEvent,
    setSelectedEvent,
    events,
    handleExport,
    handleBackfillIds
}) => (<>
        {/* Stats Row */}
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
            <div className="stat-card-small card">
                <div className="stat-icon">
                    <Filter size={24} />
                </div>
                <div className="stat-info">
                    <span className="stat-value-small">{filteredParticipants.length}</span>
                    <span className="stat-label-small">Filtered Results</span>
                </div>
            </div>
        </div>

        {/* Filters Row */}
        <section className="dashboard-section">
            <div className="filters-row">
                {/* Search Box */}
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

                {/* Event Filter Dropdown */}
                <div className="event-filter">
                    <Filter size={16} style={{ marginRight: '6px', opacity: 0.6 }} />
                    <select
                        className="input"
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="all">All Events</option>
                        {(events || []).map(ev => (
                            <option key={ev.value ?? ev} value={ev.value ?? ev}>{ev.label ?? ev}</option>
                        ))}
                    </select>
                </div>

                {/* Export Button */}
                <button className="btn btn-primary" onClick={handleExport}>
                    <Download size={18} />
                    Export Excel
                </button>

                {/* Backfill IDs Button */}
                {handleBackfillIds && (
                    <button
                        className="btn"
                        onClick={handleBackfillIds}
                        title="Assign SS26-XXX IDs to participants who are missing one"
                        style={{ background: 'rgba(99,179,237,0.12)', border: '1px solid rgba(99,179,237,0.4)', color: '#93c5fd', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        Assign Missing IDs
                    </button>
                )}
            </div>
        </section>

        {/* Table */}
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
                                <th>Reg ID</th>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Pwd Status</th>
                                <th>College</th>
                                <th>Phone</th>
                                <th>Event Choices</th>
                                <th>Payment Ref</th>
                                <th>Registered On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParticipants.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="table-empty">
                                        {selectedEvent !== 'all'
                                            ? `No registrations found for "${selectedEvent}"`
                                            : 'No registrations found'}
                                    </td>
                                </tr>
                            ) : (
                                filteredParticipants.map((participant, index) => (
                                    <tr key={participant.id || participant._id || index}>
                                        <td><code style={{fontSize:'0.8rem', color:'#93c5fd'}}>{participant.registrationId || '—'}</code></td>
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
                                                {(() => {
                                                    const ec = participant.eventChoices || {};
                                                    const parts = [];
                                                    if (ec.day1Workshop === 'rtl-gds') parts.push('RTL→GDS');
                                                    else if (ec.day1Workshop === 'fpga') parts.push('FPGA');
                                                    if (ec.sharkTank) parts.push('Shark Tank');
                                                    if (ec.treasureHunt) parts.push('Treasure Hunt');
                                                    if (ec.silentGallery) parts.push('Silent Gallery');
                                                    if (parts.length === 0 && (participant.selectedEvents || []).length > 0)
                                                        return participant.selectedEvents.map((evt, i) => (
                                                            <span key={i} className="event-badge">{evt}</span>
                                                        ));
                                                    return parts.length > 0
                                                        ? parts.map((p, i) => <span key={i} className="event-badge">{p}</span>)
                                                        : <span className="text-muted">—</span>;
                                                })()}
                                            </div>
                                        </td>
                                        <td><code>{participant.paymentRef || '—'}</code></td>
                                        <td className="timestamp-cell">
                                            {/* timestamp field from participantRoutes maps user.createdAt */}
                                            {participant.timestamp
                                                ? new Date(participant.timestamp).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })
                                                : participant.createdAt
                                                    ? new Date(participant.createdAt).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })
                                                    : '—'}
                                        </td>
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
                    {selectedEvent !== 'all' && (() => {
                        const evObj = (events || []).find(e => (e.value ?? e) === selectedEvent);
                        return ` · filtered by "${evObj ? (evObj.label ?? evObj) : selectedEvent}"`;
                    })()}
                </span>
            </div>
        </section>
    </>
)

export default RegistrationsTab
