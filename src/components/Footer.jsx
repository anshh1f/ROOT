import React from 'react';
import { Compass, MapPin, Heart, Shield, ArrowUp, Info } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="brand-logo" style={{ marginBottom: '14px' }}>
              <div className="brand-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="46" fill="#123B73" />
                  <path d="M50 16 L58 42 L84 50 L58 58 L50 84 L42 58 L16 50 L42 42 Z" fill="#3478F6" />
                  <circle cx="50" cy="50" r="9" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="brand-text-group">
                <span className="brand-name">ROOTS</span>
                <span className="brand-badge-tag">Community Travel</span>
              </div>
            </div>

            <p className="footer-tagline">
              <strong>Discover the place beyond the places.</strong>
            </p>
            <p className="footer-bio">
              A community-powered personalised travel planner connecting thoughtful explorers 
              with authentic homestays, living traditions, and meaningful local friendships.
            </p>

            <div className="footer-prototype-pill">
              <Info size={14} />
              <span>Hackathon Prototype • Curated Sample Data</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><a href="#explore">Immersive Activities</a></li>
              <li><a href="#destinations">Curated Destinations</a></li>
              <li><a href="#diaries">Community Travel Diaries</a></li>
              <li><a href="#plan-trip">Personalized Planner</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">Community</h4>
            <ul className="footer-links">
              <li><a href="#connect">ROOTS Connect (Travel Buddies)</a></li>
              <li><a href="#stay">ROOTS Stay (Local Hosts)</a></li>
              <li><a href="#diaries">Share a Travel Story</a></li>
              <li><a href="#plan-trip">Plan a Custom Route</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">Ethical Travel Charter</h4>
            <ul className="footer-charter-list">
              <li>🌿 Fair compensation for family-run homestays</li>
              <li>🤝 Genuine cultural exchange without staging</li>
              <li>🚶 Low-impact footpaths & respectful photography</li>
              <li>🧺 Support indigenous crafts directly at source</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copy">
            © 2026 ROOTS. All rights reserved. Built with the Ocean Blue design system.
          </p>
          <div className="footer-bottom-actions">
            <span className="footer-disclaimer-text">
              Demonstration prototype: Not connected to live booking or commercial AI engines.
            </span>
            <button
              type="button"
              className="btn-scroll-top"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
