import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Schedule', path: '/schedule' },
        { name: 'Speakers', path: '/speakers' },
        { name: 'Travel & Stay', path: '/travel' },
        { name: 'Organizing Committee', path: '/committee' },
        { name: 'Contact', path: '/contact' },
    ]

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
                    <img
                        src="/images/Logo/Logo of SS.png"
                        alt="Semiconductor Summit 2.0"
                        className="navbar-logo-img"
                    />
                </Link>

                <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/register" className="btn btn-outline btn-sm nav-register-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        Register
                    </Link>
                    <Link to="/login" className="btn btn-primary btn-sm nav-login-btn">
                        Login
                    </Link>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
