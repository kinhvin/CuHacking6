import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LaunchPage.css';

const LaunchPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to initialize waveforms with varying heights and animations
  useEffect(() => {
    // This ensures the animations have different starting points
    const waveforms = document.querySelectorAll('.waveform');
    waveforms.forEach((wave, index) => {
      const randomHeight = Math.floor(Math.random() * 30) + 20;
      const randomDuration = (Math.random() * 0.5 + 1.2).toFixed(1);
      const randomDelay = (Math.random() * 2).toFixed(2);
      
    });
  }, []);

  return (
    <div className="launch-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="music-icon">♫</span>
          <span>Spotimates</span>
        </div>
        
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          
          <div className="nav-buttons">
            <button className="nav-btn nav-login">
              <Link to="/main-menu" style={{color: 'inherit', textDecoration: 'none'}}>Log in</Link>
            </button>
            <button className="nav-btn nav-signup">
              <Link to="/sign-in" style={{color: 'inherit', textDecoration: 'none'}}>Sign up</Link>
            </button>
          </div>
        </div>
      </nav>
      
      <div className="background-animation">
        {Array.from({ length: 48 }).map((_, index) => (
          <div 
            key={index} 
            className="waveform"
          />
        ))}
      </div>
      
      <div className="content">
        <div className="hero">
          <h1>Discover Your Music Community</h1>
          <p className="tagline">Connect with like-minded listeners who share your musical taste and expand your horizons</p>
        </div>
        
        <div className="cta-buttons">
          <button className="btn login-btn">
            <Link to="/sign-up" style={{color: 'inherit', textDecoration: 'none'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "10px"}}>
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              Connect with Spotify
            </Link>
          </button>
          <button className="btn signup-btn">
            <Link to="/sign-in" style={{color: 'inherit', textDecoration: 'none'}}>Sign in to your account</Link>
          </button>
        </div>
        
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🎵</div>
            <h3>Smart Matching</h3>
            <p>Our algorithm analyzes your listening patterns to connect you with users who share your unique music preferences.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎧</div>
            <h3>Collaborative Playlists</h3>
            <p>Create shared playlists with your matches and discover new artists and tracks together.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎤</div>
            <h3>Live Events</h3>
            <p>Get personalized concert recommendations and find people to attend shows with in your area.</p>
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