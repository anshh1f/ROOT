import React, { useState } from 'react';
import { Home, MapPin, Heart, Shield, Check, Calendar, ArrowRight, X, Bookmark, Sparkles, Send } from 'lucide-react';
import { SAMPLE_HOSTS } from '../data/sampleData';

export function RootsStay({ onOpenStayHub }) {
  const [selectedHost, setSelectedHost] = useState(null);
  const [inquiryDates, setInquiryDates] = useState('Next Month (Flexible)');
  const [inquiryNotes, setInquiryNotes] = useState('Looking forward to learning family recipes and supporting the local community initiative.');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const [bookmarkedHostIds, setBookmarkedHostIds] = useState(() => {
    const saved = localStorage.getItem('roots_bookmarked_stays');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (hostId) => {
    let next;
    if (bookmarkedHostIds.includes(hostId)) {
      next = bookmarkedHostIds.filter((id) => id !== hostId);
    } else {
      next = [...bookmarkedHostIds, hostId];
    }
    setBookmarkedHostIds(next);
    localStorage.setItem('roots_bookmarked_stays', JSON.stringify(next));
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setSelectedHost(null);
    }, 2200);
  };

  return (
    <section id="stay" className="section stay-section">
      <div className="container">
        <div className="section-header">
          <div className="header-badge-row">
            <span className="section-tag">
              <Home size={14} />
              ROOTS Stay
            </span>
            <span className="sample-badge">Curated Host Showcase</span>
          </div>
          <h2 className="section-title">Stay in Living Homes, Not Impersonal Rooms</h2>
          <p className="section-description">
            Experience ancestral homestays where hosts welcome you at their family table, 
            share oral histories, and reinvest directly into their village ecosystems.
          </p>
        </div>

        {/* Host Cards Grid */}
        <div className="hosts-grid">
          {SAMPLE_HOSTS.map((stay) => {
            const isBookmarked = bookmarkedHostIds.includes(stay.id);

            return (
              <div key={stay.id} className="host-card card-white">
                <div className="host-image-wrapper">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="host-cover-img"
                    loading="lazy"
                  />
                  <div className="host-badge-floating">
                    <span className="sample-badge">Sample Host Showcase</span>
                  </div>
                  <button
                    type="button"
                    className={`btn-bookmark-floating ${isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark(stay.id)}
                    aria-label="Bookmark stay"
                    title={isBookmarked ? 'Bookmarked in prototype' : 'Bookmark stay'}
                  >
                    <Bookmark size={16} fill={isBookmarked ? '#3478F6' : 'none'} color={isBookmarked ? '#3478F6' : '#FFFFFF'} />
                  </button>
                </div>

                <div className="host-content">
                  <div className="host-profile-row">
                    <img
                      src={stay.avatar}
                      alt={stay.host}
                      className="host-avatar"
                    />
                    <div>
                      <span className="host-label">Hosted by</span>
                      <h4 className="host-name">{stay.host}</h4>
                    </div>
                  </div>

                  <h3 className="host-stay-title">{stay.name}</h3>
                  
                  <div className="host-location-row">
                    <MapPin size={14} />
                    <span>{stay.location}</span>
                  </div>

                  <div className="stay-architecture-pill">
                    <strong>Architecture:</strong> {stay.stayType}
                  </div>

                  <div className="host-experience-box">
                    <span className="experience-label">Immersive Highlight:</span>
                    <p className="experience-text">"{stay.experience}"</p>
                  </div>

                  <div className="community-impact-box">
                    <span className="impact-label">🌱 Local Impact:</span>
                    <p className="impact-text">{stay.communityImpact}</p>
                  </div>

                  <div className="host-badges-row">
                    {stay.badges.map((b, idx) => (
                      <span key={idx} className="stay-feature-pill">✓ {b}</span>
                    ))}
                  </div>

                  <div className="host-card-footer">
                    <div className="host-price-block">
                      <span className="price-tag">{stay.priceIndication}</span>
                      <span className="sample-note">Sample Rate</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedHost(stay);
                        setInquirySuccess(false);
                      }}
                    >
                      <span>Inquire with Host</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to Open Full Community Stays Hub */}
        <div className="stay-showcase-cta-banner card-white">
          <div className="cta-banner-text">
            <h3>Looking for more village homestays or want to host slow travellers?</h3>
            <p>
              Explore our full directory of community-verified stays with detailed pricing breakdowns, 
              house rules, and safety audits — or submit an application to become a verified host.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenStayHub}
          >
            <span>Explore All Homestays & Become a Host</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Inquire Host Modal */}
        {selectedHost && (
          <div className="modal-backdrop" onClick={() => setSelectedHost(null)}>
            <div className="modal-dialog connect-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedHost(null)}
                aria-label="Close stay inquiry modal"
              >
                <X size={20} />
              </button>

              <div className="modal-body-content">
                <div className="modal-buddy-header">
                  <img
                    src={selectedHost.avatar}
                    alt={selectedHost.host}
                    className="modal-avatar"
                  />
                  <div>
                    <h3 className="modal-author-name">Inquire with {selectedHost.host}</h3>
                    <p className="modal-meta-text">{selectedHost.name} • {selectedHost.location}</p>
                  </div>
                </div>

                <div className="prototype-advisory">
                  <Shield size={14} />
                  <span>
                    Prototype Simulation: Real availability is not connected to third-party booking engines. 
                    This simulates direct fair-price host communication.
                  </span>
                </div>

                {inquirySuccess ? (
                  <div className="success-banner">
                    <Check size={20} />
                    <span>Your inquiry for {selectedHost.name} has been recorded locally!</span>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="connect-form">
                    <div className="form-group">
                      <label className="form-label">Approximate Dates of Visit</label>
                      <input
                        type="text"
                        className="form-input"
                        value={inquiryDates}
                        onChange={(e) => setInquiryDates(e.target.value)}
                        placeholder="e.g. Next month, first week"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message for {selectedHost.host}</label>
                      <textarea
                        className="form-textarea"
                        rows="4"
                        value={inquiryNotes}
                        onChange={(e) => setInquiryNotes(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="modal-form-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setSelectedHost(null)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <Send size={16} />
                        <span>Send Host Inquiry</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
