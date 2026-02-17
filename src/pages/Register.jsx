import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight,
    CreditCard, User, Mail, Phone, Building,
    ExternalLink, FileText, Info, Calendar
} from 'lucide-react';
import api from '../services/api';
import ParticleField from '../components/ParticleField';
import './Register.css';

// Fixed registration fee
const REGISTRATION_FEE = 299;

// Razorpay payment link
const PAYMENT_LINK = 'https://rzp.io/rzp/NsZUsMqO';

// Available events for selection
const AVAILABLE_EVENTS = [
    { id: 'fabless-startups', name: 'Fabless Startups & MSMEs' },
    { id: 'ai-vlsi', name: 'AI in VLSI' },
    { id: 'embedded-vs-vlsi', name: 'Embedded vs VLSI' },
    { id: 'rtl-gds', name: 'RTL to GDS II Workshop' },
    { id: 'verilog-fpga', name: 'Verilog & FPGA Workshop' },
    { id: 'shark-tank', name: 'Silicon Shark Tank' },
    { id: 'silicon-jackpot', name: 'The Silicon Jackpot' },
    { id: 'silicon-playzone', name: 'Silicon PlayZone' },
    { id: 'ideas-showcase', name: 'Silicon Ideas Showcase' },
    { id: 'wafer-to-chip', name: 'Wafer to Chip Demo' }
];

