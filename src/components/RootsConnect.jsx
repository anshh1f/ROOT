import React, { useState } from 'react';
import { Users, MapPin, Compass, MessageSquare, Send, Check, Heart, Shield, Plus, X } from 'lucide-react';
import { SAMPLE_BUDDIES } from '../data/sampleData';

export function RootsConnect({ onOpenConnectHub }) {
  const [buddies, setBuddies] = useState(() => {
    const saved = localStorage.getItem('roots_community_buddies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...SAMPLE_BUDDIES, ...parsed];
      } catch (e) {
        return SAMPLE_BUDDIES;
      }
    }
    return SAMPLE_BUDDIES;
  });

  const [activeBuddyMessage, setActiveBuddyMessage] = useState(null);
  const [messageText, setMessageText] = useState('Hey! Saw your upcoming journey and would love to connect for slow travel and sharing transport responsibly.');
  const [messageSent, setMessageSent] = useState(false);

  // New buddy beacon modal
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [beaconName, setBeaconName] = useState('');
  const [beaconLocation, setBeaconLocation] = useState('');
  const [beaconUpcoming, setBeaconUpcoming] = useState('');
  const [beaconBio, setBeaconBio] = useState('');
  const [beaconStyle, setBeaconStyle] = useState('Slow Explorer • Culture Enthusiast');
  const [beaconSuccess, setBeaconSuccess] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setActiveBuddyMessage(null);
    }, 2000);
  };

  const handleCreateBeacon = (e) => {
    e.preventDefault();
    if (!beaconName.trim() || !beaconUpcoming.trim()) return;

    const newBuddy = {
      id: `user-buddy-${Date.now()}`,
      name: beaconName,
      location: beaconLocation.trim() || 'Co-Explorer',
      upcoming: beaconUpcoming,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      interests: ['Culture', 'Local Food', 'Hiking'],
      languages: ['English'],
      bio: beaconBio.trim() || 'Eager to discover hidden corners and share authentic local journeys.',
      travelStyle: beaconStyle,
      isUserCreated: true
    };

    const userBuddies = JSON.parse(localStorage.getItem('roots_community_buddies') || '[]');
    const updated = [newBuddy, ...userBuddies];
    localStorage.setItem('roots_community_buddies', JSON.stringify(updated));

    setBuddies([newBuddy, ...buddies]);
    setBeaconSuccess(true);

    setTimeout(() => {
      setBeaconSuccess(false);
      setShowBeaconModal(false);
      setBeaconName('');
      setBeaconLocation('');
      setBeaconUpcoming('');
      setBeaconBio('');
    }, 1800);
  };

  return (
    <section id="connect" className="section connect-section">
      <div className="container">
        <div className="section-header">
          <div className="header-badge-row">
            <span className="section-tag">
              <Users size={14} />
              ROOTS Connect
            </span>
            <span className="sample-badge">Sample Buddy Profiles</span>
          </div>
          <h2 className="section-title">Never Wander Alone Unless You Choose To</h2>
          <p className="section-description">
            Find vetted travel companions who value cultural respect, low ecological footprints, 
            and splitting rural transport to reach uncommercialized valleys.
          </p>

          <div className="section-actions-row">
            {onOpenConnectHub && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenConnectHub}
              >
                <Users size={16} />
                <span>Launch ROOTS Connect Hub (Match & Chat)</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowBeaconModal(true)}
            >
              <Plus size={16} />
              <span>Post Your Travel Buddy Beacon</span>
            </button>
          </div>
        </div>

        {/* Buddy Cards Grid */}
        <div className="buddies-grid">
          {buddies.map((buddy) => (
            <div key={buddy.id} className="buddy-card card-white">
              <div className="buddy-card-top">
                <img
                  src={buddy.avatar}
                  alt={buddy.name}
                  className="buddy-avatar"
                  loading="lazy"
                />
                <div className="buddy-top-info">
                  <div className="buddy-name-row">
                    <h3 className="buddy-name">{buddy.name}</h3>
                    {buddy.isUserCreated && (
                      <span className="user-beacon-tag">Your Profile</span>
                    )}
                  </div>
                  <div className="buddy-location">
                    <MapPin size={13} />
                    <span>{buddy.location}</span>
                  </div>
                  <span className="buddy-style-badge">{buddy.travelStyle}</span>
                </div>
              </div>

              <div className="buddy-card-body">
                <div className="buddy-upcoming-box">
                  <span className="upcoming-label">Upcoming Journey:</span>
                  <p className="upcoming-dest">
                    <Compass size={14} className="dest-icon" />
                    <strong>{buddy.upcoming}</strong>
                  </p>
                </div>

                <p className="buddy-bio">{buddy.bio}</p>

                <div className="buddy-meta-group">
                  <div className="meta-subgroup">
                    <span className="subgroup-label">Interests:</span>
                    <div className="buddy-chips">
                      {buddy.interests.map((int, i) => (
                        <span key={i} className="buddy-interest-chip">{int}</span>
                      ))}
                    </div>
                  </div>

                  <div className="meta-subgroup">
                    <span className="subgroup-label">Languages:</span>
                    <span className="buddy-langs">{buddy.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="buddy-card-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-sm btn-connect-buddy"
                  onClick={() => {
                    setActiveBuddyMessage(buddy);
                    setMessageSent(false);
                  }}
                >
                  <MessageSquare size={15} />
                  <span>Connect / Message</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message Modal */}
        {activeBuddyMessage && (
          <div className="modal-backdrop" onClick={() => setActiveBuddyMessage(null)}>
            <div className="modal-dialog connect-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveBuddyMessage(null)}
                aria-label="Close connect modal"
              >
                <X size={20} />
              </button>

              <div className="modal-body-content">
                <div className="modal-buddy-header">
                  <img
                    src={activeBuddyMessage.avatar}
                    alt={activeBuddyMessage.name}
                    className="modal-avatar"
                  />
                  <div>
                    <h3 className="modal-author-name">Connect with {activeBuddyMessage.name}</h3>
                    <p className="modal-meta-text">Planning: {activeBuddyMessage.upcoming}</p>
                  </div>
                </div>

                <div className="prototype-advisory">
                  <Shield size={14} />
                  <span>Sample Prototype Chat: Messages simulate peer communication without external networks.</span>
                </div>

                {messageSent ? (
                  <div className="success-banner">
                    <Check size={20} />
                    <span>Greeting delivered to {activeBuddyMessage.name}'s prototype inbox!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="connect-form">
                    <div className="form-group">
                      <label className="form-label">Introduce Yourself & Your Travel Style</label>
                      <textarea
                        className="form-textarea"
                        rows="4"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="modal-form-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setActiveBuddyMessage(null)}
                      >
                        Cancel
                      </button>
                      {onOpenConnectHub && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            setActiveBuddyMessage(null);
                            onOpenConnectHub();
                          }}
                        >
                          <Users size={15} />
                          <span>Go to Connect Hub</span>
                        </button>
                      )}
                      <button type="submit" className="btn btn-primary">
                        <Send size={16} />
                        <span>Send Message (Prototype)</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Post Beacon Modal */}
        {showBeaconModal && (
          <div className="modal-backdrop" onClick={() => setShowBeaconModal(false)}>
            <div className="modal-dialog write-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowBeaconModal(false)}
                aria-label="Close beacon modal"
              >
                <X size={20} />
              </button>

              <div className="modal-body-content">
                <span className="section-tag">
                  <Users size={14} />
                  ROOTS Connect
                </span>
                <h3 className="modal-title">Post Your Travel Buddy Beacon</h3>
                <p className="modal-subtitle">
                  Let fellow slow travelers know where you're heading and what kind of co-explorer you are looking for.
                </p>

                {beaconSuccess ? (
                  <div className="success-banner">
                    <Check size={20} />
                    <span>Your beacon is live on the prototype board!</span>
                  </div>
                ) : (
                  <form onSubmit={handleCreateBeacon} className="write-form">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Rohith Kumar"
                          value={beaconName}
                          onChange={(e) => setBeaconName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Current Base Location</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Pune, India"
                          value={beaconLocation}
                          onChange={(e) => setBeaconLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Upcoming Route / Destination</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Tirthan Valley Trout & River Trek"
                        value={beaconUpcoming}
                        onChange={(e) => setBeaconUpcoming(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Travel Style Summary</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Slow Explorer • Homestay Focused"
                        value={beaconStyle}
                        onChange={(e) => setBeaconStyle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">About You & Journey Goals</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        placeholder="Describe your travel pace, interests, and how you prefer to explore..."
                        value={beaconBio}
                        onChange={(e) => setBeaconBio(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="modal-form-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setShowBeaconModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <Check size={16} />
                        <span>Publish Beacon</span>
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
