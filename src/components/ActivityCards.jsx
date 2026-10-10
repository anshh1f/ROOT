import React from 'react';
import { 
  Utensils, 
  Mountain, 
  Waves, 
  Landmark, 
  Music, 
  Users, 
  Camera, 
  TreePine, 
  CheckCircle2,
  Compass,
  Languages,
  EyeOff
} from 'lucide-react';
import { SAMPLE_ACTIVITIES } from '../data/sampleData';

const iconMap = {
  Utensils: Utensils,
  Mountain: Mountain,
  Waves: Waves,
  Landmark: Landmark,
  Music: Music,
  Users: Users,
  Camera: Camera,
  TreePine: TreePine,
  Compass: Compass,
  Languages: Languages,
  EyeOff: EyeOff
};

export function ActivityCards({ selectedActivities, onToggleActivity, onSelectOnlyActivity }) {
  return (
    <section id="explore" className="section activities-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Compass size={14} />
            Immersive Experiences
          </span>
          <h2 className="section-title">Experiences Rooted in Real Communities</h2>
          <p className="section-description">
            Choose what calls you. Select one or more activities to tailor your custom itinerary 
            or filter community diaries and destinations below.
          </p>
        </div>

        <div className="activities-grid">
          {SAMPLE_ACTIVITIES.map((activity) => {
            const Icon = iconMap[activity.icon] || Compass;
            const isSelected = selectedActivities.includes(activity.id);

            return (
              <div
                key={activity.id}
                className={`activity-card card-white ${isSelected ? 'selected' : ''}`}
                onClick={() => onToggleActivity(activity.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleActivity(activity.id);
                  }
                }}
                aria-pressed={isSelected}
              >
                <div className="activity-image-wrapper">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="activity-image"
                    loading="lazy"
                  />
                  <div className="activity-overlay-gradient"></div>
                  
                  <div className="activity-icon-floating">
                    <Icon size={18} />
                  </div>

                  {isSelected && (
                    <div className="activity-selected-badge" title="Added to your planner preferences">
                      <CheckCircle2 size={16} />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                <div className="activity-content">
                  <div className="activity-header">
                    <h3 className="activity-name">{activity.name}</h3>
                  </div>
                  <p className="activity-tagline">{activity.tagline}</p>
                  
                  <div className="activity-sample-box">
                    <span className="sample-box-label">Example experience:</span>
                    <p className="sample-box-text">"{activity.sampleExperience}"</p>
                  </div>

                  <div className="activity-footer-action">
                    <button
                      type="button"
                      className={`btn-toggle-activity ${isSelected ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleActivity(activity.id);
                      }}
                    >
                      {isSelected ? '✓ In Itinerary Plan' : '+ Add to Trip Plan'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedActivities.length > 0 && (
          <div className="activities-selection-summary">
            <div className="summary-left">
              <strong>{selectedActivities.length} activities selected:</strong>
              <div className="selected-chips">
                {selectedActivities.map((actId) => {
                  const act = SAMPLE_ACTIVITIES.find((a) => a.id === actId);
                  return (
                    <span key={actId} className="chip">
                      {act?.name || actId}
                      <button
                        type="button"
                        onClick={() => onToggleActivity(actId)}
                        className="chip-remove"
                        aria-label={`Remove ${act?.name}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <a href="#plan-trip" className="btn btn-primary btn-sm">
              Apply to Plan Form ↓
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
