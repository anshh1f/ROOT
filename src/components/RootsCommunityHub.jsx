import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Heart,
  Plus,
  X,
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  User,
  Sparkles,
  Send,
  Edit3,
  Check,
  Tag,
  FileText,
  ArrowLeft,
  Info,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Compass,
  Utensils,
  Mountain,
  Landmark,
  Share2,
  CornerDownRight,
  HelpCircle
} from 'lucide-react';
import {
  getCommunityDiaries,
  saveCommunityDiary,
  getCommunityPlaces,
  saveCommunityPlace,
  getCommunityExperiences,
  saveCommunityExperience,
  getModerationSubmissions,
  updateModerationStatus,
  getReportedItems,
  reportContent,
  updateReportStatus
} from '../data/communityHubData';

export function RootsCommunityHub({ onBackToHome, onOpenPlanner }) {
  // Navigation / active tabs
  const [activeTab, setActiveTab] = useState('diaries'); // 'diaries' | 'places' | 'experiences' | 'moderation'
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'approved' | 'pending' | 'draft'

  // Data states
  const [diaries, setDiaries] = useState(getCommunityDiaries);
  const [places, setPlaces] = useState(getCommunityPlaces);
  const [experiences, setExperiences] = useState(getCommunityExperiences);
  const [moderationQueue, setModerationQueue] = useState(getModerationSubmissions);
  const [reportedItems, setReportedItems] = useState(getReportedItems);

  // Likes state
  const [likedDiaries, setLikedDiaries] = useState(() => {
    try {
      const saved = localStorage.getItem('roots_community_diary_likes');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Modal states
  const [showCreateDiaryModal, setShowCreateDiaryModal] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showShareExpModal, setShowShareExpModal] = useState(false);
  const [activeDetailItem, setActiveDetailItem] = useState(null); // { type: 'diary'|'place'|'experience', data }
  const [activeReportItem, setActiveReportItem] = useState(null); // { type, id, title }
  const [moderationActionModal, setModerationActionModal] = useState(null); // { submission, action: 'reject'|'changes' }
  const [notification, setNotification] = useState('');

  // Refresh data from storage
  const reloadData = () => {
    setDiaries(getCommunityDiaries());
    setPlaces(getCommunityPlaces());
    setExperiences(getCommunityExperiences());
    setModerationQueue(getModerationSubmissions());
    setReportedItems(getReportedItems());
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  const handleToggleLike = (diaryId) => {
    const isLiked = !!likedDiaries[diaryId];
    const nextLikes = { ...likedDiaries, [diaryId]: !isLiked };
    setLikedDiaries(nextLikes);
    try {
      localStorage.setItem('roots_community_diary_likes', JSON.stringify(nextLikes));
    } catch (e) {}

    // Update count in state
    setDiaries(prev => prev.map(d => {
      if (d.id === diaryId) {
        return { ...d, likes: (d.likes || 0) + (isLiked ? -1 : 1) };
      }
      return d;
    }));
  };

  // Moderation actions
  const handleApproveSubmission = (sub) => {
    updateModerationStatus(sub.id, 'approved', 'Approved by administrator for public feed and trip planner.');
    reloadData();
    showToast(`✓ "${sub.title || sub.name}" has been approved! It is now live in the community feed and trip planner.`);
  };

  const handleModerationRejectOrChanges = (reason) => {
    if (!moderationActionModal) return;
    const { submission, action } = moderationActionModal;
    const newStatus = action === 'reject' ? 'rejected' : 'changes_requested';
    updateModerationStatus(submission.id, newStatus, reason);
    reloadData();
    setModerationActionModal(null);
    showToast(
      action === 'reject'
        ? `Submission rejected. Stored with note: "${reason}"`
        : `Changes requested. Feedback sent to contributor.`
    );
  };

  const handleHideReportedItem = (reportId) => {
    updateReportStatus(reportId, 'hidden');
    reloadData();
    showToast('Inappropriate item hidden from public display.');
  };

  const handleDismissReport = (reportId) => {
    updateReportStatus(reportId, 'dismissed');
    reloadData();
    showToast('Report dismissed.');
  };

  const handleReportSubmit = (reason, notes) => {
    if (!activeReportItem) return;
    reportContent(activeReportItem.type, activeReportItem.id, activeReportItem.title, reason, notes);
    reloadData();
    setActiveReportItem(null);
    showToast('Report submitted for community moderator review. Thank you for protecting the trail.');
  };

  // Counts
  const pendingCount = moderationQueue.filter(s => s.status === 'pending_review').length;
  const activeReportsCount = reportedItems.filter(r => r.status === 'active').length;

  // Filter lists
  const filterList = (items) => {
    return items.filter(item => {
      // Destination filter
      if (selectedDestinationFilter !== 'all') {
        const destId = item.destinationId || '';
        const destName = (item.destination || '').toLowerCase();
        if (destId !== selectedDestinationFilter && !destName.includes(selectedDestinationFilter)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Category filter (for places/experiences)
      if (selectedCategoryFilter !== 'all' && item.category && item.category !== selectedCategoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.title || item.name || ''} ${item.destination || ''} ${item.description || item.story || ''} ${item.contributor?.name || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  };

  const visibleDiaries = filterList(diaries);
  const visiblePlaces = filterList(places);
  const visibleExperiences = filterList(experiences);

  return (
    <div className="community-hub-page">
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
            {/* Quick trigger for moderation dashboard simulation */}
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'moderation' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('moderation')}
              title="Open demonstration admin moderation panel"
            >
              <ShieldCheck size={15} />
              <span>Moderation Dashboard</span>
              {pendingCount > 0 && (
                <span className="nav-badge-pill" style={{ marginLeft: '6px', background: '#ef4444' }}>
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Contribution Dropdown / Trigger */}
            <div className="contribute-btn-group">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (activeTab === 'places') setShowAddPlaceModal(true);
                  else if (activeTab === 'experiences') setShowShareExpModal(true);
                  else setShowCreateDiaryModal(true);
                }}
              >
                <Plus size={16} />
                <span>
                  {activeTab === 'places'
                    ? 'Add Place / Food Spot'
                    : activeTab === 'experiences'
                    ? 'Share Local Experience'
                    : 'Write a Travel Diary'}
                </span>
              </button>
            </div>
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

      {/* Community Hero Banner */}
      <section className="container community-hero-section" style={{ paddingTop: '28px', paddingBottom: '16px' }}>
        <div className="community-hero-card card-white" style={{
          padding: '36px 40px',
          background: 'radial-gradient(circle at 90% 10%, rgba(234, 243, 255, 0.8) 0%, #ffffff 80%)',
          borderRadius: '16px',
          border: '1px solid #E2E8F0'
        }}>
          <div className="header-badge-row" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
            <span className="section-tag" style={{ marginBottom: 0 }}>
              <BookOpen size={14} />
              ROOTS Community Knowledge
            </span>
            <span className="sample-badge">Curated Demonstration Entries</span>
          </div>

          <h1 className="connect-hero-title">Authentic Travel Intelligence, Shared by Explorers</h1>
          <p className="connect-hero-subtitle">
            Community-contributed travel diaries, unmapped clay hearth eateries, living root trails, 
            and artisan workshops. Every approved submission enriches the ROOTS Trip Planner recommendations.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowCreateDiaryModal(true)}
            >
              <FileText size={14} />
              <span>Create Travel Diary</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowAddPlaceModal(true)}
            >
              <MapPin size={14} />
              <span>Add Place or Food Spot</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowShareExpModal(true)}
            >
              <Sparkles size={14} />
              <span>Share a Local Experience</span>
            </button>
            {onOpenPlanner && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onOpenPlanner}
                style={{ color: '#3478F6' }}
              >
                <span>Plan Trip using this Knowledge →</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Category Tabs */}
      <section className="container" style={{ marginBottom: '24px' }}>
        <div className="community-tabs-nav" style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #E2E8F0',
          paddingBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            className={`community-nav-tab ${activeTab === 'diaries' ? 'active' : ''}`}
            onClick={() => { setActiveTab('diaries'); setSelectedCategoryFilter('all'); }}
          >
            <BookOpen size={16} />
            <span>Travel Diaries ({diaries.length})</span>
          </button>

          <button
            type="button"
            className={`community-nav-tab ${activeTab === 'places' ? 'active' : ''}`}
            onClick={() => { setActiveTab('places'); setSelectedCategoryFilter('all'); }}
          >
            <MapPin size={16} />
            <span>Places & Food Spots ({places.length})</span>
          </button>

          <button
            type="button"
            className={`community-nav-tab ${activeTab === 'experiences' ? 'active' : ''}`}
            onClick={() => { setActiveTab('experiences'); setSelectedCategoryFilter('all'); }}
          >
            <Sparkles size={16} />
            <span>Local Experiences & Workshops ({experiences.length})</span>
          </button>

          <button
            type="button"
            className={`community-nav-tab ${activeTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            <ShieldCheck size={16} />
            <span>Moderation Dashboard</span>
            {pendingCount > 0 && (
              <span className="tab-count-badge incoming" style={{ marginLeft: '6px' }}>
                {pendingCount} pending
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Filter & Search Bar (Only shown for public tabs) */}
      {activeTab !== 'moderation' && (
        <section className="container connect-controls-section" style={{ marginBottom: '28px' }}>
          <div className="controls-row">
            {/* Search Input */}
            <div className="connect-search-box" style={{ maxWidth: '440px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="connect-search-input"
                placeholder={`Search ${activeTab} by title, location, contributor, or tag...`}
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

            {/* Status Filter (All vs Approved vs Draft) */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Status:</span>
              <select
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Submissions</option>
                <option value="approved">Approved & Vetted Only</option>
                <option value="pending_review">Pending Review</option>
                <option value="draft">My Drafts</option>
              </select>
            </div>
          </div>

          {/* Destination Filter Chips */}
          <div className="destination-chips-row" style={{ marginTop: '12px' }}>
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
              Varkala
            </button>
            <button
              type="button"
              className={`dest-filter-chip ${selectedDestinationFilter === 'meghalaya' ? 'active' : ''}`}
              onClick={() => setSelectedDestinationFilter('meghalaya')}
            >
              Nongriat / Meghalaya
            </button>
            <button
              type="button"
              className={`dest-filter-chip ${selectedDestinationFilter === 'spiti' ? 'active' : ''}`}
              onClick={() => setSelectedDestinationFilter('spiti')}
            >
              Spiti Valley
            </button>
            <button
              type="button"
              className={`dest-filter-chip ${selectedDestinationFilter === 'coorg' ? 'active' : ''}`}
              onClick={() => setSelectedDestinationFilter('coorg')}
            >
              Coorg
            </button>
            <button
              type="button"
              className={`dest-filter-chip ${selectedDestinationFilter === 'ziro' ? 'active' : ''}`}
              onClick={() => setSelectedDestinationFilter('ziro')}
            >
              Ziro Valley
            </button>
            <button
              type="button"
              className={`dest-filter-chip ${selectedDestinationFilter === 'hampi' ? 'active' : ''}`}
              onClick={() => setSelectedDestinationFilter('hampi')}
            >
              Hampi / Anegundi
            </button>
          </div>

          {/* Category Filter Chips for Places / Experiences */}
          {activeTab === 'places' && (
            <div className="destination-chips-row" style={{ marginTop: '8px', background: '#F8FBFF' }}>
              <span className="chips-title">Category:</span>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('all')}
              >
                All Categories
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'food' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('food')}
              >
                Local Food Spots
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'nature' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('nature')}
              >
                Nature & Waterways
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'hiking' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('hiking')}
              >
                Trails & Hiking
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'culture' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('culture')}
              >
                Culture & Sacred Groves
              </button>
            </div>
          )}

          {activeTab === 'experiences' && (
            <div className="destination-chips-row" style={{ marginTop: '8px', background: '#F8FBFF' }}>
              <span className="chips-title">Experience Type:</span>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('all')}
              >
                All Experiences
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'cultural_workshop' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('cultural_workshop')}
              >
                Cultural Workshops
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'traditional_food' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('traditional_food')}
              >
                Food Traditions
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'art_craft' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('art_craft')}
              >
                Art & Craft
              </button>
              <button
                type="button"
                className={`dest-filter-chip ${selectedCategoryFilter === 'language_tip' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('language_tip')}
              >
                Dialect & Language
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 1: TRAVEL DIARIES FEED
          ===================================================================== */}
      {activeTab === 'diaries' && (
        <section className="container">
          {visibleDiaries.length === 0 ? (
            <div className="empty-discovery-card card-white">
              <BookOpen size={40} className="empty-icon" />
              <h3>No travel diaries match your current search</h3>
              <p>Try resetting destination filters or contribute your own story from the road.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowCreateDiaryModal(true)}
              >
                <Plus size={16} />
                <span>Write the First Diary</span>
              </button>
            </div>
          ) : (
            <div className="community-diaries-grid">
              {visibleDiaries.map(diary => (
                <article key={diary.id} className="community-diary-card card-white">
                  {/* Card Cover Photo */}
                  <div className="diary-card-cover-wrapper">
                    <img
                      src={diary.cover || diary.photos?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
                      alt={diary.title}
                      className="diary-card-cover"
                      loading="lazy"
                    />
                    <div className="diary-card-cover-overlay">
                      <span className="diary-dest-badge">
                        <MapPin size={12} />
                        {diary.destination}
                      </span>
                      <span className={`status-pill-small status-${diary.status}`}>
                        {diary.status === 'approved' && '✓ Approved'}
                        {diary.status === 'pending_review' && '⏳ Pending Review'}
                        {diary.status === 'changes_requested' && '✎ Changes Needed'}
                        {diary.status === 'rejected' && '✕ Rejected'}
                        {diary.status === 'draft' && 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="diary-card-body">
                    {/* Contributor Row */}
                    <div className="diary-contributor-row">
                      <div className="contributor-profile">
                        <img
                          src={diary.contributor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                          alt={diary.contributor?.name || 'Contributor'}
                          className="contributor-avatar-small"
                        />
                        <div>
                          <strong className="contributor-name">{diary.contributor?.name || 'Explorer'}</strong>
                          <span className="contributor-origin">{diary.contributor?.origin || diary.tripDates}</span>
                        </div>
                      </div>

                      <div className="diary-date-tag">
                        <Calendar size={13} />
                        <span>{diary.tripDates}</span>
                      </div>
                    </div>

                    <h3 className="diary-card-title">{diary.title}</h3>
                    <p className="diary-card-snippet">{diary.story?.slice(0, 160)}...</p>

                    {/* Expenses Highlight (Actual vs Estimated Distinction) */}
                    <div className="diary-expense-badge-box">
                      <div className={`expense-distinction-tag ${diary.expenseType === 'actual' ? 'tag-actual' : 'tag-estimated'}`}>
                        <DollarSign size={13} />
                        <span>
                          {diary.expenseType === 'actual' ? 'Actual Incurred:' : 'Estimated Approx:'} ₹{diary.expensesINR?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {diary.isApproximate && (
                        <span className="approximate-flag-pill" title="Information is approximate or not personally verified">
                          ⚠️ Approximate
                        </span>
                      )}
                    </div>

                    {/* Visited highlights preview */}
                    {diary.placesVisited && diary.placesVisited.length > 0 && (
                      <div className="diary-highlights-preview">
                        <small>Places Visited:</small>
                        <div className="chips-mini-row">
                          {diary.placesVisited.slice(0, 3).map((pl, idx) => (
                            <span key={idx} className="mini-chip">{pl}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {diary.tags && diary.tags.length > 0 && (
                      <div className="diary-tags-row">
                        {diary.tags.map((tg, i) => (
                          <span key={i} className="diary-tag-pill">#{tg}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="diary-card-footer">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-read-diary"
                      onClick={() => setActiveDetailItem({ type: 'diary', data: diary })}
                    >
                      <Eye size={15} />
                      <span>Read Story & Tips</span>
                    </button>

                    <div className="diary-social-actions">
                      <button
                        type="button"
                        className={`btn-like-icon ${likedDiaries[diary.id] ? 'liked' : ''}`}
                        onClick={() => handleToggleLike(diary.id)}
                        title="Like this diary"
                        aria-label="Like this diary"
                      >
                        <Heart size={16} fill={likedDiaries[diary.id] ? '#ef4444' : 'none'} color={likedDiaries[diary.id] ? '#ef4444' : '#64748B'} />
                        <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>{diary.likes || 0}</span>
                      </button>

                      <button
                        type="button"
                        className="btn-icon-safety"
                        onClick={() => setActiveReportItem({ type: 'diary', id: diary.id, title: diary.title })}
                        title="Report inappropriate or misleading content"
                        aria-label="Report diary"
                      >
                        <AlertTriangle size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 2: PLACES & FOOD SPOTS FEED
          ===================================================================== */}
      {activeTab === 'places' && (
        <section className="container">
          {visiblePlaces.length === 0 ? (
            <div className="empty-discovery-card card-white">
              <MapPin size={40} className="empty-icon" />
              <h3>No places or food spots match your search</h3>
              <p>Be the first to share an authentic village tea stall, estuary trail, or clay hearth spot!</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddPlaceModal(true)}
              >
                <Plus size={16} />
                <span>Add Place or Food Spot</span>
              </button>
            </div>
          ) : (
            <div className="community-places-grid">
              {visiblePlaces.map(place => (
                <div key={place.id} className="community-place-card card-white">
                  <div className="place-card-image-wrap">
                    <img
                      src={place.photos?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'}
                      alt={place.name}
                      className="place-card-image"
                      loading="lazy"
                    />
                    <div className="place-image-overlay-tags">
                      <span className="category-pill-tag">
                        {place.category === 'food' && <Utensils size={12} />}
                        {place.category === 'hiking' && <Mountain size={12} />}
                        {place.category === 'nature' && <Compass size={12} />}
                        {place.category === 'culture' && <Landmark size={12} />}
                        <span style={{ textTransform: 'capitalize' }}>{place.category}</span>
                      </span>

                      <span className={`status-pill-small status-${place.status}`}>
                        {place.status === 'approved' && '✓ Approved'}
                        {place.status === 'pending_review' && '⏳ Pending'}
                        {place.status === 'changes_requested' && '✎ Changes'}
                        {place.status === 'rejected' && '✕ Rejected'}
                      </span>
                    </div>
                  </div>

                  <div className="place-card-content">
                    <div className="place-location-header">
                      <MapPin size={14} className="location-pin-icon" />
                      <div>
                        <strong className="place-destination-text">{place.destination}</strong>
                        <span className="place-village-text">{place.village}</span>
                      </div>
                    </div>

                    <h3 className="place-title">{place.name}</h3>
                    <p className="place-description">{place.description}</p>

                    {/* Metadata details */}
                    <div className="place-details-grid">
                      <div className="detail-mini-item">
                        <small>Price Range:</small>
                        <strong>{place.priceRangeINR || 'Free'}</strong>
                      </div>

                      <div className="detail-mini-item">
                        <small>Best Time:</small>
                        <span>{place.bestTime || 'Anytime'}</span>
                      </div>
                    </div>

                    {/* Safety & Accessibility */}
                    {place.safetyNotes && (
                      <div className="place-safety-callout">
                        <ShieldAlert size={14} className="safety-note-icon" />
                        <div>
                          <small>Safety Note:</small>
                          <p>{place.safetyNotes}</p>
                        </div>
                      </div>
                    )}

                    {place.accessibilityDetails && (
                      <div className="place-accessibility-note">
                        <small>Accessibility: {place.accessibilityDetails}</small>
                      </div>
                    )}

                    {/* Contributor & Approximate Warning */}
                    <div className="place-card-meta-bar">
                      <span className="contributor-credit">
                        Contributed by <strong>{place.contributor?.name || 'Community Member'}</strong> ({place.visitDate})
                      </span>
                      {place.isApproximate && (
                        <span className="approximate-flag-pill" title="Information is approximate or not personally verified">
                          ⚠️ Approximate
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Place Actions */}
                  <div className="place-card-footer">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveDetailItem({ type: 'place', data: place })}
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      className="btn-icon-safety"
                      onClick={() => setActiveReportItem({ type: 'place', id: place.id, title: place.name })}
                      title="Report misleading place information"
                    >
                      <AlertTriangle size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 3: LOCAL EXPERIENCES FEED
          ===================================================================== */}
      {activeTab === 'experiences' && (
        <section className="container">
          {visibleExperiences.length === 0 ? (
            <div className="empty-discovery-card card-white">
              <Sparkles size={40} className="empty-icon" />
              <h3>No cultural activities or workshops found</h3>
              <p>Share a traditional cooking lesson, bamboo crafting demo, or language exchange.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowShareExpModal(true)}
              >
                <Plus size={16} />
                <span>Share an Experience</span>
              </button>
            </div>
          ) : (
            <div className="community-experiences-grid">
              {visibleExperiences.map(exp => (
                <div key={exp.id} className="community-experience-card card-white">
                  <div className="exp-card-header">
                    <div className="exp-category-badge">
                      <Sparkles size={14} />
                      <span style={{ textTransform: 'capitalize' }}>{exp.category?.replace('_', ' ')}</span>
                    </div>
                    <span className={`status-pill-small status-${exp.status}`}>
                      {exp.status === 'approved' && '✓ Approved'}
                      {exp.status === 'pending_review' && '⏳ Pending'}
                      {exp.status === 'changes_requested' && '✎ Changes'}
                      {exp.status === 'rejected' && '✕ Rejected'}
                    </span>
                  </div>

                  <h3 className="exp-card-title">{exp.title}</h3>
                  <p className="exp-card-description">{exp.description}</p>

                  <div className="exp-params-box">
                    <div className="exp-param-item">
                      <MapPin size={14} />
                      <span>{exp.destination} ({exp.village})</span>
                    </div>
                    <div className="exp-param-item">
                      <Clock size={14} />
                      <span>Duration: {exp.duration}</span>
                    </div>
                    <div className="exp-param-item">
                      <DollarSign size={14} />
                      <span>Est. Cost: ₹{exp.estimatedCostINR?.toLocaleString('en-IN')}</span>
                    </div>
                    {exp.bookingRequirements && (
                      <div className="exp-param-item">
                        <Info size={14} />
                        <span>Booking: {exp.bookingRequirements}</span>
                      </div>
                    )}
                  </div>

                  {exp.safetyAndPermissionNotes && (
                    <div className="exp-permission-callout">
                      <Shield size={14} />
                      <span><strong>Etiquette & Permissions:</strong> {exp.safetyAndPermissionNotes}</span>
                    </div>
                  )}

                  <div className="exp-contributor-row">
                    <small>Shared by {exp.contributor?.name} ({exp.contributor?.role || 'Local Artisan'})</small>
                    <button
                      type="button"
                      className="btn-icon-safety"
                      onClick={() => setActiveReportItem({ type: 'experience', id: exp.id, title: exp.title })}
                      title="Report experience"
                    >
                      <AlertTriangle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 4: MODERATION DASHBOARD (ADMIN-ONLY SIMULATION)
          ===================================================================== */}
      {activeTab === 'moderation' && (
        <section className="container moderation-dashboard-section">
          {/* Moderation Admin Banner */}
          <div className="moderation-header-card card-white" style={{
            padding: '24px 28px',
            marginBottom: '24px',
            borderLeft: '4px solid #123B73'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div className="header-badge-row" style={{ justifyContent: 'flex-start', marginBottom: '6px' }}>
                  <span className="section-tag" style={{ marginBottom: 0 }}>
                    <ShieldCheck size={14} />
                    ROOTS Community Moderation Dashboard
                  </span>
                  <span className="sample-badge">Admin Prototype Simulation</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: '#123B73', margin: '4px 0' }}>Review Community Submissions</h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
                  Only <strong>Approved</strong> entries appear in the public feed and become recommendation entries 
                  in the ROOTS Trip Planner. <em>Pending</em> or <em>Rejected</em> entries are strictly excluded from itinerary generation.
                </p>
              </div>

              <div className="moderation-stats-pill-group">
                <span className="mod-stat-pill pending">
                  <strong>{pendingCount}</strong> Pending
                </span>
                <span className="mod-stat-pill reports">
                  <strong>{activeReportsCount}</strong> Reports
                </span>
                <span className="mod-stat-pill approved">
                  <strong>{moderationQueue.filter(s => s.status === 'approved').length}</strong> Processed
                </span>
              </div>
            </div>
          </div>

          {/* Pending Submissions Queue */}
          <div className="moderation-section-title-row">
            <h3>Pending Community Submissions ({pendingCount})</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Requires administrator evaluation before public publication & planner indexing.
            </span>
          </div>

          {moderationQueue.filter(s => s.status === 'pending_review').length === 0 ? (
            <div className="empty-discovery-card card-white" style={{ marginBottom: '32px' }}>
              <CheckCircle2 size={36} style={{ color: '#10B981' }} />
              <h4>Moderation queue is clean!</h4>
              <p>No pending submissions awaiting review. You can create a new diary or place to test the submission flow.</p>
            </div>
          ) : (
            <div className="moderation-queue-list" style={{ marginBottom: '36px' }}>
              {moderationQueue.filter(s => s.status === 'pending_review').map(sub => (
                <div key={sub.id} className="moderation-item-card card-white">
                  <div className="mod-item-header">
                    <div className="mod-type-badge">
                      <span style={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '0.72rem' }}>
                        {sub.submissionType} submission
                      </span>
                      <span className="mod-dest-tag">{sub.destination}</span>
                    </div>
                    <span className="mod-timestamp">
                      Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mod-title">{sub.title || sub.name}</h3>
                  <p className="mod-description">{sub.description || sub.story}</p>

                  {/* Submission Specific Metadata Preview */}
                  <div className="mod-preview-meta">
                    {sub.submissionType === 'diary' && (
                      <div className="mod-meta-row">
                        <span>Dates: <strong>{sub.tripDates}</strong></span>
                        <span>Expense ({sub.expenseType}): <strong>₹{sub.expensesINR?.toLocaleString('en-IN')}</strong></span>
                        <span>Places: <strong>{(sub.placesVisited || []).join(', ')}</strong></span>
                      </div>
                    )}
                    {sub.submissionType === 'place' && (
                      <div className="mod-meta-row">
                        <span>Category: <strong>{sub.category}</strong></span>
                        <span>Price Range: <strong>{sub.priceRangeINR}</strong></span>
                        <span>Village: <strong>{sub.village}</strong></span>
                        <span>Safety: <strong>{sub.safetyNotes || 'None entered'}</strong></span>
                      </div>
                    )}
                    {sub.submissionType === 'experience' && (
                      <div className="mod-meta-row">
                        <span>Duration: <strong>{sub.duration}</strong></span>
                        <span>Cost: <strong>₹{sub.estimatedCostINR}</strong></span>
                        <span>Booking: <strong>{sub.bookingRequirements}</strong></span>
                      </div>
                    )}
                    <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#64748B' }}>
                      Contributor: <strong>{sub.contributor?.name || 'Explorer'}</strong> • 
                      {sub.isApproximate ? ' ⚠️ Flagged as Approximate / Unverified by author' : ' Marked as personal first-hand visit'}
                    </div>
                  </div>

                  {/* Moderation Actions Bar */}
                  <div className="mod-actions-bar">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-approve"
                      onClick={() => handleApproveSubmission(sub)}
                      title="Approve submission and add to public feed + planner dataset"
                    >
                      <Check size={16} />
                      <span>Approve for Public & Planner</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-request-changes"
                      onClick={() => setModerationActionModal({ submission: sub, action: 'changes' })}
                    >
                      <Edit3 size={15} />
                      <span>Request Changes</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-reject"
                      onClick={() => setModerationActionModal({ submission: sub, action: 'reject' })}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      <X size={15} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reported Content Management */}
          <div className="moderation-section-title-row" style={{ marginTop: '24px' }}>
            <h3>Reported Content & Safety Queue ({activeReportsCount})</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Flagged entries by community members for inappropriate conduct, erosion, or false commercial tours.
            </span>
          </div>

          {reportedItems.length === 0 ? (
            <div className="empty-discovery-card card-white">
              <ShieldCheck size={36} style={{ color: '#10B981' }} />
              <h4>No reported items</h4>
              <p>No safety or guideline violation reports have been logged.</p>
            </div>
          ) : (
            <div className="reported-items-list" style={{ marginBottom: '40px' }}>
              {reportedItems.map(report => (
                <div key={report.id} className="report-item-card card-white">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span className="report-target-tag">{report.targetType}: {report.targetTitle}</span>
                      <h4 style={{ margin: '6px 0 2px 0', color: '#991B1B' }}>
                        Reason: {report.reportedReason}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
                        Notes: {report.notes || 'No notes provided'} • Reported by: <em>{report.reportedBy || 'Anonymous traveler'}</em>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`status-pill-small status-${report.status}`}>
                        {report.status}
                      </span>
                      {report.status === 'active' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => handleHideReportedItem(report.id)}
                            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          >
                            Hide Entry
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => handleDismissReport(report.id)}
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Submissions Status History */}
          <div className="moderation-section-title-row">
            <h3>Recent Moderation History</h3>
          </div>
          <div className="card-white" style={{ padding: '20px' }}>
            <div className="status-history-table">
              {moderationQueue.slice(0, 8).map(sub => (
                <div key={sub.id} className="history-row" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #E2E8F0',
                  fontSize: '0.85rem',
                  gap: '12px'
                }}>
                  <div>
                    <strong>{sub.title || sub.name}</strong>
                    <div style={{ color: '#64748B', fontSize: '0.78rem' }}>
                      {sub.submissionType} • {sub.destination} • Contributor: {sub.contributor?.name || 'Explorer'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`status-pill-small status-${sub.status}`}>
                      {sub.status}
                    </span>
                    {sub.moderationNotes && (
                      <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '320px', marginTop: '2px' }}>
                        {sub.moderationNotes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          MODAL 1: CREATE A TRAVEL DIARY
          ===================================================================== */}
      {showCreateDiaryModal && (
        <CreateDiaryModal
          onClose={() => setShowCreateDiaryModal(false)}
          onSave={(diaryData, isDraft) => {
            saveCommunityDiary(diaryData, isDraft);
            reloadData();
            setShowCreateDiaryModal(false);
            showToast(
              isDraft
                ? 'Travel Diary saved as Draft! You can view and edit it anytime.'
                : 'Travel Diary submitted for moderation review! It will appear after admin review.'
            );
          }}
        />
      )}

      {/* =====================================================================
          MODAL 2: ADD A PLACE OR FOOD SPOT
          ===================================================================== */}
      {showAddPlaceModal && (
        <AddPlaceModal
          onClose={() => setShowAddPlaceModal(false)}
          onSave={(placeData, isDraft) => {
            saveCommunityPlace(placeData, isDraft);
            reloadData();
            setShowAddPlaceModal(false);
            showToast(
              isDraft
                ? 'Place saved as Draft.'
                : 'Place submitted for moderation review! Once approved, it will be added to the Trip Planner recommendations.'
            );
          }}
        />
      )}

      {/* =====================================================================
          MODAL 3: SHARE A LOCAL EXPERIENCE
          ===================================================================== */}
      {showShareExpModal && (
        <ShareExperienceModal
          onClose={() => setShowShareExpModal(false)}
          onSave={(expData, isDraft) => {
            saveCommunityExperience(expData, isDraft);
            reloadData();
            setShowShareExpModal(false);
            showToast(
              isDraft
                ? 'Local experience saved as Draft.'
                : 'Experience submitted for community review! Once approved, it will be added to the Trip Planner.'
            );
          }}
        />
      )}

      {/* =====================================================================
          MODAL 4: FULL DIARY / PLACE / EXPERIENCE DETAIL MODAL
          ===================================================================== */}
      {activeDetailItem && (
        <DetailReaderModal
          item={activeDetailItem}
          onClose={() => setActiveDetailItem(null)}
          onReport={() => {
            const it = activeDetailItem.data;
            setActiveReportItem({
              type: activeDetailItem.type,
              id: it.id,
              title: it.title || it.name
            });
            setActiveDetailItem(null);
          }}
        />
      )}

      {/* =====================================================================
          MODAL 5: REPORT CONTENT MODAL
          ===================================================================== */}
      {activeReportItem && (
        <ReportContentModal
          target={activeReportItem}
          onClose={() => setActiveReportItem(null)}
          onSubmit={handleReportSubmit}
        />
      )}

      {/* =====================================================================
          MODAL 6: MODERATION REJECT / REQUEST CHANGES MODAL
          ===================================================================== */}
      {moderationActionModal && (
        <ModerationReasonModal
          action={moderationActionModal.action}
          submission={moderationActionModal.submission}
          onClose={() => setModerationActionModal(null)}
          onSubmit={handleModerationRejectOrChanges}
        />
      )}
    </div>
  );
}

// =====================================================================
// SUB-COMPONENT: CREATE TRAVEL DIARY MODAL
// =====================================================================
function CreateDiaryModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('Varkala Cliff & Backwaters');
  const [destinationId, setDestinationId] = useState('varkala');
  const [tripDates, setTripDates] = useState('');
  const [story, setStory] = useState('');
  const [placesVisited, setPlacesVisited] = useState('');
  const [foodDiscovered, setFoodDiscovered] = useState('');
  const [activities, setActivities] = useState('');
  const [expenseType, setExpenseType] = useState('actual'); // 'actual' | 'estimated'
  const [expensesINR, setExpensesINR] = useState('');
  const [expenseBreakdown, setExpenseBreakdown] = useState('');
  const [travellerTips, setTravellerTips] = useState('');
  const [tags, setTags] = useState('Local Food, Hiking, Meeting Locals');
  const [contributorName, setContributorName] = useState('');
  const [contributorOrigin, setContributorOrigin] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80');
  const [isApproximate, setIsApproximate] = useState(false);

  const handleSubmit = (e, isDraft = false) => {
    e.preventDefault();
    if (!title.trim() || !story.trim()) return;

    const diaryData = {
      title: title.trim(),
      destination,
      destinationId,
      tripDates: tripDates.trim() || 'Autumn 2026',
      story: story.trim(),
      cover: coverPhoto,
      photos: [coverPhoto],
      placesVisited: placesVisited ? placesVisited.split(',').map(s => s.trim()).filter(Boolean) : [],
      foodDiscovered: foodDiscovered ? foodDiscovered.split(',').map(s => s.trim()).filter(Boolean) : [],
      activities: activities ? activities.split(',').map(s => s.trim()).filter(Boolean) : [],
      expenseType,
      expensesINR: parseInt(expensesINR, 10) || 0,
      expenseBreakdown: expenseBreakdown.trim(),
      travellerTips: travellerTips.trim(),
      tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : ['Community Story'],
      contributor: {
        name: contributorName.trim() || 'Explorer',
        origin: contributorOrigin.trim() || 'Community Member',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      isApproximate
    };

    onSave(diaryData, isDraft);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog diary-form-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-body-content">
          <div className="header-badge-row" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
            <span className="section-tag" style={{ marginBottom: 0 }}>
              <BookOpen size={14} />
              Create a Travel Diary
            </span>
          </div>
          <h2 className="modal-title">Share Your Slow Travel Journey</h2>
          <p className="modal-subtitle">Document personal insights, authentic food discoveries, and actual expenses for fellow community travelers.</p>

          <form onSubmit={e => handleSubmit(e, false)} className="community-submission-form">
            <div className="form-group">
              <label className="form-label">Diary Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Quiet Canals & Coconut Hearth: 5 Days Beyond the Tourist Cliff"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Destination *</label>
                <select
                  className="form-select"
                  value={destinationId}
                  onChange={e => {
                    setDestinationId(e.target.value);
                    const opt = e.target.options[e.target.selectedIndex];
                    setDestination(opt.text);
                  }}
                >
                  <option value="varkala">Varkala Cliff & Backwaters</option>
                  <option value="meghalaya">Nongriat & Cherrapunji</option>
                  <option value="spiti">Spiti Valley & Pin Valley</option>
                  <option value="coorg">Madikeri & Coorg Highlands</option>
                  <option value="ziro">Ziro Pine Valley</option>
                  <option value="hampi">Anegundi & Hampi Beyond Ruins</option>
                  <option value="gokarna">Gokarna Coastal Trails</option>
                  <option value="wayanad">Wayanad Rainforest Foothills</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trip Dates *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Nov 12 – Nov 17, 2026"
                  value={tripDates}
                  onChange={e => setTripDates(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Story & Experience *</label>
              <textarea
                className="form-textarea"
                rows="5"
                placeholder="Describe your journey, encounters with elders or artisans, and what made the slow route special..."
                value={story}
                onChange={e => setStory(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Places Visited</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Comma separated (e.g. Edava Estuary, Kappil Sand Spit)"
                  value={placesVisited}
                  onChange={e => setPlacesVisited(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Food Discovered</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Clay Hearth Sadya, Tapioca with Chutney"
                  value={foodDiscovered}
                  onChange={e => setFoodDiscovered(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Activities Experienced</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Coracle rowboat, Net hauling"
                  value={activities}
                  onChange={e => setActivities(e.target.value)}
                />
              </div>
            </div>

            {/* Expenses Section with clear actual vs estimated distinction */}
            <div className="form-card-subgroup" style={{ background: '#F8FBFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <label className="form-label" style={{ marginBottom: '8px', color: '#123B73', fontWeight: 800 }}>
                Expenses Distinction (Actual vs Estimated) *
              </label>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="radio"
                    name="expenseType"
                    checked={expenseType === 'actual'}
                    onChange={() => setExpenseType('actual')}
                  />
                  <span><strong>Actual Expenses Incurred</strong> (from personal receipts/log)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="radio"
                    name="expenseType"
                    checked={expenseType === 'estimated'}
                    onChange={() => setExpenseType('estimated')}
                  />
                  <span><strong>Estimated Approximate Expenses</strong> (recollection / guidance)</span>
                </label>
              </div>

              <div className="form-row-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Total Expense in INR (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 14500"
                    value={expensesINR}
                    onChange={e => setExpensesINR(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Optional Expense Breakdown</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Stay: ₹6,000, Food: ₹3,500, Local transport: ₹2,000"
                    value={expenseBreakdown}
                    onChange={e => setExpenseBreakdown(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tips for Future Travelers</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="e.g. Bring a water canteen; avoid tourist taxi stands; best auto rickshaws wait near the railway crossing..."
                value={travellerTips}
                onChange={e => setTravellerTips(e.target.value)}
              ></textarea>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Siddharth Menon"
                  value={contributorName}
                  onChange={e => setContributorName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Home Origin</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kochi, Kerala"
                  value={contributorOrigin}
                  onChange={e => setContributorOrigin(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Local Food, Hiking, Meeting Locals, Cultural"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="approxCheck"
                checked={isApproximate}
                onChange={e => setIsApproximate(e.target.checked)}
              />
              <label htmlFor="approxCheck" style={{ fontSize: '0.85rem', color: '#64748B', cursor: 'pointer' }}>
                Note: Some details are approximate and have not been independently audited.
              </label>
            </div>

            {/* Modal Actions */}
            <div className="modal-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={e => handleSubmit(e, true)}
                title="Save draft locally without submitting for review"
              >
                Save as Draft
              </button>

              <button type="submit" className="btn btn-primary">
                <Send size={16} />
                <span>Submit for Community Review</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUB-COMPONENT: ADD A PLACE OR FOOD SPOT MODAL
// =====================================================================
function AddPlaceModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [destinationId, setDestinationId] = useState('varkala');
  const [destination, setDestination] = useState('Varkala Cliff & Backwaters');
  const [village, setVillage] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [approximateLocation, setApproximateLocation] = useState('');
  const [priceRangeINR, setPriceRangeINR] = useState('₹150 – ₹300');
  const [estimatedCostINR, setEstimatedCostINR] = useState('200');
  const [bestTime, setBestTime] = useState('12:00 PM – 02:30 PM (Lunch)');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [accessibilityDetails, setAccessibilityDetails] = useState('');
  const [visitDate, setVisitDate] = useState('October 2026');
  const [contributorName, setContributorName] = useState('');
  const [isApproximate, setIsApproximate] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80');

  const handleSubmit = (e, isDraft = false) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const placeData = {
      name: name.trim(),
      destination,
      destinationId,
      village: village.trim() || 'Local Hamlet',
      category,
      description: description.trim(),
      approximateLocation: approximateLocation.trim(),
      photos: [photoUrl],
      priceRangeINR,
      estimatedCostINR: parseInt(estimatedCostINR, 10) || 0,
      bestTime: bestTime.trim(),
      safetyNotes: safetyNotes.trim(),
      accessibilityDetails: accessibilityDetails.trim(),
      visitDate: visitDate.trim(),
      contributor: {
        name: contributorName.trim() || 'Explorer',
        notes: 'Community Contributor'
      },
      isApproximate
    };

    onSave(placeData, isDraft);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog diary-form-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-body-content">
          <div className="header-badge-row" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
            <span className="section-tag" style={{ marginBottom: 0 }}>
              <MapPin size={14} />
              Add a Place or Food Spot
            </span>
          </div>
          <h2 className="modal-title">Contribute an Authentic Local Place</h2>
          <p className="modal-subtitle">Share hidden coves, family eateries, or historic craft centers. Once approved, this will become an itinerary recommendation.</p>

          <form onSubmit={e => handleSubmit(e, false)} className="community-submission-form">
            <div className="form-group">
              <label className="form-label">Place or Food Spot Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ammachi's Clay Pot Hearth Sadya"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Destination Region *</label>
                <select
                  className="form-select"
                  value={destinationId}
                  onChange={e => {
                    setDestinationId(e.target.value);
                    const opt = e.target.options[e.target.selectedIndex];
                    setDestination(opt.text);
                  }}
                >
                  <option value="varkala">Varkala Cliff & Backwaters</option>
                  <option value="meghalaya">Nongriat & Cherrapunji</option>
                  <option value="spiti">Spiti Valley & Pin Valley</option>
                  <option value="coorg">Madikeri & Coorg Highlands</option>
                  <option value="ziro">Ziro Pine Valley</option>
                  <option value="hampi">Anegundi & Hampi Beyond Ruins</option>
                  <option value="gokarna">Gokarna Coastal Trails</option>
                  <option value="wayanad">Wayanad Rainforest Foothills</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Town or Village</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kurakkanni Junction"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="food">Local Food Spot</option>
                  <option value="nature">Nature & Wetland</option>
                  <option value="hiking">Hiking Trail</option>
                  <option value="culture">Culture & Sacred Grove</option>
                  <option value="attraction">Historical Heritage</option>
                  <option value="other">Other Unique Spot</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Describe what to expect, who runs it, house specialities or scenic highlights..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Approximate Location / Landmark</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 50m behind Kurakkanni Temple bus stop (protect sensitive sites)"
                  value={approximateLocation}
                  onChange={e => setApproximateLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Opening Hours / Best Time</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 12:15 PM – 02:30 PM (Lunch)"
                  value={bestTime}
                  onChange={e => setBestTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Estimated Price Range & Currency</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ₹180 – ₹280 or Free"
                  value={priceRangeINR}
                  onChange={e => setPriceRangeINR(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Typical Cost in INR (for Planner)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 250"
                  value={estimatedCostINR}
                  onChange={e => setEstimatedCostINR(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Safety Notes & Cautions</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Slippery moss rocks; do not swim into estuary mouth currents"
                  value={safetyNotes}
                  onChange={e => setSafetyNotes(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Accessibility Details</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flat dirt path; step threshold at entrance"
                  value={accessibilityDetails}
                  onChange={e => setAccessibilityDetails(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Visit Date</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. October 2026"
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contributor Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Name"
                  value={contributorName}
                  onChange={e => setContributorName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Checkbox: approximate / not personally verified */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="placeApproxCheck"
                checked={isApproximate}
                onChange={e => setIsApproximate(e.target.checked)}
              />
              <label htmlFor="placeApproxCheck" style={{ fontSize: '0.85rem', color: '#64748B', cursor: 'pointer' }}>
                Note: Some details are approximate and have not been personally or officially verified.
              </label>
            </div>

            <div className="modal-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-outline" onClick={e => handleSubmit(e, true)}>
                Save Draft
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
                <span>Submit Place for Review</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUB-COMPONENT: SHARE A LOCAL EXPERIENCE MODAL
// =====================================================================
function ShareExperienceModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [destinationId, setDestinationId] = useState('spiti');
  const [destination, setDestination] = useState('Spiti Valley & Pin Valley');
  const [village, setVillage] = useState('Kaza Old Village');
  const [category, setCategory] = useState('cultural_workshop');
  const [duration, setDuration] = useState('2.5 Hours');
  const [estimatedCostINR, setEstimatedCostINR] = useState('450');
  const [location, setLocation] = useState('Dechen’s Mudbrick Kitchen');
  const [bookingRequirements, setBookingRequirements] = useState('Inquire 1 day in advance');
  const [availableDates, setAvailableDates] = useState('June to October, mornings');
  const [safetyAndPermissionNotes, setSafetyAndPermissionNotes] = useState('Remove footwear at door; ask elder permission before taking photos');
  const [description, setDescription] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [contributorRole, setContributorRole] = useState('Local Artisan / Host');
  const [isApproximate, setIsApproximate] = useState(false);

  const handleSubmit = (e, isDraft = false) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const expData = {
      title: title.trim(),
      destination,
      destinationId,
      village: village.trim(),
      category,
      duration: duration.trim(),
      estimatedCostINR: parseInt(estimatedCostINR, 10) || 0,
      location: location.trim(),
      bookingRequirements: bookingRequirements.trim(),
      availableDates: availableDates.trim(),
      safetyAndPermissionNotes: safetyAndPermissionNotes.trim(),
      description: description.trim(),
      contributor: {
        name: contributorName.trim() || 'Local Host',
        role: contributorRole.trim()
      },
      isApproximate
    };

    onSave(expData, isDraft);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog diary-form-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-body-content">
          <div className="header-badge-row" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
            <span className="section-tag" style={{ marginBottom: 0 }}>
              <Sparkles size={14} />
              Share a Local Experience
            </span>
          </div>
          <h2 className="modal-title">Share a Workshop, Craft, or Cultural Tradition</h2>
          <p className="modal-subtitle">Offer insights into traditional cooking, musical instruments, dialect phrases, or artisan weaving.</p>

          <form onSubmit={e => handleSubmit(e, false)} className="community-submission-form">
            <div className="form-group">
              <label className="form-label">Experience Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tsampa Roasting & Tibetan Dialect Greeting Circle"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Destination *</label>
                <select
                  className="form-select"
                  value={destinationId}
                  onChange={e => {
                    setDestinationId(e.target.value);
                    const opt = e.target.options[e.target.selectedIndex];
                    setDestination(opt.text);
                  }}
                >
                  <option value="varkala">Varkala Cliff & Backwaters</option>
                  <option value="meghalaya">Nongriat & Cherrapunji</option>
                  <option value="spiti">Spiti Valley & Pin Valley</option>
                  <option value="coorg">Madikeri & Coorg Highlands</option>
                  <option value="ziro">Ziro Pine Valley</option>
                  <option value="hampi">Anegundi & Hampi Beyond Ruins</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Village / Hamlet</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kaza Old Village"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="cultural_workshop">Cultural Workshop</option>
                  <option value="traditional_food">Traditional Cooking</option>
                  <option value="art_craft">Art & Craft</option>
                  <option value="language_tip">Language / Dialect Exchange</option>
                  <option value="nature_walk">Guided Ecological Walk</option>
                  <option value="other">Other Activity</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description of Activity *</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Explain what travelers will do, who leads the session, and what materials are used..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2.5 Hours"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Cost in INR (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 450"
                  value={estimatedCostINR}
                  onChange={e => setEstimatedCostINR(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Dates / Season</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. June to October, mornings"
                  value={availableDates}
                  onChange={e => setAvailableDates(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Location / Meeting Point</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dechen’s kitchen, near monastery path"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Booking Requirements</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Inquire 1 day in advance or walk-in"
                  value={bookingRequirements}
                  onChange={e => setBookingRequirements(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Safety, Etiquette & Permission Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Remove shoes at door; ask elder permission before recording audio..."
                value={safetyAndPermissionNotes}
                onChange={e => setSafetyAndPermissionNotes(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Contributor Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Name"
                  value={contributorName}
                  onChange={e => setContributorName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contributor Role / Relationship</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Local Weaver / Community Host"
                  value={contributorRole}
                  onChange={e => setContributorRole(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-outline" onClick={e => handleSubmit(e, true)}>
                Save Draft
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
                <span>Submit Experience for Review</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUB-COMPONENT: DETAIL READER MODAL (DIARY, PLACE, OR EXPERIENCE)
// =====================================================================
function DetailReaderModal({ item, onClose, onReport }) {
  const { type, data } = item;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog diary-reader-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close reader">
          <X size={20} />
        </button>

        <div className="modal-body-content">
          {/* Header Image if available */}
          {(data.cover || data.photos?.[0]) && (
            <div className="reader-hero-image-wrapper">
              <img
                src={data.cover || data.photos?.[0]}
                alt={data.title || data.name}
                className="reader-hero-image"
              />
              <div className="reader-image-overlay">
                <span className="diary-dest-badge">{data.destination}</span>
                <span className={`status-pill-small status-${data.status}`}>
                  {data.status === 'approved' ? '✓ Approved & Vetted' : data.status}
                </span>
              </div>
            </div>
          )}

          <div className="reader-content-body">
            <h2 className="reader-title">{data.title || data.name}</h2>

            <div className="reader-meta-row">
              <div className="contributor-profile">
                <User size={16} />
                <span>Contributed by <strong>{data.contributor?.name || 'Explorer'}</strong></span>
                {data.tripDates && <span>• Dates: {data.tripDates}</span>}
                {data.visitDate && <span>• Visit: {data.visitDate}</span>}
              </div>

              {data.isApproximate && (
                <span className="approximate-flag-pill">
                  ⚠️ Author noted approximate details
                </span>
              )}
            </div>

            {/* Story / Description */}
            <div className="reader-story-text">
              <p>{data.story || data.description}</p>
            </div>

            {/* Expenses breakdown for diaries */}
            {type === 'diary' && data.expensesINR && (
              <div className="reader-expense-box card-white" style={{ background: '#F8FBFF', padding: '16px', borderRadius: '12px', margin: '20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className={`expense-distinction-tag ${data.expenseType === 'actual' ? 'tag-actual' : 'tag-estimated'}`}>
                    <DollarSign size={14} />
                    {data.expenseType === 'actual' ? 'Actual Incurred:' : 'Estimated Approx:'} ₹{data.expensesINR.toLocaleString('en-IN')}
                  </span>
                </div>
                {data.expenseBreakdown && (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                    <strong>Breakdown:</strong> {data.expenseBreakdown}
                  </p>
                )}
              </div>
            )}

            {/* Highlights Lists */}
            {data.placesVisited && data.placesVisited.length > 0 && (
              <div className="reader-section">
                <h4>Places Visited</h4>
                <div className="chips-mini-row">
                  {data.placesVisited.map((p, i) => (
                    <span key={i} className="mini-chip">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {data.foodDiscovered && data.foodDiscovered.length > 0 && (
              <div className="reader-section" style={{ marginTop: '14px' }}>
                <h4>Food Discovered</h4>
                <div className="chips-mini-row">
                  {data.foodDiscovered.map((f, i) => (
                    <span key={i} className="mini-chip" style={{ background: '#FFF7ED', color: '#C2410C' }}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Safety & Traveller Tips */}
            {(data.travellerTips || data.safetyNotes || data.safetyAndPermissionNotes) && (
              <div className="reader-tips-callout" style={{ marginTop: '20px' }}>
                <Shield size={16} className="tip-icon" />
                <div>
                  <strong>Traveler Tips & Safety Guidance:</strong>
                  <p>{data.travellerTips || data.safetyNotes || data.safetyAndPermissionNotes}</p>
                </div>
              </div>
            )}

            {/* Reader Footer Actions */}
            <div className="reader-footer-actions" style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onClose}
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onReport}
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              >
                <AlertTriangle size={14} />
                <span>Report Content</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUB-COMPONENT: REPORT CONTENT MODAL
// =====================================================================
function ReportContentModal({ target, onClose, onSubmit }) {
  const [reason, setReason] = useState('Inaccurate, misleading, or commercial solicitation');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason, notes);
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
              <h3 className="modal-title">Report Content: {target.title}</h3>
              <p className="modal-subtitle">Help preserve the integrity, ecological respect, and safety of the ROOTS community.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label className="form-label">Reason for Report</label>
              <select
                className="form-select"
                value={reason}
                onChange={e => setReason(e.target.value)}
              >
                <option value="Inaccurate, misleading, or commercial solicitation">Inaccurate, misleading, or commercial solicitation</option>
                <option value="Safety risk, hazardous location without caution">Safety risk, hazardous location without caution</option>
                <option value="Sacred site or private property without permission">Sacred site or private property without permission</option>
                <option value="Environmental damage or litter concern">Environmental damage or litter concern</option>
                <option value="Inappropriate or disrespectful conduct">Inappropriate or disrespectful conduct</option>
                <option value="Other concern">Other concern</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Details</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Explain why this content should be reviewed or hidden..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="modal-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}>
                Submit Report to Moderators
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUB-COMPONENT: MODERATION REASON MODAL (REQUIRED REASON FOR REJECT/CHANGES)
// =====================================================================
function ModerationReasonModal({ action, submission, onClose, onSubmit }) {
  const isReject = action === 'reject';
  const [reason, setReason] = useState(
    isReject
      ? 'Does not adhere to slow travel authenticity guidelines or lacks safety verification.'
      : 'Please add explicit safety advice and clarify whether costs were personally verified.'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason.trim());
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog report-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-body-content">
          <h3 className="modal-title">
            {isReject ? 'Reject Submission' : 'Request Changes from Contributor'}
          </h3>
          <p className="modal-subtitle">
            Target: <strong>{submission.title || submission.name}</strong> ({submission.destination})
          </p>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label className="form-label">
                {isReject ? 'Required Rejection Reason *' : 'Required Revisions Requested *'}
              </label>
              <textarea
                className="form-textarea"
                rows="4"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={isReject ? "Explain why this submission cannot be approved..." : "Specify the edits needed from the traveler..."}
                required
              ></textarea>
            </div>

            <div className="modal-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  backgroundColor: isReject ? '#dc2626' : '#d97706',
                  borderColor: isReject ? '#dc2626' : '#d97706'
                }}
              >
                {isReject ? 'Confirm Rejection' : 'Send Change Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
