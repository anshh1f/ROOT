import React from 'react';
import { X, Trash2, Calendar, MapPin, DollarSign, BookmarkCheck, ArrowRight } from 'lucide-react';

export function SavedTripsDrawer({ isOpen, onClose, savedTrips, onDeleteTrip, onSelectTrip }) {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <BookmarkCheck size={20} color="#3478F6" />
            <h3 className="drawer-title">My Saved Trips</h3>
            <span className="drawer-count-badge">{savedTrips.length}</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close saved trips drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {savedTrips.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-icon-circle">
                <Calendar size={32} color="#64748B" />
              </div>
              <h4>No saved itineraries yet</h4>
              <p>
                Use the interactive trip planner on the homepage to generate a custom day-by-day 
                plan and click "Save to My Trips".
              </p>
              <a
                href="#plan-trip"
                className="btn btn-primary btn-sm"
                onClick={onClose}
              >
                Go to Planner
              </a>
            </div>
          ) : (
            <div className="saved-trips-list">
              {savedTrips.map((trip) => (
                <div key={trip.id} className="saved-trip-item card-white">
                  <div className="trip-item-header">
                    <div>
                      <h4 className="trip-dest-title">{trip.destination}</h4>
                      <div className="trip-meta-row">
                        <span className="trip-pill">{trip.durationDays} Days</span>
                        <span className="trip-pill">{trip.travelStyle || trip.budget || 'Custom'}</span>
                        <span className="trip-cost">
                          {trip.budgetSummary ? `₹${trip.budgetSummary.totalEstimatedCost.toLocaleString('en-IN')}` : (trip.estimatedCost || '')}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-delete-trip"
                      onClick={() => onDeleteTrip(trip.id)}
                      title="Remove saved itinerary"
                      aria-label="Delete saved trip"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="trip-start-text">
                    Starting from: <strong>{trip.startLocation}</strong>
                  </p>

                  <div className="trip-schedule-preview">
                    {trip.schedule?.slice(0, 2).map((day, idx) => (
                      <div key={day.dayNumber || day.day || idx} className="mini-day-preview">
                        <strong>Day {day.dayNumber || day.day || idx + 1}:</strong> {day.dayTheme || day.title}
                      </div>
                    ))}
                    {trip.schedule?.length > 2 && (
                      <span className="more-days-hint">
                        + {trip.schedule.length - 2} more days in itinerary
                      </span>
                    )}
                  </div>

                  <div className="trip-item-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        onSelectTrip(trip);
                        onClose();
                      }}
                    >
                      <span>View Full Plan</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <small>
            Saved locally in your browser's localStorage. Zero tracking cookies or third-party storage.
          </small>
        </div>
      </div>
    </div>
  );
}
