import React, { useState, useEffect } from 'react';
import {
  Compass,
  Calendar,
  Languages,
  BookOpen,
  Users,
  Home,
  Menu,
  X,
  BookmarkCheck
} from 'lucide-react';

export function Navbar({
  savedTripsCount,
  onOpenSavedTrips,
  onNavigate,
  currentView,
  incomingRequestsCount
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHomeSection, setActiveHomeSection] = useState('explore');

  // Sync scroll on homepage to update active tab between 'explore' and 'plan'
  useEffect(() => {
    if (currentView === 'home') {
      const handleScroll = () => {
        const planEl = document.getElementById('plan-trip');
        if (planEl) {
          const rect = planEl.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveHomeSection('plan');
          } else if (window.scrollY < 380) {
            setActiveHomeSection('explore');
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentView]);

  const navTabs = [
    {
      id: 'explore',
      name: 'Explore',
      shortName: 'Explore',
      href: '#explore',
      view: 'home',
      icon: Compass
    },
    {
      id: 'plan',
      name: 'Plan a Trip',
      shortName: 'Plan',
      href: '#plan-trip',
      view: 'home',
      icon: Calendar
    },
    {
      id: 'lingua',
      name: 'Lingua',
      shortName: 'Lingua',
      href: '#lingua',
      view: 'lingua',
      icon: Languages
    },
    {
      id: 'community',
      name: 'Community',
      shortName: 'Community',
      href: '#community',
      view: 'community',
      icon: BookOpen
    },
    {
      id: 'connect',
      name: 'Connect',
      shortName: 'Connect',
      href: '#connect',
      view: 'connect',
      icon: Users,
      badge: incomingRequestsCount
    },
    {
      id: 'stay',
      name: 'Stay',
      shortName: 'Stay',
      href: '#stay',
      view: 'stay',
      icon: Home
    }
  ];

  // Resolve active tab state accurately
  const isTabActive = (tab) => {
    if (currentView === 'lingua') return tab.id === 'lingua';
    if (currentView === 'community') return tab.id === 'community';
    if (currentView === 'connect') return tab.id === 'connect';
    if (currentView === 'stay') return tab.id === 'stay';
    if (currentView === 'results') return tab.id === 'plan';
    if (currentView === 'home') {
      return tab.id === activeHomeSection;
    }
    return false;
  };

  const handleTabClick = (tab) => {
    setMobileMenuOpen(false);

    if (tab.view === 'home') {
      setActiveHomeSection(tab.id);
      if (currentView !== 'home') {
        if (onNavigate) onNavigate('home');
        setTimeout(() => {
          const el = document.querySelector(tab.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.querySelector(tab.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (onNavigate) onNavigate(tab.view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              setActiveHomeSection('explore');
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

          {/* Desktop Modern App-Style Segmented Tab Track */}
          <nav className="desktop-tab-track" role="tablist" aria-label="Main Application Tabs">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isTabActive(tab);
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={active}
                  aria-label={`Navigate to ${tab.name}`}
                  className={`desktop-tab-item ${active ? 'active-tab' : ''}`}
                  onClick={() => handleTabClick(tab)}
                >
                  <Icon size={16} className="tab-icon" />
                  <span className="tab-label">{tab.name}</span>
                  {tab.badge > 0 && (
                    <span className="tab-badge-pill" title={`${tab.badge} pending request`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="nav-actions">
            <button
              type="button"
              className="saved-trips-btn"
              onClick={onOpenSavedTrips}
              title="View saved itineraries"
              aria-label="View saved trips"
            >
              <BookmarkCheck size={17} className="saved-icon" />
              <span className="saved-label">My Trips</span>
              {savedTripsCount > 0 && (
                <span className="saved-count-pill">{savedTripsCount}</span>
              )}
            </button>

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu (Accessible alternative on mobile) */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <nav className="mobile-nav-list" aria-label="Mobile Drawer Navigation">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const active = isTabActive(tab);
                return (
                  <button
                    key={`drawer-${tab.id}`}
                    type="button"
                    className={`mobile-nav-link ${active ? 'active-drawer-link' : ''}`}
                    onClick={() => handleTabClick(tab)}
                  >
                    <Icon size={18} className="mobile-link-icon" />
                    <span>{tab.name}</span>
                    {tab.badge > 0 && (
                      <span className="nav-badge-pill" style={{ marginLeft: 'auto' }}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <div className="mobile-menu-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSavedTrips();
                  }}
                >
                  <BookmarkCheck size={18} />
                  <span>Saved Trips ({savedTripsCount})</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Fixed Modern Bottom Tab Bar for Smartphone Users */}
      <nav className="mobile-bottom-nav" role="tablist" aria-label="Mobile Bottom App Tabs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isTabActive(tab);

          return (
            <button
              key={`bottom-${tab.id}`}
              type="button"
              role="tab"
              id={`bottom-tab-${tab.id}`}
              aria-selected={active}
              className={`mobile-bottom-tab ${active ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
              aria-label={`Navigate to ${tab.name}`}
            >
              <div className="bottom-tab-icon-wrap">
                <Icon size={19} className="bottom-icon" />
                {tab.badge > 0 && <span className="bottom-badge-indicator" />}
              </div>
              <span className="bottom-tab-title">{tab.shortName}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
