import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClock } from '../hooks/useClock'
import { X } from '@phosphor-icons/react'

function Nav() {
    const time = useClock()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
        // Prevent body scroll when menu is open
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
        document.body.style.overflow = ''
    }

    return (
        <>
            <nav className="nav-container">
                {/* Left: Logo */}
                <div className="nav-logo">
                    <Link to="/" onClick={closeMenu}>AJIBOLA.</Link>
                </div>

                {/* Center: Navigation Links (Hidden on Mobile) */}
                <div className="nav-links">
                    <Link to="/approach" className="nav-link">Approach</Link>
                    <Link to="/portfolio" className="nav-link">Work</Link>
                    <Link to="/resume" className="nav-link">Resume</Link>
                    <Link to="/courses" className="nav-link">Courses</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>

                {/* Right: Location & Clock */}
                <div className="nav-info">
                    <div className="nav-info-item">
                        <span>Based in Nigeria</span>
                    </div>
                    <div className="nav-clock">
                        {time}
                    </div>
                </div>

                {/* Mobile Menu Trigger (Visible only on mobile) */}
                <button
                    className={`nav-menu-button ${isMenuOpen ? 'menu-open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={20} weight="duotone" color="#e9e9e9" /> : 'Menu'}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-content">
                    <Link to="/approach" className="mobile-menu-link" onClick={closeMenu}>Approach</Link>
                    <Link to="/portfolio" className="mobile-menu-link" onClick={closeMenu}>Work</Link>
                    <Link to="/resume" className="mobile-menu-link" onClick={closeMenu}>Resume</Link>
                    <Link to="/courses" className="mobile-menu-link" onClick={closeMenu}>Courses</Link>
                    <Link to="/contact" className="mobile-menu-link" onClick={closeMenu}>Contact</Link>
                </div>
            </div>
        </>
    )
}

export default Nav
