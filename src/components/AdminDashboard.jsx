import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Check, X, AlertCircle, Clock, FileText, Home, BookOpen,
  MapPin, MessageSquare, AlertTriangle, CheckCircle2, User, ChevronRight,
  Filter, RefreshCw, Eye, Sparkles, BedDouble, Calendar, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  checkIsAdmin,
  setLocalUserRole,
  getHostApplications,
  moderateHostApplication,
  getAllHomestays,
  getAllDiariesForModeration,
  moderateDiary,
  getAllTipsForModeration,
  moderateDestinationTip,
  getSafetyReports,
  resolveSafetyReport,
  readStorage
} from '../services/dbService';

export function AdminDashboard({ onBackToHome, onNavigateToStay, onNavigateToCommunity }) {
  const { user, requireAuth } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Tab navigation
  const [activeSection, setActiveSection] = useState('hosts'); // 'hosts' | 'listings' | 'diaries' | 'tips' | 'reports'

  // Data states
  const [hostApplications, setHostApplications] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [tips, setTips] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Modals / Details
  const [reviewModal, setReviewModal] = useState(null); // { type, item, decision: 'approved'|'rejected'|'changes_requested' }
  const [reviewReason, setReviewReason] = useState('');

  // Check admin status
  const checkAdminPrivileges = useCallback(async () => {
    setAuthChecking(true);
    if (!user) {
      setIsAdmin(false);
      setAuthChecking(false);
      return;
    }
    const adminStatus = await checkIsAdmin(user);
    setIsAdmin(adminStatus);
    setAuthChecking(false);
  }, [user]);

  useEffect(() => {
    checkAdminPrivileges();
  }, [checkAdminPrivileges]);

  // Load section data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [apps, stays, diaryList, tipList, repList] = await Promise.all([
        getHostApplications(),
        getAllHomestays(),
        getAllDiariesForModeration(),
        getAllTipsForModeration(),
        getSafetyReports()
      ]);
      setHostApplications(apps);
      setHomestays(stays);
      setDiaries(diaryList);
      setTips(tipList);
      setReports(repList);
    } catch (err) {
      console.error('Error loading admin records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin, loadAllData]);

  // Handle Host Decision
  const handleHostDecision = async (appId, decision) => {
    try {
      await moderateHostApplication(appId, decision, reviewReason || 'Reviewed by ROOTS admin.', user);
      setActionMessage(`Host application ${decision === 'approved' ? 'approved and published' : decision}.`);
      setReviewModal(null);
      setReviewReason('');
      await loadAllData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(`Error updating application: ${err.message}`);
    }
  };

  // Handle Diary Decision
  const handleDiaryDecision = async (diaryId, decision) => {
    try {
      await moderateDiary(diaryId, decision, reviewReason || 'Moderated by ROOTS admin.', user);
      setActionMessage(`Travel diary marked as ${decision}.`);
      setReviewModal(null);
      setReviewReason('');
      await loadAllData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(`Error moderating diary: ${err.message}`);
    }
  };

  // Handle Tip Decision
  const handleTipDecision = async (tipId, decision) => {
    try {
      await moderateDestinationTip(tipId, decision, reviewReason || 'Moderated by ROOTS admin.', user);
      setActionMessage(`Destination tip marked as ${decision}.`);
      setReviewModal(null);
      setReviewReason('');
      await loadAllData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(`Error moderating tip: ${err.message}`);
    }
  };

  // Handle Report Resolution
  const handleReportAction = async (reportId, action) => {
    try {
      await resolveSafetyReport(reportId, action, reviewReason || 'Handled by admin.');
      setActionMessage(`Report marked as ${action}.`);
      setReviewModal(null);
      setReviewReason('');
      await loadAllData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(`Error updating report: ${err.message}`);
    }
  };

  // Helper for dev test toggle
  const enableAdminForCurrentSession = () => {
    if (!user) {
      requireAuth({
        actionName: 'Access Admin Dashboard',
        message: 'Sign in to access admin tools or enable test admin privileges.',
        onAuthenticated: (u) => {
          setLocalUserRole(u.id, 'admin');
          setIsAdmin(true);
        }
      });
      return;
    }
    setLocalUserRole(user.id, 'admin');
    setIsAdmin(true);
  };

  if (authChecking) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <RefreshCw className="animate-spin" size={32} color="#123B73" style={{ margin: '0 auto 16px' }} />
        <h3>Verifying administrative permissions...</h3>
      </div>
    );
  }

  // ACCESS RESTRICTED SCREEN
  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <div className="card-white" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '48px 32px' }}>
          <Shield size={48} color="#EF4444" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#123B73', marginBottom: 12 }}>
            Admin Authorization Required
          </h2>
          <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
            The ROOTS Centralized Moderation Dashboard is restricted to authorized administrators.
            Only verified admin accounts may approve homestays, moderate travel diaries, and review community safety reports.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={enableAdminForCurrentSession}
              style={{ width: '100%', maxWidth: 360 }}
            >
              <Sparkles size={16} />
              <span>{user ? 'Enable Admin Role for My Account' : 'Sign In as Admin'}</span>
            </button>

            {onBackToHome && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onBackToHome}
                style={{ width: '100%', maxWidth: 360 }}
              >
                <ArrowLeft size={16} />
                <span>Return to Homepage</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PENDING COUNTS
  const pendingHosts = hostApplications.filter(a => a.status === 'pending_verification').length;
  const pendingDiaries = diaries.filter(d => d.status === 'pending_review').length;
  const pendingTips = tips.filter(t => t.status === 'pending_review').length;
  const activeReports = reports.filter(r => r.status === 'active').length;

  return (
    <div className="roots-admin-dashboard" style={{ paddingBottom: 80 }}>
      {/* Header Banner */}
      <section className="stay-hero-banner" style={{ padding: '36px 0 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {onBackToHome && (
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="stay-breadcrumb-back-btn"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                <span className="stay-welcome-label">
                  <Shield size={12} /> CENTRALIZED CONTROL
                </span>
                <span className="stay-prototype-flag">Admin Coordinator</span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                ROOTS Moderation & Admin Dashboard
              </h1>
              <p style={{ color: '#E2E8F0', fontSize: '0.96rem', margin: '4px 0 0' }}>
                Review community host applications, moderate diaries & tips, and enforce community standards.
              </p>
            </div>

            <button
              type="button"
              className="btn-search-stays"
              onClick={loadAllData}
              title="Refresh database records"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Data</span>
            </button>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="stay-nav-tabs" style={{ marginTop: 22 }}>
            <button
              type="button"
              className={`stay-tab-btn ${activeSection === 'hosts' ? 'active' : ''}`}
              onClick={() => setActiveSection('hosts')}
            >
              <Home size={16} />
              <span>Host Applications ({hostApplications.length})</span>
              {pendingHosts > 0 && <span className="stay-tab-counter">{pendingHosts}</span>}
            </button>

            <button
              type="button"
              className={`stay-tab-btn ${activeSection === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveSection('listings')}
            >
              <BedDouble size={16} />
              <span>Active Stays ({homestays.length})</span>
            </button>

            <button
              type="button"
              className={`stay-tab-btn ${activeSection === 'diaries' ? 'active' : ''}`}
              onClick={() => setActiveSection('diaries')}
            >
              <BookOpen size={16} />
              <span>Community Diaries ({diaries.length})</span>
              {pendingDiaries > 0 && <span className="stay-tab-counter">{pendingDiaries}</span>}
            </button>

            <button
              type="button"
              className={`stay-tab-btn ${activeSection === 'tips' ? 'active' : ''}`}
              onClick={() => setActiveSection('tips')}
            >
              <MapPin size={16} />
              <span>Destination Tips ({tips.length})</span>
              {pendingTips > 0 && <span className="stay-tab-counter">{pendingTips}</span>}
            </button>

            <button
              type="button"
              className={`stay-tab-btn ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveSection('reports')}
            >
              <AlertTriangle size={16} />
              <span>Safety Reports ({reports.length})</span>
              {activeReports > 0 && <span className="stay-tab-counter">{activeReports}</span>}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: 28 }}>
        {actionMessage && (
          <div style={{
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: '12px 18px',
            borderRadius: 12,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 700
          }}>
            <CheckCircle2 size={18} />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* SECTION 1: HOST APPLICATIONS */}
        {activeSection === 'hosts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                  Host Applications Verification
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                  Verify local village credentials, ID types, safety audit declarations, and nightly rates.
                </p>
              </div>
            </div>

            {hostApplications.length === 0 ? (
              <div className="card-white" style={{ padding: 40, textAlign: 'center' }}>
                <Clock size={36} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                <h4>No Host Applications in Queue</h4>
                <p style={{ color: '#64748B' }}>When prospective hosts submit the onboarding form, applications will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {hostApplications.map(app => {
                  const isPending = app.status === 'pending_verification';
                  return (
                    <div key={app.id} className="card-white" style={{ padding: 22, borderLeft: isPending ? '4px solid #3478F6' : app.status === 'approved' ? '4px solid #16A34A' : '4px solid #EF4444' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                              {app.property_title || app.propertyName}
                            </h3>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 999,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: isPending ? '#EAF3FF' : app.status === 'approved' ? '#DCFCE7' : '#FEE2E2',
                              color: isPending ? '#123B73' : app.status === 'approved' ? '#166534' : '#991B1B'
                            }}>
                              {app.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            <strong>Host:</strong> {app.full_name || app.fullName} • {app.phone_or_email || app.phoneOrEmail} • {app.general_location || app.generalLocation}
                          </div>
                          <p style={{ fontSize: '0.88rem', color: '#334155', margin: '8px 0 0', fontStyle: 'italic' }}>
                            "{app.intro}"
                          </p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#123B73' }}>
                            ₹{app.nightly_rate_inr || app.nightlyRateINR}/night
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            Capacity: {app.max_guests || app.maxGuests} Guests • {app.rooms_count || app.rooms} Rooms
                          </div>
                        </div>
                      </div>

                      {/* Audit Details */}
                      <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 10, margin: '14px 0', fontSize: '0.82rem', color: '#475569' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                          <div><strong>Gov ID Type:</strong> {app.gov_id_type || app.verification?.govIdType}</div>
                          <div><strong>Ownership Doc:</strong> {app.ownership_doc_ref || app.verification?.ownershipDocReference}</div>
                          <div><strong>Lives on Property:</strong> {app.lives_on_property ? 'Yes' : 'No'}</div>
                          <div><strong>Submitted:</strong> {new Date(app.created_at || app.timestamp || Date.now()).toLocaleDateString()}</div>
                        </div>
                        {app.admin_notes && (
                          <div style={{ marginTop: 8, color: '#1E3A8A' }}>
                            <strong>Admin Review Note:</strong> {app.admin_notes}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {app.status !== 'approved' && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '6px 16px', fontSize: '0.84rem' }}
                            onClick={() => handleHostDecision(app.id, 'approved')}
                          >
                            <Check size={14} />
                            <span>Approve & Publish Listing</span>
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ padding: '6px 14px', fontSize: '0.84rem' }}
                            onClick={() => {
                              setReviewModal({ type: 'host', item: app, decision: 'rejected' });
                            }}
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: ACTIVE HOMESTAYS */}
        {activeSection === 'listings' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                Active Public Homestay Listings
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                All approved homestays visible to travelers on the ROOTS Stay page.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {homestays.map(stay => (
                <div key={stay.id} className="card-white" style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
                  <img
                    src={stay.photos?.[0]}
                    alt={stay.name}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }}
                  />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#123B73', margin: '0 0 6px' }}>{stay.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 8 }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {stay.general_location || stay.generalLocation}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: 12 }}>
                    Hosted by {stay.host?.name} • ₹{stay.nightly_rate_inr || stay.nightlyRateINR}/night
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 999 }}>
                      Live on ROOTS Stay
                    </span>
                    {onNavigateToStay && (
                      <button
                        type="button"
                        onClick={onNavigateToStay}
                        style={{ background: 'transparent', border: 'none', color: '#3478F6', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        View in Hub →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: COMMUNITY DIARIES */}
        {activeSection === 'diaries' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                Travel Diaries Moderation Queue
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                Only community diaries marked as 'approved' appear on the public feed.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {diaries.map(diary => {
                const isPending = diary.status === 'pending_review';
                return (
                  <div key={diary.id} className="card-white" style={{ padding: 20, borderLeft: isPending ? '4px solid #3478F6' : diary.status === 'approved' ? '4px solid #16A34A' : '4px solid #EF4444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                            {diary.title}
                          </h3>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isPending ? '#EAF3FF' : diary.status === 'approved' ? '#DCFCE7' : '#FEE2E2',
                            color: isPending ? '#123B73' : diary.status === 'approved' ? '#166534' : '#991B1B'
                          }}>
                            {diary.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0' }}>
                          Author: {diary.author_name || diary.contributor?.name || diary.author} • Destination: {diary.destination}
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: '8px 0 0' }}>
                          {diary.story?.slice(0, 220) || diary.snippet || ''}...
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {diary.status !== 'approved' && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.84rem' }}
                            onClick={() => handleDiaryDecision(diary.id, 'approved')}
                          >
                            <Check size={14} /> Approve
                          </button>
                        )}
                        {diary.status !== 'rejected' && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '0.84rem' }}
                            onClick={() => {
                              setReviewModal({ type: 'diary', item: diary, decision: 'rejected' });
                            }}
                          >
                            <X size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: DESTINATION TIPS */}
        {activeSection === 'tips' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                Destination Tips & Recommendations
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                Approved tips feed directly into destination discovery and the ROOTS AI Trip Planner engine.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tips.map(tip => (
                <div key={tip.id} className="card-white" style={{ padding: 18, borderLeft: tip.status === 'approved' ? '4px solid #16A34A' : '4px solid #3478F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                          {tip.name || tip.title}
                        </h3>
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: '#F1F5F9', fontWeight: 700 }}>
                          {tip.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: tip.status === 'approved' ? '#DCFCE7' : '#EAF3FF', color: tip.status === 'approved' ? '#166534' : '#123B73', fontWeight: 700 }}>
                          {tip.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0' }}>
                        {tip.destination || tip.destination_name} • By {tip.contributor?.name || tip.author_name || 'Traveler'}
                      </div>
                      <p style={{ fontSize: '0.88rem', color: '#334155', margin: '6px 0 0' }}>
                        {tip.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {tip.status !== 'approved' && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.84rem' }}
                          onClick={() => handleTipDecision(tip.id, 'approved')}
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}
                      {tip.status !== 'rejected' && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.84rem' }}
                          onClick={() => {
                            setReviewModal({ type: 'tip', item: tip, decision: 'rejected' });
                          }}
                        >
                          <X size={14} /> Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: SAFETY REPORTS */}
        {activeSection === 'reports' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#123B73', margin: 0 }}>
                Safety & Content Reports
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                Community traveler reports on listings or content needing safety inspection.
              </p>
            </div>

            {reports.length === 0 ? (
              <div className="card-white" style={{ padding: 40, textAlign: 'center' }}>
                <CheckCircle2 size={36} color="#16A34A" style={{ margin: '0 auto 12px' }} />
                <h4>All Clear! No Active Safety Reports</h4>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reports.map(rep => (
                  <div key={rep.id} className="card-white" style={{ padding: 18, borderLeft: rep.status === 'active' ? '4px solid #EF4444' : '4px solid #64748B' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase' }}>
                            Report on: {rep.target_title || rep.stayTitle || rep.targetTitle}
                          </span>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: '#FEE2E2', color: '#991B1B', fontWeight: 700 }}>
                            {rep.reason}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#334155', margin: '6px 0' }}>
                          <strong>Reporter Notes:</strong> {rep.notes}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          Submitted by {rep.reporter_name || rep.reporterName} on {new Date(rep.created_at || rep.timestamp || Date.now()).toLocaleDateString()}
                        </div>
                      </div>

                      {rep.status === 'active' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.84rem' }}
                            onClick={() => handleReportAction(rep.id, 'resolved')}
                          >
                            Resolve & Hide
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.84rem' }}
                            onClick={() => handleReportAction(rep.id, 'dismissed')}
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* REJECTION REASON MODAL */}
      {reviewModal && (
        <div className="auth-modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-white" style={{ maxWidth: 460, width: '90%', padding: 24, borderRadius: 16 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#123B73', marginBottom: 8 }}>
              {reviewModal.decision === 'rejected' ? 'Reject Submission' : 'Request Changes'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 16 }}>
              Provide clear feedback to the applicant on why this submission requires adjustment.
            </p>

            <textarea
              rows={4}
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              placeholder="e.g. Please provide a clear government permission reference or verify room fire safety requirements..."
              style={{ width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid #CBD5E1', fontFamily: 'inherit', fontSize: '0.9rem', marginBottom: 16 }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setReviewModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (reviewModal.type === 'host') handleHostDecision(reviewModal.item.id, reviewModal.decision);
                  else if (reviewModal.type === 'diary') handleDiaryDecision(reviewModal.item.id, reviewModal.decision);
                  else if (reviewModal.type === 'tip') handleTipDecision(reviewModal.item.id, reviewModal.decision);
                }}
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
