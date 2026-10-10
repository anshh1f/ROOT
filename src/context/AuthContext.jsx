import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal control state
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login', // 'login' | 'signup' | 'forgot'
    message: '',
    onAuthenticated: null
  });

  // Listen to Supabase Auth state changes and restore initial session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Get current active session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (isMounted) {
        if (!error && currentSession) {
          setSession(currentSession);
          setUser(currentSession.user ?? null);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('ROOTS: Failed to restore Supabase session', err);
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    });

    // 2. Subscribe to auth changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);

        // If newly signed in and a post-auth action was queued, execute it
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && newSession?.user) {
          if (authModal.onAuthenticated && typeof authModal.onAuthenticated === 'function') {
            try {
              authModal.onAuthenticated(newSession.user);
            } catch (err) {
              console.error('ROOTS: Error executing post-auth callback', err);
            }
          }
          // Close modal once successfully signed in
          setAuthModal(prev => ({ ...prev, isOpen: false, onAuthenticated: null }));
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [authModal.onAuthenticated]);

  // Open modal with specific mode and optional contextual message
  const openAuthModal = useCallback(({ mode = 'login', message = '', onAuthenticated = null } = {}) => {
    setAuthModal({
      isOpen: true,
      mode,
      message,
      onAuthenticated
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal({
      isOpen: false,
      mode: 'login',
      message: '',
      onAuthenticated: null
    });
  }, []);

  // Helper for protected actions: if user is logged in, immediately run action;
  // otherwise, open login/signup modal with contextual explanation and queue action.
  const requireAuth = useCallback(({ actionName, message, onAuthenticated } = {}) => {
    if (user) {
      if (onAuthenticated && typeof onAuthenticated === 'function') {
        onAuthenticated(user);
      }
      return true;
    }

    const defaultMsg = message || (actionName
      ? `Create an account or sign in to ${actionName.toLowerCase()} and keep everything in one place.`
      : 'Create an account to save your journey and keep everything in one place.');

    openAuthModal({
      mode: 'login',
      message: defaultMsg,
      onAuthenticated
    });
    return false;
  }, [user, openAuthModal]);

  // Sign In with email and password
  const signIn = useCallback(async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: {
          message: 'Supabase credentials are not configured yet. Please add your real VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.'
        }
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { success: false, error };
      }

      setSession(data.session);
      setUser(data.user);

      if (authModal.onAuthenticated && typeof authModal.onAuthenticated === 'function') {
        try {
          authModal.onAuthenticated(data.user);
        } catch (err) {
          console.error('ROOTS: Post-auth callback error', err);
        }
      }

      closeAuthModal();
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return {
        success: false,
        error: { message: err.message || 'An unexpected error occurred during sign in.' }
      };
    }
  }, [authModal.onAuthenticated, closeAuthModal]);

  // Sign Up with email, password, and full name
  const signUp = useCallback(async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: {
          message: 'Supabase credentials are not configured yet. Please add your real VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.'
        }
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          },
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });

      if (error) {
        return { success: false, error };
      }

      // Check whether session was created immediately or confirmation email is required
      const isEmailConfirmationRequired = Boolean(data.user && !data.session);

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        if (authModal.onAuthenticated && typeof authModal.onAuthenticated === 'function') {
          try {
            authModal.onAuthenticated(data.user);
          } catch (err) {
            console.error('ROOTS: Post-signup callback error', err);
          }
        }
        closeAuthModal();
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        needsEmailConfirmation: isEmailConfirmationRequired
      };
    } catch (err) {
      return {
        success: false,
        error: { message: err.message || 'An unexpected error occurred during registration.' }
      };
    }
  }, [authModal.onAuthenticated, closeAuthModal]);

  // Sign Out
  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      if (error) {
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      setUser(null);
      setSession(null);
      return {
        success: false,
        error: { message: err.message || 'Failed to sign out cleanly.' }
      };
    }
  }, []);

  // Password Recovery
  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: {
          message: 'Supabase credentials are not configured yet. Please add your real VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.'
        }
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}?view=reset-password` : undefined
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: { message: err.message || 'Failed to request password reset.' }
      };
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    isConfigured: isSupabaseConfigured,
    configStatus: getSupabaseConfigStatus(),
    authModal,
    openAuthModal,
    closeAuthModal,
    requireAuth,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
