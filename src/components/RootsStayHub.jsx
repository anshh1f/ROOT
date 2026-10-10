import React, { useState, useMemo } from 'react';
import {
  Home, MapPin, Shield, Check, Calendar, ArrowRight, X, Bookmark, Sparkles,
  Send, Users, AlertCircle, Eye, CheckCircle2, XCircle, Clock, Info, Search,
  Filter, Coffee, Wifi, Mountain, Utensils, Activity, Flag, ChevronRight,
  Lock, Bed, Bath, Plus, RefreshCw, FileText, CheckSquare, Phone, Mail, Award
} from 'lucide-react';
import {
  getAllStays,
  getApprovedStays,
  getStayById,
  submitHostRegistration,
  getHostApplications,
  moderateHostApplication,
  getStayBookings,
  createStayBookingRequest,
  updateBookingStatus,
  getStayReports,
  reportStayListing,
  moderateStayReport
} from '../data/stayHubData';

export function RootsStayHub({ onBackToHome, onOpenPlanner }) {
  // Navigation tabs: 'discover' | 'host' | 'bookings' | 'admin'
  const [activeTab, setActiveTab] = useState('discover');

  // Stays data state
  const [stays, setStays] = useState(() => getAllStays());
  const [bookings, setBookings] = useState(() => getStayBookings());
  const [applications, setApplications] = useState(() => getHostApplications());
  const [reports, setReports] = useState(() => getStayReports());

  // Discovery Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestsFilter, setGuestsFilter] = useState(1);
  const [maxPriceFilter, setMaxPriceFilter] = useState(4000);
  const [filterWifiOnly, setFilterWifiOnly] = useState(false);
  const [filterBreakfastOnly, setFilterBreakfastOnly] = useState(false);
  const [filterCulturalActivities, setFilterCulturalActivities] = useState(false);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('roots_bookmarked_stays');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Selected Listing for Detailed View Modal
  const [detailStay, setDetailStay] = useState(null);

  // Booking Modal State
  const [bookingStay, setBookingStay] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestContact: '',
    checkInDate: '',
    checkOutDate: '',
    guestsCount: 2,
    includeDinner: true,
    guestMessage: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Reporting Modal State
  const [reportingStay, setReportingStay] = useState(null);
  const [reportReason, setReportReason] = useState('Inaccurate listing information');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Admin Decision Modal
  const [adminTargetApp, setAdminTargetApp] = useState(null);
  const [adminDecisionType, setAdminDecisionType] = useState('reject'); // 'reject' | 'request_info'
  const [adminReason, setAdminReason] = useState('');
  const [adminChecklist, setAdminChecklist] = useState({
    idChecked: false,
    ownershipVerified: false,
    safetyPassed: false,
    photosVerified: false
  });

  // Become a Host Form State
  const [hostForm, setHostForm] = useState({
    hostFullName: '',
    age18Plus: false,
    contactVerified: true,
    languages: 'English, Malayalam',
    hostIntro: '',
    propertyName: '',
    destinationId: 'varkala',
    generalLocation: '',
    propertyType: 'Village Homestay',
    hostLivesOnProperty: true,
    rooms: 2,
    beds: 2,
    maxGuests: 4,
    bathroomPrivacy: 'Private Ensuite Washroom',
    photos: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Homecooked Meals', 'Hot Water', 'Wi-Fi'],
    accessibility: '',
    safetyFeatures: ['First aid kit on site', 'Emergency contact card'],
    culturalActivities: 'Cooking demonstration, Village walk',
    breakfastIncluded: true,
    dinnerAvailable: true,
    dinnerCostINR: 200,
    mealsDescription: 'Family homecooked seasonal meals.',
    nightlyRateINR: 2000,
    cleaningFeeINR: 150,
    checkInTime: '01:00 PM',
    checkOutTime: '11:00 AM',
    houseRules: 'Quiet hours after 10 PM\nNo single-use plastic\nRemove footwear at entrance',
    cancellationPolicy: 'Flexible: Free cancellation up to 48 hours before check-in.',
    govIdType: 'Aadhaar / Voter ID (Masked)',
    ownershipDocType: 'Village Panchayat Registration / Electricity Receipt',
    hasFireExtinguisher: true,
    hasFirstAidKit: true,
    potableWaterCertified: true
  });
  const [hostSubmitSuccess, setHostSubmitSuccess] = useState(null);
  const [hostSubmitError, setHostSubmitError] = useState('');

  // Synchronize storage
  const refreshAllData = () => {
    setStays(getAllStays());
    setBookings(getStayBookings());
    setApplications(getHostApplications());
    setReports(getStayReports());
  };

  const toggleBookmark = (id) => {
    let next;
    if (bookmarkedIds.includes(id)) {
      next = bookmarkedIds.filter(i => i !== id);
    } else {
      next = [...bookmarkedIds, id];
    }
    setBookmarkedIds(next);
    localStorage.setItem('roots_bookmarked_stays', JSON.stringify(next));
  };

  // Filtered Approved Stays for Discovery
  const filteredStays = useMemo(() => {
    // Only APPROVED stays are visible in public discovery
    const approved = stays.filter(s => s.status === 'approved');

    return approved.filter(stay => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          stay.name.toLowerCase().includes(q) ||
          stay.generalLocation.toLowerCase().includes(q) ||
          (stay.host?.name && stay.host.name.toLowerCase().includes(q)) ||
          stay.propertyType.toLowerCase().includes(q) ||
          (stay.culturalActivities && stay.culturalActivities.some(a => a.toLowerCase().includes(q)));
        if (!matchesText) return false;
      }

      // Destination
      if (destinationFilter !== 'all' && stay.destinationId !== destinationFilter) {
        return false;
      }

      // Property Type
      if (propertyTypeFilter !== 'all' && stay.propertyType !== propertyTypeFilter) {
        return false;
      }

      // Max Price
      if (stay.nightlyRateINR > maxPriceFilter) {
        return false;
      }

      // Capacity
      if (stay.maxGuests < guestsFilter) {
        return false;
      }

      // Amenities Filters
      if (filterWifiOnly && !stay.amenities?.includes('Wi-Fi')) {
        return false;
      }

      if (filterBreakfastOnly && !stay.mealOptions?.breakfastIncluded) {
        return false;
      }

      if (filterCulturalActivities && (!stay.culturalActivities || stay.culturalActivities.length === 0)) {
        return false;
      }

      return true;
    });
  }, [
    stays,
    searchQuery,
    destinationFilter,
    propertyTypeFilter,
    maxPriceFilter,
    guestsFilter,
    filterWifiOnly,
    filterBreakfastOnly,
    filterCulturalActivities
  ]);

  // Open Booking Modal for a stay
  const handleOpenBooking = (stay) => {
    setBookingStay(stay);
    setBookingForm({
      guestName: '',
      guestContact: '',
      checkInDate: checkInDate || '2026-11-15',
      checkOutDate: checkOutDate || '2026-11-18',
      guestsCount: guestsFilter || 2,
      includeDinner: stay.mealOptions?.dinnerAvailable || false,
      guestMessage: ''
    });
    setBookingError('');
    setBookingSuccess(null);
  };

  // Submit Booking Request
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingError('');

    if (!bookingForm.guestName.trim()) {
      setBookingError('Please enter your full name.');
      return;
    }
    if (!bookingForm.guestContact.trim()) {
      setBookingError('Please provide an email or phone number for confirmation.');
      return;
    }
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      setBookingError('Please select check-in and check-out dates.');
      return;
    }

    try {
      const newBooking = createStayBookingRequest({
        stayId: bookingStay.id,
        guestName: bookingForm.guestName,
        guestContact: bookingForm.guestContact,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guestsCount: bookingForm.guestsCount,
        includeDinner: bookingForm.includeDinner,
        guestMessage: bookingForm.guestMessage
      });

      setBookingSuccess(newBooking);
      refreshAllData();
    } catch (err) {
      setBookingError(err.message || 'Error creating booking request.');
    }
  };

  // Host Registration Submit
  const handleHostFormSubmit = (e) => {
    e.preventDefault();
    setHostSubmitError('');

    if (!hostForm.hostFullName.trim()) {
      setHostSubmitError('Host full name is required.');
      return;
    }
    if (!hostForm.age18Plus) {
      setHostSubmitError('You must confirm age eligibility (18+ years) to register as a host.');
      return;
    }
    if (!hostForm.propertyName.trim()) {
      setHostSubmitError('Please provide a descriptive name for your homestay.');
      return;
    }
    if (!hostForm.generalLocation.trim()) {
      setHostSubmitError('General location (village/district) is required.');
      return;
    }
    if (!hostForm.nightlyRateINR || Number(hostForm.nightlyRateINR) <= 0) {
      setHostSubmitError('Please enter a valid nightly rate in INR.');
      return;
    }

    try {
      const created = submitHostRegistration(hostForm);
      setHostSubmitSuccess(created);
      refreshAllData();
    } catch (err) {
      setHostSubmitError(err.message || 'Submission error.');
    }
  };

  // Handle Admin Decision
  const handleAdminDecision = (appId, decision) => {
    if (decision === 'approve') {
      moderateHostApplication(appId, 'approve', 'Approved by ROOTS community verification coordinator.', {
        idChecked: true,
        ownershipVerified: true,
        safetyPassed: true,
        photosVerified: true
      });
      refreshAllData();
      return;
    }

    // Opens reason modal for reject or request_info
    const target = applications.find(a => a.id === appId) || stays.find(s => s.id === appId);
    setAdminTargetApp(target);
    setAdminDecisionType(decision);
    setAdminReason('');
  };

  const handleConfirmAdminDecision = () => {
    if (!adminReason.trim() || adminReason.trim().length < 5) {
      alert('Please enter a reason or specific instructions (minimum 5 characters).');
      return;
    }

    moderateHostApplication(adminTargetApp.id, adminDecisionType, adminReason.trim(), adminChecklist);
    setAdminTargetApp(null);
    setAdminReason('');
    refreshAllData();
  };

  // Report submission
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportingStay) return;
    reportStayListing(reportingStay.id, reportingStay.name, reportReason, reportNotes);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportingStay(null);
      refreshAllData();
    }, 1500);
  };

  return (
    <div className="roots-stay-hub">
      {/* 1. Header Banner */}
      <section className="stay-hero-banner">
        <div className="container">
          <div className="stay-hero-content">
            <div className="stay-badge-row">
              <span className="section-tag">
                <Home size={14} />
                ROOTS Stay
              </span>
              <span className="sample-badge">Community Homestay Network</span>
              <span className="stay-prototype-flag">Demonstration Prototype</span>
            </div>

            <h1 className="stay-hero-title">Stay in Living Homes, Not Impersonal Rooms</h1>
            <p className="stay-hero-subtitle">
              Ancestral homestays where hosts share oral folklore, farm-fresh recipes on banana leaves,
              and reinvest directly into village conservation.
            </p>

            {/* Prototype Transparency Notice */}
            <div className="stay-transparency-card">
              <div className="transparency-icon">
                <Shield size={20} color="#3478F6" />
              </div>
              <div className="transparency-text">
                <strong>Transparent Prototype Disclosures:</strong>
                <p>
                  Listings below are manually curated sample records with verified demonstration badges. 
                  Host registration starts as <em>Pending Verification</em> until village and safety audit checks pass.
                  Exact home addresses are protected and never publicly exposed.
                </p>
              </div>
            </div>

            {/* Hub Navigation Tabs */}
            <div className="stay-nav-tabs">
              <button
                type="button"
                className={`stay-tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
                onClick={() => setActiveTab('discover')}
              >
                <Search size={16} />
                <span>Discover Stays ({filteredStays.length})</span>
              </button>

              <button
                type="button"
                className={`stay-tab-btn ${activeTab === 'host' ? 'active' : ''}`}
                onClick={() => setActiveTab('host')}
              >
                <Plus size={16} />
                <span>Become a Host</span>
              </button>

              <button
                type="button"
                className={`stay-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar size={16} />
                <span>My Bookings & Requests ({bookings.length})</span>
              </button>

              <button
                type="button"
                className={`stay-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <Award size={16} />
                <span>Admin Verification (Demo)</span>
                {applications.length > 0 && (
                  <span className="stay-tab-counter">{applications.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TAB 1: DISCOVER STAYS */}
      {activeTab === 'discover' && (
        <section className="stay-discovery-section container">
          {/* Search & Filter Toolbar */}
          <div className="stay-filter-card card-white">
            <div className="stay-search-primary-row">
              <div className="search-input-group flex-1">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search village, property name, host, or cultural activity (e.g., clay pot, bamboo)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="stay-text-input"
                />
                {searchQuery && (
                  <button type="button" className="clear-btn" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Destination Filter */}
              <div className="filter-select-group">
                <MapPin size={16} />
                <select
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="stay-select"
                >
                  <option value="all">All Destinations</option>
                  <option value="varkala">Varkala & Periyar (Kerala)</option>
                  <option value="meghalaya">Nongriat & Cherrapunji (Meghalaya)</option>
                  <option value="spiti">Spiti Valley (Himachal)</option>
                  <option value="coorg">Coorg Highlands (Karnataka)</option>
                  <option value="hampi">Hampi & Anegundi (Karnataka)</option>
                  <option value="wayanad">Wayanad (Kerala)</option>
                </select>
              </div>

              {/* Guests Count */}
              <div className="filter-select-group">
                <Users size={16} />
                <select
                  value={guestsFilter}
                  onChange={(e) => setGuestsFilter(Number(e.target.value))}
                  className="stay-select"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4+ Guests</option>
                </select>
              </div>
            </div>

            {/* Secondary Filter Chips Row */}
            <div className="stay-secondary-filters-row">
              <div className="filter-chips-list">
                <button
                  type="button"
                  className={`chip-filter-btn ${filterBreakfastOnly ? 'active' : ''}`}
                  onClick={() => setFilterBreakfastOnly(!filterBreakfastOnly)}
                >
                  <Coffee size={14} />
                  Breakfast Included
                </button>

                <button
                  type="button"
                  className={`chip-filter-btn ${filterWifiOnly ? 'active' : ''}`}
                  onClick={() => setFilterWifiOnly(!filterWifiOnly)}
                >
                  <Wifi size={14} />
                  Wi-Fi Available
                </button>

                <button
                  type="button"
                  className={`chip-filter-btn ${filterCulturalActivities ? 'active' : ''}`}
                  onClick={() => setFilterCulturalActivities(!filterCulturalActivities)}
                >
                  <Utensils size={14} />
                  Cultural Workshops
                </button>

                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="chip-select-btn"
                >
                  <option value="all">All Property Styles</option>
                  <option value="Ancestral Courtyard">Ancestral Courtyard</option>
                  <option value="Bamboo Stilt Home">Bamboo Stilt Home</option>
                  <option value="Heritage Farm Cottage">Heritage Farm Cottage</option>
                  <option value="Mudbrick Mountain Retreat">Mudbrick Mountain Retreat</option>
                  <option value="Village Homestay">Village Homestay</option>
                </select>
              </div>

              {/* Price Slider */}
              <div className="price-slider-group">
                <span className="price-slider-label">
                  Max: <strong>₹{maxPriceFilter.toLocaleString('en-IN')}</strong>/night
                </span>
                <input
                  type="range"
                  min="1000"
                  max="4500"
                  step="250"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="stay-price-slider"
                />
              </div>
            </div>
          </div>

          {/* Stays Grid */}
          <div className="stay-results-header">
            <h3>Available Community Stays ({filteredStays.length})</h3>
            <span className="results-subtext">
              Showing approved authentic village stays. All coordinates approximate for community safety.
            </span>
          </div>

          {filteredStays.length === 0 ? (
            <div className="stay-empty-state card-white">
              <AlertCircle size={40} color="#3478F6" />
              <h4>No Community Stays Match Your Filters</h4>
              <p>Try broadening your price range, choosing another destination, or clearing active filters.</p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setDestinationFilter('all');
                  setMaxPriceFilter(4500);
                  setFilterBreakfastOnly(false);
                  setFilterWifiOnly(false);
                  setFilterCulturalActivities(false);
                  setPropertyTypeFilter('all');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="stay-cards-grid">
              {filteredStays.map((stay) => {
                const isBookmarked = bookmarkedIds.includes(stay.id);

                return (
                  <article key={stay.id} className="stay-card card-white">
                    {/* Card Photo Header */}
                    <div className="stay-card-image-wrap">
                      <img
                        src={stay.photos[0]}
                        alt={stay.name}
                        className="stay-card-img"
                        loading="lazy"
                      />
                      <div className="stay-card-badges-floating">
                        <span className="stay-verification-badge">
                          <Check size={12} />
                          {stay.verification?.verificationBadge || 'Community Verified'}
                        </span>
                        <span className="stay-sample-pill">Demo</span>
                      </div>

                      <button
                        type="button"
                        className={`stay-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                        onClick={() => toggleBookmark(stay.id)}
                        aria-label="Bookmark homestay"
                        title={isBookmarked ? 'Saved in prototype' : 'Bookmark stay'}
                      >
                        <Bookmark
                          size={16}
                          fill={isBookmarked ? '#3478F6' : 'none'}
                          color={isBookmarked ? '#3478F6' : '#FFFFFF'}
                        />
                      </button>
                    </div>

                    {/* Card Content Body */}
                    <div className="stay-card-body">
                      {/* Host Snippet */}
                      <div className="stay-host-snippet">
                        <img
                          src={stay.host?.avatar}
                          alt={stay.host?.name}
                          className="stay-host-mini-avatar"
                        />
                        <div className="stay-host-mini-info">
                          <span className="stay-host-by">Hosted by</span>
                          <span className="stay-host-name-txt">{stay.host?.name}</span>
                        </div>
                        <span className="stay-prop-type-pill">{stay.propertyType}</span>
                      </div>

                      <h3 className="stay-card-title">{stay.name}</h3>

                      <div className="stay-location-row">
                        <MapPin size={14} className="icon-blue" />
                        <span>{stay.generalLocation}</span>
                      </div>

                      <div className="stay-capacity-row">
                        <span><Bed size={13} /> {stay.rooms} Rooms ({stay.beds} Beds)</span>
                        <span>•</span>
                        <span><Users size={13} /> Up to {stay.maxGuests} Guests</span>
                        <span>•</span>
                        <span><Bath size={13} /> {stay.bathroomPrivacy}</span>
                      </div>

                      {/* Cultural Activities Preview */}
                      {stay.culturalActivities && stay.culturalActivities.length > 0 && (
                        <div className="stay-activities-snippet">
                          <Sparkles size={13} color="#1746A2" />
                          <span>{stay.culturalActivities.slice(0, 2).join(' • ')}</span>
                        </div>
                      )}

                      {/* Amenities Chips */}
                      <div className="stay-amenities-chips">
                        {stay.amenities?.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="amenity-chip">{amenity}</span>
                        ))}
                        {stay.mealOptions?.breakfastIncluded && (
                          <span className="amenity-chip highlight">Breakfast Included</span>
                        )}
                      </div>

                      {/* Pricing and Action Buttons */}
                      <div className="stay-card-footer">
                        <div className="stay-price-group">
                          <span className="stay-price-amount">
                            ₹{stay.nightlyRateINR.toLocaleString('en-IN')}
                          </span>
                          <span className="stay-price-unit">/ night</span>
                        </div>

                        <div className="stay-actions-group">
                          <button
                            type="button"
                            className="btn-stay-details"
                            onClick={() => setDetailStay(stay)}
                          >
                            <Eye size={14} />
                            Details
                          </button>
                          <button
                            type="button"
                            className="btn-stay-request"
                            onClick={() => handleOpenBooking(stay)}
                          >
                            Request Stay
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 3. TAB 2: BECOME A HOST FORM */}
      {activeTab === 'host' && (
        <section className="stay-host-section container">
          <div className="host-onboard-card card-white">
            <div className="host-onboard-header">
              <div className="badge-row">
                <span className="section-tag">
                  <Plus size={14} />
                  Host Registration
                </span>
                <span className="sample-badge">Village Immersion Program</span>
              </div>
              <h2>Open Your Ancestral Home to Slow Travelers</h2>
              <p>
                ROOTS connects conscious travelers with community homestays. Share traditional meals,
                oral folklore, and indigenous crafts while earning sustainable direct livelihood.
              </p>
            </div>

            {hostSubmitSuccess ? (
              <div className="host-success-screen">
                <CheckCircle2 size={56} color="#10B981" />
                <h3>Application Submitted for Review!</h3>
                <p className="app-ref-text">Application Reference ID: <strong>{hostSubmitSuccess.id}</strong></p>
                <div className="verification-reminder-box">
                  <Shield size={20} color="#3478F6" />
                  <div>
                    <strong>Verification Notice:</strong>
                    <p>
                      Your listing is stored with status <strong>Pending Verification</strong>.
                      As part of our community safety charter, a local village coordinator or Dorbar Shnong elder
                      will review your identity documents and safety checklist before the listing is activated in public discovery.
                    </p>
                  </div>
                </div>

                <div className="host-success-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setHostSubmitSuccess(null);
                      setActiveTab('admin');
                    }}
                  >
                    View in Admin Verification Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setHostSubmitSuccess(null);
                      setActiveTab('discover');
                    }}
                  >
                    Back to Stays Discovery
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleHostFormSubmit} className="host-registration-form">
                {hostSubmitError && (
                  <div className="form-error-alert">
                    <AlertCircle size={16} />
                    <span>{hostSubmitError}</span>
                  </div>
                )}

                {/* Section 1: Host Profile */}
                <div className="form-section-block">
                  <h3 className="section-block-title">
                    <span className="step-num">1</span> Host Profile & Eligibility
                  </h3>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Kunjamma Nair"
                        value={hostForm.hostFullName}
                        onChange={(e) => setHostForm({ ...hostForm, hostFullName: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Languages Spoken (comma separated) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Malayalam, English, Hindi"
                        value={hostForm.languages}
                        onChange={(e) => setHostForm({ ...hostForm, languages: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Short Host Introduction & Ancestral Story</label>
                    <textarea
                      rows="3"
                      placeholder="Share a few sentences about your family, your relationship to the land, and what guests will experience..."
                      value={hostForm.hostIntro}
                      onChange={(e) => setHostForm({ ...hostForm, hostIntro: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="eligibility-checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hostForm.age18Plus}
                        onChange={(e) => setHostForm({ ...hostForm, age18Plus: e.target.checked })}
                      />
                      <span>I confirm that I am at least 18 years of age and legally eligible to host guests. *</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hostForm.hostLivesOnProperty}
                        onChange={(e) => setHostForm({ ...hostForm, hostLivesOnProperty: e.target.checked })}
                      />
                      <span>I (or my family) reside on this property to welcome guests in person.</span>
                    </label>
                  </div>
                </div>

                {/* Section 2: Property Details */}
                <div className="form-section-block">
                  <h3 className="section-block-title">
                    <span className="step-num">2</span> Property & Accommodation Details
                  </h3>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Homestay Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Ka Mei's Cardamom Foothill Cottage"
                        value={hostForm.propertyName}
                        onChange={(e) => setHostForm({ ...hostForm, propertyName: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Destination Hub *</label>
                      <select
                        value={hostForm.destinationId}
                        onChange={(e) => setHostForm({ ...hostForm, destinationId: e.target.value })}
                        className="form-control"
                      >
                        <option value="varkala">Varkala & Coastal Kerala</option>
                        <option value="meghalaya">Nongriat & Cherrapunji (Meghalaya)</option>
                        <option value="spiti">Spiti Valley (Himachal)</option>
                        <option value="coorg">Coorg Highlands (Karnataka)</option>
                        <option value="hampi">Hampi & Anegundi (Karnataka)</option>
                        <option value="wayanad">Wayanad Rainforest (Kerala)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>General Location (Village / Landmark / District) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Kakkabe Foothills, Kodagu, Karnataka (Do not enter exact house number)"
                      value={hostForm.generalLocation}
                      onChange={(e) => setHostForm({ ...hostForm, generalLocation: e.target.value })}
                      className="form-control"
                    />
                    <small className="field-hint">
                      Safety Notice: Exact house numbers and private directions are only disclosed after host accepts a confirmed booking.
                    </small>
                  </div>

                  <div className="form-row-4">
                    <div className="form-group">
                      <label>Property Style</label>
                      <select
                        value={hostForm.propertyType}
                        onChange={(e) => setHostForm({ ...hostForm, propertyType: e.target.value })}
                        className="form-control"
                      >
                        <option value="Ancestral Courtyard">Ancestral Courtyard</option>
                        <option value="Bamboo Stilt Home">Bamboo Stilt Home</option>
                        <option value="Heritage Farm Cottage">Heritage Farm Cottage</option>
                        <option value="Mudbrick Mountain Retreat">Mudbrick Mountain Retreat</option>
                        <option value="Village Homestay">Village Homestay</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Rooms</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={hostForm.rooms}
                        onChange={(e) => setHostForm({ ...hostForm, rooms: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Beds</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={hostForm.beds}
                        onChange={(e) => setHostForm({ ...hostForm, beds: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Max Guests</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={hostForm.maxGuests}
                        onChange={(e) => setHostForm({ ...hostForm, maxGuests: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Bathroom & Privacy Arrangements</label>
                    <select
                      value={hostForm.bathroomPrivacy}
                      onChange={(e) => setHostForm({ ...hostForm, bathroomPrivacy: e.target.value })}
                      className="form-control"
                    >
                      <option value="Private Ensuite Washroom">Private Ensuite Washroom</option>
                      <option value="Shared Family Washroom">Shared Family Washroom</option>
                      <option value="Detached Washroom (Covered Walkway)">Detached Washroom (Covered Walkway)</option>
                      <option value="Dry Composting Spitian Washroom">Dry Composting Spitian Washroom</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Accessibility & Physical Access Notes</label>
                    <input
                      type="text"
                      placeholder="e.g., Ground floor entrance with 2 stone veranda steps. Narrow doorways."
                      value={hostForm.accessibility}
                      onChange={(e) => setHostForm({ ...hostForm, accessibility: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Section 3: Local Experiences & Meals */}
                <div className="form-section-block">
                  <h3 className="section-block-title">
                    <span className="step-num">3</span> Local Experiences & Homecooked Meals
                  </h3>

                  <div className="form-group">
                    <label>Cultural Workshops & Walks You Can Offer (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., Clay pot fish cooking, Bamboo basketry lesson, Dawn birdwatching canoe"
                      value={hostForm.culturalActivities}
                      onChange={(e) => setHostForm({ ...hostForm, culturalActivities: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="checkbox-label mb-2">
                        <input
                          type="checkbox"
                          checked={hostForm.breakfastIncluded}
                          onChange={(e) => setHostForm({ ...hostForm, breakfastIncluded: e.target.checked })}
                        />
                        <span>Traditional Homemade Breakfast Included in Nightly Rate</span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label mb-2">
                        <input
                          type="checkbox"
                          checked={hostForm.dinnerAvailable}
                          onChange={(e) => setHostForm({ ...hostForm, dinnerAvailable: e.target.checked })}
                        />
                        <span>Traditional Dinner Available upon Request</span>
                      </label>
                      {hostForm.dinnerAvailable && (
                        <div className="mt-2">
                          <label>Dinner Cost per Person (INR)</label>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={hostForm.dinnerCostINR}
                            onChange={(e) => setHostForm({ ...hostForm, dinnerCostINR: e.target.value })}
                            className="form-control"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Meals Specialty & Description</label>
                    <input
                      type="text"
                      placeholder="e.g., Steamed appams, wild pepper rasam, organic vegetable thali on banana leaves."
                      value={hostForm.mealsDescription}
                      onChange={(e) => setHostForm({ ...hostForm, mealsDescription: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Section 4: Pricing & Rules */}
                <div className="form-section-block">
                  <h3 className="section-block-title">
                    <span className="step-num">4</span> Nightly Rate & House Rules
                  </h3>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Nightly Rate (INR) *</label>
                      <input
                        type="number"
                        required
                        min="500"
                        max="20000"
                        step="100"
                        value={hostForm.nightlyRateINR}
                        onChange={(e) => setHostForm({ ...hostForm, nightlyRateINR: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Cleaning / Community Fund Fee (INR)</label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="50"
                        value={hostForm.cleaningFeeINR}
                        onChange={(e) => setHostForm({ ...hostForm, cleaningFeeINR: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Cancellation Policy</label>
                      <select
                        value={hostForm.cancellationPolicy}
                        onChange={(e) => setHostForm({ ...hostForm, cancellationPolicy: e.target.value })}
                        className="form-control"
                      >
                        <option value="Flexible: Free cancellation up to 48 hours before check-in.">Flexible (Up to 48h)</option>
                        <option value="Moderate: Free cancellation up to 5 days before check-in.">Moderate (Up to 5 days)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Guest House Rules (one per line)</label>
                    <textarea
                      rows="3"
                      value={hostForm.houseRules}
                      onChange={(e) => setHostForm({ ...hostForm, houseRules: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Section 5: Verification & Safety Compliance Declarations */}
                <div className="form-section-block verification-sub-box">
                  <h3 className="section-block-title">
                    <span className="step-num">5</span> Verification & Safety Compliance Declarations
                  </h3>
                  <p className="sub-box-desc">
                    To maintain traveller trust and community safety, please disclose your compliance statuses.
                    Sensitive documentation numbers are stored confidentially and are never shared publicly.
                  </p>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Government Identity Proof</label>
                      <input
                        type="text"
                        value={hostForm.govIdType}
                        onChange={(e) => setHostForm({ ...hostForm, govIdType: e.target.value })}
                        className="form-control"
                      />
                      <small className="field-hint">Masked reference (e.g. Aadhaar / Voter ID / Passport)</small>
                    </div>

                    <div className="form-group">
                      <label>Permission or Ownership Reference</label>
                      <input
                        type="text"
                        value={hostForm.ownershipDocType}
                        onChange={(e) => setHostForm({ ...hostForm, ownershipDocType: e.target.value })}
                        className="form-control"
                      />
                      <small className="field-hint">Village Panchayat letter or property tax document</small>
                    </div>
                  </div>

                  <div className="safety-declarations-list">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hostForm.hasFirstAidKit}
                        onChange={(e) => setHostForm({ ...hostForm, hasFirstAidKit: e.target.checked })}
                      />
                      <span>Basic first aid kit is maintained on premises with clean bandages and antiseptic.</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hostForm.hasFireExtinguisher}
                        onChange={(e) => setHostForm({ ...hostForm, hasFireExtinguisher: e.target.checked })}
                      />
                      <span>Fire safety precaution (fire extinguisher or sand bucket) is accessible in cooking area.</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hostForm.potableWaterCertified}
                        onChange={(e) => setHostForm({ ...hostForm, potableWaterCertified: e.target.checked })}
                      />
                      <span>Purified, boiled, or tested drinking water is provided to guests in clean copper or glass jugs.</span>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="form-submit-row">
                  <button type="submit" className="btn-primary btn-large">
                    Submit Host Application for Review
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab('discover')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}

      {/* 4. TAB 3: MY BOOKINGS & HOST REQUESTS */}
      {activeTab === 'bookings' && (
        <section className="stay-bookings-section container">
          <div className="bookings-header-card card-white">
            <div className="badge-row">
              <span className="section-tag">
                <Calendar size={14} />
                Stay Requests & Reservations
              </span>
              <span className="sample-badge">Interactive Guest & Host Workflow</span>
            </div>
            <h2>Track Your Stay Inquiries and Host Approvals</h2>
            <p>
              ROOTS respects host autonomy. Bookings are only finalized when the host reviews the guest message
              and accepts the reservation. No automated payments or instant lock-ins.
            </p>
          </div>

          <div className="bookings-list">
            {bookings.length === 0 ? (
              <div className="stay-empty-state card-white">
                <Calendar size={36} color="#3478F6" />
                <h4>No Active Stay Requests</h4>
                <p>Browse our curated community stays and submit a stay request to experience local immersion.</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveTab('discover')}
                >
                  Browse Stays
                </button>
              </div>
            ) : (
              bookings.map((booking) => {
                const isPending = booking.status === 'pending_host_approval';
                const isConfirmed = booking.status === 'confirmed';
                const isDeclined = booking.status === 'declined';
                const isCancelled = booking.status === 'cancelled';

                return (
                  <div key={booking.id} className="booking-card card-white">
                    <div className="booking-card-top">
                      <div>
                        <span className="booking-ref">Ref: {booking.id}</span>
                        <h3 className="booking-stay-title">{booking.stayTitle}</h3>
                        <div className="booking-host-row">
                          <Users size={14} />
                          <span>Host: <strong>{booking.hostName}</strong></span>
                          <span>•</span>
                          <span>Guest: <strong>{booking.guestName}</strong></span>
                        </div>
                      </div>

                      <div className="booking-status-badge-wrap">
                        {isPending && <span className="status-pill status-pending">Pending Host Approval</span>}
                        {isConfirmed && <span className="status-pill status-approved">Confirmed</span>}
                        {isDeclined && <span className="status-pill status-rejected">Declined</span>}
                        {isCancelled && <span className="status-pill status-changes">Cancelled</span>}
                      </div>
                    </div>

                    <div className="booking-card-details-grid">
                      <div className="detail-col">
                        <span className="detail-label">Check-in</span>
                        <span className="detail-val">{booking.checkInDate}</span>
                      </div>
                      <div className="detail-col">
                        <span className="detail-label">Check-out</span>
                        <span className="detail-val">{booking.checkOutDate}</span>
                      </div>
                      <div className="detail-col">
                        <span className="detail-label">Duration & Guests</span>
                        <span className="detail-val">{booking.nights} Nights • {booking.guestsCount} Guests</span>
                      </div>
                      <div className="detail-col">
                        <span className="detail-label">Total Calculated Price</span>
                        <span className="detail-val price-highlight">₹{booking.totalPriceINR.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {booking.guestMessage && (
                      <div className="booking-message-box">
                        <strong>Guest Message:</strong>
                        <p>"{booking.guestMessage}"</p>
                      </div>
                    )}

                    {/* Interactive Workflow Buttons */}
                    <div className="booking-actions-row">
                      {isPending && (
                        <>
                          <div className="host-demo-actions">
                            <span className="demo-action-note">Simulate Host Actions:</span>
                            <button
                              type="button"
                              className="btn-action-accept"
                              onClick={() => {
                                updateBookingStatus(booking.id, 'confirmed', 'Host accepted request.');
                                refreshAllData();
                              }}
                            >
                              <CheckCircle2 size={14} />
                              Accept Request (Confirm)
                            </button>
                            <button
                              type="button"
                              className="btn-action-decline"
                              onClick={() => {
                                updateBookingStatus(booking.id, 'declined', 'Host unable to accommodate these dates.');
                                refreshAllData();
                              }}
                            >
                              <XCircle size={14} />
                              Decline
                            </button>
                          </div>

                          <button
                            type="button"
                            className="btn-action-cancel"
                            onClick={() => {
                              updateBookingStatus(booking.id, 'cancelled', 'Guest cancelled inquiry.');
                              refreshAllData();
                            }}
                          >
                            Cancel My Request
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <div className="confirmed-booking-notice">
                          <CheckCircle2 size={16} color="#10B981" />
                          <span>
                            Reservation Confirmed! The host will contact {booking.guestContact} with arrival directions and family dinner preparation times.
                          </span>
                        </div>
                      )}

                      {isDeclined && (
                        <div className="declined-booking-notice">
                          <XCircle size={16} color="#EF4444" />
                          <span>Request was declined by host due to availability. You can explore other village stays.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* 5. TAB 4: ADMIN VERIFICATION DASHBOARD (DEMO) */}
      {activeTab === 'admin' && (
        <section className="stay-admin-section container">
          <div className="admin-header-card card-white">
            <div className="admin-demo-alert">
              <Shield size={20} color="#3478F6" />
              <div>
                <strong>Community Administrator Verification Console (Demo Prototype)</strong>
                <p>
                  This protected interface simulates the village elder and community verification coordinator workflow.
                  Pending host applications must pass identity, permission, and safety review before becoming visible in
                  public discovery and the <strong>ROOTS Planner</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Pending Applications Queue */}
          <div className="admin-section-block card-white">
            <div className="admin-block-header">
              <h3>Pending Host Applications Queue ({applications.length})</h3>
              <span className="results-subtext">
                Review host identity, Dorbar Shnong / Panchayat certificates, and safety checks.
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="admin-empty-queue">
                <CheckCircle2 size={36} color="#10B981" />
                <p>All host applications have been reviewed. No pending verification requests in queue.</p>
              </div>
            ) : (
              <div className="admin-apps-list">
                {applications.map((app) => (
                  <div key={app.id} className="admin-app-card">
                    <div className="admin-app-top">
                      <div>
                        <span className="app-id-pill">ID: {app.id}</span>
                        <h4 className="admin-app-name">{app.name}</h4>
                        <div className="admin-app-meta">
                          <MapPin size={13} />
                          <span>{app.generalLocation}</span>
                          <span>•</span>
                          <Users size={13} />
                          <span>Applicant: <strong>{app.host?.name}</strong></span>
                        </div>
                      </div>

                      <div className="admin-app-status-wrap">
                        <span className="status-pill status-pending">
                          {app.verification?.verificationBadge || 'Pending Verification'}
                        </span>
                      </div>
                    </div>

                    {/* Review Checklist */}
                    <div className="admin-checklist-box">
                      <strong>Verification Checklist:</strong>
                      <div className="checklist-items-grid">
                        <div className="checklist-item">
                          <CheckSquare size={14} color="#3478F6" />
                          <span>Gov ID Type: {app.verification?.govIdType || 'Aadhaar / Voter ID (Masked)'}</span>
                        </div>
                        <div className="checklist-item">
                          <CheckSquare size={14} color="#3478F6" />
                          <span>Permission Proof: {app.verification?.ownershipDocReference || 'Panchayat Receipt'}</span>
                        </div>
                        <div className="checklist-item">
                          <CheckSquare size={14} color="#3478F6" />
                          <span>Safety Audit: Fire extinguisher & First aid kit declared</span>
                        </div>
                        <div className="checklist-item">
                          <CheckSquare size={14} color="#3478F6" />
                          <span>Pricing: ₹{app.nightlyRateINR}/night • Max {app.maxGuests} guests</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="admin-actions-row">
                      <button
                        type="button"
                        className="btn-preview-app"
                        onClick={() => setDetailStay(app)}
                      >
                        <Eye size={14} />
                        Preview Full Property Details
                      </button>

                      <div className="admin-decision-buttons">
                        <button
                          type="button"
                          className="btn-admin-approve"
                          onClick={() => handleAdminDecision(app.id, 'approve')}
                        >
                          <CheckCircle2 size={14} />
                          Approve & Publish
                        </button>

                        <button
                          type="button"
                          className="btn-admin-request"
                          onClick={() => handleAdminDecision(app.id, 'request_info')}
                        >
                          <Clock size={14} />
                          Request More Information
                        </button>

                        <button
                          type="button"
                          className="btn-admin-reject"
                          onClick={() => handleAdminDecision(app.id, 'reject')}
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reported Stays Queue */}
          <div className="admin-section-block card-white mt-4">
            <div className="admin-block-header">
              <h3>Community Content Reports on Stays ({reports.filter(r => r.status === 'active').length})</h3>
              <span className="results-subtext">
                Manage reports on misleading locations, safety hazards, or policy violations.
              </span>
            </div>

            {reports.filter(r => r.status === 'active').length === 0 ? (
              <div className="admin-empty-queue">
                <CheckCircle2 size={30} color="#10B981" />
                <p>No active stay reports requiring administrative action.</p>
              </div>
            ) : (
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Stay Title</th>
                      <th>Reason</th>
                      <th>Reporter Notes</th>
                      <th>Timestamp</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.filter(r => r.status === 'active').map((rep) => (
                      <tr key={rep.id}>
                        <td><strong>{rep.stayTitle}</strong></td>
                        <td><span className="report-reason-pill">{rep.reason}</span></td>
                        <td>{rep.notes || 'No additional notes'}</td>
                        <td>{new Date(rep.timestamp).toLocaleDateString()}</td>
                        <td>
                          <div className="report-action-btns">
                            <button
                              type="button"
                              className="btn-table-hide"
                              onClick={() => {
                                moderateStayReport(rep.id, 'hide_listing');
                                refreshAllData();
                              }}
                            >
                              Suspend Listing
                            </button>
                            <button
                              type="button"
                              className="btn-table-dismiss"
                              onClick={() => {
                                moderateStayReport(rep.id, 'dismiss_report');
                                refreshAllData();
                              }}
                            >
                              Dismiss
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. MODAL: DETAILED LISTING PREVIEW */}
      {detailStay && (
        <div className="modal-overlay" onClick={() => setDetailStay(null)}>
          <div className="modal-content stay-detail-modal card-white" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="detail-modal-tag">{detailStay.propertyType}</span>
                <h2>{detailStay.name}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDetailStay(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="stay-detail-body">
              {/* Photo Carousel */}
              <div className="stay-gallery-grid">
                {detailStay.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`${detailStay.name} view ${i + 1}`}
                    className={`gallery-img ${i === 0 ? 'lead' : ''}`}
                  />
                ))}
              </div>

              {/* General Location & Status */}
              <div className="detail-meta-bar">
                <div className="meta-location-item">
                  <MapPin size={16} className="icon-blue" />
                  <span>{detailStay.generalLocation}</span>
                </div>
                <div className="meta-badge-item">
                  <span className="stay-verification-badge">
                    <Check size={12} />
                    {detailStay.verification?.verificationBadge || 'Community Reviewed'}
                  </span>
                </div>
              </div>

              {/* Host Profile Info */}
              <div className="detail-host-profile-box">
                <img
                  src={detailStay.host?.avatar}
                  alt={detailStay.host?.name}
                  className="host-large-avatar"
                />
                <div className="host-large-info">
                  <div className="host-name-row">
                    <h4>Hosted by {detailStay.host?.name}</h4>
                    {detailStay.host?.ageVerified && (
                      <span className="host-verified-pill">Age & ID Verified (Demo)</span>
                    )}
                  </div>
                  <p className="host-intro-text">{detailStay.host?.intro}</p>
                  <div className="host-languages-list">
                    <strong>Languages:</strong> {detailStay.host?.languages?.join(', ')}
                  </div>
                  {detailStay.hostLivesOnProperty && (
                    <span className="host-on-site-tag">
                      <Home size={12} /> Host resides on the property
                    </span>
                  )}
                </div>
              </div>

              {/* Property Specs */}
              <div className="detail-specs-grid">
                <div className="spec-card">
                  <Bed size={18} className="icon-blue" />
                  <div>
                    <span className="spec-label">Rooms & Beds</span>
                    <span className="spec-val">{detailStay.rooms} Rooms • {detailStay.beds} Beds</span>
                  </div>
                </div>

                <div className="spec-card">
                  <Users size={18} className="icon-blue" />
                  <div>
                    <span className="spec-label">Guest Capacity</span>
                    <span className="spec-val">Up to {detailStay.maxGuests} Guests</span>
                  </div>
                </div>

                <div className="spec-card">
                  <Bath size={18} className="icon-blue" />
                  <div>
                    <span className="spec-label">Bathroom</span>
                    <span className="spec-val">{detailStay.bathroomPrivacy}</span>
                  </div>
                </div>

                <div className="spec-card">
                  <Clock size={18} className="icon-blue" />
                  <div>
                    <span className="spec-label">Check-in / Check-out</span>
                    <span className="spec-val">{detailStay.checkInTime} / {detailStay.checkOutTime}</span>
                  </div>
                </div>
              </div>

              {/* Cultural Experiences & Meals */}
              <div className="detail-section-row">
                <div className="detail-sub-col">
                  <h4><Sparkles size={16} className="icon-blue" /> Local Cultural Experiences</h4>
                  <ul className="detail-bullet-list">
                    {detailStay.culturalActivities?.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-sub-col">
                  <h4><Coffee size={16} className="icon-blue" /> Homemade Meals</h4>
                  <p className="meal-desc-text">{detailStay.mealOptions?.description}</p>
                  <div className="meal-badges-group">
                    {detailStay.mealOptions?.breakfastIncluded && (
                      <span className="badge-meal">Breakfast: Included</span>
                    )}
                    {detailStay.mealOptions?.dinnerAvailable && (
                      <span className="badge-meal">
                        Dinner: ₹{detailStay.mealOptions?.dinnerCostPerPersonINR}/person
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* House Rules & Safety */}
              <div className="detail-section-row">
                <div className="detail-sub-col">
                  <h4><FileText size={16} className="icon-blue" /> House Rules</h4>
                  <ul className="detail-bullet-list">
                    {detailStay.houseRules?.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-sub-col">
                  <h4><Shield size={16} className="icon-blue" /> Safety & Accessibility</h4>
                  <ul className="detail-bullet-list">
                    {detailStay.safetyFeatures?.map((safe, i) => (
                      <li key={i}>{safe}</li>
                    ))}
                    {detailStay.accessibility && (
                      <li><strong>Accessibility:</strong> {detailStay.accessibility}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="cancellation-policy-box">
                <AlertCircle size={16} color="#3478F6" />
                <div>
                  <strong>Cancellation Policy:</strong>
                  <p>{detailStay.cancellationPolicy}</p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="privacy-disclosure-box">
                <Lock size={16} color="#64748B" />
                <span>
                  Privacy & Safety Charter: Exact house numbers and personal phone numbers are not disclosed on this page.
                  Directions are transmitted securely after the host accepts your stay request.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <div className="modal-price-display">
                <span className="price-bold">₹{detailStay.nightlyRateINR.toLocaleString('en-IN')}</span>
                <span className="price-unit">/ night</span>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-report-outline"
                  onClick={() => {
                    setReportingStay(detailStay);
                    setDetailStay(null);
                  }}
                >
                  <Flag size={14} /> Report Listing
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const current = detailStay;
                    setDetailStay(null);
                    handleOpenBooking(current);
                  }}
                >
                  Request Stay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: BOOKING REQUEST FORM */}
      {bookingStay && (
        <div className="modal-overlay" onClick={() => setBookingStay(null)}>
          <div className="modal-content stay-booking-modal card-white" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="detail-modal-tag">Stay Request</span>
                <h2>Request to Stay at {bookingStay.name}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setBookingStay(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="booking-success-box">
                <CheckCircle2 size={50} color="#10B981" />
                <h3>Stay Request Sent to {bookingStay.host?.name}!</h3>
                <p>
                  Request ID: <strong>{bookingSuccess.id}</strong>
                </p>
                <div className="booking-summary-recap">
                  <div>Dates: {bookingSuccess.checkInDate} to {bookingSuccess.checkOutDate} ({bookingSuccess.nights} Nights)</div>
                  <div>Guests: {bookingSuccess.guestsCount}</div>
                  <div>Total Price: ₹{bookingSuccess.totalPriceINR.toLocaleString('en-IN')}</div>
                </div>
                <p className="no-charge-reminder">
                  Notice: No payment was charged. The host will review your request and confirm availability.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setBookingSuccess(null);
                    setBookingStay(null);
                    setActiveTab('bookings');
                  }}
                >
                  View My Stay Requests
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="booking-request-form">
                {bookingError && (
                  <div className="form-error-alert">
                    <AlertCircle size={16} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.checkInDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Number of Guests *</label>
                    <select
                      value={bookingForm.guestsCount}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestsCount: Number(e.target.value) })}
                      className="form-control"
                    >
                      {Array.from({ length: bookingStay.maxGuests || 4 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {bookingStay.mealOptions?.dinnerAvailable && (
                    <div className="form-group pt-4">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={bookingForm.includeDinner}
                          onChange={(e) => setBookingForm({ ...bookingForm, includeDinner: e.target.checked })}
                        />
                        <span>Include Traditional Family Dinner (+₹{bookingStay.mealOptions.dinnerCostPerPersonINR}/person/night)</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Ananya Verma"
                      value={bookingForm.guestName}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Email or Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., ananya@example.com"
                      value={bookingForm.guestContact}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestContact: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message to Host {bookingStay.host?.name}</label>
                  <textarea
                    rows="2"
                    placeholder="Tell the host about your travel purpose, cultural interests, or any dietary requirements..."
                    value={bookingForm.guestMessage}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestMessage: e.target.value })}
                    className="form-control"
                  />
                </div>

                {/* Price Breakdown Calculation */}
                {(() => {
                  const checkIn = new Date(bookingForm.checkInDate);
                  const checkOut = new Date(bookingForm.checkOutDate);
                  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))) || 1;
                  const base = bookingStay.nightlyRateINR * nights;
                  const cleaning = bookingStay.cleaningOrCommunityFeeINR || 0;
                  const dinner = bookingForm.includeDinner && bookingStay.mealOptions?.dinnerCostPerPersonINR
                    ? bookingStay.mealOptions.dinnerCostPerPersonINR * bookingForm.guestsCount * nights
                    : 0;
                  const total = base + cleaning + dinner;

                  return (
                    <div className="price-calculation-card">
                      <h4 className="price-calc-title">Estimated Stay Total</h4>
                      <div className="calc-line">
                        <span>₹{bookingStay.nightlyRateINR} × {nights} Nights</span>
                        <span>₹{base.toLocaleString('en-IN')}</span>
                      </div>
                      {cleaning > 0 && (
                        <div className="calc-line">
                          <span>Village Community & Cleaning Fund</span>
                          <span>₹{cleaning.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {dinner > 0 && (
                        <div className="calc-line">
                          <span>Traditional Dinner ({bookingForm.guestsCount} guests × {nights} nights)</span>
                          <span>₹{dinner.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="calc-total-line">
                        <strong>Total Estimated (Pay upon host acceptance)</strong>
                        <strong>₹{total.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  );
                })()}

                <div className="modal-actions-row">
                  <button type="submit" className="btn-primary flex-1">
                    Send Stay Request
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setBookingStay(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. MODAL: REPORT LISTING */}
      {reportingStay && (
        <div className="modal-overlay" onClick={() => setReportingStay(null)}>
          <div className="modal-content modal-small card-white" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Content or Safety Concern</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setReportingStay(null)}
              >
                <X size={18} />
              </button>
            </div>

            {reportSuccess ? (
              <div className="report-success-msg">
                <CheckCircle2 size={36} color="#10B981" />
                <p>Report submitted to ROOTS safety moderators for review.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <p className="report-target-label">Listing: <strong>{reportingStay.name}</strong></p>
                <div className="form-group">
                  <label>Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="form-control"
                  >
                    <option value="Inaccurate listing information">Inaccurate listing information</option>
                    <option value="Safety or hygiene concern">Safety or hygiene concern</option>
                    <option value="Misleading location description">Misleading location description</option>
                    <option value="Disrespectful or unauthorized content">Disrespectful or unauthorized content</option>
                    <option value="Other concern">Other concern</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Details / Specific Observation</label>
                  <textarea
                    rows="3"
                    placeholder="Provide details to assist community review..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="submit" className="btn-danger flex-1">
                    Submit Report
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setReportingStay(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. MODAL: ADMIN REASON MODAL (Reject or Request Info) */}
      {adminTargetApp && (
        <div className="modal-overlay" onClick={() => setAdminTargetApp(null)}>
          <div className="modal-content modal-small card-white" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {adminDecisionType === 'reject' ? 'Reject Host Application' : 'Request Additional Information'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setAdminTargetApp(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-reason-body">
              <p>
                Property: <strong>{adminTargetApp.name}</strong> (Applicant: {adminTargetApp.host?.name})
              </p>

              <div className="form-group">
                <label>
                  {adminDecisionType === 'reject' ? 'Reason for Rejection *' : 'Specific Information Needed *'}
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder={
                    adminDecisionType === 'reject'
                      ? 'Explain why this listing does not meet community safety guidelines...'
                      : 'Specify what documents or clarifications the host must submit...'
                  }
                  value={adminReason}
                  onChange={(e) => setAdminReason(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className={adminDecisionType === 'reject' ? 'btn-danger flex-1' : 'btn-primary flex-1'}
                  onClick={handleConfirmAdminDecision}
                >
                  Confirm Decision
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAdminTargetApp(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
