import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Clock, MapPin, Plus, X, User, Check, Send } from 'lucide-react';
import { SAMPLE_TRAVEL_DIARIES } from '../data/sampleData';

export function TravelDiaries({ onOpenCommunity }) {
  const [diaries, setDiaries] = useState(() => {
    const saved = localStorage.getItem('roots_community_diaries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...SAMPLE_TRAVEL_DIARIES, ...parsed];
      } catch (e) {
        return SAMPLE_TRAVEL_DIARIES;
      }
    }
    return SAMPLE_TRAVEL_DIARIES;
  });

  const [activeDiary, setActiveDiary] = useState(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [likedMap, setLikedMap] = useState(() => {
    const saved = localStorage.getItem('roots_diary_likes');
    return saved ? JSON.parse(saved) : {};
  });

  // New diary form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Meeting Locals');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleLike = (diaryId) => {
    const next = { ...likedMap, [diaryId]: !likedMap[diaryId] };
    setLikedMap(next);
    localStorage.setItem('roots_diary_likes', JSON.stringify(next));
  };

  const handleCreateDiary = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newEntry = {
      id: `user-diary-${Date.now()}`,
      title: newTitle,
      author: newAuthor.trim() || 'Fellow Explorer',
      location: newLocation.trim() || 'Local Foothills',
      date: 'Just now (Prototype entry)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      snippet: newContent.slice(0, 140) + '...',
      fullText: newContent,
      tags: [newTag, 'Community Story'],
      likes: 1,
      readTime: '3 min read',
      isUserCreated: true
    };

    const userDiaries = JSON.parse(localStorage.getItem('roots_community_diaries') || '[]');
    const updatedUserDiaries = [newEntry, ...userDiaries];
    localStorage.setItem('roots_community_diaries', JSON.stringify(updatedUserDiaries));

    setDiaries([newEntry, ...diaries]);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      setShowWriteModal(false);
      setNewTitle('');
      setNewAuthor('');
      setNewLocation('');
      setNewContent('');
    }, 1800);
  };

  return (
    <section id="diaries" className="section diaries-section">
      <div className="container">
        <div className="section-header">
          <div className="header-badge-row">
            <span className="section-tag">
              <BookOpen size={14} />
              Travel Diaries
            </span>
            <span className="sample-badge">Community Stories</span>
          </div>
          <h2 className="section-title">Stories Written from the Hearth</h2>
          <p className="section-description">
            Read first-hand accounts from community members who traded tourist itineraries 
            for sunrise rowboats, bamboo woodcarving, and village chai circles.
          </p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {onOpenCommunity && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenCommunity}
              >
                <BookOpen size={16} />
                <span>Explore Community Hub (Diaries, Places & Experiences)</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (onOpenCommunity) onOpenCommunity();
                else setShowWriteModal(true);
              }}
            >
              <Plus size={16} />
              <span>Share Your Travel Story</span>
            </button>
          </div>
        </div>

        {/* Diaries Cards Grid */}
        <div className="diaries-grid">
          {diaries.map((diary) => {
            const isLiked = !!likedMap[diary.id];
            const currentLikes = diary.likes + (isLiked ? 1 : 0);

            return (
              <article key={diary.id} className="diary-card card-white">
                <div className="diary-image-wrapper">
                  <img
                    src={diary.cover}
                    alt={diary.title}
                    className="diary-cover-img"
                    loading="lazy"
                  />
                  <div className="diary-read-badge">
                    <Clock size={12} />
                    <span>{diary.readTime}</span>
                  </div>
                  {diary.isUserCreated && (
                    <div className="diary-user-badge">Your Story (Local)</div>
                  )}
                </div>

                <div className="diary-content">
                  <div className="diary-meta-row">
                    <div className="diary-author-group">
                      <img
                        src={diary.avatar}
                        alt={diary.author}
                        className="diary-avatar"
                      />
                      <div>
                        <strong className="diary-author-name">{diary.author}</strong>
                        <div className="diary-location">
                          <MapPin size={12} />
                          <span>{diary.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="diary-title" onClick={() => setActiveDiary(diary)}>
                    {diary.title}
                  </h3>

                  <p className="diary-snippet">
                    {diary.snippet}
                  </p>

                  <div className="diary-tags-row">
                    {diary.tags.map((tag, i) => (
                      <span key={i} className="diary-tag">#{tag}</span>
                    ))}
                  </div>

                  <div className="diary-footer">
                    <button
                      type="button"
                      className={`btn-like ${isLiked ? 'liked' : ''}`}
                      onClick={() => toggleLike(diary.id)}
                      aria-label="Applaud story"
                    >
                      <Heart size={16} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : '#64748B'} />
                      <span>{currentLikes}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-read-more"
                      onClick={() => setActiveDiary(diary)}
                    >
                      Read Diary →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Read Full Diary Modal */}
        {activeDiary && (
          <div className="modal-backdrop" onClick={() => setActiveDiary(null)}>
            <div className="modal-dialog diary-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveDiary(null)}
                aria-label="Close diary modal"
              >
                <X size={20} />
              </button>

              <div className="modal-hero-img-box">
                <img src={activeDiary.cover} alt={activeDiary.title} className="modal-cover-img" />
              </div>

              <div className="modal-body-content">
                <div className="modal-author-header">
                  <img src={activeDiary.avatar} alt={activeDiary.author} className="modal-avatar" />
                  <div>
                    <h4 className="modal-author-name">{activeDiary.author}</h4>
                    <span className="modal-meta-text">{activeDiary.location} • {activeDiary.date}</span>
                  </div>
                </div>

                <h2 className="modal-diary-title">{activeDiary.title}</h2>

                <div className="modal-diary-tags">
                  {activeDiary.tags.map((t, i) => (
                    <span key={i} className="diary-tag">#{t}</span>
                  ))}
                </div>

                <div className="modal-text-passage">
                  <p>{activeDiary.fullText}</p>
                </div>

                <div className="modal-footer-box">
                  <span className="sample-badge">Sample Community Diary</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveDiary(null)}
                  >
                    Done Reading
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Your Story Modal */}
        {showWriteModal && (
          <div className="modal-backdrop" onClick={() => setShowWriteModal(false)}>
            <div className="modal-dialog write-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowWriteModal(false)}
                aria-label="Close write diary modal"
              >
                <X size={20} />
              </button>

              <div className="modal-body-content">
                <span className="section-tag">
                  <BookOpen size={14} />
                  Community Journal
                </span>
                <h3 className="modal-title">Share Your Authentic Travel Diary</h3>
                <p className="modal-subtitle">
                  Describe a moment where stepping off the beaten path made you feel at home.
                </p>

                {submitSuccess ? (
                  <div className="success-banner">
                    <Check size={20} />
                    <span>Your travel diary has been saved and published to the local showcase!</span>
                  </div>
                ) : (
                  <form onSubmit={handleCreateDiary} className="write-form">
                    <div className="form-group">
                      <label className="form-label">Story Title</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Afternoon tea with the stonecutters of Badami"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Maya Sharma"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Location Visited</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Badami, Karnataka"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Primary Theme</label>
                      <select
                        className="form-select"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      >
                        <option value="Meeting Locals">Meeting Locals</option>
                        <option value="Local Food">Local Food</option>
                        <option value="Hiking">Hiking & Trails</option>
                        <option value="Culture">Living Culture</option>
                        <option value="Nature">Nature & Wildlife</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Story</label>
                      <textarea
                        className="form-textarea"
                        rows="5"
                        placeholder="Share the moments, conversations, scents, and lessons..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="modal-form-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setShowWriteModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <Send size={16} />
                        <span>Publish Diary (Local Prototype)</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
