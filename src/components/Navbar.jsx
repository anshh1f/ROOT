import React, { useState } from 'react';
import { Compass, MapPin, BookOpen, Users, Home, Calendar, Menu, X, BookmarkCheck } from 'lucide-react';

export function Navbar({ savedTripsCount, onOpenSavedTrips, onNavigate, currentView, incomingRequestsCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Explore', href: '#explore', view: 'home', icon: Compass },
    { name: 'Plan a Trip', href: '#plan-trip', view: 'home', icon: Calendar },
    { name: 'Community', href: '#community', view: 'community', icon: BookOpen },
    { name: 'Connect', href: '#connect', view: 'connect', icon: Users, badge: incomingRequestsCount },
    { name: 'Stay', href: '#stay', view: 'stay', icon: Home },
  ];

  const handleNavClick = (target) => {
    setMobileMenuOpen(false);
    const linkObj = typeof target === 'string'
      ? { href: target, view: target === '#connect' ? 'connect' : (target === '#community' ? 'community' : (target === '#stay' ? 'stay' : 'home')) }
      : target;

    if (linkObj.view === 'connect') {
      if (onNavigate) onNavigate('connect');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (linkObj.view === 'community') {
      if (onNavigate) onNavigate('community');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (linkObj.view === 'stay') {
      if (onNavigate) onNavigate('stay');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView !== 'home') {
      if (onNavigate) onNavigate('home');
      setTimeout(() => {
        const element = document.querySelector(linkObj.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.querySelector(linkObj.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="navbar-root">
      <div className="container nav-container">
        {/* ROOTS Brand Logo */}
        <a 
          href="#" 
          className="brand-logo" 
          aria-label="ROOTS Homepage"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
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
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`nav-link ${currentView === item.view ? 'active-nav' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item);
              }}
            >
              <span>{item.name}</span>
              {item.badge > 0 && (
                <span className="nav-badge-pill" title={`${item.badge} incoming request`}>
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button
            type="button"
            className="saved-trips-btn"
            onClick={onOpenSavedTrips}
            title="View saved itineraries"
            aria-label="View saved trips"
          >
            <BookmarkCheck size={18} className="saved-icon" />
            <span className="saved-label">My Trips</span>
            {savedTripsCount > 0 && (
              <span className="saved-count-pill">{savedTripsCount}</span>
            )}
          </button>

          <a
            href="#plan-trip"
            className="btn btn-primary nav-plan-btn"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#plan-trip');
            }}
          >
            Plan a Trip
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <nav className="mobile-nav-list" aria-label="Mobile Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                >
                  <Icon size={18} className="mobile-link-icon" />
                  <span>{item.name}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge-pill" style={{ marginLeft: 'auto' }}>
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
            <div className="mobile-menu-footer">
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%', marginBottom: '10px' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSavedTrips();
                }}
              >
                <BookmarkCheck size={18} />
                Saved Trips ({savedTripsCount})
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => handleNavClick('#plan-trip')}
              >
                Plan a Trip
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>

    {/* Fixed Bottom Navigation Bar for Smartphone Users */}
    <nav className="mobile-bottom-nav" aria-label="Mobile Main Navigation">
      {navLinks.map((item) => {
        const Icon = item.icon;
        const isActive = (item.view === currentView && (currentView !== 'home' || item.href === '#explore'));
        const label = item.name === 'Plan a Trip' ? 'Plan' : item.name;

        return (
          <button
            key={`bottom-${item.name}`}
            type="button"
            className={`mobile-bottom-tab ${isActive ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
            aria-label={`Navigate to ${item.name}`}
          >
            <div className="bottom-tab-icon-wrap">
              <Icon size={20} className="bottom-icon" />
              {item.badge > 0 && <span className="bottom-badge-indicator" />}
            </div>
            <span className="bottom-tab-title">{label}</span>
          </button>
        );
      })}
    </nav>
    </>
  );
}
