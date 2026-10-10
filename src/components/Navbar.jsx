import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Languages,
  BedDouble,
  Users,
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

  const navTabs = [
    {
      id: 'home',
      name: 'Home',
      shortName: 'Home',
      view: 'home',
      icon: Home
    },
    {
      id: 'community',
      name: 'ROOTS Community',
      shortName: 'Community',
      view: 'community',
      icon: BookOpen
    },
    {
      id: 'lingua',
      name: 'ROOTS Lingua',
      shortName: 'Lingua',
      view: 'lingua',
      icon: Languages
    },
    {
      id: 'stay',
      name: 'ROOTS Stay',
      shortName: 'Stay',
      view: 'stay',
      icon: BedDouble
    },
    {
      id: 'connect',
      name: 'ROOTS Connect Hub',
      shortName: 'Connect',
      view: 'connect',
      icon: Users,
      badge: incomingRequestsCount
    }
  ];

  // Resolve active tab state based on the actual current route
  const isTabActive = (tab) => {
    if (currentView === 'home' || currentView === 'results') {
      return tab.id === 'home';
    }
    return tab.id === currentView;
  };

  const handleTabClick = (tab) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(tab.view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="navbar-root">
        <div className="container nav-container">
          {/* ROOTS Brand Logo & Tagline */}
          <a
            href="#"
            className="brand-logo"
            aria-label="ROOTS Homepage - Discover the place beyond the places"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="brand-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <circle cx="50" cy="50" r="46" fill="#123B73" />
                <path d="M50 16 L58 42 L84 50 L58 58 L50 84 L42 58 L16 50 L42 42 Z" fill="#3478F6" />
                <circle cx="50" cy="50" r="9" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="brand-text-group">
              <div className="brand-title-row">
                <span className="brand-name">ROOTS</span>
                <span className="community-prototype-badge">Community Prototype</span>
              </div>
              <span className="brand-tagline">Discover the place beyond the places.</span>
            </div>
          </a>

          {/* Desktop Modern App-Style Segmented Tab Track */}
          <nav className="desktop-tab-track" role="tablist" aria-label="Main Application Navigation">
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
                  <span className="tab-label">
                    <span className="tab-label-full">{tab.name}</span>
                    <span className="tab-label-compact">{tab.shortName}</span>
                  </span>
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

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-tagline">Discover the place beyond the places.</span>
              <span className="community-prototype-badge">Community Prototype</span>
            </div>
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
