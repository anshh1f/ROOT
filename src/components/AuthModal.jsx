import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const {
    authModal,
    closeAuthModal,
    signIn,
    signUp,
    resetPassword,
    isConfigured,
    configStatus
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize internal mode with context state when modal opens
  useEffect(() => {
    if (authModal.isOpen) {
      setMode(authModal.mode || 'login');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [authModal.isOpen, authModal.mode]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModal.isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModal.isOpen, closeAuthModal]);

  if (!authModal.isOpen) return null;

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isConfigured) {
      setErrorMsg(
        'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local to enable live Supabase authentication.'
      );
      return;
    }

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both email address and password.');
        return;
      }

      setLoading(true);
      const res = await signIn({ email, password });
      setLoading(false);

      if (!res.success) {
        const msg = res.error?.message || 'Invalid email or password.';
        if (msg.includes('Invalid login credentials')) {
          setErrorMsg('Incorrect email or password. Please try again.');
        } else if (msg.includes('Email not confirmed')) {
          setErrorMsg('Please verify your email address before logging in.');
        } else {
          setErrorMsg(msg);
        }
      } else {
        resetFormFields();
      }
    } else if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your password.');
        return;
      }

      setLoading(true);
      const res = await signUp({ email, password, fullName });
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error?.message || 'Registration failed. Please try again.');
      } else if (res.needsEmailConfirmation) {
        setSuccessMsg(
          'Account created! A confirmation link has been sent to your email. Please verify your email to log in.'
        );
      } else {
        setSuccessMsg('Account created successfully! Welcome to ROOTS.');
        setTimeout(() => {
          resetFormFields();
        }, 1200);
      }
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Please enter your account email address.');
        return;
      }

      setLoading(true);
      const res = await resetPassword(email);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error?.message || 'Could not send reset link. Please try again.');
      } else {
        setSuccessMsg(
          'Password reset instructions have been sent to your email. Please check your inbox.'
        );
      }
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeAuthModal();
        }
      }}
    >
      <div className="modal-content auth-modal-card">
        {/* Modal Header */}
        <div className="modal-header auth-modal-header">
          <div className="auth-header-brand">
            <div className="auth-brand-icon">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <circle cx="50" cy="50" r="46" fill="#123B73" />
                <path d="M50 16 L58 42 L84 50 L58 58 L50 84 L42 58 L16 50 L42 42 Z" fill="#3478F6" />
                <circle cx="50" cy="50" r="9" fill="#FFFFFF" />
              </svg>
            </div>
            <div>
              <h2 id="auth-modal-title" className="auth-title">
                {mode === 'login' && 'Sign in to ROOTS'}
                {mode === 'signup' && 'Create your ROOTS Account'}
                {mode === 'forgot' && 'Reset your Password'}
              </h2>
              <span className="auth-subtitle">Discover the place beyond the places.</span>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeAuthModal}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body auth-modal-body">
          {/* Contextual Action Message (when prompted from a protected user action) */}
          {authModal.message && (
            <div className="auth-contextual-callout">
              <Compass size={18} className="auth-callout-icon" />
              <p className="auth-callout-text">{authModal.message}</p>
            </div>
          )}

          {/* Supabase Configuration Guidance (shown when credentials are placeholder / missing) */}
          {!isConfigured && (
            <div className="auth-config-guidance-card">
              <div className="config-guidance-header">
                <Info size={16} />
                <strong>Supabase Auth Setup Required</strong>
              </div>
              <p className="config-guidance-text">
                ROOTS uses <strong>Supabase Auth</strong> for secure credentials, email confirmation, and session management.
                {configStatus?.error && (
                  <span style={{ display: 'block', color: 'var(--status-error)', marginTop: '6px', fontWeight: 600 }}>
                    Status: {configStatus.error}
                  </span>
                )}
                To enable live Supabase authentication, configure <code>.env.local</code> with:
              </p>
              <div className="config-guidance-code">
                <code>VITE_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co</code><br />
                <code>VITE_SUPABASE_PUBLISHABLE_KEY=[YOUR-ANON-KEY]</code>
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs (Login vs Sign Up) */}
          {mode !== 'forgot' && (
            <div className="auth-tab-switcher" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`auth-switcher-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => handleSwitchMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`auth-switcher-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => handleSwitchMode('signup')}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error / Success Feedback Banners */}
          {errorMsg && (
            <div className="alert-banner alert-error" role="alert">
              <AlertCircle size={18} className="alert-icon" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert-banner alert-success" role="status">
              <CheckCircle2 size={18} className="alert-icon" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="auth-full-name" className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-field-icon" aria-hidden="true" />
                  <input
                    id="auth-full-name"
                    type="text"
                    className="form-control auth-input"
                    placeholder="e.g. Maya Shenoy"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email" className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-field-icon" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  className="form-control auth-input"
                  placeholder="explorer@roots-travel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="auth-password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="auth-link-text"
                      onClick={() => handleSwitchMode('forgot')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-field-icon" aria-hidden="true" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control auth-input auth-password-input"
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="auth-confirm-password" className="form-label">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-field-icon" aria-hidden="true" />
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control auth-input auth-password-input"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    tabIndex={0}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <span className="auth-helper-error">Passwords do not match</span>
                )}
              </div>
            )}

            {/* Privacy Assurance */}
            <div className="auth-privacy-note">
              <ShieldCheck size={14} className="privacy-icon" />
              <span>
                {mode === 'signup'
                  ? 'Your profile is private. We never share your credentials or personal travel data.'
                  : 'Secured via Supabase authentication. Plaintext passwords are never stored.'}
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>Please wait...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Create ROOTS Account</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode Footer Links */}
          <div className="auth-footer-switch">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  className="auth-link-bold"
                  onClick={() => handleSwitchMode('signup')}
                >
                  Create one now
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-link-bold"
                  onClick={() => handleSwitchMode('login')}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  className="auth-link-bold"
                  onClick={() => handleSwitchMode('login')}
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>

          {/* Guest Dismissal Option */}
          <div className="auth-guest-dismiss-row">
            <button
              type="button"
              className="btn btn-ghost btn-sm auth-dismiss-btn"
              onClick={closeAuthModal}
            >
              Continue exploring as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
