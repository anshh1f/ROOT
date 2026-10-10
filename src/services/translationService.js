/**
 * ROOTS Lingua — Translation Service Module (Secure Server-Side Architecture)
 * 
 * In this secure design, the client browser NEVER contacts the external Gemini
 * API directly and NEVER receives the API key in client-side bundles or network calls.
 * 
 * All translation requests are dispatched to the secure internal server endpoint:
 * POST /api/translate
 * 
 * The server securely injects GEMINI_API_KEY from .env.local and proxies the request.
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🌴' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🛕' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇦🇪' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🐘' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🐅' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
];

let cachedServerStatus = null;

/**
 * Checks server endpoint configuration status.
 */
export async function fetchTranslationProviderStatus() {
  try {
    const res = await fetch('/api/translate/status');
    if (res.ok) {
      const data = await res.json();
      cachedServerStatus = data;
      return data;
    }
  } catch {
    // If backend middleware not responding, fall back to synchronous status
  }
  return getTranslationProviderStatus();
}

/**
 * Synchronous status helper for immediate rendering.
 */
export function getTranslationProviderStatus() {
  if (cachedServerStatus) return cachedServerStatus;

  return {
    isConfigured: true,
    provider: 'server-gemini',
    providerName: 'Google Gemini (Secure Server Endpoint)',
    isServerSecured: true,
    description: 'Protected server endpoint (/api/translate). API key is private on the server and never exposed in browser network traffic.'
  };
}

/**
 * Translates text via the secure server proxy endpoint.
 * 
 * @param {Object} params
 * @param {string} params.text - The text to translate
 * @param {string} params.sourceLang - ISO code (e.g., 'en', 'ml')
 * @param {string} params.targetLang - ISO code
 * @returns {Promise<Object>} { success, translatedText, phonetic, error, message, setupGuide }
 */
export async function translateText({ text, sourceLang, targetLang }) {
  if (!text || !text.trim()) {
    return {
      success: false,
      error: 'EMPTY_TEXT',
      message: 'Please enter text to translate.'
    };
  }

  if (sourceLang === targetLang) {
    return {
      success: true,
      translatedText: text.trim(),
      phonetic: '',
      provider: 'identity'
    };
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.trim(),
        sourceLang,
        targetLang
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      if (data.error === 'NO_PROVIDER_CONFIGURED') {
        return {
          success: false,
          error: 'NO_PROVIDER_CONFIGURED',
          message: 'Server translation service is unavailable: No GEMINI_API_KEY found in .env.local on the server.',
          setupGuide: [
            {
              title: 'Secure Server-Side Configuration',
              steps: [
                'Add GEMINI_API_KEY=your_key_here to .env.local (no VITE_ prefix needed).',
                'Restart the Vite dev server: npm run dev.',
                'The server endpoint securely proxies all translations without exposing your key.'
              ]
            }
          ]
        };
      }

      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Translation server returned an error.'
      };
    }

    return {
      success: true,
      translatedText: data.translatedText || '',
      phonetic: data.phonetic || '',
      provider: data.provider || 'Secure Server Endpoint'
    };
  } catch (err) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: `Failed to reach translation server: ${err.message}`
    };
  }
}
