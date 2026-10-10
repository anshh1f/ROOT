import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Check, 
  BookmarkCheck, 
  Printer, 
  RotateCcw, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Home, 
  Compass, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Share2,
  SlidersHorizontal,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { recalculateItineraryBudget, getAvailableDestinationActivities } from '../data/itineraryEngine.js';

export function ItineraryResults({
  itinerary,
  onBackToPlanner,
  onEditPreferences,
  onRegenerate,
  onSaveTrip,
  onUpdateItinerary,
  isAlreadySaved,
  onFindBuddies
}) {
  // Mode: 'view' (default read-only) vs 'customize' (optional editing mode)
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Sync state with incoming itinerary ID
  const [syncedTripId, setSyncedTripId] = useState(itinerary?.id);

  // Draft schedule for editing session
  const [draftSchedule, setDraftSchedule] = useState(() => 
    itinerary?.schedule ? JSON.parse(JSON.stringify(itinerary.schedule)) : []
  );

  if (itinerary?.id && itinerary.id !== syncedTripId) {
    setSyncedTripId(itinerary.id);
    setDraftSchedule(itinerary.schedule ? JSON.parse(JSON.stringify(itinerary.schedule)) : []);
    setIsCustomizing(false);
  }

  // Filter & UI states
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals / Inline editors for customizer
  const [editingSlotId, setEditingSlotId] = useState(null); // `${dayNumber}-${sIdx}`
  const [replaceModal, setReplaceModal] = useState(null); // { dayIndex, slotIndex, currentActivity }
  const [addModal, setAddModal] = useState(null); // { dayIndex, dayNumber }
  const [moveModal, setMoveModal] = useState(null); // { dayIndex, slotIndex, activity }

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
    destinationId,
    destinationMeta,
    durationDays,
    travellers,
    travelStyle,
    accommodation,
    schedule: savedSchedule,
    budgetSummary: savedBudgetSummary
  } = itinerary;

  // Active schedule being displayed
  const activeSchedule = isCustomizing ? draftSchedule : savedSchedule;

  // Live budget calculation in customize mode
  const activeBudgetSummary = isCustomizing 
    ? recalculateItineraryBudget(itinerary, draftSchedule)
    : savedBudgetSummary;

  // Check if there are unsaved customizations
  const hasUnsavedChanges = JSON.stringify(draftSchedule) !== JSON.stringify(savedSchedule);

  // Save changes to itinerary
  const handleSaveChanges = () => {
    const updatedBudget = recalculateItineraryBudget(itinerary, draftSchedule);
    const updatedPlan = {
      ...itinerary,
      schedule: draftSchedule,
      budgetSummary: updatedBudget,
      lastModified: new Date().toISOString()
    };

    if (onUpdateItinerary) {
      onUpdateItinerary(updatedPlan);
    }
    if (onSaveTrip) {
      onSaveTrip(updatedPlan);
    }

    setIsCustomizing(false);
    setEditingSlotId(null);
    setSaveSuccessMessage('Itinerary customizations saved! Your day-by-day plan and budget breakdown have been updated.');
    setTimeout(() => setSaveSuccessMessage(''), 5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel customizations and restore previous plan
  const handleCancelEditing = () => {
    setDraftSchedule(JSON.parse(JSON.stringify(savedSchedule)));
    setIsCustomizing(false);
    setEditingSlotId(null);
    setSaveSuccessMessage('Editing cancelled. Restored previous itinerary plan.');
    setTimeout(() => setSaveSuccessMessage(''), 4000);
  };

  // Enter customize mode
  const handleEnterCustomizeMode = () => {
    setDraftSchedule(JSON.parse(JSON.stringify(savedSchedule)));
    setIsCustomizing(true);
    setEditingSlotId(null);
  };

  // Save manual trip bookmark
  const handleSave = () => {
    if (onSaveTrip) {
      onSaveTrip(itinerary);
    }
    setSaveSuccessMessage('Itinerary saved to My Trips! You can access it anytime from the top bar.');
    setTimeout(() => setSaveSuccessMessage(''), 4500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // --- CUSTOMIZER OPERATIONS (Draft Schedule) ---

  // 1. Edit slot details
  const handleUpdateSlotField = (dayIndex, slotIndex, field, value) => {
    setDraftSchedule((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[dayIndex]?.activities?.[slotIndex]) {
        next[dayIndex].activities[slotIndex][field] = value;
      }
      return next;
    });
  };

  // 2. Remove an activity
  const handleRemoveActivity = (dayIndex, slotIndex) => {
    setDraftSchedule((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[dayIndex]?.activities) {
        next[dayIndex].activities.splice(slotIndex, 1);
      }
      return next;
    });
  };

  // 3. Move activity within day (up / down)
  const handleReorderActivity = (dayIndex, slotIndex, direction) => {
    setDraftSchedule((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const acts = next[dayIndex]?.activities;
      if (!acts) return prev;
      const targetIndex = slotIndex + direction;
      if (targetIndex < 0 || targetIndex >= acts.length) return prev;
      const temp = acts[slotIndex];
      acts[slotIndex] = acts[targetIndex];
      acts[targetIndex] = temp;
      return next;
    });
  };

  // 4. Move activity to another day / slot
  const handleConfirmMove = (targetDayNumber, targetSlot) => {
    if (!moveModal) return;
    const { dayIndex, slotIndex, activity } = moveModal;
    setDraftSchedule((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      // Remove from source
      next[dayIndex].activities.splice(slotIndex, 1);
      // Find target day
      const targetDay = next.find((d) => d.dayNumber === parseInt(targetDayNumber, 10));
      if (targetDay) {
        targetDay.activities.push({
          ...activity,
          slot: targetSlot
        });
      }
      return next;
    });
    setMoveModal(null);
  };

  // 5. Replace activity with community alternative
  const handleConfirmReplace = (replacementEntry) => {
    if (!replaceModal) return;
    const { dayIndex, slotIndex, currentActivity } = replaceModal;
    setDraftSchedule((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[dayIndex]?.activities?.[slotIndex]) {
        next[dayIndex].activities[slotIndex] = {
          ...currentActivity,
          slotTitle: replacementEntry.name || replacementEntry.title,
          category: replacementEntry.category || 'activity',
          costINR: Number(replacementEntry.estimatedCostINR) || 0,
          duration: replacementEntry.suggestedDuration || '2 hours',
          description: replacementEntry.description,
          practicalNotes: replacementEntry.practicalNotes || 'Verified community recommendation',
          source: replacementEntry.sourceContributor || 'Community Contributor',
          reviewStatus: replacementEntry.reviewStatus || 'Community Approved (Vetted)',
          tags: replacementEntry.tags || []
        };
      }
      return next;
    });
    setReplaceModal(null);
  };

  // 6. Add activity to day
  const handleAddActivity = (dayIndex, newActivity) => {
    setDraftSchedule((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[dayIndex]?.activities) {
        next[dayIndex].activities.push(newActivity);
      }
      return next;
    });
    setAddModal(null);
  };

  // Available community activities for this destination
  const availableAlternatives = getAvailableDestinationActivities(destinationId || itinerary.destinationMeta?.id);

  const filteredSchedule = selectedDayFilter === 'all'
    ? activeSchedule
    : activeSchedule.filter((d) => d.dayNumber === parseInt(selectedDayFilter, 10));

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

      {/* Save Success / Status Notification Banner */}
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

      {/* 2. OPTIONAL EDITING CONTROL SWITCHER */}
      <section className="container results-mode-toggle-section">
        <div className="itinerary-mode-card card-white">
          <div className="mode-toggle-left">
            <span className="mode-section-tag">Itinerary Experience</span>
            <h3 className="mode-toggle-title">
              {isCustomizing ? 'Customizing Itinerary' : 'Viewing Generated Itinerary'}
            </h3>
            <p className="mode-toggle-desc">
              {isCustomizing
                ? 'Editing mode enabled. You can adjust timings, swap activities with verified spots, remove, add, or move slots.'
                : 'Browse your generated authentic day-by-day itinerary, or optionally customize activities to your schedule.'}
            </p>
          </div>

          <div className="itinerary-mode-switcher" role="tablist" aria-label="Itinerary View Mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isCustomizing}
              className={`mode-switch-btn ${!isCustomizing ? 'active' : ''}`}
              onClick={() => {
                if (isCustomizing && hasUnsavedChanges) {
                  if (window.confirm('Discard unsaved customizations and return to read-only view?')) {
                    handleCancelEditing();
                  }
                } else {
                  setIsCustomizing(false);
                }
              }}
            >
              <Eye size={16} />
              <span>View My Itinerary</span>
              <span className="mode-pill-badge">Default</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={isCustomizing}
              className={`mode-switch-btn ${isCustomizing ? 'active' : ''}`}
              onClick={handleEnterCustomizeMode}
            >
              <SlidersHorizontal size={16} />
              <span>Customize My Trip</span>
              <span className="mode-pill-badge optional">Optional</span>
            </button>
          </div>
        </div>
      </section>

      {/* Customize Mode Active Notification & Action Bar */}
      {isCustomizing && (
        <section className="container customize-active-banner-section">
          <div className="customize-banner card-white">
            <div className="customize-banner-info">
              <div className="customize-badge">
                <SlidersHorizontal size={15} />
                <span>Customization Mode Active</span>
                {hasUnsavedChanges && <span className="unsaved-badge">• Unsaved Changes</span>}
              </div>
              <p className="customize-tip">
                Click <strong>"Edit"</strong> on any slot to change timings or descriptions. Use <strong>"Replace"</strong> to pick verified alternatives, 
                <strong>"Move"</strong> to reschedule, or <strong>"+ Add Activity"</strong> to insert local stops.
              </p>
            </div>
            <div className="customize-banner-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleCancelEditing}
              >
                <X size={15} />
                <span>Cancel Editing</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveChanges}
              >
                <Check size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Budget Analysis Dashboard */}
      <section className="container results-budget-section">
        <div className="budget-dashboard-card card-white">
          <div className="budget-dashboard-header">
            <div>
              <span className="section-tag">
                <span className="inr-symbol">₹</span>
                Itemised Budget Analysis {isCustomizing && '(Live Estimated)'}
              </span>
              <h2 className="budget-title">Transparent Local Cost Breakdown</h2>
            </div>

            <div className="budget-summary-pills">
              <div className="budget-pill-box">
                <span className="pill-box-label">Your Budget:</span>
                <span className="pill-box-val">₹{activeBudgetSummary.userTotalBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="budget-pill-box">
                <span className="pill-box-label">Estimated Total:</span>
                <span className="pill-box-val font-bold">₹{activeBudgetSummary.totalEstimatedCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Budget Health Alert (Surplus vs Deficit) */}
          {activeBudgetSummary.isOverBudget ? (
            <div className="budget-warning-banner" role="alert">
              <div className="warning-left">
                <AlertTriangle size={24} className="warning-icon-large" />
                <div>
                  <strong className="warning-heading">
                    Budget Warning: Plan exceeds your allocated budget by ₹{activeBudgetSummary.deficitAmount.toLocaleString('en-IN')}
                  </strong>
                  <p className="warning-explanation">
                    Your target budget is ₹{activeBudgetSummary.userTotalBudget.toLocaleString('en-IN')}, 
                    while the itinerary estimates ₹{activeBudgetSummary.totalEstimatedCost.toLocaleString('en-IN')}.
                  </p>
                </div>
              </div>
              <div className="warning-suggestions">
                <strong>Recommended Adjustments:</strong>
                <ul>
                  <li>• Switch accommodation to a <em>Backpacker Hostel</em> or <em>Village Homestay</em>.</li>
                  <li>• Replace high-cost paid activities with free community trails using <strong>Customize My Trip</strong> above.</li>
                  <li>• Click <strong>"Edit Preferences"</strong> above to adjust your parameters.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="budget-healthy-banner">
              <CheckCircle2 size={22} className="healthy-icon" />
              <div>
                <strong>Within Budget! Remaining Cushion: ₹{activeBudgetSummary.remainingBudget.toLocaleString('en-IN')}</strong>
                <p>
                  Your total estimate is well within your budget limit of ₹{activeBudgetSummary.userTotalBudget.toLocaleString('en-IN')}. 
                  The remaining surplus offers a healthy buffer for local artisan souvenirs and transport tips.
                </p>
              </div>
            </div>
          )}

          {/* 4 Itemised Expense Categories */}
          <div className="itemised-budget-grid">
            {Object.entries(activeBudgetSummary.breakdown).map(([key, item]) => (
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
                      width: `${Math.min(100, Math.round((item.cost / activeBudgetSummary.totalEstimatedCost) * 100))}%`
                    }}
                  ></div>
                </div>
                <small className="expense-share">
                  {Math.round((item.cost / activeBudgetSummary.totalEstimatedCost) * 100)}% of total estimate
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
            <h2 className="schedule-section-title">
              Day-by-Day Community Itinerary {isCustomizing && '(Editable)'}
            </h2>
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
            {activeSchedule.map((day) => (
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
          {filteredSchedule.map((day) => {
            // Find real dayIndex in activeSchedule when filtered
            const actualDayIndex = activeSchedule.findIndex((d) => d.dayNumber === day.dayNumber);

            return (
              <div key={day.dayNumber} className="day-full-card card-white">
                {/* Day Header Bar */}
                <div className="day-card-header">
                  <div className="day-badge-large">
                    <span className="day-num-text">DAY {day.dayNumber}</span>
                  </div>
                  <div className="day-title-block">
                    <h3 className="day-headline">{day.dayTheme}</h3>
                    <div className="day-highlights-tags">
                      {day.dayHighlights?.map((hl, i) => (
                        <span key={i} className="highlight-tag-pill">• {hl}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Slots: Morning, Afternoon, Evening */}
                <div className="day-slots-container">
                  {day.activities.map((slot, sIdx) => {
                    const slotKey = `d${day.dayNumber}-s${sIdx}`;
                    const isEditingThisSlot = isCustomizing && editingSlotId === slotKey;

                    return (
                      <div key={sIdx} className={`slot-item-card slot-${slot.slot.toLowerCase()} ${isCustomizing ? 'customizing-card' : ''}`}>
                        <div className="slot-timeline-marker">
                          <span className={`slot-dot-badge ${slot.slot.toLowerCase()}`}>
                            {slot.slot}
                          </span>
                          <span className="slot-time-range">{slot.timeRange}</span>
                        </div>

                        <div className="slot-body">
                          {/* Customize Mode: Slot Toolbar */}
                          {isCustomizing && (
                            <div className="slot-customizer-toolbar">
                              <span className="toolbar-hint">Customize Slot:</span>
                              <div className="toolbar-btns-group">
                                <button
                                  type="button"
                                  className={`btn-slot-action ${isEditingThisSlot ? 'active' : ''}`}
                                  onClick={() => setEditingSlotId(isEditingThisSlot ? null : slotKey)}
                                  title="Edit title, timing and details"
                                >
                                  <Edit3 size={13} />
                                  <span>{isEditingThisSlot ? 'Done' : 'Edit'}</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn-slot-action"
                                  onClick={() => setReplaceModal({ dayIndex: actualDayIndex, slotIndex: sIdx, currentActivity: slot })}
                                  title="Replace with verified community alternative"
                                >
                                  <RefreshCw size={13} />
                                  <span>Replace</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn-slot-action"
                                  onClick={() => setMoveModal({ dayIndex: actualDayIndex, slotIndex: sIdx, activity: slot })}
                                  title="Move to another day or slot"
                                >
                                  <ArrowRightLeft size={13} />
                                  <span>Move</span>
                                </button>

                                <div className="reorder-btns-pair">
                                  <button
                                    type="button"
                                    className="btn-slot-mini-action"
                                    disabled={sIdx === 0}
                                    onClick={() => handleReorderActivity(actualDayIndex, sIdx, -1)}
                                    title="Move earlier"
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-slot-mini-action"
                                    disabled={sIdx === day.activities.length - 1}
                                    onClick={() => handleReorderActivity(actualDayIndex, sIdx, 1)}
                                    title="Move later"
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="btn-slot-action btn-slot-danger"
                                  onClick={() => handleRemoveActivity(actualDayIndex, sIdx)}
                                  title="Remove activity from day"
                                >
                                  <Trash2 size={13} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Inline Editing Form */}
                          {isEditingThisSlot ? (
                            <div className="slot-inline-edit-form">
                              <div className="edit-form-grid">
                                <div className="edit-field-group">
                                  <label>Activity Title</label>
                                  <input
                                    type="text"
                                    value={slot.slotTitle}
                                    onChange={(e) => handleUpdateSlotField(actualDayIndex, sIdx, 'slotTitle', e.target.value)}
                                    className="form-input-sm"
                                  />
                                </div>

                                <div className="edit-field-group">
                                  <label>Time Range</label>
                                  <input
                                    type="text"
                                    value={slot.timeRange}
                                    placeholder="e.g. 09:00 AM – 11:30 AM"
                                    onChange={(e) => handleUpdateSlotField(actualDayIndex, sIdx, 'timeRange', e.target.value)}
                                    className="form-input-sm"
                                  />
                                </div>

                                <div className="edit-field-group">
                                  <label>Cost / Person (₹)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={slot.costINR}
                                    onChange={(e) => handleUpdateSlotField(actualDayIndex, sIdx, 'costINR', parseInt(e.target.value, 10) || 0)}
                                    className="form-input-sm"
                                  />
                                </div>

                                <div className="edit-field-group">
                                  <label>Time Slot</label>
                                  <select
                                    value={slot.slot}
                                    onChange={(e) => handleUpdateSlotField(actualDayIndex, sIdx, 'slot', e.target.value)}
                                    className="form-select-sm"
                                  >
                                    <option value="Morning">Morning</option>
                                    <option value="Afternoon">Afternoon</option>
                                    <option value="Evening">Evening</option>
                                  </select>
                                </div>
                              </div>

                              <div className="edit-field-group" style={{ marginTop: '8px' }}>
                                <label>Description</label>
                                <textarea
                                  rows={2}
                                  value={slot.description}
                                  onChange={(e) => handleUpdateSlotField(actualDayIndex, sIdx, 'description', e.target.value)}
                                  className="form-textarea-sm"
                                />
                              </div>

                              <div className="edit-field-group" style={{ marginTop: '8px' }}>
                                <label>Local Notes / Practical Guidance</label>
                                <input
                                  type="text"
                                  value={slot.practicalNotes}
                                  onChange={(e) => handleUpdateSlotField(actualDayIndex, sIdx, 'practicalNotes', e.target.value)}
                                  className="form-input-sm"
                                />
                              </div>

                              <div className="edit-form-actions">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => setEditingSlotId(null)}
                                >
                                  <Check size={14} />
                                  <span>Done Editing Slot</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Read-Only Slot Content */
                            <>
                              <div className="slot-top-row">
                                <div className="slot-title-group">
                                  <span className="slot-category-tag">
                                    {slot.category === 'food_spot' ? '🍴 Local Food Spot' : slot.category === 'place' ? '📍 Heritage Place' : '🌿 Community Activity'}
                                  </span>
                                  <h4 className="slot-title">{slot.slotTitle}</h4>
                                </div>

                                <div className="slot-price-pill">
                                  <span className="slot-cost-num">
                                    {Number(slot.costINR) === 0 ? 'Free Access' : `₹${slot.costINR} / person`}
                                  </span>
                                  <span className="slot-duration-hint">{slot.duration}</span>
                                </div>
                              </div>

                              <p className="slot-description">{slot.description}</p>

                              {/* Practical Notes & Etiquette Box */}
                              {slot.practicalNotes && (
                                <div className="slot-notes-box">
                                  <Info size={14} className="notes-icon" />
                                  <div>
                                    <strong>Local Notes:</strong> {slot.practicalNotes}
                                  </div>
                                </div>
                              )}

                              {/* Contributor Citation and Review Status */}
                              <div className="slot-footer-meta">
                                <div className="slot-source-group">
                                  <span className="sample-badge">{slot.reviewStatus || 'Community Approved'}</span>
                                  <span className="slot-contributor-text">
                                    Contributed by: <strong>{slot.source || 'Local Guide'}</strong>
                                  </span>
                                </div>

                                <div className="slot-tags-group">
                                  {slot.tags?.map((t, idx) => (
                                    <span key={idx} className="slot-tag-chip">#{t}</span>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Activity Button in Customize Mode */}
                  {isCustomizing && (
                    <div className="day-add-activity-row">
                      <button
                        type="button"
                        className="btn-add-activity-dashed"
                        onClick={() => setAddModal({ dayIndex: actualDayIndex, dayNumber: day.dayNumber })}
                      >
                        <Plus size={16} />
                        <span>Add Activity to Day {day.dayNumber}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Travel Buddy Match Callout */}
      {onFindBuddies && (
        <section className="container results-buddy-callout-section">
          <div className="results-buddy-banner">
            <div className="results-buddy-banner-left">
              <div className="results-buddy-icon-wrap">
                <Users size={24} />
              </div>
              <div>
                <h4 className="results-buddy-title">
                  Looking for a Travel Buddy to {destination}?
                </h4>
                <p className="results-buddy-text">
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
            <p>Save this itinerary locally, print it out for offline travel, or customize your schedule anytime.</p>
          </div>

          <div className="bottom-buttons">
            {isCustomizing ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCancelEditing}
                >
                  <X size={16} />
                  <span>Cancel Editing</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  <Check size={18} />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleEnterCustomizeMode}
                >
                  <SlidersHorizontal size={16} />
                  <span>Customize My Trip</span>
                </button>

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
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- MODAL 1: REPLACE ACTIVITY WITH COMMUNITY ALTERNATIVE --- */}
      {replaceModal && (
        <div className="modal-backdrop" onClick={() => setReplaceModal(null)}>
          <div className="modal-dialog modal-lg card-white" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-tag">
                  <RefreshCw size={13} />
                  Verified Community Alternatives
                </span>
                <h3 className="modal-title">Replace: {replaceModal.currentActivity?.slotTitle}</h3>
                <p className="modal-subtitle">
                  Select an authentic community-recommended spot or activity in {destination}. Real entries only with zero fabricated data.
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setReplaceModal(null)}
                aria-label="Close replacement modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body customizer-alternatives-list">
              {availableAlternatives.length === 0 ? (
                <div className="text-center" style={{ padding: '30px 10px' }}>
                  <p>No alternative activities currently available for this destination.</p>
                </div>
              ) : (
                availableAlternatives
                  .filter((item) => (item.name || item.title) !== replaceModal.currentActivity?.slotTitle)
                  .map((item) => (
                    <div key={item.id} className="alternative-item-card">
                      <div className="alt-info-main">
                        <div className="alt-title-row">
                          <span className="slot-category-tag">
                            {item.category === 'food_spot' ? '🍴 Local Food' : item.category === 'place' ? '📍 Heritage Place' : '🌿 Local Experience'}
                          </span>
                          <h4 className="alt-name">{item.name || item.title}</h4>
                        </div>
                        <p className="alt-desc">{item.description}</p>
                        <div className="alt-meta-row">
                          <span className="alt-cost">
                            {Number(item.estimatedCostINR) === 0 ? 'Free Access' : `₹${item.estimatedCostINR} / person`}
                          </span>
                          <span className="alt-duration">• {item.suggestedDuration || '2 hours'}</span>
                          <span className="alt-contributor">• Shared by {item.sourceContributor || 'Community Traveler'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm alt-select-btn"
                        onClick={() => handleConfirmReplace(item)}
                      >
                        <Check size={14} />
                        <span>Select This Spot</span>
                      </button>
                    </div>
                  ))
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setReplaceModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: MOVE ACTIVITY TO ANOTHER DAY OR TIME SLOT --- */}
      {moveModal && (
        <div className="modal-backdrop" onClick={() => setMoveModal(null)}>
          <div className="modal-dialog card-white" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-tag">
                  <ArrowRightLeft size={13} />
                  Reschedule Activity
                </span>
                <h3 className="modal-title">Move "{moveModal.activity.slotTitle}"</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setMoveModal(null)}
                aria-label="Close move modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleConfirmMove(formData.get('targetDay'), formData.get('targetSlot'));
              }}
            >
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label font-bold">Move to Day:</label>
                  <select name="targetDay" defaultValue={draftSchedule[moveModal.dayIndex]?.dayNumber || 1} className="form-select">
                    {draftSchedule.map((d) => (
                      <option key={d.dayNumber} value={d.dayNumber}>
                        Day {d.dayNumber} — {d.dayTheme}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label font-bold">Target Time Slot:</label>
                  <select name="targetSlot" defaultValue={moveModal.activity.slot || 'Morning'} className="form-select">
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setMoveModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={16} />
                  <span>Confirm Move</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD ACTIVITY TO DAY --- */}
      {addModal && (
        <div className="modal-backdrop" onClick={() => setAddModal(null)}>
          <div className="modal-dialog modal-lg card-white" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-tag">
                  <Plus size={13} />
                  Add New Activity
                </span>
                <h3 className="modal-title">Add Activity to Day {addModal.dayNumber}</h3>
                <p className="modal-subtitle">
                  Pick from verified community discoveries or add your custom local visit.
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setAddModal(null)}
                aria-label="Close add activity modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Option A: Quick Pick from Community Entries */}
              <h4 style={{ fontSize: '0.95rem', color: '#123B73', marginBottom: '12px' }}>
                Option 1: Choose from Verified Community Discoveries ({destination})
              </h4>
              <div className="customizer-alternatives-list" style={{ maxHeight: '280px', marginBottom: '24px' }}>
                {availableAlternatives.map((item) => (
                  <div key={item.id} className="alternative-item-card">
                    <div className="alt-info-main">
                      <div className="alt-title-row">
                        <span className="slot-category-tag">
                          {item.category === 'food_spot' ? '🍴 Local Food' : item.category === 'place' ? '📍 Heritage Place' : '🌿 Local Experience'}
                        </span>
                        <h4 className="alt-name">{item.name || item.title}</h4>
                      </div>
                      <p className="alt-desc">{item.description}</p>
                      <div className="alt-meta-row">
                        <span className="alt-cost">
                          {Number(item.estimatedCostINR) === 0 ? 'Free Access' : `₹${item.estimatedCostINR} / person`}
                        </span>
                        <span className="alt-duration">• {item.suggestedDuration || '2 hours'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm alt-select-btn"
                      onClick={() => {
                        handleAddActivity(addModal.dayIndex, {
                          slot: 'Afternoon',
                          timeRange: '02:30 PM – 04:30 PM',
                          slotTitle: item.name || item.title,
                          category: item.category || 'activity',
                          costINR: Number(item.estimatedCostINR) || 0,
                          duration: item.suggestedDuration || '2 hours',
                          description: item.description,
                          practicalNotes: item.practicalNotes || 'Verified community discovery',
                          source: item.sourceContributor || 'Community Traveler',
                          reviewStatus: item.reviewStatus || 'Community Approved (Vetted)',
                          tags: item.tags || []
                        });
                      }}
                    >
                      <Plus size={14} />
                      <span>Add to Day</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Option B: Custom Activity Form */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#123B73', marginBottom: '12px' }}>
                  Option 2: Or Add a Custom Local Plan
                </h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAddActivity(addModal.dayIndex, {
                      slot: formData.get('slot') || 'Morning',
                      timeRange: formData.get('timeRange') || '10:00 AM – 12:00 PM',
                      slotTitle: formData.get('title') || 'Local Exploration',
                      category: formData.get('category') || 'activity',
                      costINR: parseInt(formData.get('costINR'), 10) || 0,
                      duration: formData.get('duration') || '2 hours',
                      description: formData.get('description') || '',
                      practicalNotes: formData.get('notes') || 'User customized stop',
                      source: 'Customized by You',
                      reviewStatus: 'User Added Plan',
                      tags: ['custom-activity']
                    });
                  }}
                >
                  <div className="edit-form-grid" style={{ marginBottom: '10px' }}>
                    <div className="edit-field-group">
                      <label>Activity Title *</label>
                      <input name="title" required placeholder="e.g. Village Potter Workshop" className="form-input-sm" />
                    </div>
                    <div className="edit-field-group">
                      <label>Time Slot</label>
                      <select name="slot" defaultValue="Morning" className="form-select-sm">
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>
                    <div className="edit-field-group">
                      <label>Time Range</label>
                      <input name="timeRange" placeholder="e.g. 10:00 AM – 12:00 PM" className="form-input-sm" />
                    </div>
                    <div className="edit-field-group">
                      <label>Cost / Person (₹)</label>
                      <input name="costINR" type="number" min="0" defaultValue="0" className="form-input-sm" />
                    </div>
                  </div>
                  <div className="edit-field-group" style={{ marginBottom: '14px' }}>
                    <label>Description</label>
                    <textarea name="description" rows={2} placeholder="Describe the visit or encounter..." className="form-textarea-sm" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setAddModal(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Plus size={14} />
                      <span>Add Custom Plan</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
