import React from 'react';
import { Compass, Sparkles, MapPin, Users, Heart, ArrowRight } from 'lucide-react';

export function HeroSection({ onStartPlanning, onExploreActivities }) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="pill-dot"></span>
            <span className="pill-text">Community-Powered Travel Prototype</span>
          </div>

          <h1 className="hero-title">
            Discover the place <br />
            <span className="hero-title-highlight">beyond the places.</span>
          </h1>

          <p className="hero-subtitle">
            Move past tourist-flooded checklists and generic travel packages. ROOTS connects curious explorers 
            with authentic community homestays, generational food recipes, sacred trails, and genuine local companions 
            who share the real heart of their homeland.
          </p>

          <div className="hero-actions">
            <a
              href="#plan-trip"
              className="btn btn-primary hero-btn-main"
              onClick={(e) => {
                e.preventDefault();
                onStartPlanning();
              }}
            >
              <span>Personalise Your Trip</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#explore"
              className="btn btn-outline hero-btn-sub"
              onClick={(e) => {
                e.preventDefault();
                onExploreActivities();
              }}
            >
              <Compass size={18} />
              <span>Explore Activities</span>
            </a>
          </div>

          {/* Value highlights */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <span className="trust-icon-box">🌱</span>
              <div className="trust-text">
                <strong>Authentic Living</strong>
                <small>Family homestays & craft elders</small>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon-box">🤝</span>
              <div className="trust-text">
                <strong>Community Powered</strong>
                <small>Travel buddies & local hosts</small>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon-box">🗺️</span>
              <div className="trust-text">
                <strong>Beyond Hotspots</strong>
                <small>Unmapped trails & silent rivers</small>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Imagery Stack */}
        <div className="hero-visual-wrapper">
          <div className="hero-card-main">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              alt="Misty secluded mountain pass at dawn"
              className="hero-main-img"
              loading="eager"
            />
            <div className="hero-img-overlay">
              <div className="hero-overlay-tag">
                <MapPin size={14} />
                <span>Spiti & Pin Valley Hidden Sanctuary</span>
              </div>
              <p className="hero-overlay-quote">
                “We shared salt-butter tea in a sunlit earthen kitchen. No tour buses in sight.”
              </p>
            </div>
          </div>

          {/* Floating Micro-Card 1: Host Preview */}
          <div className="hero-floating-card hero-floating-left">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
              alt="Local host Dolkar"
              className="floating-avatar"
            />
            <div className="floating-info">
              <span className="floating-badge">ROOTS Stay Host</span>
              <strong>Dolkar & Stanzin</strong>
              <small>Earthen orchard stay in Ladakh</small>
            </div>
          </div>

          {/* Floating Micro-Card 2: Community Travel Buddy */}
          <div className="hero-floating-card hero-floating-right">
            <div className="floating-badge-icon">
              <Users size={18} color="#3478F6" />
            </div>
            <div className="floating-info">
              <span className="floating-badge">ROOTS Connect</span>
              <strong>Find Travel Buddies</strong>
              <small>Shared trails & cultural journeys</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
