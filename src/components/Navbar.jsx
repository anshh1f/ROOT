import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Languages,
  BedDouble,
  Users,
  Menu,
  X,
  BookmarkCheck,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({
  savedTripsCount,
  onOpenSavedTrips,
  onNavigate,
  currentView,
  incomingRequestsCount
}) {
  const { user, signOut, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler';

  const navTabs = [
    {
      id: 'home',
      name: 'Home',
      view: 'home',
      icon: Home
    },
    {
      id: 'community',
      name: 'Community',
      view: 'community',
      icon: BookOpen
    },
    {
      id: 'lingua',
      name: 'Lingua',
      view: 'lingua',
      icon: Languages
    },
    {
      id: 'stay',
      name: 'Stay',
      view: 'stay',
      icon: BedDouble
    },
    {
      id: 'connect',
      name: 'Connect',
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
      <header className={`navbar-root ${isScrolled ? 'is-stuck' : ''}`}>
        <div className="container nav-container">
          {/* 1. Left Section: ROOTS Brand Logo & Tagline */}
          <div className="nav-brand-section">
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
                  <span className="community-prototype-badge">Prototype</span>
                </div>
                <span className="brand-tagline">Discover the place beyond the places.</span>
              </div>
            </a>
          </div>

          {/* 2. Center Section: Main Desktop Navigation (Pill-style) */}
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
                  <Icon size={18} className="tab-icon" />
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

          {/* 3. Right Section: User Actions */}
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

            {/* User Profile / Auth Action */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    className="nav-user-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-label={`User menu for ${displayName}`}
                    title={user.email}
                  >
                    <div className="nav-user-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="nav-user-label">{displayName}</span>
                    <ChevronDown size={14} className="user-chevron" />
                  </button>
                  {userMenuOpen && (
                    <div className="nav-user-dropdown" role="menu">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">
                          {user.user_metadata?.full_name || displayName}
                        </div>
                        <div className="user-dropdown-email">{user.email}</div>
                      </div>
                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenSavedTrips();
                        }}
                      >
                        <BookmarkCheck size={16} />
                        <span>My Saved Trips ({savedTripsCount})</span>
                      </button>
                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onNavigate) onNavigate('admin');
                        }}
                      >
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        type="button"
                        className="user-dropdown-item danger-item"
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await signOut();
                        }}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="nav-user-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-label="Account options"
                    title="Account options"
                  >
                    <User size={18} />
                    <span className="nav-user-label">Account</span>
                    <ChevronDown size={14} className="user-chevron" />
                  </button>
                  {userMenuOpen && (
                    <div className="nav-user-dropdown" role="menu">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">Welcome, Explorer</div>
                        <div className="user-dropdown-email">Sign in to sync your journeys</div>
                      </div>
                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          openAuthModal({ mode: 'login' });
                        }}
                      >
                        <LogIn size={16} />
                        <span>Log in</span>
                      </button>
                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          openAuthModal({ mode: 'signup' });
                        }}
                      >
                        <UserPlus size={16} />
                        <span>Create account</span>
                      </button>
                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onNavigate) onNavigate('admin');
                        }}
                      >
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

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
                {user ? (
                  <div className="mobile-drawer-user-section" style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--pale-blue)', borderRadius: 'var(--radius-md)' }}>
                      <div className="nav-user-avatar">
                        {(user.user_metadata?.full_name || user.email?.split('@')[0] || 'T').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--deep-blue)' }}>
                          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveler'}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--secondary-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', marginTop: '8px', color: 'var(--status-error)', borderColor: '#FECACA' }}
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await signOut();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal({ mode: 'login' });
                      }}
                    >
                      <LogIn size={15} />
                      <span>Log in</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal({ mode: 'signup' });
                      }}
                    >
                      <UserPlus size={15} />
                      <span>Sign up</span>
                    </button>
                  </div>
                )}

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
              <span className="bottom-tab-title">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
