import React, { useState } from 'react';
import { MapPin, Sparkles, Compass, Check, ArrowRight, Tag, Info } from 'lucide-react';
import { SAMPLE_DESTINATIONS } from '../data/sampleData';

export function CuratedDestinations({ onSelectDestination }) {
  const [filterActivity, setFilterActivity] = useState('all');

  const filteredDestinations = filterActivity === 'all'
    ? SAMPLE_DESTINATIONS
    : SAMPLE_DESTINATIONS.filter((d) => d.bestFor.includes(filterActivity));

  return (
    <section id="destinations" className="section destinations-section">
      <div className="container">
        <div className="section-header">
          <div className="header-badge-row">
            <span className="section-tag">
              <MapPin size={14} />
              Curated Destinations
            </span>
            <span className="sample-badge">Sample Prototype Data</span>
          </div>
          <h2 className="section-title">Places Untouched by Mass Tourism</h2>
          <p className="section-description">
            Carefully scouted retreats where travelers participate in preservation, 
            learn heritage skills, and engage ethically with local communities.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="destination-filter-bar">
          <span className="filter-label">Filter by focus:</span>
          <div className="filter-chips">
            <button
              type="button"
              className={`filter-btn ${filterActivity === 'all' ? 'active' : ''}`}
              onClick={() => setFilterActivity('all')}
            >
              All Destinations ({SAMPLE_DESTINATIONS.length})
            </button>
            <button
              type="button"
              className={`filter-btn ${filterActivity === 'nature' ? 'active' : ''}`}
              onClick={() => setFilterActivity('nature')}
            >
              Nature & Forests
            </button>
            <button
              type="button"
              className={`filter-btn ${filterActivity === 'hiking' ? 'active' : ''}`}
              onClick={() => setFilterActivity('hiking')}
            >
              Hiking Trails
            </button>
            <button
              type="button"
              className={`filter-btn ${filterActivity === 'culture' ? 'active' : ''}`}
              onClick={() => setFilterActivity('culture')}
            >
              Living Culture
            </button>
            <button
              type="button"
              className={`filter-btn ${filterActivity === 'local-food' ? 'active' : ''}`}
              onClick={() => setFilterActivity('local-food')}
            >
              Heritage Food
            </button>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="destinations-grid">
          {filteredDestinations.map((dest) => (
            <div key={dest.id} className="destination-card card-white">
              <div className="dest-image-box">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="dest-image"
                  loading="lazy"
                />
                <div className="dest-tag-badge">
                  <MapPin size={12} />
                  <span>{dest.region}</span>
                </div>
                <div className="dest-sample-tag">Sample Showcase</div>
              </div>

              <div className="dest-content">
                <div className="dest-header">
                  <h3 className="dest-title">{dest.name}</h3>
                  <span className="dest-vibe">{dest.vibe}</span>
                </div>

                <div className="dest-highlights">
                  <strong>Key authentic highlights:</strong>
                  <ul>
                    {dest.highlights.map((h, idx) => (
                      <li key={idx}>
                        <Check size={14} className="check-icon" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dest-insider-box">
                  <div className="insider-label">
                    <Info size={14} />
                    <span>Local Insider Tip:</span>
                  </div>
                  <p className="insider-text">"{dest.localInsiderTip}"</p>
                </div>

                <div className="dest-footer">
                  <div className="dest-price-info">
                    <span className="price-label">Sample estimated budget:</span>
                    <span className="price-value">{dest.sampleCost}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm btn-plan-dest"
                    onClick={() => onSelectDestination(`${dest.name}, ${dest.region}`)}
                  >
                    <span>Plan this trip</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="prototype-data-disclaimer">
          <Info size={16} />
          <span>
            Notice: Curated destinations are demonstrated using manually structured editorial sample data. 
            All suggestions emphasize environmental preservation and respect for local traditions.
          </span>
        </div>
      </div>
    </section>
  );
}
