import { createClient } from '@supabase/supabase-js';

// Safe environment variable resolution (Vite browser runtime or Node testing)
const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' ? process.env : {});

// Read environment variables (supports VITE_ convention and NEXT_PUBLIC_ alias)
const rawUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
const supabaseAnonKey = typeof rawKey === 'string' ? rawKey.trim() : '';

// Security Check: Guard against exposing server-only secret or service_role keys to client
const isSecretKey = Boolean(
  supabaseAnonKey && (
    supabaseAnonKey.startsWith('sb_secret_') ||
    supabaseAnonKey.toLowerCase().includes('service_role')
  )
);

if (isSecretKey) {
  console.error(
    'ROOTS Security Warning: A Supabase service_role or secret key was detected in frontend environment variables. ' +
    'Secret keys must NEVER be exposed to browser clients. Please provide your public/anon publishable key instead.'
  );
}

// Check if valid credentials have been set (not empty, starts with https://, not placeholder, not secret key)
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !isSecretKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-publishable-key-here') &&
  !supabaseAnonKey.includes('placeholder')
);

/**
 * Returns diagnostic configuration status and details what variables are missing or misconfigured.
 */
export function getSupabaseConfigStatus() {
  const missing = [];
  if (!supabaseUrl || supabaseUrl.includes('your-project-id') || !supabaseUrl.startsWith('https://')) {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!supabaseAnonKey || supabaseAnonKey.includes('your-supabase-publishable-key') || supabaseAnonKey.includes('placeholder')) {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  }

  if (isSecretKey) {
    return {
      isConfigured: false,
      missing,
      error: 'Security Warning: A secret/service_role key was provided. Only public/publishable anon keys are allowed in client.'
    };
  }

  if (missing.length > 0) {
    return {
      isConfigured: false,
      missing,
      error: `Missing or placeholder credentials: ${missing.join(', ')}`
    };
  }

  return {
    isConfigured: true,
    missing: [],
    error: null
  };
}

// Create and export the Supabase client safely
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Health-check helper to verify whether the connection to Supabase is active.
 * Never exposes secrets or service keys.
 */
export async function testSupabaseConnection(customUrl, customKey) {
  const clientToTest = (customUrl && customKey)
    ? createClient(customUrl, customKey)
    : supabase;

  if (!clientToTest) {
    return {
      success: false,
      message: 'Supabase credentials are not configured yet or are using placeholder values in .env.local.'
    };
  }

  try {
    // Attempt a lightweight public auth session check to test connectivity
    const { error } = await clientToTest.auth.getSession();
    if (error) {
      return {
        success: false,
        message: `Connection error: ${error.message}`
      };
    }
    return {
      success: true,
      message: 'Connected to Supabase project successfully!'
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to connect: ${err.message || 'Unknown network error'}`
    };
  }
}
