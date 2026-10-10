import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Check, 
  Clock, 
  MessageSquare, 
  Send, 
  Shield, 
  ShieldAlert, 
  AlertTriangle, 
  X, 
  Search, 
  Filter, 
  UserCheck, 
  UserPlus, 
  UserX, 
  Lock, 
  Info, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  Flame, 
  HeartHandshake,
  Compass,
  AlertCircle
} from 'lucide-react';
import { 
  SAMPLE_CONNECT_PROFILES, 
  evaluateBuddyMatch, 
  ACTIVITY_NAMES 
} from '../data/connectData';
import { useAuth } from '../context/AuthContext';

export function RootsConnectHub({
  userTripContext,
  onBackToHome
}) {
  const { requireAuth } = useAuth();
  // User's own trip criteria for matching
  const [userCriteria, setUserCriteria] = useState(() => {
    const saved = localStorage.getItem('roots_user_connect_criteria');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      destination: userTripContext?.destination || "Varkala Cliff & Backwaters",
      destinationId: userTripContext?.destinationId || "varkala",
      startDate: "2026-11-12",
      endDate: "2026-11-18",
      budgetINR: userTripContext?.budgetSummary?.userTotalBudget || 22000,
      preferredActivities: userTripContext?.preferredExperiences || ["hiking", "local-food", "nature", "swimming"],
      travelStyle: userTripContext?.travelStyle || "Mixed"
    };
  });

  // Track connection request status map { [buddyId]: 'no_request' | 'request_sent' | 'incoming' | 'accepted' | 'declined' | 'cancelled' }
  const [requestStatusMap, setRequestStatusMap] = useState(() => {
    const saved = localStorage.getItem('roots_connect_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Set initial defaults from sample profiles
    const initial = {};
    SAMPLE_CONNECT_PROFILES.forEach(p => {
      initial[p.id] = p.initialStatus || 'no_request';
    });
    return initial;
  });

  // Blocked users set
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const saved = localStorage.getItem('roots_connect_blocked');
    return saved ? JSON.parse(saved) : [];
  });

  // Active filters
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all'); // 'all' | 'incoming' | 'accepted' | 'sent'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeChatBuddy, setActiveChatBuddy] = useState(null);
  const [activeReportBuddy, setActiveReportBuddy] = useState(null);
  const [showEditCriteriaModal, setShowEditCriteriaModal] = useState(false);
  const [showSafetyGuideModal, setShowSafetyGuideModal] = useState(false);
  const [notification, setNotification] = useState('');

  // Chat conversation state for active chat
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sync user criteria if external trip context changes
  useEffect(() => {
    if (userTripContext) {
      setUserCriteria(prev => ({
        ...prev,
        destination: userTripContext.destination || prev.destination,
        destinationId: userTripContext.destinationId || prev.destinationId,
        budgetINR: userTripContext.budgetSummary?.userTotalBudget || prev.budgetINR,
        preferredActivities: userTripContext.preferredExperiences || prev.preferredActivities,
        travelStyle: userTripContext.travelStyle || prev.travelStyle
      }));
    }
  }, [userTripContext]);

  // Persist request statuses
  const updateStatus = (buddyId, newStatus) => {
    setRequestStatusMap(prev => {
      const next = { ...prev, [buddyId]: newStatus };
      localStorage.setItem('roots_connect_requests', JSON.stringify(next));
      return next;
    });
  };

  // Connection Actions
  const handleSendRequest = (buddyId) => {
    requireAuth({
      actionName: 'Connect with a travel buddy',
      message: 'Create an account or sign in to connect and plan shared trails with fellow explorers.',
      onAuthenticated: () => {
        if (buddyId === 'user-self' || buddyId?.startsWith('user-')) {
          showToast('Cannot send a connection request to your own profile.');
          return;
        }
        const currentStatus = requestStatusMap[buddyId];
        if (currentStatus === 'request_sent' || currentStatus === 'accepted') {
          showToast('A connection request is already active for this traveller.');
          return;
        }
        updateStatus(buddyId, 'request_sent');
        showToast('Connection request sent! The traveller can now review your profile.');
      }
    });
  };

  const handleCancelRequest = (buddyId) => {
    updateStatus(buddyId, 'cancelled');
    showToast('Connection request cancelled.');
  };

  const handleAcceptRequest = (buddy) => {
    updateStatus(buddy.id, 'accepted');
    showToast(`Connected with ${buddy.name}! Demo conversation is now unlocked.`);
  };

  const handleDeclineRequest = (buddyId) => {
    updateStatus(buddyId, 'declined');
    showToast('Connection request declined.');
  };

  const handleWithdrawConnection = (buddyId) => {
    updateStatus(buddyId, 'no_request');
    showToast('Connection withdrawn. Conversation has been locked.');
    if (activeChatBuddy && activeChatBuddy.id === buddyId) {
      setActiveChatBuddy(null);
    }
  };

  // Block Action
  const handleBlockUser = (buddyId) => {
    const updated = [...blockedUsers, buddyId];
    setBlockedUsers(updated);
    localStorage.setItem('roots_connect_blocked', JSON.stringify(updated));
    showToast('Traveller profile blocked and removed from discovery.');
    if (activeChatBuddy && activeChatBuddy.id === buddyId) {
      setActiveChatBuddy(null);
    }
  };

  // Unblock Action
  const handleUnblockUser = (buddyId) => {
    const updated = blockedUsers.filter(id => id !== buddyId);
    setBlockedUsers(updated);
    localStorage.setItem('roots_connect_blocked', JSON.stringify(updated));
    showToast('Traveller profile unblocked.');
  };

  // Report Action
  const handleReportSubmit = (reason, notes) => {
    if (!activeReportBuddy) return;
    const reports = JSON.parse(localStorage.getItem('roots_connect_reports') || '[]');
    reports.push({
      reportedBuddyId: activeReportBuddy.id,
      reportedName: activeReportBuddy.name,
      reason,
      notes,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('roots_connect_reports', JSON.stringify(reports));

    // Also auto-block reported user for user comfort
    handleBlockUser(activeReportBuddy.id);
    setActiveReportBuddy(null);
    showToast('Report submitted for community review. Profile has been muted.');
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  // Open Chat
  const handleOpenChat = (buddy) => {
    requireAuth({
      actionName: 'Chat with a travel buddy',
      message: 'Create an account or sign in to send messages and coordinate trails safely.',
      onAuthenticated: () => {
        setActiveChatBuddy(buddy);
        // Load persisted chat
        const stored = localStorage.getItem(`roots_connect_messages_${buddy.id}`);
        if (stored) {
          try {
            setChatMessages(JSON.parse(stored));
          } catch (e) {
            setChatMessages([]);
          }
        } else {
          // Default greeting from buddy
          const initial = [
            {
              id: 'msg-init-1',
              sender: 'buddy',
              text: buddy.initialMessage || `Hey there! Glad we connected on ROOTS. Are you heading to ${buddy.destination} around the same dates?`,
              timestamp: 'Yesterday at 4:30 PM'
            }
          ];
          setChatMessages(initial);
          localStorage.setItem(`roots_connect_messages_${buddy.id}`, JSON.stringify(initial));
        }
      }
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatBuddy) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: 'Just now'
    };

    const nextMessages = [...chatMessages, newMsg];
    setChatMessages(nextMessages);
    localStorage.setItem(`roots_connect_messages_${activeChatBuddy.id}`, JSON.stringify(nextMessages));
    setInputMessage('');

    // Simulated companion peer response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Sounds like a great plan! Let's definitely meet at a busy central café first so we can coordinate in a public spot.",
        "That works well! I'm planning to hire an auto-rickshaw to the trail head early morning if you'd like to share.",
        "Perfect! Have you booked a homestay yet or looking to stay in the village courtyard area?",
        "Awesome! Looking forward to discovering authentic spots beyond the tourist rush!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const companionReply = {
        id: `msg-reply-${Date.now()}`,
        sender: 'buddy',
        text: randomResponse,
        timestamp: 'Just now'
      };
      const updatedWithReply = [...nextMessages, companionReply];
      setChatMessages(updatedWithReply);
      localStorage.setItem(`roots_connect_messages_${activeChatBuddy.id}`, JSON.stringify(updatedWithReply));
    }, 1800);
  };

  // Count incoming requests for status badge
  const incomingCount = SAMPLE_CONNECT_PROFILES.filter(
    p => !blockedUsers.includes(p.id) && requestStatusMap[p.id] === 'incoming'
  ).length;

  const acceptedCount = SAMPLE_CONNECT_PROFILES.filter(
    p => !blockedUsers.includes(p.id) && requestStatusMap[p.id] === 'accepted'
  ).length;

  const sentCount = SAMPLE_CONNECT_PROFILES.filter(
    p => !blockedUsers.includes(p.id) && requestStatusMap[p.id] === 'request_sent'
  ).length;

  // Filter profiles
  const visibleProfiles = SAMPLE_CONNECT_PROFILES.filter(buddy => {
    // Hide blocked users
    if (blockedUsers.includes(buddy.id)) return false;

    // Filter by destination
    if (selectedDestinationFilter !== 'all' && buddy.destinationId !== selectedDestinationFilter) {
      return false;
    }

    // Filter by status tab
    const status = requestStatusMap[buddy.id] || 'no_request';
    if (selectedStatusTab === 'incoming' && status !== 'incoming') return false;
    if (selectedStatusTab === 'accepted' && status !== 'accepted') return false;
    if (selectedStatusTab === 'sent' && status !== 'request_sent') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = buddy.name.toLowerCase().includes(q);
      const matchDest = buddy.destination.toLowerCase().includes(q);
      const matchBio = buddy.bio.toLowerCase().includes(q);
      if (!matchName && !matchDest && !matchBio) return false;
    }

    return true;
  });

  // Sort profiles by match score
  const evaluatedProfiles = visibleProfiles.map(buddy => {
    const match = evaluateBuddyMatch(userCriteria, buddy);
    const status = requestStatusMap[buddy.id] || 'no_request';
    return { ...buddy, match, status };
  });

  evaluatedProfiles.sort((a, b) => b.match.score - a.match.score);

  return (
    <div className="connect-hub-page">
      {/* Top Header Bar */}
      <div className="results-top-nav">
        <div className="container results-top-nav-inner">
          <button
            type="button"
            className="btn-back-link"
            onClick={onBackToHome}
            aria-label="Back to Homepage"
          >
            <ArrowLeft size={18} />
            <span>Back to Homepage</span>
          </button>

          <div className="results-top-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowSafetyGuideModal(true)}
            >
              <Shield size={15} />
              <span>Safety Guidelines</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowEditCriteriaModal(true)}
            >
              <Edit3 size={15} />
              <span>My Travel Dates & Criteria</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="container" style={{ marginTop: '16px' }}>
          <div className="planner-notification" role="status">
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Hub Hero Banner */}
      <section className="container connect-hub-hero">
        <div className="connect-hero-card card-white">
          <div className="connect-hero-content">
            <div className="header-badge-row" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
              <span className="section-tag" style={{ marginBottom: 0 }}>
                <Users size={14} />
                ROOTS Connect
              </span>
              <span className="sample-badge">Sample Traveler Profiles Prototype</span>
            </div>

            <h1 className="connect-hero-title">Find Like-Minded Travel Buddies</h1>
            <p className="connect-hero-subtitle">
              Discover fellow explorers travelling to the same destination during your dates. 
              Share rural transport, split verified homestay costs, and explore local trails safely.
            </p>

            <div className="safety-callout-pill">
              <Shield size={15} className="safety-icon" />
              <span>
                <strong>Safety First:</strong> Profiles are demonstration samples. When meeting travellers in real life, 
                always choose public daytime locations and inform your homestay host.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* User's Current Matching Parameters Bar */}
      <section className="container matching-parameters-section">
        <div className="matching-criteria-bar card-white">
          <div className="criteria-left">
            <span className="criteria-label">Currently matching your profile for:</span>
            <div className="criteria-tags">
              <span className="criteria-pill">
                <MapPin size={13} />
                <strong>{userCriteria.destination || 'All Destinations'}</strong>
              </span>
              <span className="criteria-pill">
                <Calendar size={13} />
                <strong>{userCriteria.startDate} to {userCriteria.endDate}</strong>
              </span>
              <span className="criteria-pill">
                <DollarSign size={13} />
                <strong>Budget: ₹{userCriteria.budgetINR?.toLocaleString('en-IN')}</strong>
              </span>
              <span className="criteria-pill">
                <Compass size={13} />
                <strong>Style: {userCriteria.travelStyle}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm btn-edit-criteria"
            onClick={() => setShowEditCriteriaModal(true)}
          >
            <Edit3 size={14} />
            <span>Edit Matching Criteria</span>
          </button>
        </div>
      </section>

      {/* Filters & Status Tabs */}
      <section className="container connect-controls-section">
        <div className="controls-row">
          {/* Status Tabs */}
          <div className="status-tabs-group">
            <button
              type="button"
              className={`status-tab ${selectedStatusTab === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatusTab('all')}
            >
              All Profiles ({SAMPLE_CONNECT_PROFILES.length - blockedUsers.length})
            </button>
            <button
              type="button"
              className={`status-tab ${selectedStatusTab === 'incoming' ? 'active' : ''}`}
              onClick={() => setSelectedStatusTab('incoming')}
            >
              Incoming Requests
              {incomingCount > 0 && <span className="tab-count-badge incoming">{incomingCount}</span>}
            </button>
            <button
              type="button"
              className={`status-tab ${selectedStatusTab === 'accepted' ? 'active' : ''}`}
              onClick={() => setSelectedStatusTab('accepted')}
            >
              Connected Buddies
              {acceptedCount > 0 && <span className="tab-count-badge accepted">{acceptedCount}</span>}
            </button>
            <button
              type="button"
              className={`status-tab ${selectedStatusTab === 'sent' ? 'active' : ''}`}
              onClick={() => setSelectedStatusTab('sent')}
            >
              Sent Requests
              {sentCount > 0 && <span className="tab-count-badge">{sentCount}</span>}
            </button>
          </div>

          {/* Search Input */}
          <div className="connect-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="connect-search-input"
              placeholder="Search by name, destination, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Destination Filter Pills */}
        <div className="destination-chips-row">
          <span className="chips-title">Destination Filter:</span>
          <button
            type="button"
            className={`dest-filter-chip ${selectedDestinationFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedDestinationFilter('all')}
          >
            All Destinations
          </button>
          <button
            type="button"
            className={`dest-filter-chip ${selectedDestinationFilter === 'varkala' ? 'active' : ''}`}
            onClick={() => setSelectedDestinationFilter('varkala')}
          >
            Varkala (Kerala)
          </button>
          <button
            type="button"
            className={`dest-filter-chip ${selectedDestinationFilter === 'meghalaya' ? 'active' : ''}`}
            onClick={() => setSelectedDestinationFilter('meghalaya')}
          >
            Nongriat (Meghalaya)
          </button>
          <button
            type="button"
            className={`dest-filter-chip ${selectedDestinationFilter === 'spiti' ? 'active' : ''}`}
            onClick={() => setSelectedDestinationFilter('spiti')}
          >
            Spiti Valley (Himachal)
          </button>
          <button
            type="button"
            className={`dest-filter-chip ${selectedDestinationFilter === 'coorg' ? 'active' : ''}`}
            onClick={() => setSelectedDestinationFilter('coorg')}
          >
            Coorg (Karnataka)
          </button>
          <button
            type="button"
            className={`dest-filter-chip ${selectedDestinationFilter === 'ziro' ? 'active' : ''}`}
            onClick={() => setSelectedDestinationFilter('ziro')}
          >
            Ziro (Arunachal)
          </button>
          <button
            type="button"
            className={`dest-filter-chip ${selectedDestinationFilter === 'hampi' ? 'active' : ''}`}
            onClick={() => setSelectedDestinationFilter('hampi')}
          >
            Hampi (Karnataka)
          </button>
        </div>
      </section>

      {/* Profile Discovery Cards Grid */}
      <section className="container connect-profiles-grid-section">
        {evaluatedProfiles.length === 0 ? (
          <div className="empty-discovery-card card-white">
            <Users size={40} className="empty-icon" />
            <h3>No traveller profiles match your current filters</h3>
            <p>Try switching to "All Profiles", broadening your destination filter, or adjusting your travel dates.</p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSelectedDestinationFilter('all');
                setSelectedStatusTab('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="connect-buddies-grid">
            {evaluatedProfiles.map(buddy => {
              const { match, status } = buddy;

              return (
                <div key={buddy.id} className="buddy-hub-card card-white">
                  {/* Card Header with Avatar & Identity */}
                  <div className="buddy-card-header">
                    <div className="buddy-avatar-group">
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="buddy-hub-avatar"
                        loading="lazy"
                      />
                      <div className="buddy-title-group">
                        <div className="name-badge-row">
                          <h3 className="buddy-hub-name">{buddy.name}</h3>
                          <span className="sample-badge" title="Demonstration Profile">Demo Profile</span>
                        </div>
                        <span className="buddy-home-base">{buddy.homeBase}</span>
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <div className={`connection-status-pill status-${status}`}>
                      {status === 'no_request' && 'No Request'}
                      {status === 'request_sent' && 'Request Sent (Pending)'}
                      {status === 'incoming' && 'Incoming Request'}
                      {status === 'accepted' && 'Connected'}
                      {status === 'declined' && 'Declined'}
                      {status === 'cancelled' && 'Cancelled'}
                    </div>
                  </div>

                  {/* Destination & Date Banner */}
                  <div className="buddy-trip-banner">
                    <div className="trip-banner-item">
                      <MapPin size={14} className="banner-icon" />
                      <div>
                        <small>Destination</small>
                        <strong>{buddy.destination}</strong>
                      </div>
                    </div>

                    <div className="trip-banner-item">
                      <Calendar size={14} className="banner-icon" />
                      <div>
                        <small>Travel Dates</small>
                        <strong>{buddy.dateDisplay}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Defined Matching Explanation Card */}
                  <div className={`match-explanation-box ${match.isMatch ? 'high-match' : 'standard-match'}`}>
                    <div className="match-score-row">
                      <span className="match-rule-tag">
                        <Flame size={13} />
                        Compatibility: {match.score}% match
                      </span>
                      {match.destinationMatch && <span className="match-badge-pill">Same Destination</span>}
                      {match.dateOverlap && <span className="match-badge-pill">Overlapping Dates</span>}
                    </div>
                    <p className="match-explanation-text">
                      <strong>Match Rules:</strong> {match.explanation}
                    </p>
                  </div>

                  {/* Bio & Intro */}
                  <div className="buddy-hub-body">
                    <p className="buddy-bio-text">{buddy.bio}</p>

                    <div className="buddy-details-list">
                      <div className="detail-row">
                        <span className="detail-label">Budget Range:</span>
                        <strong className="detail-value">{buddy.budgetDisplay}</strong>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Travel Style:</span>
                        <strong className="detail-value">{buddy.travelStyle}</strong>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Languages:</span>
                        <span className="detail-value">{buddy.languages.join(', ')}</span>
                      </div>
                    </div>

                    {/* Shared Activities Tags */}
                    <div className="shared-activities-block">
                      <span className="activities-label">Preferred Activities:</span>
                      <div className="activities-chips-group">
                        {buddy.preferredActivities.map(actId => {
                          const isShared = (userCriteria.preferredActivities || []).includes(actId);
                          return (
                            <span 
                              key={actId} 
                              className={`activity-tag ${isShared ? 'shared-active' : ''}`}
                              title={isShared ? 'Shared interest with your travel criteria!' : ''}
                            >
                              {isShared ? '✓ ' : ''}{ACTIVITY_NAMES[actId] || actId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row Depending on Connection State */}
                  <div className="buddy-hub-actions-bar">
                    {/* Status: No Request */}
                    {status === 'no_request' && !buddy.isSelf && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm btn-connect-action"
                        onClick={() => handleSendRequest(buddy.id)}
                      >
                        <UserPlus size={16} />
                        <span>Request to Connect</span>
                      </button>
                    )}

                    {/* Status: Request Sent */}
                    {status === 'request_sent' && (
                      <div className="request-sent-group">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm btn-disabled-status"
                          disabled
                        >
                          <Clock size={15} />
                          <span>Request Pending</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-cancel-req"
                          onClick={() => handleCancelRequest(buddy.id)}
                        >
                          Cancel Request
                        </button>
                      </div>
                    )}

                    {/* Status: Incoming Request */}
                    {status === 'incoming' && (
                      <div className="incoming-actions-group">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm btn-accept"
                          onClick={() => handleAcceptRequest(buddy)}
                        >
                          <Check size={16} />
                          <span>Accept Request</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm btn-decline"
                          onClick={() => handleDeclineRequest(buddy.id)}
                        >
                          <X size={15} />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {/* Status: Accepted (Connected) */}
                    {status === 'accepted' && (
                      <div className="accepted-actions-group">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm btn-open-chat"
                          onClick={() => handleOpenChat(buddy)}
                        >
                          <MessageSquare size={16} />
                          <span>Open Conversation</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm btn-withdraw"
                          onClick={() => handleWithdrawConnection(buddy.id)}
                          title="Withdraw connection"
                        >
                          Withdraw
                        </button>
                      </div>
                    )}

                    {/* Status: Declined */}
                    {status === 'declined' && (
                      <div className="declined-actions-group">
                        <span className="declined-label">Request Declined</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => updateStatus(buddy.id, 'no_request')}
                        >
                          Reset
                        </button>
                      </div>
                    )}

                    {/* Status: Cancelled */}
                    {status === 'cancelled' && (
                      <div className="cancelled-actions-group">
                        <span className="cancelled-label">Request Cancelled</span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleSendRequest(buddy.id)}
                        >
                          <UserPlus size={14} />
                          <span>Request Again</span>
                        </button>
                      </div>
                    )}

                    {/* Self Profile (If own beacon) */}
                    {buddy.isSelf && (
                      <div className="self-profile-badge-box">
                        <span className="self-profile-badge">
                          <UserCheck size={14} />
                          <span>Your Profile (Self-requests disabled)</span>
                        </span>
                      </div>
                    )}

                    {/* Safety actions: Report & Block */}
                    <div className="safety-dropdown-trigger">
                      <button
                        type="button"
                        className="btn-icon-safety"
                        onClick={() => setActiveReportBuddy(buddy)}
                        title="Report this profile"
                        aria-label={`Report ${buddy.name}`}
                      >
                        <ShieldAlert size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-safety"
                        onClick={() => handleBlockUser(buddy.id)}
                        title="Block this profile"
                        aria-label={`Block ${buddy.name}`}
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Blocked Users Section (if any) */}
      {blockedUsers.length > 0 && (
        <section className="container" style={{ marginTop: '36px' }}>
          <div className="blocked-list-card card-white">
            <h4>Blocked Profiles ({blockedUsers.length})</h4>
            <p>These profiles are hidden from your match list and cannot view your connection requests.</p>
            <div className="blocked-chips">
              {blockedUsers.map(id => {
                const b = SAMPLE_CONNECT_PROFILES.find(p => p.id === id);
                return (
                  <span key={id} className="blocked-chip">
                    {b?.name || id}
                    <button type="button" onClick={() => handleUnblockUser(id)}>Unblock</button>
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 4. CONVERSATION INTERFACE MODAL (UNLOCKED ONLY ON ACCEPTANCE) */}
      {/* ============================================================== */}
      {activeChatBuddy && (
        <div className="modal-backdrop" onClick={() => setActiveChatBuddy(null)}>
          <div className="modal-dialog connect-chat-modal" onClick={e => e.stopPropagation()}>
            {/* Chat Modal Header */}
            <div className="chat-modal-header">
              <div className="chat-user-info">
                <img
                  src={activeChatBuddy.avatar}
                  alt={activeChatBuddy.name}
                  className="chat-avatar"
                />
                <div>
                  <h3 className="chat-user-name">{activeChatBuddy.name}</h3>
                  <span className="chat-user-trip">
                    {activeChatBuddy.destination} • {activeChatBuddy.dateDisplay}
                  </span>
                </div>
              </div>

              <div className="chat-header-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={() => handleWithdrawConnection(activeChatBuddy.id)}
                  title="Remove connection and lock chat"
                >
                  Withdraw Connection
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  style={{ position: 'static' }}
                  onClick={() => setActiveChatBuddy(null)}
                  aria-label="Close conversation modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Privacy & Safety Demo Disclosure Banner */}
            <div className="chat-safety-banner">
              <Shield size={16} className="safety-icon-banner" />
              <div>
                <strong>Local Prototype Demo Conversation:</strong>
                <p>
                  Messages simulate peer coordination and persist only in your browser's localStorage. 
                  Never disclose financial details, home addresses, or private verification passwords.
                </p>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="chat-messages-container">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'message-user' : 'message-buddy'}`}>
                  <div className="message-bubble">
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-message-row message-buddy">
                  <div className="message-bubble typing-bubble">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="chat-input-bar">
              <input
                type="text"
                className="chat-input"
                placeholder={`Message ${activeChatBuddy.name} to plan local meetups...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary btn-send-message"
                disabled={!inputMessage.trim()}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. SAFETY & REPORT MODAL */}
      {/* ============================================================== */}
      {activeReportBuddy && (
        <ReportModal
          buddy={activeReportBuddy}
          onClose={() => setActiveReportBuddy(null)}
          onSubmitReport={handleReportSubmit}
        />
      )}

      {/* Safety Guide Modal */}
      {showSafetyGuideModal && (
        <div className="modal-backdrop" onClick={() => setShowSafetyGuideModal(false)}>
          <div className="modal-dialog safety-guide-modal" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowSafetyGuideModal(false)}
            >
              <X size={20} />
            </button>
            <div className="modal-body-content">
              <div className="header-badge-row" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
                <span className="section-tag" style={{ marginBottom: 0 }}>
                  <Shield size={14} />
                  ROOTS Community Safety Charter
                </span>
              </div>
              <h3 className="modal-title">Guidelines for Safe Travel Buddies</h3>
              
              <div className="safety-rules-list">
                <div className="safety-rule-item">
                  <span className="rule-num">1</span>
                  <div>
                    <strong>Meet in Public Places First</strong>
                    <p>Always arrange your first meetup in a well-trafficked, public daytime venue—such as a central heritage café or village square.</p>
                  </div>
                </div>

                <div className="safety-rule-item">
                  <span className="rule-num">2</span>
                  <div>
                    <strong>Keep Your Accommodations Independent</strong>
                    <p>Book your own verified homestay room. Never feel pressured into shared rooms with someone you just met.</p>
                  </div>
                </div>

                <div className="safety-rule-item">
                  <span className="rule-num">3</span>
                  <div>
                    <strong>Inform Loved Ones of Your Day's Route</strong>
                    <p>Share your day's intended trail or auto-rickshaw route with family or your homestay hosts.</p>
                  </div>
                </div>

                <div className="safety-rule-item">
                  <span className="rule-num">4</span>
                  <div>
                    <strong>Maintain Financial Independence</strong>
                    <p>Split public transport or meals directly with the local vendor. Never send money in advance to private individuals.</p>
                  </div>
                </div>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowSafetyGuideModal(false)}
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Matching Criteria Modal */}
      {showEditCriteriaModal && (
        <EditCriteriaModal
          criteria={userCriteria}
          onClose={() => setShowEditCriteriaModal(false)}
          onSave={(newCriteria) => {
            setUserCriteria(newCriteria);
            localStorage.setItem('roots_user_connect_criteria', JSON.stringify(newCriteria));
            setShowEditCriteriaModal(false);
            showToast('Matching criteria updated! Profiles re-evaluated.');
          }}
        />
      )}
    </div>
  );
}

// Sub-component: Report Modal
function ReportModal({ buddy, onClose, onSubmitReport }) {
  const [reason, setReason] = useState('Commercial tour agency or solicitation');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReport(reason, notes);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog report-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="modal-body-content">
          <div className="report-header">
            <AlertTriangle size={24} className="warning-icon-large" />
            <div>
              <h3 className="modal-title">Report Profile: {buddy.name}</h3>
              <p className="modal-subtitle">Help keep the ROOTS travel community authentic and trustworthy.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label className="form-label">Reason for reporting</label>
              <select
                className="form-select"
                value={reason}
                onChange={e => setReason(e.target.value)}
              >
                <option value="Commercial tour agency or solicitation">Commercial tour agency or solicitation</option>
                <option value="Inappropriate or disrespectful conduct">Inappropriate or disrespectful conduct</option>
                <option value="Suspected fake or impersonation profile">Suspected fake or impersonation profile</option>
                <option value="Safety or boundary violation concern">Safety or boundary violation concern</option>
                <option value="Other concern">Other concern</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional details (Optional)</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Explain what happened so our moderation simulation can review..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="modal-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Submit Report & Block Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Sub-component: Edit User Criteria Modal
function EditCriteriaModal({ criteria, onClose, onSave }) {
  const [destination, setDestination] = useState(criteria.destination);
  const [startDate, setStartDate] = useState(criteria.startDate);
  const [endDate, setEndDate] = useState(criteria.endDate);
  const [budgetINR, setBudgetINR] = useState(criteria.budgetINR);
  const [travelStyle, setTravelStyle] = useState(criteria.travelStyle || 'Mixed');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...criteria,
      destination,
      startDate,
      endDate,
      budgetINR: parseInt(budgetINR, 10) || 20000,
      travelStyle
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog edit-criteria-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="modal-body-content">
          <h3 className="modal-title">Customize Your Travel Matching Parameters</h3>
          <p className="modal-subtitle">Adjust your destination and dates to test how different profiles match.</p>

          <form onSubmit={handleSubmit} className="criteria-form">
            <div className="form-group">
              <label className="form-label">Your Planned Destination</label>
              <input
                type="text"
                className="form-input"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Varkala, Meghalaya, Spiti, Coorg..."
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Trip Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trip End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Your Budget in INR (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={budgetINR}
                  onChange={e => setBudgetINR(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Travel Style</label>
                <select
                  className="form-select"
                  value={travelStyle}
                  onChange={e => setTravelStyle(e.target.value)}
                >
                  <option value="Mixed">Mixed (Balanced)</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Relaxed">Relaxed</option>
                </select>
              </div>
            </div>

            <div className="modal-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Update Matches
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
