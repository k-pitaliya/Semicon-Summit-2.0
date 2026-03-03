import { Search, Download, Users, Filter, AlertTriangle, RefreshCw, Mail } from 'lucide-react'
import { useState } from 'react'

const RegistrationsTab = ({
    participants,
    filteredParticipants,
    loading,
    actionLoading,
    searchTerm,
    setSearchTerm,
    selectedEvent,
    setSelectedEvent,
    events,
    handleExport,
    handleBackfillIds,
    onResendEmail,
}) => {
    const [resendingId, setResendingId] = useState(null)

    // Participants where email delivery is confirmed failed (null = old record, unknown)
    const emailFailed = participants.filter(p => p.credentialsEmailSent === false)

    const handleResend = async (p) => {
        if (!onResendEmail) return
        setResendingId(p.id)
        try {
            await onResendEmail(p.id, p.email)
        } finally {
            setResendingId(null)
        }
    }

    return (<>
        {/* ── Email Failure Alert Banner ─────────────────────────────────────── */}
        {emailFailed.length > 0 && (
            <div style={{
                margin: '0 0 1.25rem',
                padding: '14px 18px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '10px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <strong style={{ color: '#fca5a5', fontSize: '0.95rem' }}>
                        ⚠️ {emailFailed.length} participant{emailFailed.length > 1 ? 's' : ''} did not receive credentials email
                    </strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {emailFailed.map(p => (
                        <div key={p.id} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '8px 12px',
                            background: 'rgba(239,68,68,0.06)',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                        }}>
                            <Mail size={14} color="#f87171" style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1, color: '#fca5a5' }}>
                                <strong>{p.name}</strong> &nbsp;·&nbsp; {p.email}
                                {p.registrationId && <code style={{ marginLeft: '6px', fontSize: '0.72rem', background: 'rgba(0,0,0,0.25)', padding: '2px 5px', borderRadius: '3px', color: '#93c5fd' }}>{p.registrationId}</code>}
                                {p.credentialsEmailFailedAt && (
                                    <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: '#9ca3af' }}>
                                        Failed at {new Date(p.credentialsEmailFailedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </span>
                            <button
                                onClick={() => handleResend(p)}
                                disabled={resendingId === p.id}
                                style={{
                                    flexShrink: 0,
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                    padding: '5px 12px',
                                    background: resendingId === p.id ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.15)',
                                    border: '1px solid rgba(99,102,241,0.4)',
                                    borderRadius: '6px',
                                    color: '#a5b4fc',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: resendingId === p.id ? 'not-allowed' : 'pointer',
                                    opacity: resendingId === p.id ? 0.6 : 1,
                                }}
                            >
                                <RefreshCw size={13} style={{ animation: resendingId === p.id ? 'spin 1s linear infinite' : 'none' }} />
                                {resendingId === p.id ? 'Sending…' : 'Resend'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

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

                <button
                    className="btn btn-primary"
                    onClick={handleExport}
                    disabled={actionLoading === 'export'}
                    style={{ opacity: actionLoading === 'export' ? 0.7 : 1, whiteSpace: 'nowrap' }}
                >
                    <Download size={18} />
                    {actionLoading === 'export' ? 'Exporting…' : 'Export All (Excel)'}
                </button>

                {handleBackfillIds && (
                    <button
                        className="btn"
                        onClick={handleBackfillIds}
                        title="Assign SS26-XXX IDs to participants who are missing one"
                        style={{
                            background: 'rgba(99,179,237,0.12)',
                            border: '1px solid rgba(99,179,237,0.4)',
                            color: '#93c5fd',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap'
                        }}
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
                    <table className="data-table" style={{ tableLayout: 'auto', minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '130px', whiteSpace: 'nowrap' }}># / Reg ID</th>
                                <th style={{ minWidth: '130px' }}>Name</th>
                                <th style={{ minWidth: '180px' }}>Email</th>
                                <th style={{ width: '90px', whiteSpace: 'nowrap' }}>Email ✉️</th>
                                <th style={{ width: '105px', whiteSpace: 'nowrap' }}>Pwd Status</th>
                                <th style={{ minWidth: '110px' }}>College</th>
                                <th style={{ width: '115px', whiteSpace: 'nowrap' }}>Phone</th>
                                <th style={{ minWidth: '240px' }}>Event Choices</th>
                                <th style={{ minWidth: '140px', whiteSpace: 'nowrap' }}>Payment Ref</th>
                                <th style={{ width: '95px', whiteSpace: 'nowrap' }}>Registered On</th>
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
                                filteredParticipants.map((participant, index) => {
                                    const ec = participant.eventChoices || {};
                                    const badges = [];
                                    if (ec.panelDiscussion) badges.push({ label: 'Panel Disc.', color: '#3b82f6' });
                                    if (ec.day1Workshop === 'rtl-gds') badges.push({ label: 'RTL & Testbench', color: '#8b5cf6' });
                                    else if (ec.day1Workshop === 'fpga') badges.push({ label: 'FPGA', color: '#8b5cf6' });
                                    if (ec.expertInsights) badges.push({ label: 'Expert Talk', color: '#f59e0b' });
                                    if (ec.sharkTank) badges.push({ label: 'Shark Tank', color: '#ef4444' });
                                    if (ec.aiInVlsi) badges.push({ label: 'AI-Powered VLSI', color: '#f59e0b' });
                                    if (ec.treasureHunt) badges.push({ label: 'Jackpot', color: '#ec4899' });
                                    if (ec.silentGallery) badges.push({ label: 'Gallery', color: '#06b6d4' });

                                    // Fallback for old selectedEvents array
                                    if (badges.length === 0 && (participant.selectedEvents || []).length > 0) {
                                        participant.selectedEvents.forEach(evt =>
                                            badges.push({ label: evt, color: '#3b82f6' })
                                        );
                                    }

                                    return (
                                        <tr key={participant.id || participant._id || index}>
                                            {/* Combined # + Reg ID */}
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <span style={{ color: '#6b7280', fontSize: '0.72rem', marginRight: '4px' }}>
                                                    {index + 1}.
                                                </span>
                                                <code style={{
                                                    fontSize: '0.72rem',
                                                    color: participant.registrationId ? '#93c5fd' : '#4b5563',
                                                    background: 'var(--bg-tertiary)',
                                                    padding: '2px 5px',
                                                    borderRadius: '3px'
                                                }}>
                                                    {participant.registrationId || '—'}
                                                </code>
                                            </td>

                                            <td className="name-cell">{participant.name}</td>

                                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.84rem' }}>
                                                {participant.email}
                                            </td>

                                            {/* Email delivery status */}
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {participant.credentialsEmailSent === true ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 7px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600, color: '#22c55e' }}>
                                                        ✓ Sent
                                                    </span>
                                                ) : participant.credentialsEmailSent === false ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 7px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600, color: '#f87171' }}>
                                                        ✕ Failed
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#4b5563', fontSize: '0.72rem' }}>—</span>
                                                )}
                                            </td>

                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {participant.mustChangePassword
                                                    ? (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '3px',
                                                            padding: '3px 8px',
                                                            background: 'rgba(234,179,8,0.12)',
                                                            border: '1px solid rgba(234,179,8,0.4)',
                                                            borderRadius: '20px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            color: '#fbbf24',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            ⚠️ Must Change
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '3px',
                                                            padding: '3px 8px',
                                                            background: 'rgba(34,197,94,0.1)',
                                                            border: '1px solid rgba(34,197,94,0.3)',
                                                            borderRadius: '20px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            color: '#22c55e',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            ✓ Active
                                                        </span>
                                                    )
                                                }
                                            </td>

                                            <td style={{ fontSize: '0.84rem' }}>{participant.college}</td>

                                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.84rem' }}>
                                                {participant.phone}
                                            </td>

                                            <td>
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '4px',
                                                    maxWidth: '280px'
                                                }}>
                                                    {badges.length > 0
                                                        ? badges.map((b, i) => (
                                                            <span key={i} style={{
                                                                padding: '2px 7px',
                                                                background: `${b.color}18`,
                                                                border: `1px solid ${b.color}40`,
                                                                borderRadius: '4px',
                                                                fontSize: '0.68rem',
                                                                color: b.color,
                                                                whiteSpace: 'nowrap',
                                                                fontWeight: 500,
                                                                letterSpacing: '0.01em'
                                                            }}>
                                                                {b.label}
                                                            </span>
                                                        ))
                                                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                                                    }
                                                </div>
                                            </td>

                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <code style={{
                                                    fontSize: '0.72rem',
                                                    color: '#a3a3a3',
                                                    background: 'var(--bg-tertiary)',
                                                    padding: '2px 5px',
                                                    borderRadius: '3px'
                                                }}>
                                                    {participant.paymentRef || '—'}
                                                </code>
                                            </td>

                                            <td className="timestamp-cell" style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
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
                                    );
                                })
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
}

export default RegistrationsTab
