import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LaunchPage.css';

const LaunchPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="launch-container">
      {/* Navbar */}
      <nav className="navbar">
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        <span>Spotimates</span>
      </Link>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/about" className="nav-link">About Us</Link>

          <div className="nav-buttons">
            <button className="nav-btn nav-login">
              <Link to="/sign-in" style={{ color: 'inherit', textDecoration: 'none' }}>Log in</Link>
            </button>
          </div>
        </div>
      </nav>

      <div className="content">
        <div className="hero">
          <h1>Discover Your Music Community</h1>
          <p className="tagline">
            Connect with like-minded listeners who share your musical taste and expand your horizons!
          </p>
        </div>

        <div className="cta-buttons">
          <button className="btn login-btn">
            <Link to="/sign-in" style={{ color: 'inherit', textDecoration: 'none' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '10px' }}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Login with Spotify
            </Link>
          </button>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <svg
                className="feature-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <h3>Smart Matching</h3>
            <p>
              With the power of AI our application creates a music profile for you and helps connect you with users who share
              your unique music preferences.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg
                className="feature-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <h3>Playlists Platform</h3>
            <p>Our platform provides users with a unique place to find and share playlists of all sorts of genres.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg
                className="feature-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <h3>Live Events</h3>
            <p>
              Get personalized concert recommendations and find people to attend shows with in your
              area.
            </p>
          </div>
        </div>
      </div>

      <footer>
        <p>© 2025 Spotimates • Privacy Policy • Terms of Service</p>
      </footer>
    </div>
  );
};

export default LaunchPage;