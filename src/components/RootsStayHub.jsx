import React, { useState, useMemo } from 'react';
import {
  Home, MapPin, Shield, Check, Calendar, ArrowRight, X, Bookmark, Sparkles,
  Send, Users, AlertCircle, Eye, CheckCircle2, XCircle, Clock, Info, Search,
  Filter, Coffee, Wifi, Mountain, Utensils, Activity, Flag, ChevronRight,
  Lock, Bed, Bath, Plus, RefreshCw, FileText, CheckSquare, Phone, Mail, Award,
  Image, Camera, ChevronLeft, Trash2, Heart, Upload, User
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
import { useAuth } from '../context/AuthContext';

export function RootsStayHub({ onBackToHome, onOpenPlanner }) {
  const { requireAuth } = useAuth();
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
  const [hostStep, setHostStep] = useState(1); // Steps 1 to 4
  const [hostSubmitting, setHostSubmitting] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [stepErrors, setStepErrors] = useState({});
  const [languageSearch, setLanguageSearch] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [hostForm, setHostForm] = useState({
    hostFullName: '',
    age18Plus: false,
    contactVerified: false,
    languages: 'English, Malayalam',
    hostIntro: '',
    propertyName: '',
    destinationId: 'varkala',
    generalLocation: '',
    propertyType: 'Village Homestay',
    hostLivesOnProperty: false,
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

  // Language options pool for Step 1
  const AVAILABLE_LANGUAGES = [
    'English', 'Malayalam', 'Hindi', 'Tamil', 'Kannada', 'Bengali',
    'Khasi', 'Marathi', 'Telugu', 'Gujarati', 'French', 'Spanish', 'German'
  ];

  // Helper to handle avatar file upload
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: image/jpeg, image/png, image/webp
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size: max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError('Image size exceeds 5MB limit. Please upload a smaller photo.');
      return;
    }

    setAvatarError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setHostForm(prev => ({ ...prev, hostAvatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Helper to toggle a language chip
  const handleToggleLanguage = (langName) => {
    const currentList = hostForm.languages
      ? hostForm.languages.split(',').map(l => l.trim()).filter(Boolean)
      : [];
    const exists = currentList.some(l => l.toLowerCase() === langName.toLowerCase());

    let updatedList;
    if (exists) {
      updatedList = currentList.filter(l => l.toLowerCase() !== langName.toLowerCase());
    } else {
      updatedList = [...currentList, langName];
    }

    const newLangStr = updatedList.join(', ');
    setHostForm(prev => ({ ...prev, languages: newLangStr }));
    if (stepErrors.languages && updatedList.length > 0) {
      setStepErrors(prev => ({ ...prev, languages: undefined }));
    }
  };

  // Helper to add custom language from search input
  const handleAddCustomLanguage = (e) => {
    if (e) e.preventDefault();
    const query = languageSearch.trim();
    if (!query) return;

    const currentList = hostForm.languages
      ? hostForm.languages.split(',').map(l => l.trim()).filter(Boolean)
      : [];
    const exists = currentList.some(l => l.toLowerCase() === query.toLowerCase());

    if (!exists) {
      const updatedList = [...currentList, query];
      setHostForm(prev => ({ ...prev, languages: updatedList.join(', ') }));
    }
    setLanguageSearch('');
    if (stepErrors.languages) {
      setStepErrors(prev => ({ ...prev, languages: undefined }));
    }
  };

  // Helper to insert intro prompt into host story
  const handleInsertIntroPrompt = (promptText) => {
    setHostForm(prev => {
      const existing = prev.hostIntro ? prev.hostIntro.trim() : '';
      const separator = existing ? (existing.endsWith('.') ? ' ' : '. ') : '';
      const updated = existing ? `${existing}${separator}${promptText}` : promptText;
      return { ...prev, hostIntro: updated.slice(0, 600) };
    });
  };

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
    const maxCap = stay.maxGuests || (stay.rooms ? stay.rooms * 2 : 4);
    setBookingForm(prev => ({
      guestName: prev?.guestName || '',
      guestContact: prev?.guestContact || '',
      checkInDate: checkInDate || prev?.checkInDate || '2026-11-15',
      checkOutDate: checkOutDate || prev?.checkOutDate || '2026-11-18',
      guestsCount: Math.min(Math.max(1, guestsFilter || prev?.guestsCount || 2), maxCap),
      includeDinner: stay.mealOptions?.dinnerAvailable !== false,
      guestMessage: prev?.guestMessage || ''
    }));
    setBookingError('');
    setBookingSuccess(null);
  };

  // Dynamic Pricing & Date Calculation for Booking Request Form
  const bookingPricing = useMemo(() => {
    if (!bookingStay) {
      return {
        nights: 0,
        isValidDates: false,
        baseTotal: 0,
        cleaningFee: 0,
        dinnerRate: 0,
        dinnerTotal: 0,
        estimatedTotal: 0,
        dateError: '',
        guests: 1,
        maxCapacity: 4
      };
    }

    const maxCapacity = bookingStay.maxGuests || (bookingStay.rooms ? bookingStay.rooms * 2 : 4);
    const { checkInDate: cIn, checkOutDate: cOut, guestsCount, includeDinner } = bookingForm;

    if (!cIn || !cOut) {
      return {
        nights: 0,
        isValidDates: false,
        baseTotal: 0,
        cleaningFee: bookingStay.cleaningOrCommunityFeeINR || 0,
        dinnerRate: bookingStay.mealOptions?.dinnerCostPerPersonINR || 0,
        dinnerTotal: 0,
        estimatedTotal: 0,
        dateError: 'Please select both check-in and check-out dates.',
        guests: Number(guestsCount) || 1,
        maxCapacity
      };
    }

    const checkIn = new Date(cIn);
    const checkOut = new Date(cOut);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return {
        nights: 0,
        isValidDates: false,
        baseTotal: 0,
        cleaningFee: 0,
        dinnerRate: 0,
        dinnerTotal: 0,
        estimatedTotal: 0,
        dateError: 'Invalid check-in or check-out date format.',
        guests: Number(guestsCount) || 1,
        maxCapacity
      };
    }

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return {
        nights: 0,
        isValidDates: false,
        baseTotal: 0,
        cleaningFee: 0,
        dinnerRate: 0,
        dinnerTotal: 0,
        estimatedTotal: 0,
        dateError: 'Check-out date must be after check-in date.',
        guests: Number(guestsCount) || 1,
        maxCapacity
      };
    }

    const guests = Math.max(1, Number(guestsCount) || 1);
    const baseTotal = bookingStay.nightlyRateINR * nights;
    const cleaningFee = bookingStay.cleaningOrCommunityFeeINR || 0;
    const dinnerRate = bookingStay.mealOptions?.dinnerCostPerPersonINR || 0;
    const dinnerTotal = (includeDinner && dinnerRate > 0) ? (dinnerRate * guests * nights) : 0;
    const estimatedTotal = baseTotal + cleaningFee + dinnerTotal;

    return {
      nights,
      isValidDates: true,
      baseTotal,
      cleaningFee,
      dinnerRate,
      dinnerTotal,
      estimatedTotal,
      dateError: '',
      guests,
      maxCapacity
    };
  }, [bookingStay, bookingForm.checkInDate, bookingForm.checkOutDate, bookingForm.guestsCount, bookingForm.includeDinner]);

  // Submit Booking Request
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingError('');

    if (!bookingStay) return;

    const maxCap = bookingStay.maxGuests || (bookingStay.rooms ? bookingStay.rooms * 2 : 4);

    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      setBookingError('Please select both check-in and check-out dates.');
      return;
    }

    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      setBookingError('Please select valid check-in and check-out dates.');
      return;
    }

    if (checkOut <= checkIn) {
      setBookingError('Check-out date must be after check-in date.');
      return;
    }

    const numGuests = Number(bookingForm.guestsCount) || 1;
    if (numGuests < 1) {
      setBookingError('At least 1 guest is required.');
      return;
    }

    if (numGuests > maxCap) {
      setBookingError(`Number of guests cannot exceed property capacity (${maxCap} guests max).`);
      return;
    }

    if (!bookingForm.guestName.trim()) {
      setBookingError('Please enter your full legal or preferred name.');
      return;
    }

    if (!bookingForm.guestContact.trim()) {
      setBookingError('Please provide an email or phone number for host confirmation.');
      return;
    }

    const executeBooking = () => {
      try {
        const newBooking = createStayBookingRequest({
          stayId: bookingStay.id,
          guestName: bookingForm.guestName.trim(),
          guestContact: bookingForm.guestContact.trim(),
          checkInDate: bookingForm.checkInDate,
          checkOutDate: bookingForm.checkOutDate,
          guestsCount: numGuests,
          includeDinner: Boolean(bookingForm.includeDinner),
          guestMessage: bookingForm.guestMessage.trim()
        });

        setBookingSuccess(newBooking);
        refreshAllData();
      } catch (err) {
        // Form fields are preserved in bookingForm state
        setBookingError(err.message || 'Error creating booking request.');
      }
    };

    requireAuth({
      actionName: 'Submit homestay booking',
      message: 'Create an account or sign in to confirm and manage your homestay reservation request.',
      onAuthenticated: () => executeBooking()
    });
  };

  // Validate fields for a given wizard step
  const validateHostStep = (stepNumber) => {
    const errs = {};
    if (stepNumber === 1) {
      if (!hostForm.hostFullName.trim()) {
        errs.hostFullName = 'Full legal or preferred name is required.';
      }
      if (!hostForm.languages || !hostForm.languages.trim()) {
        errs.languages = 'Please select or enter at least one language you speak.';
      }
      if (!hostForm.age18Plus) {
        errs.age18Plus = 'You must confirm age eligibility (18+ years) to register as a host.';
      }
    } else if (stepNumber === 2) {
      if (!hostForm.propertyName.trim()) {
        errs.propertyName = 'Please provide a warm, descriptive name for your homestay.';
      }
      if (!hostForm.generalLocation.trim()) {
        errs.generalLocation = 'General location (village, landmark, or district) is required.';
      }
      if (!hostForm.rooms || Number(hostForm.rooms) < 1) {
        errs.rooms = 'Please specify at least 1 guest bedroom.';
      }
      if (!hostForm.maxGuests || Number(hostForm.maxGuests) < 1) {
        errs.maxGuests = 'Please specify maximum guest capacity.';
      }
    } else if (stepNumber === 3) {
      if (!hostForm.nightlyRateINR || Number(hostForm.nightlyRateINR) <= 0) {
        errs.nightlyRateINR = 'Please enter a valid nightly rate in INR (minimum ₹500).';
      } else if (Number(hostForm.nightlyRateINR) < 500) {
        errs.nightlyRateINR = 'Minimum recommended nightly rate is ₹500 to support local hosting.';
      }
    } else if (stepNumber === 4) {
      if (!hostForm.photos || hostForm.photos.length === 0) {
        errs.photos = 'Please provide at least one photo showing your homestay or guest room.';
      }
    }
    return errs;
  };

  const handleNextHostStep = () => {
    const errs = validateHostStep(hostStep);
    setStepErrors(errs);
    if (Object.keys(errs).length > 0) {
      setHostSubmitError('Please address the highlighted fields before proceeding.');
      return;
    }
    setHostSubmitError('');
    setHostStep(prev => Math.min(4, prev + 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrevHostStep = () => {
    setHostSubmitError('');
    setStepErrors({});
    setHostStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Host Registration Final Submit
  const handleHostFormSubmit = (e) => {
    if (e) e.preventDefault();
    setHostSubmitError('');

    // Full validation across all steps
    const step1Err = validateHostStep(1);
    const step2Err = validateHostStep(2);
    const step3Err = validateHostStep(3);
    const step4Err = validateHostStep(4);
    const allErr = { ...step1Err, ...step2Err, ...step3Err, ...step4Err };

    if (Object.keys(allErr).length > 0) {
      setStepErrors(allErr);
      if (Object.keys(step1Err).length > 0) setHostStep(1);
      else if (Object.keys(step2Err).length > 0) setHostStep(2);
      else if (Object.keys(step3Err).length > 0) setHostStep(3);
      else setHostStep(4);
      setHostSubmitError('Please complete all required fields before final submission.');
      return;
    }

    const executeHostSubmit = () => {
      setHostSubmitting(true);
      try {
        const created = submitHostRegistration(hostForm);
        setHostSubmitSuccess(created);
        setHostSubmitting(false);
        setHostStep(1);
        refreshAllData();
        window.scrollTo({ top: 80, behavior: 'smooth' });
      } catch (err) {
        setHostSubmitting(false);
        setHostSubmitError(err.message || 'Submission error. Please verify your details.');
      }
    };

    requireAuth({
      actionName: 'Submit host application',
      message: 'Create an account or sign in to submit and track your official ROOTS Homestay host application.',
      onAuthenticated: () => executeHostSubmit()
    });
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
                  role="switch"
                  aria-checked={filterBreakfastOnly}
                  className={`chip-filter-btn ${filterBreakfastOnly ? 'active' : ''}`}
                  onClick={() => setFilterBreakfastOnly(prev => !prev)}
                >
                  <Coffee size={14} />
                  <span>Breakfast Included</span>
                  <span className={`filter-switch-indicator ${filterBreakfastOnly ? 'on' : 'off'}`} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={filterWifiOnly}
                  className={`chip-filter-btn ${filterWifiOnly ? 'active' : ''}`}
                  onClick={() => setFilterWifiOnly(prev => !prev)}
                >
                  <Wifi size={14} />
                  <span>Wi-Fi Available</span>
                  <span className={`filter-switch-indicator ${filterWifiOnly ? 'on' : 'off'}`} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={filterCulturalActivities}
                  className={`chip-filter-btn ${filterCulturalActivities ? 'active' : ''}`}
                  onClick={() => setFilterCulturalActivities(prev => !prev)}
                >
                  <Utensils size={14} />
                  <span>Cultural Workshops</span>
                  <span className={`filter-switch-indicator ${filterCulturalActivities ? 'on' : 'off'}`} aria-hidden="true" />
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
              <h2>Become a ROOTS Host</h2>
              <p>
                Open your home and share your regional culture, stories, and seasonal homecooked meals with
                curious, mindful travellers from across the world while earning direct sustainable livelihood.
              </p>
            </div>

            {hostSubmitSuccess ? (
              <div className="host-success-screen">
                <div className="success-icon-badge">
                  <CheckCircle2 size={54} color="#10B981" />
                </div>
                <h3>Application Submitted for Review!</h3>
                <p className="app-ref-text">
                  Application Reference ID: <strong>{hostSubmitSuccess.id}</strong>
                </p>

                <div className="verification-reminder-box">
                  <Shield size={22} color="#3478F6" className="flex-shrink-0" />
                  <div>
                    <strong>Safety & Trust Notice — Pending Review:</strong>
                    <p>
                      Your listing is safely stored with status <strong>Application Under Review</strong>.
                      To protect both hosts and guests, our community verification team and local village coordinators
                      review ownership declarations, safety checklists, and phone credentials before activating your listing
                      in public discovery. We never automatically mark applications as verified.
                    </p>
                  </div>
                </div>

                <div className="host-summary-review card-subtle text-left" style={{ maxWidth: '640px', width: '100%', margin: '0 auto 20px' }}>
                  <h4 style={{ color: 'var(--deep-blue)', marginBottom: '10px', fontSize: '1rem', fontWeight: '800' }}>
                    Submitted Application Snapshot
                  </h4>
                  <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.88rem' }}>
                    <div><strong>Homestay:</strong> {hostSubmitSuccess.name}</div>
                    <div><strong>Host:</strong> {hostSubmitSuccess.host?.name}</div>
                    <div><strong>General Area:</strong> {hostSubmitSuccess.generalLocation}</div>
                    <div><strong>Nightly Rate:</strong> ₹{hostSubmitSuccess.nightlyRateINR}/night</div>
                    <div><strong>Property Type:</strong> {hostSubmitSuccess.propertyType}</div>
                    <div><strong>Status:</strong> <span className="badge-tag status-pending">Under Community Review</span></div>
                  </div>
                </div>

                <div className="host-success-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setHostSubmitSuccess(null);
                      setHostStep(1);
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
                      setHostStep(1);
                      setActiveTab('discover');
                    }}
                  >
                    Back to Stays Discovery
                  </button>
                </div>
              </div>
            ) : (
              <div className="host-wizard-wrapper">
                {/* Step Indicator & Progress Bar */}
                <div className="wizard-progress-card">
                  <div className="wizard-steps-nav" role="tablist">
                    {[
                      { num: 1, title: 'Host Profile', desc: 'Identity & Story' },
                      { num: 2, title: 'Property Details', desc: 'Home & Rooms' },
                      { num: 3, title: 'Amenities & Experiences', desc: 'Meals & Culture' },
                      { num: 4, title: 'Photos & Review', desc: 'Preview & Submit' }
                    ].map(step => {
                      const isCompleted = hostStep > step.num;
                      const isCurrent = hostStep === step.num;
                      return (
                        <button
                          key={step.num}
                          type="button"
                          className={`wizard-step-tab ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                          onClick={() => {
                            if (step.num < hostStep) {
                              setHostStep(step.num);
                              setHostSubmitError('');
                            } else if (step.num > hostStep) {
                              const errs = validateHostStep(hostStep);
                              if (Object.keys(errs).length === 0) {
                                setHostStep(step.num);
                              } else {
                                setStepErrors(errs);
                                setHostSubmitError('Please complete current required fields before skipping ahead.');
                              }
                            }
                          }}
                        >
                          <div className="step-tab-num">
                            {isCompleted ? <Check size={14} strokeWidth={3} /> : step.num}
                          </div>
                          <div className="step-tab-text">
                            <span className="step-tab-title">{step.title}</span>
                            <span className="step-tab-desc">{step.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="wizard-progress-bar-bg" aria-hidden="true">
                    <div
                      className="wizard-progress-bar-fill"
                      style={{ width: `${((hostStep - 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Form Error Banner */}
                {hostSubmitError && (
                  <div className="form-error-alert" role="alert">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{hostSubmitError}</span>
                  </div>
                )}

                <form onSubmit={handleHostFormSubmit} className="host-registration-form" noValidate>
                  {/* STEP 1: HOST PROFILE */}
                  {hostStep === 1 && (
                    <div className="form-step-content host-step1-container animate-fadeIn">
                      {/* Step Header */}
                      <div className="step-header-banner">
                        <div className="step-header-top-row">
                          <span className="step-pill">Step 1 of 4</span>
                          <span className="step-pill-meta">Host Profile & Eligibility</span>
                        </div>
                        <h3>Tell us about yourself</h3>
                        <p>Share your identity, the languages you speak with travellers, and confirm basic hosting eligibility.</p>
                        
                        {/* Subtle Privacy Reassurance */}
                        <div className="privacy-reassurance-chip">
                          <Shield size={14} className="flex-shrink-0 text-primary" />
                          <span><strong>Privacy Reassurance:</strong> Your personal contact info is private and only verified community coordinators review this application. It will never be displayed publicly.</span>
                        </div>
                      </div>

                      {/* Card 1: Host Identity & Spoken Languages */}
                      <div className="host-profile-card">
                        <div className="profile-card-header">
                          <h4 className="profile-card-title">
                            <User size={18} className="text-primary" />
                            Host Identity & Languages Spoken
                          </h4>
                          <span className="profile-card-badge">Required</span>
                        </div>

                        <div className="form-row-2">
                          <div className="form-group">
                            <label htmlFor="hostFullName" className="form-label-bold">
                              Full Legal or Preferred Name <span className="req-star">*</span>
                            </label>
                            <input
                              id="hostFullName"
                              type="text"
                              required
                              placeholder="e.g., Kunjamma Nair or Dorbar Elder John"
                              value={hostForm.hostFullName}
                              onChange={(e) => {
                                setHostForm({ ...hostForm, hostFullName: e.target.value });
                                if (stepErrors.hostFullName) {
                                  setStepErrors({ ...stepErrors, hostFullName: undefined });
                                }
                              }}
                              className={`form-control ${stepErrors.hostFullName ? 'input-error' : ''}`}
                            />
                            {stepErrors.hostFullName ? (
                              <span className="field-error-msg">{stepErrors.hostFullName}</span>
                            ) : (
                              <small className="field-hint">The name guests will use when greeting you at your homestay.</small>
                            )}
                          </div>

                          <div className="form-group">
                            <label className="form-label-bold">
                              Spoken Languages <span className="req-star">*</span>
                            </label>
                            
                            {/* Search or Add Custom Language */}
                            <div className="language-search-wrapper">
                              <Search size={15} className="lang-search-icon" />
                              <input
                                type="text"
                                placeholder="Filter languages or type new & press Enter..."
                                value={languageSearch}
                                onChange={(e) => setLanguageSearch(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomLanguage();
                                  }
                                }}
                                className="form-control lang-search-input"
                              />
                              {languageSearch.trim() && (
                                <button
                                  type="button"
                                  className="btn-add-lang-pill"
                                  onClick={handleAddCustomLanguage}
                                >
                                  + Add
                                </button>
                              )}
                            </div>

                            {/* Selectable Wrapping Language Chips */}
                            <div className="chip-selector-group language-chips-wrap">
                              {(() => {
                                const currentSelected = hostForm.languages
                                  ? hostForm.languages.split(',').map(l => l.trim()).filter(Boolean)
                                  : [];
                                
                                // Pool of options: standard pool filtered by query + already selected custom languages
                                const filteredPool = AVAILABLE_LANGUAGES.filter(lang => 
                                  lang.toLowerCase().includes(languageSearch.trim().toLowerCase())
                                );
                                
                                // Union of pool and any custom selected languages
                                const displayPool = Array.from(new Set([...filteredPool, ...currentSelected]));

                                return displayPool.map(lang => {
                                  const isSelected = currentSelected.some(l => l.toLowerCase() === lang.toLowerCase());
                                  return (
                                    <button
                                      key={lang}
                                      type="button"
                                      className={`filter-chip lang-chip ${isSelected ? 'active' : ''}`}
                                      onClick={() => handleToggleLanguage(lang)}
                                      aria-pressed={isSelected}
                                    >
                                      {isSelected ? <Check size={13} className="text-primary" /> : null}
                                      <span>{lang}</span>
                                    </button>
                                  );
                                });
                              })()}
                            </div>

                            {stepErrors.languages ? (
                              <span className="field-error-msg">{stepErrors.languages}</span>
                            ) : (
                              <small className="field-hint">
                                Selected: <strong>{hostForm.languages || 'None yet'}</strong> (Tap chips to add/remove)
                              </small>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Host Introduction & Ancestral Story */}
                      <div className="host-profile-card">
                        <div className="profile-card-header">
                          <h4 className="profile-card-title">
                            <Sparkles size={18} className="text-primary" />
                            Host Introduction & Story
                          </h4>
                          <span className="char-count-badge">
                            {(hostForm.hostIntro || '').length} / 600
                          </span>
                        </div>

                        <div className="form-group">
                          <label htmlFor="hostIntro" className="form-label-bold">
                            Welcome Note & Cultural Background
                          </label>
                          <textarea
                            id="hostIntro"
                            rows="4"
                            maxLength={600}
                            placeholder="Share a few sentences about your family, your relationship to the land, traditional recipes passed down, and what makes your village special..."
                            value={hostForm.hostIntro || ''}
                            onChange={(e) => setHostForm({ ...hostForm, hostIntro: e.target.value })}
                            className="form-control host-intro-textarea"
                          />
                          
                          {/* Helpful Story Starter Prompts */}
                          <div className="intro-prompts-row">
                            <span className="intro-prompts-label">Need inspiration? Click to add:</span>
                            <div className="intro-prompts-chips">
                              <button
                                type="button"
                                className="intro-prompt-btn"
                                onClick={() => handleInsertIntroPrompt('Our family has cultivated these lands for three generations, preserving ancestral heritage.')}
                              >
                                + Family roots
                              </button>
                              <button
                                type="button"
                                className="intro-prompt-btn"
                                onClick={() => handleInsertIntroPrompt('We love serving traditional homecooked earthenware meals with organic spices.')}
                              >
                                + Traditional meals
                              </button>
                              <button
                                type="button"
                                className="intro-prompt-btn"
                                onClick={() => handleInsertIntroPrompt('Guests enjoy evening folk stories and quiet walks through sacred groves.')}
                              >
                                + Local folklore
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Profile Photo */}
                      <div className="host-profile-card">
                        <div className="profile-card-header">
                          <h4 className="profile-card-title">
                            <Camera size={18} className="text-primary" />
                            Host Profile Photo
                          </h4>
                          <span className="profile-card-badge-optional">Optional</span>
                        </div>

                        <div className="avatar-uploader-layout">
                          {/* Photo Preview Circle */}
                          <div className="avatar-preview-wrapper">
                            {hostForm.hostAvatar ? (
                              <img
                                src={hostForm.hostAvatar}
                                alt="Host avatar preview"
                                className="avatar-preview-img"
                              />
                            ) : (
                              <div className="avatar-placeholder-box">
                                <User size={40} className="avatar-placeholder-icon" />
                                <span>Default Avatar</span>
                              </div>
                            )}
                          </div>

                          {/* Upload and Fallback Controls */}
                          <div className="avatar-controls-col">
                            <div className="avatar-file-upload-actions">
                              <label htmlFor="avatar-file-input" className="btn-upload-file">
                                <Upload size={16} />
                                <span>Upload photo from device</span>
                                <input
                                  id="avatar-file-input"
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden-file-input"
                                  onChange={handleAvatarFileUpload}
                                />
                              </label>

                              {hostForm.hostAvatar && (
                                <button
                                  type="button"
                                  className="btn-remove-avatar"
                                  onClick={() => {
                                    setHostForm({ ...hostForm, hostAvatar: '' });
                                    setAvatarError('');
                                  }}
                                >
                                  <Trash2 size={14} /> Remove photo
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-default-avatar"
                                onClick={() => {
                                  setHostForm({
                                    ...hostForm,
                                    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
                                  });
                                  setAvatarError('');
                                }}
                              >
                                Use curated portrait
                              </button>
                            </div>

                            {avatarError && (
                              <span className="field-error-msg">{avatarError}</span>
                            )}

                            {/* Or direct URL fallback */}
                            <div className="avatar-url-fallback">
                              <label htmlFor="hostAvatarUrl" className="field-hint">
                                Or enter direct image URL:
                              </label>
                              <input
                                id="hostAvatarUrl"
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={hostForm.hostAvatar || ''}
                                onChange={(e) => {
                                  setHostForm({ ...hostForm, hostAvatar: e.target.value });
                                  setAvatarError('');
                                }}
                                className="form-control form-control-sm"
                              />
                            </div>
                            <small className="field-hint">
                              Accepted formats: JPG, PNG, WebP (max 5MB). A warm, authentic portrait helps travellers connect before arrival.
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Host Eligibility & Consent Confirmations */}
                      <div className="host-profile-card">
                        <div className="profile-card-header">
                          <h4 className="profile-card-title">
                            <Shield size={18} className="text-primary" />
                            Eligibility & Legal Confirmations
                          </h4>
                          <span className="profile-card-badge">Confirmations</span>
                        </div>

                        <p className="eligibility-intro-text">
                          To maintain traveller safety and cultural authenticity, ROOTS hosts must meet these core criteria before community verification:
                        </p>

                        <div className="eligibility-cards-list">
                          {/* Confirmation 1: 18+ Required */}
                          <label className={`eligibility-item-card ${stepErrors.age18Plus ? 'checkbox-error' : ''} ${hostForm.age18Plus ? 'checked-card' : ''}`}>
                            <div className="eligibility-checkbox-wrapper">
                              <input
                                type="checkbox"
                                id="age18PlusCheck"
                                checked={hostForm.age18Plus}
                                onChange={(e) => {
                                  setHostForm({ ...hostForm, age18Plus: e.target.checked });
                                  if (stepErrors.age18Plus) {
                                    setStepErrors({ ...stepErrors, age18Plus: undefined });
                                  }
                                }}
                                className="accessible-checkbox"
                              />
                            </div>
                            <div className="eligibility-text-content">
                              <div className="eligibility-card-headline">
                                <strong>Legal Age Eligibility (18+ Years)</strong>
                                <span className="badge-required-pill">Required</span>
                              </div>
                              <p>I confirm that I am at least 18 years of age and legally authorized by family, panchayat, or property title to host travellers on this property.</p>
                            </div>
                          </label>
                          {stepErrors.age18Plus && (
                            <span className="field-error-msg">{stepErrors.age18Plus}</span>
                          )}

                          {/* Confirmation 2: On-Premises Presence */}
                          <label className={`eligibility-item-card ${hostForm.hostLivesOnProperty ? 'checked-card' : ''}`}>
                            <div className="eligibility-checkbox-wrapper">
                              <input
                                type="checkbox"
                                id="hostLivesOnPropertyCheck"
                                checked={hostForm.hostLivesOnProperty}
                                onChange={(e) => setHostForm({ ...hostForm, hostLivesOnProperty: e.target.checked })}
                                className="accessible-checkbox"
                              />
                            </div>
                            <div className="eligibility-text-content">
                              <div className="eligibility-card-headline">
                                <strong>On-Premises Host or Family Presence</strong>
                                <span className="badge-recommended-pill">Recommended</span>
                              </div>
                              <p>I (or members of my family) reside on or adjacent to this property during guest stays to welcome guests in person, share homecooked meals, and offer authentic local guidance.</p>
                            </div>
                          </label>

                          {/* Confirmation 3: Direct Reachability */}
                          <label className={`eligibility-item-card ${hostForm.contactVerified ? 'checked-card' : ''}`}>
                            <div className="eligibility-checkbox-wrapper">
                              <input
                                type="checkbox"
                                id="contactVerifiedCheck"
                                checked={hostForm.contactVerified}
                                onChange={(e) => setHostForm({ ...hostForm, contactVerified: e.target.checked })}
                                className="accessible-checkbox"
                              />
                            </div>
                            <div className="eligibility-text-content">
                              <div className="eligibility-card-headline">
                                <strong>Direct WhatsApp / Phone Reachability</strong>
                                <span className="badge-standard-pill">Active Hosting</span>
                              </div>
                              <p>I agree to receive booking inquiries from verified travellers and respond within 24 hours to coordinate check-in details and dietary preferences.</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PROPERTY DETAILS */}
                  {hostStep === 2 && (
                    <div className="form-step-content animate-fadeIn">
                      <div className="step-header-banner">
                        <span className="step-pill">Step 2 of 4</span>
                        <h3>Property & Accommodation Details</h3>
                        <p>Describe your homestay structure, destination, guest room capacity, and accessibility.</p>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="propertyName">
                            Homestay Name <span className="req-star">*</span>
                          </label>
                          <input
                            id="propertyName"
                            type="text"
                            required
                            placeholder="e.g., Ka Mei's Cardamom Foothill Cottage"
                            value={hostForm.propertyName}
                            onChange={(e) => {
                              setHostForm({ ...hostForm, propertyName: e.target.value });
                              if (stepErrors.propertyName) {
                                setStepErrors({ ...stepErrors, propertyName: undefined });
                              }
                            }}
                            className={`form-control ${stepErrors.propertyName ? 'input-error' : ''}`}
                          />
                          {stepErrors.propertyName && (
                            <span className="field-error-msg">{stepErrors.propertyName}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="destinationId">
                            Destination Hub <span className="req-star">*</span>
                          </label>
                          <select
                            id="destinationId"
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
                        <label htmlFor="generalLocation">
                          General Location (Village / Landmark / District) <span className="req-star">*</span>
                        </label>
                        <input
                          id="generalLocation"
                          type="text"
                          required
                          placeholder="e.g., Kakkabe Foothills, Kodagu, Karnataka (Do NOT enter house number)"
                          value={hostForm.generalLocation}
                          onChange={(e) => {
                            setHostForm({ ...hostForm, generalLocation: e.target.value });
                            if (stepErrors.generalLocation) {
                              setStepErrors({ ...stepErrors, generalLocation: undefined });
                            }
                          }}
                          className={`form-control ${stepErrors.generalLocation ? 'input-error' : ''}`}
                        />
                        {stepErrors.generalLocation && (
                          <span className="field-error-msg">{stepErrors.generalLocation}</span>
                        )}
                        <div className="privacy-badge-note">
                          <Lock size={14} color="#3478F6" />
                          <span>
                            <strong>Privacy Shield:</strong> Exact house numbers and private GPS coordinates are NEVER
                            published on the web. They are disclosed to guests only after you accept their booking request.
                          </span>
                        </div>
                      </div>

                      <div className="form-row-4">
                        <div className="form-group">
                          <label htmlFor="propertyType">Property Style</label>
                          <select
                            id="propertyType"
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
                          <label htmlFor="rooms">
                            Guest Bedrooms <span className="req-star">*</span>
                          </label>
                          <input
                            id="rooms"
                            type="number"
                            min="1"
                            max="10"
                            value={hostForm.rooms}
                            onChange={(e) => setHostForm({ ...hostForm, rooms: e.target.value })}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="beds">Beds Available</label>
                          <input
                            id="beds"
                            type="number"
                            min="1"
                            max="15"
                            value={hostForm.beds}
                            onChange={(e) => setHostForm({ ...hostForm, beds: e.target.value })}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="maxGuests">Max Guests</label>
                          <input
                            id="maxGuests"
                            type="number"
                            min="1"
                            max="20"
                            value={hostForm.maxGuests}
                            onChange={(e) => setHostForm({ ...hostForm, maxGuests: e.target.value })}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="bathroomPrivacy">Bathroom & Privacy Arrangements</label>
                          <select
                            id="bathroomPrivacy"
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
                          <label htmlFor="accessibility">Accessibility & Mobility Notes</label>
                          <input
                            id="accessibility"
                            type="text"
                            placeholder="e.g., Ground floor entrance, 2 veranda stone steps, wide doors"
                            value={hostForm.accessibility}
                            onChange={(e) => setHostForm({ ...hostForm, accessibility: e.target.value })}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                {/* STEP 3: AMENITIES & EXPERIENCES */}
                  {hostStep === 3 && (
                    <div className="form-step-content animate-fadeIn">
                      <div className="step-header-banner">
                        <span className="step-pill">Step 3 of 4</span>
                        <h3>Amenities, Meals & Experiences</h3>
                        <p>Highlight the facilities, homecooked traditions, cultural activities, and nightly pricing.</p>
                      </div>

                      <div className="form-group">
                        <label>Available Homestay Facilities</label>
                        <p className="field-hint-sub">Select all amenities available to guests:</p>
                        <div className="chip-selector-group">
                          {[
                            'Homecooked Meals', 'Hot Water', 'Wi-Fi', 'Solar Backup',
                            'Filtered Water', 'Veranda Seating', 'Organic Kitchen Garden',
                            'Fireplace / Bukhari', 'Bonfire Pit', 'Pet Friendly', 'Free Parking',
                            'Washing Machine', 'Mosquito Netting'
                          ].map(amenity => {
                            const isSelected = hostForm.amenities?.includes(amenity);
                            return (
                              <button
                                key={amenity}
                                type="button"
                                className={`filter-chip ${isSelected ? 'active' : ''}`}
                                onClick={() => {
                                  const current = hostForm.amenities || [];
                                  if (isSelected) {
                                    setHostForm({ ...hostForm, amenities: current.filter(a => a !== amenity) });
                                  } else {
                                    setHostForm({ ...hostForm, amenities: [...current, amenity] });
                                  }
                                }}
                              >
                                {amenity}
                                {isSelected && <Check size={12} className="ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="card-subtle mb-4">
                        <h4 className="card-subtle-title">
                          <Utensils size={18} color="#3478F6" />
                          Homecooked Traditional Food
                        </h4>

                        <div className="form-row-2">
                          <label className="checkbox-label-card">
                            <input
                              type="checkbox"
                              checked={hostForm.breakfastIncluded}
                              onChange={(e) => setHostForm({ ...hostForm, breakfastIncluded: e.target.checked })}
                            />
                            <div>
                              <strong>Traditional Breakfast Included</strong>
                              <p>Included in the nightly rate (e.g., idiyappam, poori bhaji, Tsampa porridge).</p>
                            </div>
                          </label>

                          <label className="checkbox-label-card">
                            <input
                              type="checkbox"
                              checked={hostForm.dinnerAvailable}
                              onChange={(e) => setHostForm({ ...hostForm, dinnerAvailable: e.target.checked })}
                            />
                            <div>
                              <strong>Traditional Dinner upon Request</strong>
                              <p>Guests can request wholesome family dinner prepared with local ingredients.</p>
                            </div>
                          </label>
                        </div>

                        {hostForm.dinnerAvailable && (
                          <div className="form-group mt-3" style={{ maxWidth: '300px' }}>
                            <label htmlFor="dinnerCostINR">Dinner Cost per Person (INR)</label>
                            <input
                              id="dinnerCostINR"
                              type="number"
                              min="0"
                              step="50"
                              value={hostForm.dinnerCostINR}
                              onChange={(e) => setHostForm({ ...hostForm, dinnerCostINR: e.target.value })}
                              className="form-control"
                            />
                          </div>
                        )}

                        <div className="form-group mt-3">
                          <label htmlFor="mealsDescription">Meals Specialty & Description</label>
                          <input
                            id="mealsDescription"
                            type="text"
                            placeholder="e.g., Steamed appams, wild pepper rasam, organic vegetable thali on banana leaves."
                            value={hostForm.mealsDescription}
                            onChange={(e) => setHostForm({ ...hostForm, mealsDescription: e.target.value })}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="culturalActivities">
                          Cultural Experiences & Guided Activities (comma separated)
                        </label>
                        <input
                          id="culturalActivities"
                          type="text"
                          placeholder="e.g., Cooking demonstration, Village walk, Living root bridge trek, Clay pottery"
                          value={hostForm.culturalActivities}
                          onChange={(e) => setHostForm({ ...hostForm, culturalActivities: e.target.value })}
                          className="form-control"
                        />
                        <small className="field-hint">
                          Slow travellers seek direct engagement with local craftspeople and landscapes.
                        </small>
                      </div>

                      <div className="form-row-3">
                        <div className="form-group">
                          <label htmlFor="nightlyRateINR">
                            Nightly Rate (INR) <span className="req-star">*</span>
                          </label>
                          <div className="input-with-prefix">
                            <span className="input-prefix">₹</span>
                            <input
                              id="nightlyRateINR"
                              type="number"
                              required
                              min="500"
                              max="20000"
                              step="100"
                              value={hostForm.nightlyRateINR}
                              onChange={(e) => {
                                setHostForm({ ...hostForm, nightlyRateINR: e.target.value });
                                if (stepErrors.nightlyRateINR) {
                                  setStepErrors({ ...stepErrors, nightlyRateINR: undefined });
                                }
                              }}
                              className={`form-control ${stepErrors.nightlyRateINR ? 'input-error' : ''}`}
                            />
                          </div>
                          {stepErrors.nightlyRateINR && (
                            <span className="field-error-msg">{stepErrors.nightlyRateINR}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="cleaningFeeINR">Community Fund / Cleaning Fee (INR)</label>
                          <div className="input-with-prefix">
                            <span className="input-prefix">₹</span>
                            <input
                              id="cleaningFeeINR"
                              type="number"
                              min="0"
                              max="1000"
                              step="50"
                              value={hostForm.cleaningFeeINR}
                              onChange={(e) => setHostForm({ ...hostForm, cleaningFeeINR: e.target.value })}
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="cancellationPolicy">Cancellation Policy</label>
                          <select
                            id="cancellationPolicy"
                            value={hostForm.cancellationPolicy}
                            onChange={(e) => setHostForm({ ...hostForm, cancellationPolicy: e.target.value })}
                            className="form-control"
                          >
                            <option value="Flexible: Free cancellation up to 48 hours before check-in.">Flexible (Up to 48h)</option>
                            <option value="Moderate: Free cancellation up to 5 days before check-in.">Moderate (Up to 5 days)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="checkInTime">Check-In Time</label>
                          <input
                            id="checkInTime"
                            type="text"
                            value={hostForm.checkInTime}
                            onChange={(e) => setHostForm({ ...hostForm, checkInTime: e.target.value })}
                            className="form-control"
                            placeholder="e.g., 01:00 PM"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="checkOutTime">Check-Out Time</label>
                          <input
                            id="checkOutTime"
                            type="text"
                            value={hostForm.checkOutTime}
                            onChange={(e) => setHostForm({ ...hostForm, checkOutTime: e.target.value })}
                            className="form-control"
                            placeholder="e.g., 11:00 AM"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="houseRules">Guest House Rules (one per line)</label>
                        <textarea
                          id="houseRules"
                          rows="3"
                          value={hostForm.houseRules}
                          onChange={(e) => setHostForm({ ...hostForm, houseRules: e.target.value })}
                          className="form-control"
                          placeholder="Quiet hours after 10 PM&#10;No single-use plastic&#10;Remove footwear at entrance"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PHOTOS, REVIEW & SUBMISSION */}
                  {hostStep === 4 && (
                    <div className="form-step-content animate-fadeIn">
                      <div className="step-header-banner">
                        <span className="step-pill">Step 4 of 4</span>
                        <h3>Photos, Review & Final Submission</h3>
                        <p>Upload photo URLs, review your application summary, and submit for community review.</p>
                      </div>

                      <div className="card-subtle mb-4">
                        <h4 className="card-subtle-title">
                          <Camera size={18} color="#3478F6" />
                          Homestay Photos
                        </h4>
                        <p className="field-hint-sub">Add high-quality image URLs of the guest bedroom, dining area, or surrounding garden.</p>

                        <div className="photo-add-bar">
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            className="form-control flex-1"
                          />
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              if (newPhotoUrl.trim()) {
                                setHostForm({
                                  ...hostForm,
                                  photos: [...(hostForm.photos || []), newPhotoUrl.trim()]
                                });
                                setNewPhotoUrl('');
                                if (stepErrors.photos) {
                                  setStepErrors({ ...stepErrors, photos: undefined });
                                }
                              }
                            }}
                          >
                            <Plus size={16} /> Add Photo
                          </button>
                        </div>

                        {stepErrors.photos && (
                          <span className="field-error-msg">{stepErrors.photos}</span>
                        )}

                        <div className="photo-preview-grid">
                          {hostForm.photos && hostForm.photos.length > 0 ? (
                            hostForm.photos.map((url, idx) => (
                              <div key={idx} className="photo-preview-card">
                                <img
                                  src={url}
                                  alt={`Homestay preview ${idx + 1}`}
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
                                  }}
                                />
                                <div className="photo-preview-badge">
                                  {idx === 0 ? 'Cover Photo' : `Photo ${idx + 1}`}
                                </div>
                                {hostForm.photos.length > 1 && (
                                  <button
                                    type="button"
                                    className="photo-remove-btn"
                                    title="Remove this photo"
                                    onClick={() => {
                                      const filtered = hostForm.photos.filter((_, i) => i !== idx);
                                      setHostForm({ ...hostForm, photos: filtered });
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="photo-empty-box">
                              <Image size={32} color="#94A3B8" />
                              <span>No photos added yet. Add at least one image URL above.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-section-block verification-sub-box mb-4">
                        <h4 className="section-block-title" style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
                          <Shield size={18} color="#3478F6" />
                          Verification & Safety Compliance Declarations
                        </h4>
                        <p className="sub-box-desc">
                          Sensitive government identification numbers are stored confidentially and are never displayed publicly.
                        </p>

                        <div className="form-row-2">
                          <div className="form-group">
                            <label htmlFor="govIdType">Government Identity Proof Type</label>
                            <input
                              id="govIdType"
                              type="text"
                              value={hostForm.govIdType}
                              onChange={(e) => setHostForm({ ...hostForm, govIdType: e.target.value })}
                              className="form-control"
                            />
                            <small className="field-hint">Masked reference (e.g. Aadhaar / Voter ID / Passport)</small>
                          </div>

                          <div className="form-group">
                            <label htmlFor="ownershipDocType">Permission / Ownership Document Type</label>
                            <input
                              id="ownershipDocType"
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

                      <div className="host-summary-review card-white mb-4">
                        <div className="summary-card-header">
                          <h4 style={{ color: 'var(--deep-blue)', margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                            Application Review Summary
                          </h4>
                          <span className="review-status-pill">
                            Status Upon Submission: Under Review
                          </span>
                        </div>

                        <div className="summary-details-grid">
                          <div className="summary-item">
                            <span className="summary-label">Host Name:</span>
                            <span className="summary-val">{hostForm.hostFullName || '—'}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Languages:</span>
                            <span className="summary-val">{hostForm.languages || '—'}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Homestay Name:</span>
                            <span className="summary-val">{hostForm.propertyName || '—'}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">General Area:</span>
                            <span className="summary-val">{hostForm.generalLocation || '—'}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Property Style:</span>
                            <span className="summary-val">{hostForm.propertyType}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Bedrooms / Max Guests:</span>
                            <span className="summary-val">{hostForm.rooms} rooms • Up to {hostForm.maxGuests} guests</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Nightly Rate:</span>
                            <span className="summary-val font-semibold text-primary">₹{hostForm.nightlyRateINR} / night</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Breakfast:</span>
                            <span className="summary-val">{hostForm.breakfastIncluded ? 'Included in rate' : 'Not included'}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Cultural Walks:</span>
                            <span className="summary-val">{hostForm.culturalActivities || 'None listed'}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Photos Attached:</span>
                            <span className="summary-val">{hostForm.photos?.length || 0} photo(s)</span>
                          </div>
                        </div>

                        <div className="privacy-trust-disclaimer">
                          <Shield size={16} color="#3478F6" className="flex-shrink-0" />
                          <p>
                            <strong>Data Privacy Commitment:</strong> By submitting, your application is placed in
                            our private moderator queue. ROOTS will never sell your details or display unverified private
                            addresses. Approval is strictly conducted through personal vetting.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Actions */}
                  <div className="wizard-nav-actions">
                    {hostStep > 1 ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={handlePrevHostStep}
                        disabled={hostSubmitting}
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setActiveTab('discover')}
                        disabled={hostSubmitting}
                      >
                        Cancel
                      </button>
                    )}

                    {hostStep < 4 ? (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleNextHostStep}
                      >
                        Continue to Step {hostStep + 1} <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn-primary btn-large btn-submit-final"
                        disabled={hostSubmitting}
                      >
                        {hostSubmitting ? (
                          <>
                            <RefreshCw size={16} className="spin-icon" /> Submitting Application...
                          </>
                        ) : (
                          <>
                            Submit Application for Review <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
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

      {/* 7. MODAL: PREMIUM STAY BOOKING REQUEST FORM */}
      {bookingStay && (
        <div className="modal-overlay" onClick={() => setBookingStay(null)} role="dialog" aria-modal="true" aria-labelledby="stay-booking-modal-title">
          <div className="modal-content stay-booking-modal card-white" onClick={(e) => e.stopPropagation()}>
            
            {/* Top Context Header: Homestay & Host Identification */}
            <div className="booking-context-header">
              <div className="booking-context-main">
                <div className="booking-context-avatar-wrap">
                  {bookingStay.host?.avatar ? (
                    <img
                      src={bookingStay.host.avatar}
                      alt={bookingStay.host?.name || 'Host'}
                      className="booking-host-avatar"
                    />
                  ) : (
                    <div className="booking-host-avatar-fallback">
                      <User size={22} />
                    </div>
                  )}
                  <span className="booking-verified-badge" title="Verified Host on ROOTS">
                    <Shield size={11} />
                  </span>
                </div>
                <div className="booking-context-meta">
                  <div className="booking-context-top-tags">
                    <span className="booking-stay-type-badge">{bookingStay.propertyType}</span>
                    <span className="booking-host-name">Hosted by {bookingStay.host?.name || 'Local Host'}</span>
                    <span className="booking-rate-pill">₹{bookingStay.nightlyRateINR.toLocaleString('en-IN')}/night</span>
                  </div>
                  <h2 id="stay-booking-modal-title" className="booking-stay-title">{bookingStay.name}</h2>
                  <div className="booking-stay-sub">
                    <span className="booking-location">
                      <MapPin size={13} /> {bookingStay.generalLocation || bookingStay.destinationId}
                    </span>
                    <span className="booking-divider-dot">•</span>
                    <span className="booking-capacity-badge">
                      <Users size={13} /> Max {bookingPricing.maxCapacity} Guests ({bookingStay.rooms || 1} Room{bookingStay.rooms > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setBookingStay(null)}
                aria-label="Close booking modal"
              >
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="booking-success-box">
                <div className="booking-success-icon-wrap">
                  <CheckCircle2 size={56} color="#10B981" />
                </div>
                <h3 className="booking-success-title">Stay Request Sent to {bookingStay.host?.name || 'your Host'}!</h3>
                <p className="booking-success-subtitle">
                  Your booking request is now submitted and awaiting host approval. No money has been charged.
                </p>

                <div className="booking-request-id-pill">
                  <span>Reference ID:</span>
                  <strong>{bookingSuccess.id}</strong>
                </div>

                <div className="booking-summary-recap">
                  <div className="recap-row">
                    <span className="recap-label"><Calendar size={14} /> Dates</span>
                    <span className="recap-value">{bookingSuccess.checkInDate} to {bookingSuccess.checkOutDate} ({bookingSuccess.nights} Night{bookingSuccess.nights > 1 ? 's' : ''})</span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label"><Users size={14} /> Guests</span>
                    <span className="recap-value">{bookingSuccess.guestsCount} Guest{bookingSuccess.guestsCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="recap-row">
                    <span className="recap-label"><Utensils size={14} /> Traditional Dinner</span>
                    <span className="recap-value">{bookingSuccess.includeDinner ? 'Included' : 'Not requested'}</span>
                  </div>
                  <div className="recap-row total">
                    <span className="recap-label">Estimated Total</span>
                    <span className="recap-value total-val">₹{bookingSuccess.totalPriceINR.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="booking-success-notice">
                  <Info size={16} color="#3478F6" />
                  <p>
                    <strong>Host Approval Required:</strong> {bookingStay.host?.name} will review your request and confirm availability within 24 hours. Once accepted, you can coordinate your arrival directly.
                  </p>
                </div>

                <div className="booking-success-actions">
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
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setBookingSuccess(null);
                      setBookingStay(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="booking-request-form-v2" noValidate>
                {bookingError && (
                  <div className="booking-error-banner" role="alert">
                    <AlertCircle size={18} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="booking-form-grid-layout">
                  {/* LEFT COLUMN: Input Sections */}
                  <div className="booking-form-left-col">
                    
                    {/* SECTION 1: Dates & Guests */}
                    <div className="booking-section-card">
                      <div className="booking-section-header">
                        <div className="section-title-wrap">
                          <span className="section-step-num">1</span>
                          <Calendar size={18} className="section-icon" />
                          <h3 className="section-title">Dates & Guests</h3>
                        </div>
                        {bookingPricing.isValidDates ? (
                          <span className="nights-pill-badge">
                            <Clock size={12} /> {bookingPricing.nights} Night{bookingPricing.nights > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="dates-pending-badge">Select range</span>
                        )}
                      </div>

                      <div className="booking-inputs-row-2">
                        <div className="booking-input-group">
                          <label htmlFor="booking-checkin-date" className="booking-label">
                            Check-in Date <span className="req-star">*</span>
                          </label>
                          <div className="booking-input-wrapper">
                            <input
                              id="booking-checkin-date"
                              type="date"
                              required
                              value={bookingForm.checkInDate}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, checkInDate: e.target.value }))}
                              className={`booking-input-field ${bookingPricing.dateError ? 'input-warn' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="booking-input-group">
                          <label htmlFor="booking-checkout-date" className="booking-label">
                            Check-out Date <span className="req-star">*</span>
                          </label>
                          <div className="booking-input-wrapper">
                            <input
                              id="booking-checkout-date"
                              type="date"
                              required
                              min={bookingForm.checkInDate || undefined}
                              value={bookingForm.checkOutDate}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, checkOutDate: e.target.value }))}
                              className={`booking-input-field ${bookingPricing.dateError ? 'input-warn' : ''}`}
                            />
                          </div>
                        </div>
                      </div>

                      {bookingPricing.dateError && (
                        <div className="date-inline-feedback error">
                          <AlertCircle size={13} />
                          <span>{bookingPricing.dateError}</span>
                        </div>
                      )}

                      <div className="booking-input-group mt-3">
                        <label htmlFor="booking-guests-count" className="booking-label">
                          Number of Guests <span className="req-star">*</span>
                        </label>
                        <div className="booking-input-wrapper">
                          <select
                            id="booking-guests-count"
                            value={bookingForm.guestsCount}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, guestsCount: Number(e.target.value) }))}
                            className="booking-input-field select-field"
                          >
                            {Array.from({ length: bookingPricing.maxCapacity }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n} Guest{n > 1 ? 's' : ''} {n === bookingPricing.maxCapacity ? '(Max Capacity)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="booking-field-caption">
                          Property capacity: Accommodates up to {bookingPricing.maxCapacity} guests ({bookingStay.rooms || 1} room{bookingStay.rooms > 1 ? 's' : ''}, {bookingStay.beds || 2} bed{bookingStay.beds > 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>

                    {/* SECTION 2: Your Details */}
                    <div className="booking-section-card">
                      <div className="booking-section-header">
                        <div className="section-title-wrap">
                          <span className="section-step-num">2</span>
                          <User size={18} className="section-icon" />
                          <h3 className="section-title">Your Details</h3>
                        </div>
                        <span className="privacy-pill-badge">
                          <Shield size={11} /> Host Contact
                        </span>
                      </div>

                      <div className="booking-inputs-row-2">
                        <div className="booking-input-group">
                          <label htmlFor="booking-guest-name" className="booking-label">
                            Full Name <span className="req-star">*</span>
                          </label>
                          <div className="booking-input-wrapper">
                            <input
                              id="booking-guest-name"
                              type="text"
                              required
                              placeholder="e.g. Maya Iyer"
                              value={bookingForm.guestName}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, guestName: e.target.value }))}
                              className="booking-input-field"
                            />
                          </div>
                        </div>

                        <div className="booking-input-group">
                          <label htmlFor="booking-guest-contact" className="booking-label">
                            Contact Email or Phone <span className="req-star">*</span>
                          </label>
                          <div className="booking-input-wrapper">
                            <input
                              id="booking-guest-contact"
                              type="text"
                              required
                              placeholder="e.g. maya@example.com / +91..."
                              value={bookingForm.guestContact}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, guestContact: e.target.value }))}
                              className="booking-input-field"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="booking-input-group mt-3">
                        <label htmlFor="booking-guest-message" className="booking-label">
                          Message to Host {bookingStay.host?.name || 'Local Host'} <span className="optional-tag">(Optional)</span>
                        </label>
                        <div className="booking-input-wrapper">
                          <textarea
                            id="booking-guest-message"
                            rows="2"
                            placeholder="Share your travel plans, estimated arrival time, dietary preferences, or interest in local village culture..."
                            value={bookingForm.guestMessage}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, guestMessage: e.target.value }))}
                            className="booking-input-field textarea-field"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: Optional Experiences */}
                    <div className="booking-section-card">
                      <div className="booking-section-header">
                        <div className="section-title-wrap">
                          <span className="section-step-num">3</span>
                          <Utensils size={18} className="section-icon" />
                          <h3 className="section-title">Optional Experiences</h3>
                        </div>
                        {bookingStay.mealOptions?.breakfastIncluded && (
                          <span className="breakfast-pill-badge">
                            <Coffee size={12} /> Breakfast Included
                          </span>
                        )}
                      </div>

                      {bookingStay.mealOptions?.dinnerAvailable ? (
                        <div
                          className={`dinner-selectable-card ${bookingForm.includeDinner ? 'active' : ''}`}
                          onClick={() => setBookingForm(prev => ({ ...prev, includeDinner: !prev.includeDinner }))}
                          role="checkbox"
                          aria-checked={bookingForm.includeDinner}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              setBookingForm(prev => ({ ...prev, includeDinner: !prev.includeDinner }));
                            }
                          }}
                        >
                          <div className="dinner-card-toggle">
                            <div className={`dinner-checkbox-indicator ${bookingForm.includeDinner ? 'checked' : ''}`}>
                              {bookingForm.includeDinner && <Check size={14} strokeWidth={3} />}
                            </div>
                          </div>
                          <div className="dinner-card-body">
                            <div className="dinner-card-top">
                              <span className="dinner-card-title">Traditional Homestay Family Dinner</span>
                              <span className="dinner-rate-pill">
                                +₹{bookingStay.mealOptions.dinnerCostPerPersonINR}/person/night
                              </span>
                            </div>
                            <p className="dinner-card-desc">
                              {bookingStay.mealOptions.description || "Authentic family-style dinner prepared fresh by your hosts with local regional ingredients."}
                            </p>
                            {bookingPricing.isValidDates && (
                              <div className="dinner-live-calc">
                                {bookingForm.includeDinner ? (
                                  <span className="dinner-calc-added">
                                    <Sparkles size={12} /> Added: +₹{bookingPricing.dinnerTotal.toLocaleString('en-IN')} total ({bookingPricing.guests} guest{bookingPricing.guests > 1 ? 's' : ''} × {bookingPricing.nights} night{bookingPricing.nights > 1 ? 's' : ''})
                                  </span>
                                ) : (
                                  <span className="dinner-calc-not-added">Click to add to your stay request</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="dinner-not-available-box">
                          <Info size={16} color="#3478F6" />
                          <span>
                            Daily authentic village breakfast is complimentary with this stay. Host {bookingStay.host?.name} can recommend local traditional eateries nearby.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Sticky Prominent Price Summary */}
                  <div className="booking-form-right-col">
                    <div className="price-summary-card">
                      <div className="price-summary-header">
                        <div className="section-title-wrap">
                          <span className="section-step-num">4</span>
                          <h3 className="price-summary-title">Price Summary</h3>
                        </div>
                        <span className="currency-note">INR (₹)</span>
                      </div>

                      <div className="price-breakdown-list">
                        <div className="price-line-item">
                          <span className="item-label">
                            ₹{bookingStay.nightlyRateINR.toLocaleString('en-IN')} × {bookingPricing.nights} Night{bookingPricing.nights > 1 ? 's' : ''}
                          </span>
                          <span className="item-amount">
                            ₹{bookingPricing.baseTotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {bookingPricing.cleaningFee > 0 && (
                          <div className="price-line-item">
                            <span className="item-label">Village Community & Cleaning Fund</span>
                            <span className="item-amount">
                              ₹{bookingPricing.cleaningFee.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}

                        {bookingStay.mealOptions?.dinnerAvailable && (
                          <div className={`price-line-item ${!bookingForm.includeDinner ? 'dimmed' : ''}`}>
                            <span className="item-label">
                              Traditional Dinner ({bookingPricing.guests} guest{bookingPricing.guests > 1 ? 's' : ''} × {bookingPricing.nights}N)
                            </span>
                            <span className="item-amount">
                              {bookingForm.includeDinner
                                ? `₹${bookingPricing.dinnerTotal.toLocaleString('en-IN')}`
                                : 'Not selected'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Prominent Estimated Total Box */}
                      <div className="price-prominent-total-box">
                        <div className="total-top-row">
                          <span className="total-main-label">Estimated Stay Total</span>
                          <span className="total-estimate-pill">Approval Required</span>
                        </div>
                        <div className="total-main-amount">
                          ₹{bookingPricing.estimatedTotal.toLocaleString('en-IN')}
                        </div>
                        <p className="total-guarantee-note">
                          * Total is an estimate until confirmed by your host. No payment is charged today.
                        </p>
                      </div>

                      {/* Action CTA Buttons */}
                      <div className="booking-actions-block">
                        <button
                          type="submit"
                          className="btn-send-stay-request"
                          disabled={!bookingPricing.isValidDates}
                        >
                          Send Stay Request
                          <ArrowRight size={18} />
                        </button>
                        <button
                          type="button"
                          className="btn-cancel-stay-request"
                          onClick={() => setBookingStay(null)}
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Trust & Guarantee points */}
                      <div className="booking-trust-points">
                        <div className="trust-point-item">
                          <Shield size={14} className="trust-icon" />
                          <span>Direct homestay booking with verified hosts</span>
                        </div>
                        <div className="trust-point-item">
                          <Clock size={14} className="trust-icon" />
                          <span>Host responds within 24 hours</span>
                        </div>
                        <div className="trust-point-item">
                          <Heart size={14} className="trust-icon" />
                          <span>100% of community fund directly supports local village</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
