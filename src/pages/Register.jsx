import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight,
    CreditCard, User, Mail, Phone, Building,
    ExternalLink, FileText, Info, Calendar, Zap, Target, Image
} from 'lucide-react';
import api from '../services/api';
import ParticleField from '../components/ParticleField';
import './Register.css';

const REGISTRATION_FEE = 299;
const PAYMENT_LINK = 'https://rzp.io/rzp/NsZUsMqO';

const STEPS = [
    { id: 1, label: 'Your Details' },
    { id: 2, label: 'Day 1 Events' },
    { id: 3, label: 'Day 2 Events' },
    { id: 4, label: 'Day 3 Events' },
    { id: 5, label: 'Payment' },
];

const INITIAL_FORM = {
    name: '', studentId: '', email: '', universityEmail: '',
    phone: '', isCharusat: '', university: '', department: '', yearOfStudy: '',
    day1Workshop: '',
    sharkTank: '', sharkTankRulesAccepted: false,
    treasureHunt: '', silentGallery: '',
    paymentId: '', pdfFile: null,
};

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setError('');
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') { setError('Please upload a valid PDF file'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('PDF file size must be less than 5MB'); return; }
        setFormData(prev => ({ ...prev, pdfFile: file }));
        setError('');
    };

    const isTreasureHuntEligible = !['4th Year'].includes(formData.yearOfStudy);

    const validateStep = (s) => {
        if (s === 1) {
            if (!formData.isCharusat) return 'Please select your university / institute';
            if (formData.isCharusat === 'other' && !formData.university.trim()) return 'Please enter your college / university name';
            if (!formData.name.trim()) return 'Please enter your full name';
            if (!formData.studentId.trim()) return 'Please enter your Student ID number';
            if (!/^\S+@\S+\.\S+$/.test(formData.universityEmail)) return 'Please enter a valid university email address';
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Please enter a valid personal email address';
            if (!/^\d{10}$/.test(formData.phone)) return 'Please enter a valid 10-digit phone number';
            if (!formData.department.trim()) return 'Please enter your department / branch';
            if (!formData.yearOfStudy) return 'Please select your year of study';
        }
        if (s === 2) {
            if (!formData.day1Workshop) return 'Please select your Day 1 workshop preference';
        }
        if (s === 3) {
            if (!formData.sharkTank) return 'Please indicate if you are participating in Silicon Shark Tank';
            if (formData.sharkTank === 'yes' && !formData.sharkTankRulesAccepted) return 'You must accept the rules and regulations to participate in Silicon Shark Tank';
        }
        if (s === 4) {
            if (!formData.treasureHunt) return 'Please indicate if you are participating in the Treasure Hunt';
            if (!formData.silentGallery) return 'Please indicate if you are participating in the Silent Gallery';
        }
        if (s === 5) {
            if (!formData.paymentId.trim()) return 'Please enter the Payment ID from your receipt';
            if (!formData.paymentId.trim().startsWith('pay_')) return 'Payment ID must start with "pay_" (e.g., pay_KzJ9...)';
            if (!formData.pdfFile) return 'Please upload your PDF payment receipt';
        }
        return null;
    };

    const goNext = () => {
        const err = validateStep(step);
        if (err) { setError(err); return; }
        setError('');
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goBack = () => { setError(''); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateStep(5);
        if (err) { setError(err); return; }

        setLoading(true);
        setError('');
        setLoadingMessage('Uploading receipt...');

        try {
            const data = new FormData();
            data.append('name', formData.name.trim());
            data.append('email', formData.email.trim());
            data.append('universityEmail', formData.universityEmail.trim());
            data.append('phone', formData.phone.trim());
            data.append('studentId', formData.studentId.trim());
            data.append('college', formData.isCharusat === 'charusat' ? 'CHARUSAT' : formData.university.trim());
            data.append('department', formData.department.trim());
            data.append('yearOfStudy', formData.yearOfStudy);
            data.append('paymentId', formData.paymentId.trim());
            data.append('paymentAmount', REGISTRATION_FEE);
            data.append('pdfReceipt', formData.pdfFile);
            data.append('eventChoices', JSON.stringify({
                day1Workshop: formData.day1Workshop,
                sharkTank: formData.sharkTank === 'yes',
                treasureHunt: formData.treasureHunt === 'yes' && isTreasureHuntEligible,
                silentGallery: formData.silentGallery === 'yes',
            }));

            setTimeout(() => setLoadingMessage('Verifying payment receipt...'), 500);
            setTimeout(() => setLoadingMessage('Finalizing your registration...'), 2000);

            const response = await api.post('/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000,
            });

            if (response.data.password) setGeneratedPassword(response.data.password);
            setLoadingMessage('Registration complete!');
            setTimeout(() => setSuccess(true), 500);
        } catch (err) {
            if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError('Request timed out. Please check your connection. If this persists, your registration may already be saved — check your email.');
            } else {
                setError(err.response?.data?.error || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    const collegeName = formData.isCharusat === 'charusat' ? 'CHARUSAT' : (formData.university || '—');

    // ── Success Screen ──────────────────────────────────────
    if (success) {
        return (
            <div className="register-page" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="hero-bg"><div className="hero-grid" /><div className="hero-glow hero-glow-1" /><div className="hero-glow hero-glow-2" /><ParticleField count={40} /></div>
                <div className="register-container success-container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="success-icon"><CheckCircle size={80} /></div>
                    <h1>Registration Successful! 🎉</h1>
                    <p className="success-message">Your account has been created! Use the credentials below to login. We've also sent a confirmation email (check spam if not in inbox).</p>
                    <div className="success-info">
                        <div className="info-item"><User size={20} /><span>Email: <strong>{formData.email}</strong></span></div>
                        <div className="info-item" style={{ background: 'rgba(34,197,94,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)' }}>
                            <Mail size={20} style={{ color: '#22c55e' }} />
                            <span>Password: <code style={{ background: '#fff', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>{generatedPassword}</code></span>
                        </div>
                        <div className="info-item"><CreditCard size={20} /><span>Payment ID: <strong>{formData.paymentId}</strong></span></div>
                    </div>
                    <div style={{ background: 'rgba(251,191,36,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(251,191,36,0.3)', marginTop: '20px', marginBottom: '20px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#fbbf24' }}>⚠️ <strong>Important:</strong> Save your password now. You can also use "Forgot Password" on the login page if needed.</p>
                    </div>
                    <Link to="/login" className="btn btn-primary">Go to Login</Link>
                    <Link to="/" className="btn btn-secondary" style={{ marginLeft: '12px' }}><ArrowLeft size={20} />Back to Home</Link>
                </div>
            </div>
        );
    }

    // ── Main Register Page ────────────────────────────────────
    return (
        <div className="register-page" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-bg">
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" />
                <div className="hero-glow hero-glow-2" />
                <ParticleField count={40} />
            </div>
            <div className="register-container" style={{ position: 'relative', zIndex: 1 }}>
                <Link to="/" className="back-link"><ArrowLeft size={20} />Back to Home</Link>

                <div className="register-header">
                    <h1>Register for <span className="text-gradient">Semiconductor Summit 2.0</span></h1>
                    <p>CHARUSAT Campus · 17–19 March 2026</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    {STEPS.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <div className={`step ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                                <div className="step-number">{step > s.id ? '✓' : s.id}</div>
                                <span>{s.label}</span>
                            </div>
                            {idx < STEPS.length - 1 && <div className="step-line" />}
                        </React.Fragment>
                    ))}
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={20} />{error}
                    </div>
                )}

                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-card">
                            <div className="loading-spinner" />
                            <h3>{loadingMessage}</h3>
                            <p>Please wait, this typically takes 10–15 seconds...</p>
                            <small>⚠️ Do not close this page or press back</small>
                        </div>
                    </div>
                )}

                {/* ═══ STEP 1 — Personal Details ═══ */}
                {step === 1 && (
                    <div className="form-step">
                        <div className="step-heading">
                            <User size={22} />
                            <div>
                                <h2>Personal Details</h2>
                                <p className="step-description">Fill in your information carefully. This will be used for certificates and communication.</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="input-group full-width">
                                <label>University / Institute <span className="required">*</span></label>
                                <select name="isCharusat" value={formData.isCharusat} onChange={handleChange} className="input">
                                    <option value="">Select your university</option>
                                    <option value="charusat">CHARUSAT (Charotar University of Science and Technology)</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {formData.isCharusat === 'other' && (
                                <div className="input-group full-width">
                                    <label>College / University Name <span className="required">*</span></label>
                                    <input type="text" name="university" value={formData.university} onChange={handleChange} placeholder="Enter your institution name" className="input" />
                                </div>
                            )}

                            <div className="input-group">
                                <label>Full Name <span className="required">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="As per college ID card" className="input" autoComplete="name" />
                            </div>

                            <div className="input-group">
                                <label>Student ID Number <span className="required">*</span></label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder={formData.isCharusat === 'charusat' ? 'e.g., 22EC048' : 'Your enrollment / roll number'} className="input" />
                            </div>

                            <div className="input-group">
                                <label>University Email Address <span className="required">*</span></label>
                                <input type="email" name="universityEmail" value={formData.universityEmail} onChange={handleChange} placeholder={formData.isCharusat === 'charusat' ? 'e.g., 22ec048@charusat.ac.in' : 'your@university.edu'} className="input" />
                            </div>

                            <div className="input-group">
                                <label>Personal Email Address <span className="required">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@gmail.com" className="input" autoComplete="email" />
                                <small className="input-hint">This will be your login email for the portal</small>
                            </div>

                            <div className="input-group">
                                <label>Phone Number <span className="required">*</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" className="input" autoComplete="tel" />
                            </div>

                            <div className="input-group">
                                <label>Department / Branch <span className="required">*</span></label>
                                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g., Electronics & Communication" className="input" />
                            </div>

                            <div className="input-group full-width">
                                <label>Year of Study <span className="required">*</span></label>
                                <div className="option-cards-row">
                                    {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(yr => (
                                        <label key={yr} className={`option-card ${formData.yearOfStudy === yr ? 'selected' : ''}`}>
                                            <input type="radio" name="yearOfStudy" value={yr} checked={formData.yearOfStudy === yr} onChange={handleChange} className="sr-only" />
                                            <span>{yr}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-primary btn-proceed" onClick={goNext}>
                                Next: Day 1 Events <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ STEP 2 — Day 1 Events ═══ */}
                {step === 2 && (
                    <div className="form-step">
                        <div className="step-heading">
                            <Calendar size={22} />
                            <div><h2>Day 1 Events</h2><p className="step-description">Tuesday, 17 March 2026</p></div>
                        </div>

                        <div className="schedule-summary">
                            <div className="schedule-row fixed">
                                <span className="schedule-time">09:00 – 10:00 AM</span>
                                <span className="schedule-event">Registration &amp; Refreshment</span>
                                <span className="schedule-tag all">All</span>
                            </div>
                            <div className="schedule-row fixed">
                                <span className="schedule-time">10:00 – 11:30 AM</span>
                                <span className="schedule-event">Inaugural Talk &amp; Panel Discussion</span>
                                <span className="schedule-tag all">All</span>
                            </div>
                            <div className="schedule-row highlight">
                                <span className="schedule-time">01:30 – 04:30 PM</span>
                                <span className="schedule-event">Parallel Workshops (Choose One Below)</span>
                                <span className="schedule-tag choose">Choose 1</span>
                            </div>
                        </div>

                        <div className="section-label">
                            <Zap size={16} /> Which workshop will you attend on Day 1 (1:30 – 4:30 PM)? <span className="required">*</span>
                        </div>

                        <div className="info-note">
                            <Info size={16} />
                            <span>These two workshops run simultaneously. You can only attend <strong>one</strong>.<br />
                            🎯 RTL to GDS – recommended for 3rd year &nbsp;|&nbsp; FPGA Workshop – recommended for 1st &amp; 2nd year</span>
                        </div>

                        <div className="option-cards-col">
                            {[
                                { val: 'rtl-gds', title: 'Hands-on Workshop on RTL to GDS II Flow', sub: 'Recommended for 3rd year students', soft: !['3rd Year', '4th Year'].includes(formData.yearOfStudy) },
                                { val: 'fpga', title: 'From Logic to Hardware: FPGA Interfacing Workshop', sub: 'Recommended for 1st & 2nd year students', soft: ['3rd Year', '4th Year'].includes(formData.yearOfStudy) },
                                { val: 'none', title: 'I will not attend any workshop on Day 1', sub: 'You will still attend the morning sessions', soft: false },
                            ].map(opt => (
                                <label key={opt.val} className={`option-card-lg ${formData.day1Workshop === opt.val ? 'selected' : ''} ${opt.soft ? 'soft-disabled' : ''}`}>
                                    <input type="radio" name="day1Workshop" value={opt.val} checked={formData.day1Workshop === opt.val} onChange={handleChange} className="sr-only" />
                                    <div className="option-card-lg-body">
                                        <div className="option-card-lg-title">{opt.title}</div>
                                        <div className="option-card-lg-sub">{opt.sub}</div>
                                    </div>
                                    <div className="option-radio-dot" />
                                </label>
                            ))}
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={goBack}><ArrowLeft size={18} />Back</button>
                            <button type="button" className="btn btn-primary" onClick={goNext}>Next: Day 2 Events <ArrowRight size={18} /></button>
                        </div>
                    </div>
                )}

                {/* ═══ STEP 3 — Day 2 Events ═══ */}
                {step === 3 && (
                    <div className="form-step">
                        <div className="step-heading">
                            <Target size={22} />
                            <div><h2>Day 2 Events</h2><p className="step-description">Wednesday, 18 March 2026</p></div>
                        </div>

                        <div className="schedule-summary">
                            <div className="schedule-row fixed">
                                <span className="schedule-time">09:30 – 11:30 AM</span>
                                <span className="schedule-event">Expert Insights: VLSI vs Embedded</span>
                                <span className="schedule-tag all">All</span>
                            </div>
                            <div className="schedule-row fixed">
                                <span className="schedule-time">Whole Day</span>
                                <span className="schedule-event">Technical Events &amp; Activities</span>
                                <span className="schedule-tag all">All</span>
                            </div>
                            <div className="schedule-row highlight">
                                <span className="schedule-time">12:30 – 04:30 PM</span>
                                <span className="schedule-event">Silicon Shark Tank – Innovation Pitch</span>
                                <span className="schedule-tag choose">Register Below</span>
                            </div>
                        </div>

                        <div className="event-info-card" style={{ borderColor: 'rgba(99,179,237,0.35)', background: 'rgba(99,179,237,0.05)' }}>
                            <div className="event-info-header">
                                <Zap size={20} style={{ color: '#60a5fa' }} />
                                <h3 style={{ color: '#f1f5f9' }}>Whole Day Technical Events</h3>
                                <span className="schedule-tag all" style={{ fontSize: '0.72rem' }}>Open to All</span>
                            </div>
                            <div className="event-info-body">
                                <p>Throughout Day 2, the following technical activities run in parallel — drop in any time during the day. No separate registration required.</p>
                                <div className="event-rounds">
                                    <div className="event-round" style={{ borderLeftColor: '#60a5fa' }}><strong>Spin the Wheel — Let the Logic Choose Your Challenge.</strong><span>Spin the wheel and tackle a randomly assigned technical challenge — every spin is a different test of your skills.</span></div>
                                    <div className="event-round" style={{ borderLeftColor: '#60a5fa' }}><strong>Circuit Puzzle — Design It Right or Watch It Fail.</strong><span>Piece together a working circuit from given components — one wrong connection and it all falls apart.</span></div>
                                    <div className="event-round" style={{ borderLeftColor: '#60a5fa' }}><strong>Cross the Words. Connect the Concepts.</strong><span>A technical crossword challenge — fill in the grid using clues from electronics, VLSI, and semiconductor theory.</span></div>
                                </div>
                                <div className="info-note small"><Info size={14} /><span>All of the above are included in your registration. Just show up!</span></div>
                            </div>
                        </div>

                        <div className="event-info-card shark">
                            <div className="event-info-header">
                                <Target size={20} />
                                <h3>Silicon Shark Tank</h3>
                                <span className="badge-prize">🏆 FREE Internship for Winning Team!</span>
                            </div>
                            <div className="event-info-body">
                                <p>Submit your original idea in semiconductor, VLSI, or FPGA. ⚠️ AI-generated or plagiarized content is strictly prohibited.</p>
                                <div className="event-rounds">
                                    <div className="event-round"><strong>Round 1 – Idea Submission</strong><span>Document ≤200 words: Problem, Solution, Innovation, Technical Domain. Shortlisted teams notified by email.</span></div>
                                    <div className="event-round"><strong>Round 2 – Live Pitch to the Sharks</strong><span>7 min presentation + 3 min Q&amp;A · Team: max 2 members · Prototype not mandatory</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="section-label">Are you participating in Silicon Shark Tank? <span className="required">*</span></div>
                        <div className="option-cards-row">
                            {[{ val: 'yes', label: 'Yes, I want to participate' }, { val: 'no', label: 'No, I will attend as a visitor' }].map(opt => (
                                <label key={opt.val} className={`option-card wide ${formData.sharkTank === opt.val ? 'selected' : ''}`}>
                                    <input type="radio" name="sharkTank" value={opt.val} checked={formData.sharkTank === opt.val} onChange={handleChange} className="sr-only" />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        {formData.sharkTank === 'yes' && (
                            <label className={`rules-checkbox ${formData.sharkTankRulesAccepted ? 'checked' : ''}`}>
                                <input type="checkbox" name="sharkTankRulesAccepted" checked={formData.sharkTankRulesAccepted} onChange={handleChange} />
                                <span>I have read and accept all the rules and regulations for Silicon Shark Tank. My submission will be original and not AI-generated or plagiarized.</span>
                            </label>
                        )}

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={goBack}><ArrowLeft size={18} />Back</button>
                            <button type="button" className="btn btn-primary" onClick={goNext}>Next: Day 3 Events <ArrowRight size={18} /></button>
                        </div>
                    </div>
                )}

                {/* ═══ STEP 4 — Day 3 Events ═══ */}
                {step === 4 && (
                    <div className="form-step">
                        <div className="step-heading">
                            <Zap size={22} />
                            <div><h2>Day 3 Events</h2><p className="step-description">Thursday, 19 March 2026</p></div>
                        </div>

                        <div className="schedule-summary">
                            <div className="schedule-row fixed">
                                <span className="schedule-time">09:30 – 11:00 AM</span>
                                <span className="schedule-event">Impact of AI in VLSI</span>
                                <span className="schedule-tag all">All</span>
                            </div>
                            <div className="schedule-row fixed">
                                <span className="schedule-time">Whole Day</span>
                                <span className="schedule-event">Technical Events &amp; Activities</span>
                                <span className="schedule-tag all">All</span>
                            </div>
                            <div className="schedule-row highlight">
                                <span className="schedule-time">After 12:00 PM</span>
                                <span className="schedule-event">Silicon Jackpot + Silent Gallery</span>
                                <span className="schedule-tag choose">Register Below</span>
                            </div>
                        </div>

                        <div className="event-info-card" style={{ borderColor: 'rgba(99,179,237,0.35)', background: 'rgba(99,179,237,0.05)' }}>
                            <div className="event-info-header">
                                <Zap size={20} style={{ color: '#60a5fa' }} />
                                <h3 style={{ color: '#f1f5f9' }}>Whole Day Technical Events</h3>
                                <span className="schedule-tag all" style={{ fontSize: '0.72rem' }}>Open to All</span>
                            </div>
                            <div className="event-info-body">
                                <p>Throughout Day 3, the following technical activities run in parallel — drop in any time during the day. No separate registration required.</p>
                                <div className="event-rounds">
                                    <div className="event-round" style={{ borderLeftColor: '#60a5fa' }}><strong>Spin the Wheel — Let the Logic Choose Your Challenge.</strong><span>Spin the wheel and tackle a randomly assigned technical challenge — every spin is a different test of your skills.</span></div>
                                    <div className="event-round" style={{ borderLeftColor: '#60a5fa' }}><strong>Circuit Puzzle — Design It Right or Watch It Fail.</strong><span>Piece together a working circuit from given components — one wrong connection and it all falls apart.</span></div>
                                    <div className="event-round" style={{ borderLeftColor: '#60a5fa' }}><strong>Cross the Words. Connect the Concepts.</strong><span>A technical crossword challenge — fill in the grid using clues from electronics, VLSI, and semiconductor theory.</span></div>
                                </div>
                                <div className="info-note small"><Info size={14} /><span>All of the above are included in your registration. Just show up!</span></div>
                            </div>
                        </div>

                        {/* Treasure Hunt */}
                        <div className="event-info-card treasure">
                            <div className="event-info-header">
                                <Zap size={20} />
                                <h3>The Silicon Jackpot — Logic-Driven Treasure Hunt</h3>
                                {!isTreasureHuntEligible && <span className="badge-restricted">🎓 1st, 2nd &amp; 3rd Year</span>}
                            </div>
                            <div className="event-info-body">
                                <p>"Decode the Logic. Hunt the Clues. Complete the Silicon." — A multi-stage technical treasure challenge.</p>
                                <div className="event-rounds">
                                    <div className="event-round"><strong>Round 1</strong><span>The Silicon Screening — Individual Flag Hunt (collect V→L→S→I flags)</span></div>
                                    <div className="event-round"><strong>Round 2</strong><span>The Logic Conquest — Team-Based Challenge</span></div>
                                    <div className="event-round"><strong>Round 3</strong><span>Kaun Banega Summit Samrat — FPGA-Based Quiz Finale (no coding required)</span></div>
                                </div>
                                <div className="info-note small"><Info size={14} /><span>🎯 Open to 1st, 2nd and 3rd year students. 4th year students may attend as observers only.</span></div>
                            </div>
                        </div>

                        <div className="section-label">
                            Are you a participant in the Treasure Hunt?<span className="required"> *</span>
                            {!isTreasureHuntEligible && <span className="not-eligible-tag">Not eligible — 4th year attends as observer only</span>}
                        </div>
                        <div className="option-cards-row">
                            {[{ val: 'yes', label: 'Yes, I will participate' }, { val: 'no', label: 'No' }].map(opt => (
                                <label key={opt.val} className={`option-card wide ${formData.treasureHunt === opt.val ? 'selected' : ''} ${opt.val === 'yes' && !isTreasureHuntEligible ? 'disabled-option' : ''}`}>
                                    <input type="radio" name="treasureHunt" value={opt.val} checked={formData.treasureHunt === opt.val}
                                        onChange={opt.val === 'yes' && !isTreasureHuntEligible ? undefined : handleChange}
                                        disabled={opt.val === 'yes' && !isTreasureHuntEligible} className="sr-only" />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Silent Gallery */}
                        <div className="event-info-card gallery" style={{ marginTop: '1.75rem' }}>
                            <div className="event-info-header">
                                <Image size={20} />
                                <h3>Silicon Silent Gallery — Poster Presentation</h3>
                            </div>
                            <div className="event-info-body">
                                <p>Present your research or project as a poster. Open to all years.</p>
                                <div className="event-rounds">
                                    <div className="event-round"><strong>Team Size</strong><span>Maximum 3 members per team</span></div>
                                    <div className="event-round"><strong>Submission Deadline</strong><span>8 March 2026 (soft copy)</span></div>
                                    <div className="event-round"><strong>Topic &amp; Format</strong><span>Shared via official email after registration</span></div>
                                </div>
                                <div className="info-note small"><Info size={14} /><span>Final printed poster provided by organizing team after faculty approval.</span></div>
                            </div>
                        </div>

                        <div className="section-label">Are you a participant in the Silicon Silent Gallery? <span className="required">*</span></div>
                        <div className="option-cards-row">
                            {[{ val: 'yes', label: 'Yes, I will participate' }, { val: 'no', label: 'No' }].map(opt => (
                                <label key={opt.val} className={`option-card wide ${formData.silentGallery === opt.val ? 'selected' : ''}`}>
                                    <input type="radio" name="silentGallery" value={opt.val} checked={formData.silentGallery === opt.val} onChange={handleChange} className="sr-only" />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={goBack}><ArrowLeft size={18} />Back</button>
                            <button type="button" className="btn btn-primary" onClick={goNext}>Next: Payment <ArrowRight size={18} /></button>
                        </div>
                    </div>
                )}

                {/* ═══ STEP 5 — Payment & Submit ═══ */}
                {step === 5 && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-step">
                            <div className="step-heading">
                                <CreditCard size={22} />
                                <div><h2>Payment &amp; Confirm</h2><p className="step-description">Pay ₹{REGISTRATION_FEE} and upload your receipt to complete registration.</p></div>
                            </div>

                            {/* Summary */}
                            <div className="summary-card">
                                <h3>Your Registration Summary</h3>
                                <div className="summary-grid">
                                    <div className="summary-row"><span>Name</span><strong>{formData.name}</strong></div>
                                    <div className="summary-row"><span>University</span><strong>{collegeName}</strong></div>
                                    <div className="summary-row"><span>Year</span><strong>{formData.yearOfStudy}</strong></div>
                                    <div className="summary-row"><span>Day 1 Workshop</span><strong>
                                        {formData.day1Workshop === 'rtl-gds' ? 'RTL to GDS II Flow' :
                                         formData.day1Workshop === 'fpga' ? 'FPGA Interfacing Workshop' : 'Not attending workshop'}
                                    </strong></div>
                                    <div className="summary-row"><span>Silicon Shark Tank</span><strong>{formData.sharkTank === 'yes' ? '✅ Participant' : '👁 Visitor'}</strong></div>
                                    <div className="summary-row"><span>Treasure Hunt</span><strong>
                                        {!isTreasureHuntEligible ? '⛔ Not eligible (4th year — observer only)' :
                                         formData.treasureHunt === 'yes' ? '✅ Participant' : '❌ Not participating'}
                                    </strong></div>
                                    <div className="summary-row"><span>Silent Gallery</span><strong>{formData.silentGallery === 'yes' ? '✅ Participant' : '❌ Not participating'}</strong></div>
                                </div>
                            </div>

                            <div className="payment-info-card">
                                <div className="fee-display">
                                    <span className="fee-label">Registration Fee</span>
                                    <span className="fee-amount">₹{REGISTRATION_FEE}</span>
                                </div>
                                <div className="fee-includes">
                                    <p>✓ Access to all 3 days of the summit</p>
                                    <p>✓ Certificate of participation</p>
                                    <p>✓ Workshop materials &amp; resources</p>
                                    <p>✓ Refreshments included</p>
                                </div>
                            </div>

                            <div className="payment-guidelines">
                                <h3>📋 Payment Steps</h3>
                                <ol>
                                    <li>Click <strong>"Pay ₹{REGISTRATION_FEE}"</strong> below to open the Razorpay page.</li>
                                    <li>Complete payment via UPI, debit/credit card, or net banking.</li>
                                    <li>You will receive a <strong>PDF receipt</strong> by email.</li>
                                    <li>Note the <strong>Payment ID</strong> (starts with <code>pay_</code>).</li>
                                    <li>Enter the Payment ID and upload the PDF receipt below, then submit.</li>
                                </ol>
                            </div>

                            <div className="payment-actions">
                                <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer" className="btn-pay">
                                    <CreditCard size={22} />Pay ₹{REGISTRATION_FEE}<ExternalLink size={16} />
                                </a>
                            </div>

                            <div className="payment-note">
                                <Info size={20} />
                                <p><strong>Important:</strong> Save your PDF receipt and Payment ID. You'll need both below.</p>
                            </div>

                            <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                                <div className="input-group full-width">
                                    <label>Payment ID <span className="required">*</span></label>
                                    <input type="text" name="paymentId" value={formData.paymentId} onChange={handleChange} placeholder="e.g., pay_xxxxxxxxxxxxx" className="input" autoComplete="off" />
                                    <small className="input-hint">Find this in your Razorpay payment receipt PDF</small>
                                </div>

                                <div className="input-group full-width">
                                    <label>PDF Receipt <span className="required">*</span></label>
                                    <div className="file-upload-area">
                                        <input type="file" id="pdfReceipt" accept=".pdf" onChange={handlePdfUpload} className="file-input" />
                                        <label htmlFor="pdfReceipt" className="file-upload-label">
                                            <Upload size={24} />
                                            <span>{formData.pdfFile ? formData.pdfFile.name : 'Click to upload PDF receipt'}</span>
                                            <small>PDF only · Max 5 MB</small>
                                        </label>
                                    </div>
                                    {formData.pdfFile && (
                                        <div className="file-preview">
                                            <CheckCircle size={16} />
                                            <span>{formData.pdfFile.name} ({(formData.pdfFile.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={goBack} disabled={loading}><ArrowLeft size={18} />Back</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? <><span className="spinner" />{loadingMessage || 'Submitting...'}</> : <>Complete Registration <CheckCircle size={18} /></>}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