const Register = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        department: '',
        paymentId: '',
        pdfFile: null,
        selectedEvents: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleEventToggle = (eventName) => {
        setFormData(prev => ({
            ...prev,
            selectedEvents: prev.selectedEvents.includes(eventName)
                ? prev.selectedEvents.filter(name => name !== eventName)
                : [...prev.selectedEvents, eventName]
        }));
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            if (file.size > 5 * 1024 * 1024) {
                setError('PDF file size must be less than 5MB');
                return;
            }
            setFormData(prev => ({ ...prev, pdfFile: file }));
            setError('');
        } else if (file) {
            setError('Please upload a valid PDF file');
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) { setError('Please enter your full name'); return false; }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) { setError('Please enter a valid email'); return false; }
        if (!/^\d{10}$/.test(formData.phone)) { setError('Please enter a valid 10-digit phone number'); return false; }
        if (!formData.college.trim()) { setError('Please enter your college name'); return false; }
        if (!formData.paymentId.trim()) { setError('Please enter the Payment ID from your receipt'); return false; }
        if (!formData.paymentId.trim().startsWith('pay_')) { setError('Payment ID must start with "pay_" (e.g., pay_KzJ9...)'); return false; }
        if (!formData.pdfFile) { setError('Please upload the PDF receipt'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setLoadingMessage('Uploading receipt...');

        try {
            const data = new FormData();
            data.append('name', formData.name.trim());
            data.append('email', formData.email.trim());
            data.append('phone', formData.phone.trim());
            data.append('college', formData.college.trim());
            data.append('department', formData.department.trim());
            data.append('paymentId', formData.paymentId.trim());
            data.append('paymentAmount', REGISTRATION_FEE);
            data.append('pdfReceipt', formData.pdfFile);
            data.append('selectedEvents', JSON.stringify(formData.selectedEvents));

            // Show progress messages
            setTimeout(() => setLoadingMessage('Verifying payment receipt...'), 500);
            setTimeout(() => setLoadingMessage('Finalizing your registration...'), 2000);

            const response = await api.post('/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000 // 30 second timeout (reduced from 60s)
            });

            // Store the generated password from response
            if (response.data.password) {
                setGeneratedPassword(response.data.password);
            }

            setLoadingMessage('Registration complete!');
            setTimeout(() => setSuccess(true), 500);
        } catch (err) {
            if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                setError('Request timeout. Please check your internet connection and try again. If the problem persists, your registration may have been saved - please check your email or contact support.');
            } else {
                setError(err.response?.data?.error || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    // ─── SUCCESS SCREEN ────────────────────────
    if (success) {
        return (
            <div className="register-page" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    <ParticleField count={40} />
                </div>
                <div className="register-container success-container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="success-icon">
                        <CheckCircle size={80} />
                    </div>
                    <h1>Registration Successful! 🎉</h1>
                    <p className="success-message">
                        Your account has been created! Use the credentials below to login.
                        We've also sent a confirmation email (check spam folder if not in inbox).
                    </p>
                    <div className="success-info">
                        <div className="info-item">
                            <User size={20} />
                            <span>Email: <strong>{formData.email}</strong></span>
                        </div>
                        <div className="info-item" style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                            <Mail size={20} style={{ color: '#22c55e' }} />
                            <span>Password: <code style={{ background: '#fff', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>{generatedPassword}</code></span>
                        </div>
                        <div className="info-item">
                            <CreditCard size={20} />
                            <span>Payment ID: <strong>{formData.paymentId}</strong></span>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.3)', marginTop: '20px', marginBottom: '20px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#fbbf24' }}>⚠️ <strong>Important:</strong> Save your password now. You can also use "Forgot Password" on the login page if needed.</p>
                    </div>
                    <Link to="/login" className="btn btn-primary">
                        Go to Login
                    </Link>
                    <Link to="/" className="btn btn-secondary" style={{ marginLeft: '12px' }}>
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // ─── MAIN REGISTER PAGE ────────────────────
    return (
        <div className="register-page" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-bg">
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" />
                <div className="hero-glow hero-glow-2" />
                <ParticleField count={40} />
            </div>
            <div className="register-container" style={{ position: 'relative', zIndex: 1 }}>
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <div className="register-header">
                    <h1>Register for <span className="text-gradient">Semiconductor Summit 2.0</span></h1>
                    <p>Complete your registration in 2 simple steps</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Pay ₹{REGISTRATION_FEE}</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Fill Form & Upload Receipt</span>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-card">
                            <div className="loading-spinner"></div>
                            <h3>{loadingMessage}</h3>
                            <p>Please wait, this typically takes 10-15 seconds...</p>
                            <small>⚠️ Do not close this page or press back</small>
                        </div>
                    </div>
                )}

                {/* ═══════════ STEP 1: PAYMENT ═══════════ */}
                {step === 1 && (
                    <div className="form-step">
                        <h2><CreditCard size={24} /> Make Payment</h2>
                        <p className="step-description">
                            Pay the registration fee to get started. All 10+ events are included!
                        </p>

                        {/* Fee Card */}
                        <div className="payment-info-card">
                            <div className="fee-display">
                                <span className="fee-label">Registration Fee</span>
                                <span className="fee-amount">₹{REGISTRATION_FEE}</span>
                            </div>
                            <div className="fee-includes">
                                <p>✓ Access to all 10+ events across 3 days</p>
                                <p>✓ Certificate of participation</p>
                                <p>✓ Workshop materials & resources</p>
                                <p>✓ Refreshments</p>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="payment-guidelines">
                            <h3>📋 Payment Steps</h3>
                            <ol>
                                <li>Click the <strong>"Pay ₹{REGISTRATION_FEE}"</strong> button below to open the Razorpay payment page.</li>
                                <li>Complete the payment using UPI, debit card, credit card, or net banking.</li>
                                <li>After payment, you'll receive a <strong>PDF receipt</strong> via email.</li>
                                <li>Note down the <strong>Payment ID</strong> from the receipt (starts with <code>pay_</code>).</li>
                                <li>Come back here and click <strong>"I've Paid — Continue"</strong> to fill in your details and upload the receipt.</li>
                            </ol>
                        </div>

                        {/* Pay Button */}
                        <div className="payment-actions">
                            <a
                                href={PAYMENT_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-pay"
                            >
                                <CreditCard size={22} />
                                Pay ₹{REGISTRATION_FEE}
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        {/* Note */}
                        <div className="payment-note">
                            <Info size={20} />
                            <p>
                                <strong>Important:</strong> Save your PDF receipt and Payment ID.
                                You'll need them in the next step to complete registration.
                            </p>
                        </div>

                        {/* Proceed */}
                        <button
                            type="button"
                            className="btn btn-primary btn-proceed"
                            onClick={() => { setStep(2); setError(''); }}
                        >
                            I've Paid — Continue <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* ═══════════ STEP 2: FORM + UPLOAD ═══════════ */}
                {step === 2 && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-step">
                            <h2><User size={24} /> Your Details & Receipt</h2>
                            <p className="step-description">
                                Fill in your information and upload the payment receipt.
                            </p>

                            {/* Personal Info */}
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Full Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Email Address <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Phone Number <span className="required">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>College / University <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleChange}
                                        placeholder="Your institution name"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label>Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g., Electronics & Communication"
                                        className="input"
                                    />
                                </div>
                            </div>

                            {/* Event Selection */}
                            <div className="event-selection-section">
                                <h3><Calendar size={20} /> Select Events to Participate</h3>
                                <p className="section-note">Choose the events you're interested in (optional - you can attend all events)</p>

                                <div className="events-grid">
                                    {AVAILABLE_EVENTS.map(event => (
                                        <label key={event.id} className="event-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedEvents.includes(event.name)}
                                                onChange={() => handleEventToggle(event.name)}
                                                className="event-checkbox"
                                            />
                                            <span className="event-name">{event.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.selectedEvents.length > 0 && (
                                    <p className="selected-count">
                                        ✓ {formData.selectedEvents.length} event{formData.selectedEvents.length !== 1 ? 's' : ''} selected
                                    </p>
                                )}
                            </div>

                            {/* Payment Verification */}
                            <div className="payment-verify-section">
                                <h3><CreditCard size={20} /> Payment Details</h3>

                                <div className="input-group">
                                    <label>Payment ID <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="paymentId"
                                        value={formData.paymentId}
                                        onChange={handleChange}
                                        placeholder="e.g., pay_xxxxxxxxxxxxx"
                                        className="input"
                                    />
                                    <small>Find this ID in your payment receipt PDF</small>
                                </div>

                                <div className="input-group">
                                    <label>PDF Receipt <span className="required">*</span></label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="pdfReceipt"
                                            accept=".pdf"
                                            onChange={handlePdfUpload}
                                            className="file-input"
                                        />
                                        <label htmlFor="pdfReceipt" className="file-upload-label">
                                            <Upload size={24} />
                                            <span>{formData.pdfFile ? formData.pdfFile.name : 'Click to upload PDF receipt'}</span>
                                            <small>PDF only, max 5MB</small>
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

                            {/* Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => { setStep(1); setError(''); }}
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span>
                                            <span className="spinner"></span>
                                            {loadingMessage || 'Processing...'}
                                        </span>
                                    ) : (
                                        <>
                                            Complete Registration
                                            <CheckCircle size={18} />
                                        </>
                                    )}
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
