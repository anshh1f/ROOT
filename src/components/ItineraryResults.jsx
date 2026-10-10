import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  Check, 
  Clock, 
  BookmarkCheck, 
  Printer, 
  RotateCcw, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Home, 
  Utensils, 
  Compass, 
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2
} from 'lucide-react';

export function ItineraryResults({
  itinerary,
  onBackToPlanner,
  onEditPreferences,
  onRegenerate,
  onSaveTrip,
  isAlreadySaved,
  onFindBuddies
}) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [expandedSlots, setExpandedSlots] = useState({});
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!itinerary) {
    return (
      <div className="section container text-center">
        <h2>No itinerary selected</h2>
        <button type="button" className="btn btn-primary" onClick={onBackToPlanner}>
          Return to Planner
        </button>
      </div>
    );
  }

  const {
    startLocation,
    destination,
    destinationMeta,
    durationDays,
    travellers,
    travelStyle,
    accommodation,
    schedule,
    budgetSummary
  } = itinerary;

  const handleSave = () => {
    onSaveTrip(itinerary);
    setSaveSuccessMessage('Itinerary saved to My Trips! You can access it anytime from the top bar.');
    setTimeout(() => setSaveSuccessMessage(''), 4500);
  };

  const toggleSlotDetails = (key) => {
    setExpandedSlots((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const filteredSchedule = selectedDayFilter === 'all'
    ? schedule
    : schedule.filter((d) => d.dayNumber === parseInt(selectedDayFilter, 10));

  return (
    <div className="itinerary-results-page">
      {/* Top Bar Navigation */}
      <div className="results-top-nav">
        <div className="container results-top-nav-inner">
          <button
            type="button"
            className="btn-back-link"
            onClick={onBackToPlanner}
            aria-label="Back to trip planner"
          >
            <ArrowLeft size={18} />
            <span>Back to Homepage & Planner</span>
          </button>

          <div className="results-top-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onEditPreferences}
            >
              <Edit3 size={15} />
              <span>Edit Preferences</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onRegenerate}
              title="Reshuffle activities based on community entries"
            >
              <RotateCcw size={15} />
              <span>Regenerate</span>
            </button>

            {onFindBuddies && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onFindBuddies}
                title={`Find travel buddies travelling to ${destination}`}
              >
                <Users size={15} />
                <span>Find Buddies</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm btn-save-itinerary"
              onClick={handleSave}
            >
              <BookmarkCheck size={16} />
              <span>{isAlreadySaved ? 'Saved in My Trips' : 'Save Trip'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMessage && (
        <div className="container">
          <div className="planner-notification" style={{ marginTop: '16px' }} role="status">
            <CheckCircle2 size={18} />
            <span>{saveSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Trip Summary Card */}
      <section className="results-hero-section">
        <div className="container">
          <div className="results-hero-card card-white">
            <div className="results-hero-image-wrapper">
              <img
                src={destinationMeta?.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
                alt={destination}
                className="results-hero-image"
              />
              <div className="results-hero-overlay">
                <div className="hero-badges-row">
                  <span className="sample-badge">Sample Prototype Itinerary</span>
                  <span className="hero-region-badge">{destinationMeta?.region || 'India'}</span>
                </div>
                <h1 className="results-hero-title">{destination}</h1>
                <p className="results-hero-tagline">{destinationMeta?.tagline || 'Community-guided slow travel route'}</p>
              </div>
            </div>

            {/* Trip Parameters Metadata Bar */}
            <div className="results-parameters-bar">
              <div className="param-item">
                <MapPin size={16} className="param-icon" />
                <div>
                  <small>From</small>
                  <strong>{startLocation || 'Your Origin'}</strong>
                </div>
              </div>

              <div className="param-item">
                <Calendar size={16} className="param-icon" />
                <div>
                  <small>Duration</small>
                  <strong>{durationDays} Days / {Math.max(1, durationDays - 1)} Nights</strong>
                </div>
              </div>

              <div className="param-item">
                <Users size={16} className="param-icon" />
                <div>
                  <small>Travellers</small>
                  <strong>{travellers} Person{travellers > 1 ? 's' : ''}</strong>
                </div>
              </div>

              <div className="param-item">
                <Compass size={16} className="param-icon" />
                <div>
                  <small>Travel Style</small>
                  <strong>{travelStyle}</strong>
                </div>
              </div>

              <div className="param-item">
                <Home size={16} className="param-icon" />
                <div>
                  <small>Stay Type</small>
                  <strong>{accommodation?.type || 'Village Homestay'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Analysis Dashboard */}
      <section className="container results-budget-section">
        <div className="budget-dashboard-card card-white">
          <div className="budget-dashboard-header">
            <div>
              <span className="section-tag">
                <span className="inr-symbol">₹</span>
                Itemised Budget Analysis
              </span>
              <h2 className="budget-title">Transparent Local Cost Breakdown</h2>
            </div>

            <div className="budget-summary-pills">
              <div className="budget-pill-box">
                <span className="pill-box-label">Your Budget:</span>
                <span className="pill-box-val">₹{budgetSummary.userTotalBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="budget-pill-box">
                <span className="pill-box-label">Estimated Total:</span>
                <span className="pill-box-val font-bold">₹{budgetSummary.totalEstimatedCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Budget Health Alert (Surplus vs Deficit) */}
          {budgetSummary.isOverBudget ? (
            <div className="budget-warning-banner" role="alert">
              <div className="warning-left">
                <AlertTriangle size={24} className="warning-icon-large" />
                <div>
                  <strong className="warning-heading">
                    Budget Warning: Plan exceeds your allocated budget by ₹{budgetSummary.deficitAmount.toLocaleString('en-IN')}
                  </strong>
                  <p className="warning-explanation">
                    Your target budget is ₹{budgetSummary.userTotalBudget.toLocaleString('en-IN')}, 
                    while the community itinerary estimates ₹{budgetSummary.totalEstimatedCost.toLocaleString('en-IN')}.
                  </p>
                </div>
              </div>
              <div className="warning-suggestions">
                <strong>Recommended Adjustments:</strong>
                <ul>
                  <li>• Switch accommodation to a <em>Backpacker Hostel</em> or <em>Village Homestay</em>.</li>
                  <li>• Reduce trip duration by 1 day or explore public state transport.</li>
                  <li>• Click <strong>"Edit Preferences"</strong> above to adjust your parameters.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="budget-healthy-banner">
              <CheckCircle2 size={22} className="healthy-icon" />
              <div>
                <strong>Within Budget! Remaining Cushion: ₹{budgetSummary.remainingBudget.toLocaleString('en-IN')}</strong>
                <p>
                  Your total estimate is well within your budget limit of ₹{budgetSummary.userTotalBudget.toLocaleString('en-IN')}. 
                  The remaining surplus offers a healthy buffer for local artisan souvenirs and transport tips.
                </p>
              </div>
            </div>
          )}

          {/* 4 Itemised Expense Categories */}
          <div className="itemised-budget-grid">
            {Object.entries(budgetSummary.breakdown).map(([key, item]) => (
              <div key={key} className="expense-category-card">
                <div className="expense-card-top">
                  <span className="expense-category-name">{item.label}</span>
                  <span className="expense-cost">₹{item.cost.toLocaleString('en-IN')}</span>
                </div>
                <p className="expense-note">{item.note}</p>
                <div className="expense-progress-bar">
                  <div
                    className="expense-progress-fill"
                    style={{
                      width: `${Math.min(100, Math.round((item.cost / budgetSummary.totalEstimatedCost) * 100))}%`
                    }}
                  ></div>
                </div>
                <small className="expense-share">
                  {Math.round((item.cost / budgetSummary.totalEstimatedCost) * 100)}% of total estimate
                </small>
              </div>
            ))}
          </div>

          <div className="budget-disclaimer-note">
            <Info size={14} />
            <span>
              All amounts are conservative local estimates calculated for {travellers} traveller{travellers > 1 ? 's' : ''}. 
              Prices reflect direct payments to local drivers, homestays, and community cooks with zero commercial markups.
            </span>
          </div>
        </div>
      </section>

      {/* Selected Stay Highlight */}
      {accommodation && (
        <section className="container results-stay-highlight-section">
          <div className="stay-banner-card card-white">
            <div className="stay-banner-img-box">
              <img
                src={accommodation.image}
                alt={accommodation.name}
                className="stay-banner-img"
              />
              <span className="stay-banner-badge">{accommodation.type}</span>
            </div>

            <div className="stay-banner-content">
              <div className="stay-badge-row">
                <span className="section-tag" style={{ marginBottom: 0 }}>
                  <Home size={13} />
                  Selected Authentic Accommodation
                </span>
                <span className="sample-badge">{accommodation.reviewStatus}</span>
              </div>

              <h3 className="stay-banner-name">{accommodation.name}</h3>
              <p className="stay-banner-desc">{accommodation.description}</p>

              <div className="stay-banner-amenities">
                {accommodation.amenities?.map((amenity, idx) => (
                  <span key={idx} className="amenity-chip">✓ {amenity}</span>
                ))}
              </div>

              <div className="stay-banner-pricing">
                <div className="stay-price-left">
                  <strong className="stay-cost-tag">
                    ₹{accommodation.estimatedCostINR.toLocaleString('en-IN')}
                  </strong>
                  <span className="stay-unit-text">/{accommodation.priceUnit}</span>
                </div>
                <span className="stay-source-cite">
                  Host network submitted by <em>{accommodation.sourceContributor}</em>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Day by Day Itinerary Section */}
      <section className="container results-schedule-section">
        <div className="schedule-header-row">
          <div>
            <h2 className="schedule-section-title">Day-by-Day Community Itinerary</h2>
            <p className="schedule-section-desc">
              Curated daily sequencing featuring verified community spots, local food joints, and cultural encounters.
            </p>
          </div>

          {/* Day Filter Pills */}
          <div className="day-filters-bar">
            <button
              type="button"
              className={`day-filter-btn ${selectedDayFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedDayFilter('all')}
            >
              All Days ({durationDays})
            </button>
            {schedule.map((day) => (
              <button
                key={day.dayNumber}
                type="button"
                className={`day-filter-btn ${selectedDayFilter === String(day.dayNumber) ? 'active' : ''}`}
                onClick={() => setSelectedDayFilter(String(day.dayNumber))}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Day Cards List */}
        <div className="days-itinerary-stack">
          {filteredSchedule.map((day) => (
            <div key={day.dayNumber} className="day-full-card card-white">
              {/* Day Header Bar */}
              <div className="day-card-header">
                <div className="day-badge-large">
                  <span className="day-num-text">DAY {day.dayNumber}</span>
                </div>
                <div className="day-title-block">
                  <h3 className="day-headline">{day.dayTheme}</h3>
                  <div className="day-highlights-tags">
                    {day.dayHighlights.map((hl, i) => (
                      <span key={i} className="highlight-tag-pill">• {hl}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots: Morning, Afternoon, Evening */}
              <div className="day-slots-container">
                {day.activities.map((slot, sIdx) => {
                  const slotKey = `d${day.dayNumber}-s${sIdx}`;
                  const isExpanded = !!expandedSlots[slotKey];

                  return (
                    <div key={sIdx} className={`slot-item-card slot-${slot.slot.toLowerCase()}`}>
                      <div className="slot-timeline-marker">
                        <span className={`slot-dot-badge ${slot.slot.toLowerCase()}`}>
                          {slot.slot}
                        </span>
                        <span className="slot-time-range">{slot.timeRange}</span>
                      </div>

                      <div className="slot-body">
                        <div className="slot-top-row">
                          <div className="slot-title-group">
                            <span className="slot-category-tag">
                              {slot.category === 'food_spot' ? '🍴 Local Food Spot' : slot.category === 'place' ? '📍 Heritage Place' : '🌿 Community Activity'}
                            </span>
                            <h4 className="slot-title">{slot.slotTitle}</h4>
                          </div>

                          <div className="slot-price-pill">
                            <span className="slot-cost-num">
                              {slot.costINR === 0 ? 'Free Access' : `₹${slot.costINR} / person`}
                            </span>
                            <span className="slot-duration-hint">{slot.duration}</span>
                          </div>
                        </div>

                        <p className="slot-description">{slot.description}</p>

                        {/* Practical Notes & Etiquette Box */}
                        <div className="slot-notes-box">
                          <Info size={14} className="notes-icon" />
                          <div>
                            <strong>Local Notes:</strong> {slot.practicalNotes}
                          </div>
                        </div>

                        {/* Contributor Citation and Review Status */}
                        <div className="slot-footer-meta">
                          <div className="slot-source-group">
                            <span className="sample-badge">{slot.reviewStatus}</span>
                            <span className="slot-contributor-text">
                              Contributed by: <strong>{slot.source}</strong>
                            </span>
                          </div>

                          <div className="slot-tags-group">
                            {slot.tags?.map((t, idx) => (
                              <span key={idx} className="slot-tag-chip">#{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Buddy Match Callout */}
      {onFindBuddies && (
        <section className="container results-buddy-callout-section" style={{ marginTop: '32px' }}>
          <div className="card-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderRadius: '16px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F6FF 100%)', border: '1px solid #D6E4FF', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px', flex: '1 1 auto' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EAF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#123B73', flexShrink: 0 }}>
                <Users size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.125rem', color: '#123B73', fontWeight: 700 }}>
                  Looking for a Travel Buddy to {destination}?
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                  Discover matched fellow travellers heading to {destination} during overlapping dates to share local transport and trails.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onFindBuddies}
              style={{ flexShrink: 0 }}
            >
              <Users size={16} />
              <span>Explore ROOTS Connect Buddies</span>
            </button>
          </div>
        </section>
      )}

      {/* Itinerary Bottom Actions Bar */}
      <section className="container results-bottom-actions-section">
        <div className="bottom-actions-card card-white">
          <div className="bottom-left">
            <h3>Ready for your authentic journey?</h3>
            <p>Save this itinerary locally, print it out for offline travel, or adjust preferences anytime.</p>
          </div>

          <div className="bottom-buttons">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.print()}
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleShare}
            >
              <Share2 size={16} />
              <span>{copiedLink ? 'Link Copied!' : 'Share Plan'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              <BookmarkCheck size={18} />
              <span>{isAlreadySaved ? 'Saved in My Trips' : 'Save to My Trips'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
