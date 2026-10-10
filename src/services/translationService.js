/**
 * ROOTS Lingua — Translation Service Module
 * 
 * Provides a clean, pluggable architecture for real machine and AI translation.
 * 
 * Supported Providers (configured via .env.local):
 * 1. Google Gemini API (via VITE_GEMINI_API_KEY):
 *    Provides authentic, colloquial, context-aware translations.
 * 2. LibreTranslate or Custom API (via VITE_TRANSLATION_API_URL + optional VITE_TRANSLATION_API_KEY).
 * 
 * NOTE: If no provider is configured, this service cleanly reports the 
 * unconfigured state and explains the setup requirements without faking 
 * arbitrary translations.
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

/**
 * Checks which translation provider (if any) is configured in environment variables.
 */
export function getTranslationProviderStatus() {
  const geminiKey = import.meta.env?.VITE_GEMINI_API_KEY;
  const customUrl = import.meta.env?.VITE_TRANSLATION_API_URL;

  if (geminiKey && geminiKey !== 'your-gemini-api-key-here' && !geminiKey.includes('placeholder')) {
    return {
      isConfigured: true,
      provider: 'gemini',
      providerName: 'Google Gemini AI',
      description: 'Using Gemini AI for natural local dialect translation'
    };
  }

  if (customUrl && customUrl.startsWith('http')) {
    return {
      isConfigured: true,
      provider: 'custom',
      providerName: 'Custom Translation API',
      description: `Connected to ${new URL(customUrl).hostname}`
    };
  }

  return {
    isConfigured: false,
    provider: null,
    providerName: 'None (Unconfigured)',
    description: 'No external translation API connected yet. Setup required in .env.local.'
  };
}

/**
 * Translates text from source language to target language using a configured real provider.
 * Does NOT fake arbitrary translations if no provider is configured.
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

  const status = getTranslationProviderStatus();
  const sourceName = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang;
  const targetName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;

  // 1. Google Gemini AI Provider
  if (status.provider === 'gemini') {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const prompt = `You are a specialized travel translation assistant for the ROOTS community travel platform.
Translate the following travel text from ${sourceName} (${sourceLang}) to ${targetName} (${targetLang}).
Provide:
1. The natural, polite translation suitable for a traveler speaking to locals.
2. A phonetic pronunciation guide (using Roman script / English letters) if the target language uses non-Latin script.

Respond ONLY with a JSON object in this exact schema:
{
  "translatedText": "translation here",
  "phonetic": "phonetic pronunciation here or empty string"
}

Text to translate:
"""${text.trim()}"""`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error (${response.status})`);
      }

      const data = await response.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) throw new Error('Empty response from translation provider');

      const parsed = JSON.parse(rawJson);
      return {
        success: true,
        translatedText: parsed.translatedText || '',
        phonetic: parsed.phonetic || '',
        provider: 'Google Gemini'
      };
    } catch (err) {
      return {
        success: false,
        error: 'API_ERROR',
        message: `Translation request failed: ${err.message}`
      };
    }
  }

  // 2. Custom or LibreTranslate API Provider
  if (status.provider === 'custom') {
    try {
      const apiUrl = import.meta.env.VITE_TRANSLATION_API_URL;
      const apiKey = import.meta.env.VITE_TRANSLATION_API_KEY;

      const bodyData = {
        q: text.trim(),
        source: sourceLang,
        target: targetLang,
        format: 'text'
      };
      if (apiKey) bodyData.api_key = apiKey;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(`Custom API returned status ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        translatedText: data.translatedText || data.translation || text,
        phonetic: '',
        provider: 'Custom Translation API'
      };
    } catch (err) {
      return {
        success: false,
        error: 'API_ERROR',
        message: `Custom translation endpoint failed: ${err.message}`
      };
    }
  }

  // 3. Provider Not Configured — Clean, informative response without faking arbitrary translations
  return {
    success: false,
    error: 'NO_PROVIDER_CONFIGURED',
    message: 'Live translation service is currently unavailable because no translation provider is configured.',
    setupGuide: [
      {
        title: 'Option A: Google Gemini API (Recommended)',
        steps: [
          'Get a free Gemini API key from Google AI Studio (https://aistudio.google.com/).',
          'Add VITE_GEMINI_API_KEY=your_key_here to your .env.local file.',
          'Restart the Vite dev server.'
        ]
      },
      {
        title: 'Option B: Custom Translation API (LibreTranslate)',
        steps: [
          'Host LibreTranslate or sign up for a translation endpoint.',
          'Add VITE_TRANSLATION_API_URL=https://your-endpoint/translate to .env.local.',
          'Optional: Add VITE_TRANSLATION_API_KEY if authentication is required.'
        ]
      }
    ]
  };
}
