import { createClient } from '@supabase/supabase-js';

// Safe environment variable resolution (Vite browser runtime or Node testing)
const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' ? process.env : {});

// Read environment variables (must start with VITE_ for Vite frontend)
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Check if valid credentials have been set (not empty and not the placeholder)
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-publishable-key') &&
  supabaseUrl.startsWith('https://')
);

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
