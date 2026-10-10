import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'secure-gemini-server-endpoint',
        configureServer(server) {
          // 1. GET /api/translate/status
          server.middlewares.use('/api/translate/status', (req, res) => {
            const hasGemini = Boolean(
              (env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes('placeholder') && env.GEMINI_API_KEY.length > 5) ||
              (env.VITE_GEMINI_API_KEY && !env.VITE_GEMINI_API_KEY.includes('placeholder') && env.VITE_GEMINI_API_KEY.length > 5)
            );
            const hasCustom = Boolean(env.VITE_TRANSLATION_API_URL && env.VITE_TRANSLATION_API_URL.startsWith('http'));

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                isConfigured: hasGemini || hasCustom,
                provider: hasGemini ? 'gemini' : (hasCustom ? 'custom' : null),
                providerName: hasGemini ? 'Google Gemini AI (Secure Server Endpoint)' : (hasCustom ? 'Custom Translation API' : 'None (Unconfigured)'),
                isServerSecured: true,
                description: hasGemini
                  ? 'Active via backend proxy. Key is private on the server and hidden from browser network traffic.'
                  : (hasCustom ? 'Active via custom endpoint.' : 'No translation provider key configured on server.')
              })
            );
          });

          // 2. POST /api/translate
          server.middlewares.use('/api/translate', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }));
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');

              try {
                const { text, sourceLang, targetLang } = JSON.parse(body || '{}');

                if (!text || !text.trim()) {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ success: false, error: 'EMPTY_TEXT', message: 'Text cannot be empty.' }));
                }

                if (sourceLang === targetLang) {
                  return res.end(JSON.stringify({ success: true, translatedText: text.trim(), phonetic: '', provider: 'identity' }));
                }

                const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;

                if (!apiKey || apiKey.includes('placeholder') || apiKey.length < 5) {
                  res.statusCode = 503;
                  return res.end(
                    JSON.stringify({
                      success: false,
                      error: 'NO_PROVIDER_CONFIGURED',
                      message: 'No GEMINI_API_KEY found in server environment (.env.local).'
                    })
                  );
                }

                // Call Google Gemini API securely from Node.js runtime (server-side)
                const modelName = 'gemini-3.8-flash';
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
                const prompt = `You are an authentic, culturally respectful travel translator for the ROOTS community travel platform.
Translate the following travel phrase from language code '${sourceLang}' to '${targetLang}'.
Provide a polite, natural spoken translation suitable for a traveler speaking to locals.
Also provide a phonetic pronunciation guide (using Roman English alphabet) if the target language uses non-Latin script.

Respond ONLY with valid JSON in this exact structure:
{
  "translatedText": "translation here",
  "phonetic": "phonetic pronunciation here or empty string"
}

Text to translate:
"""${text.trim()}"""`;

                const geminiResponse = await fetch(endpoint, {
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

                if (!geminiResponse.ok) {
                  const errJson = await geminiResponse.json().catch(() => ({}));
                  const errMsg = errJson.error?.message || `Gemini API returned status ${geminiResponse.status}`;
                  res.statusCode = geminiResponse.status >= 500 ? 502 : 400;
                  return res.end(
                    JSON.stringify({
                      success: false,
                      error: 'GEMINI_API_ERROR',
                      message: errMsg
                    })
                  );
                }

                const geminiData = await geminiResponse.json();
                const rawJson = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!rawJson) {
                  res.statusCode = 502;
                  return res.end(JSON.stringify({ success: false, error: 'EMPTY_RESPONSE', message: 'Empty response received from Gemini.' }));
                }

                const parsed = JSON.parse(rawJson);
                res.end(
                  JSON.stringify({
                    success: true,
                    translatedText: parsed.translatedText || '',
                    phonetic: parsed.phonetic || '',
                    provider: 'Google Gemini (Secure Server Endpoint)'
                  })
                );
              } catch (err) {
                res.statusCode = 500;
                res.end(
                  JSON.stringify({
                    success: false,
                    error: 'SERVER_ERROR',
                    message: `Internal server translation error: ${err.message}`
                  })
                );
              }
            });
          });
        }
      }
    ]
  };
});
