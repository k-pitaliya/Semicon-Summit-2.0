import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Cpu, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import ParticleField from '../components/ParticleField'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Forgot-password modal state
    const [showForgotModal, setShowForgotModal] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotNewPassword, setForgotNewPassword] = useState('')
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState('')
    const [showForgotNewPwd, setShowForgotNewPwd] = useState(false)
    const [showForgotConfirmPwd, setShowForgotConfirmPwd] = useState(false)
    const [forgotStatus, setForgotStatus] = useState({ loading: false, success: false, error: '' })

    // mustChangePassword modal state (shown after first login with a temp password)
    const [showChangePwdModal, setShowChangePwdModal] = useState(false)
    const [changePwdNew, setChangePwdNew] = useState('')
    const [changePwdConfirm, setChangePwdConfirm] = useState('')
    const [showChangePwdNew, setShowChangePwdNew] = useState(false)
    const [changePwdStatus, setChangePwdStatus] = useState({ loading: false, error: '' })
    const [pendingRedirect, setPendingRedirect] = useState('/')

    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!email || !password) {
            setError('Please enter both email and password')
            setLoading(false)
            return
        }

        try {
            const result = await login(email, password)

            if (result.success) {
                const dashboardRoutes = {
                    participant: '/dashboard/participant',
                    coordinator: '/dashboard/coordinator',
                    faculty: '/dashboard/faculty'
                }
                const redirectTo = dashboardRoutes[result.user.role] || '/'

                // If the account has a temporary password, show change-password
                // modal before letting them into the dashboard.
                if (result.user.mustChangePassword) {
                    setPendingRedirect(redirectTo)
                    setShowChangePwdModal(true)
                } else {
                    navigate(redirectTo, { replace: true })
                }
            } else {
                setError(result.error || 'Invalid credentials')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }

        setLoading(false)
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        // Client-side validation before hitting the server
        if (forgotNewPassword.length < 8) {
            setForgotStatus({ loading: false, success: false, error: 'Password must be at least 8 characters' })
            return
        }
        if (forgotNewPassword !== forgotConfirmPassword) {
            setForgotStatus({ loading: false, success: false, error: 'Passwords do not match' })
            return
        }
        setForgotStatus({ loading: true, success: false, error: '' })

        try {
            await api.post('/auth/forgot-password', {
                email: forgotEmail,
                newPassword: forgotNewPassword,
                confirmPassword: forgotConfirmPassword,
            })
            setForgotStatus({ loading: false, success: true, error: '' })
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to reset password. Please try again.'
            setForgotStatus({ loading: false, success: false, error: errorMessage })
        }
    }

    const handleChangePwd = async (e) => {
        e.preventDefault()
        if (changePwdNew.length < 8) {
            setChangePwdStatus({ loading: false, error: 'Password must be at least 8 characters' })
            return
        }
        if (changePwdNew !== changePwdConfirm) {
            setChangePwdStatus({ loading: false, error: 'Passwords do not match' })
            return
        }
        setChangePwdStatus({ loading: true, error: '' })
        try {
            await api.put('/auth/change-password', { newPassword: changePwdNew })
            setShowChangePwdModal(false)
            navigate(pendingRedirect, { replace: true })
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to change password. Please try again.'
            setChangePwdStatus({ loading: false, error: msg })
        }
    }

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-grid"></div>
                <div className="login-glow login-glow-1"></div>
                <div className="login-glow login-glow-2"></div>
                <ParticleField count={40} />
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="login-logo">
                            <img 
                                src="/images/Logo/Logo of SS.png" 
                                alt="Semiconductor Summit 2.0" 
                                className="login-logo-img"
                            />
                        </Link>
                        <h1>Welcome Back</h1>
                        <p>Enter your credentials to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="login-error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    className="input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="forgot-password-link"
                                    onClick={() => setShowForgotModal(true)}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner-small"></span>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">
                                Register Now
                            </Link>
                        </p>

                        <Link to="/" className="back-to-home">
                            ← Back to Home
                        </Link>
                    </div>


                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="modal-overlay">
                    <div className="modal-content forgot-password-modal">
                        <button
                            className="modal-close"
                            onClick={() => {
                                setShowForgotModal(false)
                                setForgotStatus({ loading: false, success: false, error: '' })
                                setForgotEmail('')
                                setForgotNewPassword('')
                                setForgotConfirmPassword('')
                            }}
                        >
                            &times;
                        </button>

                        <div className="modal-header">
                            <div className="modal-icon-wrapper">
                                <Lock size={24} />
                            </div>
                            <h2>Reset Password</h2>
                            <p>Enter your email and choose a new password.</p>
                        </div>

                        {forgotStatus.success ? (
                            <div className="forgot-success">
                                <CheckCircle size={48} className="success-icon" />
                                <h3>Password Changed!</h3>
                                <p>Your password has been updated. You can now sign in with your new password.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowForgotModal(false)
                                        setForgotStatus({ loading: false, success: false, error: '' })
                                        setForgotEmail('')
                                        setForgotNewPassword('')
                                        setForgotConfirmPassword('')
                                    }}
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword}>
                                {forgotStatus.error && (
                                    <div className="login-error">
                                        <AlertCircle size={18} />
                                        <span>{forgotStatus.error}</span>
                                    </div>
                                )}

                                <div className="input-group">
                                    <label htmlFor="forgot-email">Registered Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} className="input-icon" />
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            className="input"
                                            placeholder="Enter your registered email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="forgot-new-password">New Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type={showForgotNewPwd ? 'text' : 'password'}
                                            id="forgot-new-password"
                                            className="input"
                                            placeholder="Minimum 8 characters"
                                            value={forgotNewPassword}
                                            onChange={(e) => setForgotNewPassword(e.target.value)}
                                            required
                                            minLength={8}
                                        />
                                        <button type="button" className="password-toggle"
                                            onClick={() => setShowForgotNewPwd(v => !v)}
                                            aria-label={showForgotNewPwd ? 'Hide password' : 'Show password'}>
                                            {showForgotNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="forgot-confirm-password">Confirm New Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type={showForgotConfirmPwd ? 'text' : 'password'}
                                            id="forgot-confirm-password"
                                            className="input"
                                            placeholder="Re-enter your new password"
                                            value={forgotConfirmPassword}
                                            onChange={(e) => setForgotConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button type="button" className="password-toggle"
                                            onClick={() => setShowForgotConfirmPwd(v => !v)}
                                            aria-label={showForgotConfirmPwd ? 'Hide password' : 'Show password'}>
                                            {showForgotConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={forgotStatus.loading}
                                >
                                    {forgotStatus.loading ? 'Saving...' : 'Set New Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Must-Change-Password Modal — shown when mustChangePassword === true after login */}
            {showChangePwdModal && (
                <div className="modal-overlay">
                    <div className="modal-content forgot-password-modal">
                        <div className="modal-header">
                            <div className="modal-icon-wrapper">
                                <Lock size={24} />
                            </div>
                            <h2>Set Your Password</h2>
                            <p>Your account has a temporary password. Please create a new password before continuing.</p>
                        </div>

                        <form onSubmit={handleChangePwd}>
                            {changePwdStatus.error && (
                                <div className="login-error">
                                    <AlertCircle size={18} />
                                    <span>{changePwdStatus.error}</span>
                                </div>
                            )}

                            <div className="input-group">
                                <label htmlFor="change-new-password">New Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type={showChangePwdNew ? 'text' : 'password'}
                                        id="change-new-password"
                                        className="input"
                                        placeholder="Minimum 8 characters"
                                        value={changePwdNew}
                                        onChange={(e) => setChangePwdNew(e.target.value)}
                                        required
                                        minLength={8}
                                        autoFocus
                                    />
                                    <button type="button" className="password-toggle"
                                        onClick={() => setShowChangePwdNew(v => !v)}
                                        aria-label={showChangePwdNew ? 'Hide password' : 'Show password'}>
                                        {showChangePwdNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="change-confirm-password">Confirm New Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type="password"
                                        id="change-confirm-password"
                                        className="input"
                                        placeholder="Re-enter your new password"
                                        value={changePwdConfirm}
                                        onChange={(e) => setChangePwdConfirm(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={changePwdStatus.loading}
                            >
                                {changePwdStatus.loading ? 'Saving...' : 'Save Password & Continue'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
