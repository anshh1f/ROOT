import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  Check, 
  AlertCircle, 
  AlertTriangle,
  RotateCcw, 
  Info,
  Compass,
  Home,
  CheckCircle2,
  Utensils,
  Mountain,
  Waves,
  Landmark,
  Music,
  Camera,
  TreePine,
  Languages,
  EyeOff
} from 'lucide-react';
import { EXPERIENCE_CATEGORIES, TRAVEL_STYLES, ACCOMMODATION_TYPES } from '../data/experiences';
import { generateItinerary, findMatchingDestination } from '../data/itineraryEngine';
import communityData from '../data/communityData.json';

const iconMap = {
  Utensils,
  Mountain,
  Waves,
  Landmark,
  Music,
  Users,
  Camera,
  TreePine,
  Compass,
  Languages,
  MapPin: EyeOff
};

export function TripPlanner({
  initialValues,
  prefilledDestination,
  onItineraryGenerated
}) {
  // Form State
  const [startLocation, setStartLocation] = useState('Bengaluru');
  const [destination, setDestination] = useState('Varkala Cliff & Backwaters, Kerala');
  const [durationDays, setDurationDays] = useState(4);
  const [travellers, setTravellers] = useState(2);
  const [budgetINR, setBudgetINR] = useState(22000);
  const [selectedExperiences, setSelectedExperiences] = useState(['local-food', 'hiking', 'nature', 'swimming']);
  const [travelStyle, setTravelStyle] = useState('Mixed');
  const [accommodationPreference, setAccommodationPreference] = useState('Village Homestay');

  // UI / Validation State
  const [validationErrors, setValidationErrors] = useState({});
  const [unmatchedError, setUnmatchedError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync initialValues if user clicks "Edit Preferences" from results page
  useEffect(() => {
    if (initialValues) {
      if (initialValues.startLocation) setStartLocation(initialValues.startLocation);
      if (initialValues.destination) setDestination(initialValues.destination);
      if (initialValues.durationDays) setDurationDays(initialValues.durationDays);
      if (initialValues.travellers) setTravellers(initialValues.travellers);
      if (initialValues.budgetSummary?.userTotalBudget) setBudgetINR(initialValues.budgetSummary.userTotalBudget);
      if (initialValues.preferredExperiences) setSelectedExperiences(initialValues.preferredExperiences);
      if (initialValues.travelStyle) setTravelStyle(initialValues.travelStyle);
      if (initialValues.accommodationPreference) setAccommodationPreference(initialValues.accommodationPreference);
    }
  }, [initialValues]);

  // Sync prefilled destination if passed from other components
  useEffect(() => {
    if (prefilledDestination) {
      setDestination(prefilledDestination);
      setUnmatchedError(null);
    }
  }, [prefilledDestination]);

  const toggleExperience = (id) => {
    setSelectedExperiences((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0 && validationErrors.experiences) {
        setValidationErrors((errs) => ({ ...errs, experiences: null }));
      }
      return next;
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!startLocation.trim()) {
      errors.startLocation = 'Please enter your starting location.';
    }
    if (!destination.trim()) {
      errors.destination = 'Please enter your destination.';
    }
    if (!durationDays || durationDays < 1 || durationDays > 14) {
      errors.durationDays = 'Trip duration must be between 1 and 14 days.';
    }
    if (!travellers || travellers < 1) {
      errors.travellers = 'Please enter at least 1 traveller.';
    }
    if (!budgetINR || budgetINR <= 0) {
      errors.budgetINR = 'Please enter a valid total trip budget in INR.';
    }
    if (selectedExperiences.length === 0) {
      errors.experiences = 'Please select at least one preferred experience.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUnmatchedError(null);

    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const result = generateItinerary({
        startLocation,
        destination,
        durationDays,
        travellers,
        budgetINR,
        preferredExperiences: selectedExperiences,
        travelStyle,
        accommodationPreference
      });

      setIsGenerating(false);

      if (!result.success) {
        setUnmatchedError(result);
        return;
      }

      if (onItineraryGenerated) {
        onItineraryGenerated(result);
      }
    }, 450);
  };

  const handleSelectApprovedDest = (destName) => {
    setDestination(destName);
    setUnmatchedError(null);
    if (validationErrors.destination) {
      setValidationErrors((errs) => ({ ...errs, destination: null }));
    }
  };

  return (
    <section id="plan-trip" className="section planner-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} />
            Community Trip Planner
          </span>
          <h2 className="section-title">Personalise Your Travel Itinerary</h2>
          <p className="section-description">
            Design an authentic, community-first travel plan based on verified local places, 
            fair host compensation, and curated cultural experiences across India.
          </p>
        </div>

        <div className="planner-card card-white">
          <div className="planner-prototype-header">
            <div className="prototype-status-group">
              <span className="sample-badge">Sample Community Engine</span>
              <span className="planner-notice">
                Uses manually curated verified entries • No external AI or scraping APIs
              </span>
            </div>
            <button
              type="button"
              className="btn-reset-sample"
              onClick={() => {
                setStartLocation('Bengaluru');
                setDestination('Varkala Cliff & Backwaters, Kerala');
                setDurationDays(4);
                setTravellers(2);
                setBudgetINR(22000);
                setSelectedExperiences(['local-food', 'hiking', 'nature', 'swimming']);
                setTravelStyle('Mixed');
                setAccommodationPreference('Village Homestay');
                setValidationErrors({});
                setUnmatchedError(null);
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Sample Defaults</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="planner-form-multisection">
            {/* ---------------- SECTION 1: ROUTE & TIMEFRAME ---------------- */}
            <div className="planner-form-section">
              <div className="section-subheading">
                <span className="step-circle">1</span>
                <div>
                  <h3 className="subheading-title">Route & Travellers</h3>
                  <p className="subheading-desc">Where you begin, your journey destination, and who is travelling.</p>
                </div>
              </div>

              <div className="form-grid-4">
                {/* Starting Location */}
                <div className="form-group">
                  <label htmlFor="startLocation" className="form-label">
                    <MapPin size={15} className="label-icon" />
                    Starting Location *
                  </label>
                  <input
                    id="startLocation"
                    type="text"
                    className={`form-input ${validationErrors.startLocation ? 'input-error' : ''}`}
                    placeholder="e.g. Bengaluru, Kochi, Mumbai..."
                    value={startLocation}
                    onChange={(e) => {
                      setStartLocation(e.target.value);
                      if (validationErrors.startLocation) {
                        setValidationErrors((prev) => ({ ...prev, startLocation: null }));
                      }
                    }}
                  />
                  {validationErrors.startLocation && (
                    <span className="field-error-text">{validationErrors.startLocation}</span>
                  )}
                  <div className="quick-city-chips">
                    {['Bengaluru', 'Kochi', 'Mumbai', 'Delhi'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="quick-chip"
                        onClick={() => setStartLocation(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div className="form-group">
                  <label htmlFor="destination" className="form-label">
                    <Compass size={15} className="label-icon" />
                    Destination *
                  </label>
                  <input
                    id="destination"
                    type="text"
                    className={`form-input ${validationErrors.destination ? 'input-error' : ''}`}
                    placeholder="e.g. Varkala, Meghalaya, Spiti..."
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setUnmatchedError(null);
                      if (validationErrors.destination) {
                        setValidationErrors((prev) => ({ ...prev, destination: null }));
                      }
                    }}
                  />
                  {validationErrors.destination && (
                    <span className="field-error-text">{validationErrors.destination}</span>
                  )}
                  <div className="quick-city-chips">
                    <span className="chips-label">Sample gems:</span>
                    {communityData.approvedDestinations.slice(0, 3).map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        className="quick-chip"
                        onClick={() => handleSelectApprovedDest(d.name)}
                      >
                        {d.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trip Duration */}
                <div className="form-group">
                  <label htmlFor="durationDays" className="form-label">
                    <Calendar size={15} className="label-icon" />
                    Trip Duration (1–14 Days) *
                  </label>
                  <div className="input-with-counter">
                    <input
                      id="durationDays"
                      type="number"
                      min="1"
                      max="14"
                      className={`form-input ${validationErrors.durationDays ? 'input-error' : ''}`}
                      value={durationDays}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setDurationDays(isNaN(val) ? '' : val);
                        if (validationErrors.durationDays) {
                          setValidationErrors((prev) => ({ ...prev, durationDays: null }));
                        }
                      }}
                    />
                    <span className="input-suffix">Days</span>
                  </div>
                  {validationErrors.durationDays && (
                    <span className="field-error-text">{validationErrors.durationDays}</span>
                  )}
                  <div className="duration-quick-pills">
                    {[3, 5, 7, 10].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`pill-choice ${durationDays === d ? 'active' : ''}`}
                        onClick={() => setDurationDays(d)}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Travellers */}
                <div className="form-group">
                  <label htmlFor="travellers" className="form-label">
                    <Users size={15} className="label-icon" />
                    Number of Travellers *
                  </label>
                  <div className="input-with-counter">
                    <input
                      id="travellers"
                      type="number"
                      min="1"
                      max="20"
                      className={`form-input ${validationErrors.travellers ? 'input-error' : ''}`}
                      value={travellers}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setTravellers(isNaN(val) ? '' : val);
                        if (validationErrors.travellers) {
                          setValidationErrors((prev) => ({ ...prev, travellers: null }));
                        }
                      }}
                    />
                    <span className="input-suffix">Person{travellers > 1 ? 's' : ''}</span>
                  </div>
                  {validationErrors.travellers && (
                    <span className="field-error-text">{validationErrors.travellers}</span>
                  )}
                  <div className="duration-quick-pills">
                    {[1, 2, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`pill-choice ${travellers === n ? 'active' : ''}`}
                        onClick={() => setTravellers(n)}
                      >
                        {n} {n === 1 ? 'Solo' : 'Travelers'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- SECTION 2: BUDGET & STYLE ---------------- */}
            <div className="planner-form-section">
              <div className="section-subheading">
                <span className="step-circle">2</span>
                <div>
                  <h3 className="subheading-title">Budget & Travel Style</h3>
                  <p className="subheading-desc">Set your total spending limit in INR and preferred way of exploring.</p>
                </div>
              </div>

              <div className="form-grid-3">
                {/* Total Trip Budget */}
                <div className="form-group">
                  <label htmlFor="budgetINR" className="form-label">
                    <span className="inr-symbol">₹</span>
                    Total Trip Budget (INR) *
                  </label>
                  <div className="input-with-currency">
                    <span className="currency-prefix">₹</span>
                    <input
                      id="budgetINR"
                      type="number"
                      min="1000"
                      step="500"
                      className={`form-input currency-input ${validationErrors.budgetINR ? 'input-error' : ''}`}
                      placeholder="e.g. 25000"
                      value={budgetINR}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setBudgetINR(isNaN(val) ? '' : val);
                        if (validationErrors.budgetINR) {
                          setValidationErrors((prev) => ({ ...prev, budgetINR: null }));
                        }
                      }}
                    />
                  </div>
                  {validationErrors.budgetINR && (
                    <span className="field-error-text">{validationErrors.budgetINR}</span>
                  )}
                  <span className="field-hint">
                    Covers accommodation, local food, activities, and local transport.
                  </span>
                </div>

                {/* Travel Style */}
                <div className="form-group">
                  <label className="form-label">
                    <Compass size={15} className="label-icon" />
                    Travel Style
                  </label>
                  <select
                    className="form-select"
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                  >
                    {TRAVEL_STYLES.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.label} — {style.description}
                      </option>
                    ))}
                  </select>
                  <span className="field-hint">Affects the pace and sequencing of daily activities.</span>
                </div>

                {/* Accommodation Preference */}
                <div className="form-group">
                  <label className="form-label">
                    <Home size={15} className="label-icon" />
                    Accommodation Preference (Optional)
                  </label>
                  <select
                    className="form-select"
                    value={accommodationPreference}
                    onChange={(e) => setAccommodationPreference(e.target.value)}
                  >
                    {ACCOMMODATION_TYPES.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.label}
                      </option>
                    ))}
                  </select>
                  <span className="field-hint">All choices support local family-run host networks.</span>
                </div>
              </div>
            </div>

            {/* ---------------- SECTION 3: 11 PREFERRED EXPERIENCES ---------------- */}
            <div className="planner-form-section">
              <div className="section-subheading">
                <span className="step-circle">3</span>
                <div className="experience-header-group">
                  <div>
                    <h3 className="subheading-title">Preferred Experiences</h3>
                    <p className="subheading-desc">Select all experiences that interest you to guide our matching engine.</p>
                  </div>
                  <span className="selection-counter-badge">
                    {selectedExperiences.length} of 11 Selected
                  </span>
                </div>
              </div>

              {validationErrors.experiences && (
                <div className="form-alert-banner">
                  <AlertCircle size={16} />
                  <span>{validationErrors.experiences}</span>
                </div>
              )}

              <div className="experiences-cards-grid">
                {EXPERIENCE_CATEGORIES.map((exp) => {
                  const Icon = iconMap[exp.icon] || Compass;
                  const isSelected = selectedExperiences.includes(exp.id);

                  return (
                    <div
                      key={exp.id}
                      className={`experience-interactive-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleExperience(exp.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          toggleExperience(exp.id);
                        }
                      }}
                    >
                      <div className="exp-card-header">
                        <div className="exp-icon-bubble">
                          <Icon size={18} />
                        </div>
                        <div className="exp-checkbox-circle">
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </div>
                      </div>

                      <strong className="exp-card-name">{exp.name}</strong>
                      <p className="exp-card-tagline">{exp.tagline}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unmatched Destination Limitation Warning */}
            {unmatchedError && (
              <div className="insufficient-data-card" role="alert">
                <div className="insufficient-header">
                  <AlertTriangle size={22} className="warning-icon" />
                  <div>
                    <h4>{unmatchedError.message}</h4>
                    <p>
                      ROOTS refuses to generate fabricated place names or live availability estimates without community verification.
                      Please select one of our approved sample destinations:
                    </p>
                  </div>
                </div>

                <div className="approved-dest-grid">
                  {unmatchedError.availableDestinations?.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className="btn-approved-dest"
                      onClick={() => handleSelectApprovedDest(d.name)}
                    >
                      <MapPin size={14} />
                      <strong>{d.name}</strong>
                      <small>({d.state})</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action Row */}
            <div className="planner-action-footer">
              <button
                type="submit"
                className="btn btn-primary btn-generate-itinerary"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner"></span>
                    <span>Matching Community Entries & Generating Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Complete Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
