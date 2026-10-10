import React, { useState, useEffect, useMemo } from 'react';
import {
  Languages,
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  Search,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Smile,
  Utensils,
  Compass,
  Bus,
  Home,
  ShoppingBag,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle,
  Key
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  getTranslationProviderStatus,
  translateText
} from '../services/translationService';
import {
  PHRASEBOOK_CATEGORIES,
  TRAVEL_PHRASES
} from '../data/phrasebookData';

const categoryIconMap = {
  Sparkles,
  Smile,
  Utensils,
  Compass,
  Bus,
  Home,
  ShoppingBag,
  AlertTriangle
};

export function RootsLingua({ onBackToHome }) {
  // Navigation tabs: 'phrasebook' | 'translator'
  const [activeTab, setActiveTab] = useState('phrasebook');

  // Provider configuration status
  const [providerStatus, setProviderStatus] = useState(getTranslationProviderStatus());

  // =========================================================================
  // TRANSLATOR STATE
  // =========================================================================
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ml');
  const [inputText, setInputText] = useState('');
  const [translationResult, setTranslationResult] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);
  const [copiedTranslator, setCopiedTranslator] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // =========================================================================
  // PHRASEBOOK STATE
  // =========================================================================
  const [phrasebookTargetLang, setPhrasebookTargetLang] = useState('ml');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPhraseId, setCopiedPhraseId] = useState(null);

  // Favourites saved in localStorage
  const [favouriteIds, setFavouriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('roots_lingua_favourites');
      return saved ? JSON.parse(saved) : ['greet-1', 'food-1', 'trans-1', 'shop-1'];
    } catch {
      return ['greet-1', 'food-1', 'trans-1', 'shop-1'];
    }
  });

  const [filterFavouritesOnly, setFilterFavouritesOnly] = useState(false);

  // Sync favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('roots_lingua_favourites', JSON.stringify(favouriteIds));
    } catch (e) {
      console.warn('Could not save favourites to localStorage', e);
    }
  }, [favouriteIds]);

  const toggleFavourite = (phraseId) => {
    setFavouriteIds((prev) =>
      prev.includes(phraseId)
        ? prev.filter((id) => id !== phraseId)
        : [...prev, phraseId]
    );
  };

  // Swap languages in translator
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (translationResult?.translatedText) {
      setInputText(translationResult.translatedText);
      setTranslationResult(null);
    }
  };

  // Perform translation
  const handleTranslate = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setTranslationError(null);
    setTranslationResult(null);

    try {
      const result = await translateText({
        text: inputText,
        sourceLang,
        targetLang
      });

      if (result.success) {
        setTranslationResult(result);
      } else {
        setTranslationError(result);
        if (result.error === 'NO_PROVIDER_CONFIGURED') {
          setShowSetupGuide(true);
        }
      }
    } catch (err) {
      setTranslationError({
        success: false,
        error: 'UNEXPECTED_ERROR',
        message: err.message || 'An unexpected error occurred during translation.'
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyText = (text, id = 'translator') => {
    if (!text) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (id === 'translator') {
        setCopiedTranslator(true);
        setTimeout(() => setCopiedTranslator(false), 2500);
      } else {
        setCopiedPhraseId(id);
        setTimeout(() => setCopiedPhraseId(null), 2500);
      }
    }
  };

  // Filtered phrases calculation
  const filteredPhrases = useMemo(() => {
    return TRAVEL_PHRASES.filter((phrase) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && phrase.category !== selectedCategory) {
        return false;
      }

      // 2. Favourites Filter
      if (filterFavouritesOnly && !favouriteIds.includes(phrase.id)) {
        return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inEnglish = phrase.english.toLowerCase().includes(q);
        const inContext = phrase.context?.toLowerCase().includes(q);
        
        // Search across all translations of this phrase
        const inTranslations = Object.values(phrase.translations).some((t) => {
          return (
            t.text.toLowerCase().includes(q) ||
            t.phonetic?.toLowerCase().includes(q) ||
            t.note?.toLowerCase().includes(q)
          );
        });

        if (!inEnglish && !inContext && !inTranslations) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, filterFavouritesOnly, searchQuery, favouriteIds]);

  return (
    <div className="roots-lingua-page">
      {/* 1. HERO & BRANDING SECTION */}
      <section className="lingua-hero-banner">
        <div className="container lingua-hero-content">
          <div className="lingua-badge-row">
            <span className="lingua-feature-tag">
              <Languages size={15} />
              ROOTS Lingua
            </span>
            <span className="lingua-tagline-badge">
              Speak Like a Local
            </span>
          </div>

          <h1 className="lingua-hero-title">
            Connect deeper with host families & local communities.
          </h1>
          <p className="lingua-hero-subtitle">
            Authentic Malayalam, Hindi, Tamil, and Arabic travel expressions with native script,
            phonetic pronunciation, and a clean translation architecture designed for travelers.
          </p>

          {/* Quick Tab Switcher */}
          <div className="lingua-nav-tabs">
            <button
              type="button"
              className={`lingua-tab-btn ${activeTab === 'phrasebook' ? 'active' : ''}`}
              onClick={() => setActiveTab('phrasebook')}
              aria-label="View Travel Phrasebook"
            >
              <Sparkles size={18} />
              <span>Travel Phrasebook</span>
              <span className="lingua-tab-counter">{TRAVEL_PHRASES.length}</span>
            </button>
            <button
              type="button"
              className={`lingua-tab-btn ${activeTab === 'translator' ? 'active' : ''}`}
              onClick={() => setActiveTab('translator')}
              aria-label="View Text Translator"
            >
              <Languages size={18} />
              <span>Live Translator</span>
              <span className="provider-pill-status">
                {providerStatus.isConfigured ? 'Live Provider' : 'Setup Mode'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container lingua-main-container">
        {/* ===================================================================
            TAB 1: TRAVEL PHRASEBOOK
            =================================================================== */}
        {activeTab === 'phrasebook' && (
          <div className="phrasebook-section">
            {/* Controls Bar: Search & Target Language */}
            <div className="card-white phrasebook-controls-card">
              <div className="phrasebook-controls-top">
                {/* Search Input */}
                <div className="phrase-search-input-wrap">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="phrase-search-input"
                    placeholder="Search phrases (e.g., 'water', 'chai', 'discount', 'doctor')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search travel phrases"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Target Language Selector */}
                <div className="phrase-lang-select-group">
                  <label htmlFor="phrasebookLang" className="lang-label">
                    Target Language:
                  </label>
                  <select
                    id="phrasebookLang"
                    className="phrase-lang-select"
                    value={phrasebookTargetLang}
                    onChange={(e) => setPhrasebookTargetLang(e.target.value)}
                  >
                    <option value="ml">🌴 Malayalam (മലയാളം)</option>
                    <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
                    <option value="ta">🛕 Tamil (தமிழ்)</option>
                    <option value="ar">🇦🇪 Arabic (العربية)</option>
                  </select>
                </div>
              </div>

              {/* Category Filter Pills Bar */}
              <div className="phrasebook-categories-scroll">
                <div className="phrasebook-categories-row">
                  {PHRASEBOOK_CATEGORIES.map((cat) => {
                    const Icon = categoryIconMap[cat.icon] || Sparkles;
                    const isActive = !filterFavouritesOnly && selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`phrase-cat-pill ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setFilterFavouritesOnly(false);
                        }}
                      >
                        <Icon size={14} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}

                  {/* Favourites Filter Pill */}
                  <button
                    type="button"
                    className={`phrase-cat-pill favourite-pill ${filterFavouritesOnly ? 'active' : ''}`}
                    onClick={() => setFilterFavouritesOnly(!filterFavouritesOnly)}
                  >
                    <BookmarkCheck size={14} />
                    <span>Saved Favourites ({favouriteIds.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Header / Active Filters Info */}
            <div className="phrasebook-results-meta">
              <span>
                Showing <strong>{filteredPhrases.length}</strong> phrase{filteredPhrases.length !== 1 ? 's' : ''} in{' '}
                <strong>
                  {SUPPORTED_LANGUAGES.find((l) => l.code === phrasebookTargetLang)?.name}
                </strong>
                {filterFavouritesOnly && ' • Filtered by Saved Favourites'}
                {selectedCategory !== 'all' &&
                  ` • Category: ${PHRASEBOOK_CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
              </span>

              {(selectedCategory !== 'all' || filterFavouritesOnly || searchQuery) && (
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={() => {
                    setSelectedCategory('all');
                    setFilterFavouritesOnly(false);
                    setSearchQuery('');
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Phrases Cards Grid */}
            {filteredPhrases.length > 0 ? (
              <div className="phrasebook-grid">
                {filteredPhrases.map((phrase) => {
                  const translation = phrase.translations[phrasebookTargetLang] || phrase.translations.ml;
                  const isFav = favouriteIds.includes(phrase.id);
                  const isCopied = copiedPhraseId === phrase.id;
                  const availableLangs = phrase.supportedLanguages || ['ml', 'hi', 'ta', 'ar'];

                  return (
                    <div key={phrase.id} className="card-white phrase-card">
                      <div className="phrase-card-header">
                        <span className="phrase-category-badge">
                          {PHRASEBOOK_CATEGORIES.find((c) => c.id === phrase.category)?.label.split(' ')[0] ||
                            phrase.category}
                        </span>

                        <div className="phrase-card-top-actions">
                          {/* Available Languages Indicator */}
                          <div className="phrase-langs-indicator" title="Available in Malayalam, Hindi, Tamil, Arabic">
                            {availableLangs.map((code) => (
                              <span
                                key={code}
                                className={`lang-dot-code ${code === phrasebookTargetLang ? 'active' : ''}`}
                              >
                                {code.toUpperCase()}
                              </span>
                            ))}
                          </div>

                          {/* Favourite Toggle */}
                          <button
                            type="button"
                            className={`btn-phrase-fav ${isFav ? 'active' : ''}`}
                            onClick={() => toggleFavourite(phrase.id)}
                            title={isFav ? 'Remove from favourites' : 'Save to favourites'}
                            aria-label="Toggle favourite phrase"
                          >
                            {isFav ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* English Meaning */}
                      <div className="phrase-english-box">
                        <span className="phrase-english-text">{phrase.english}</span>
                        {phrase.context && (
                          <span className="phrase-context-hint">{phrase.context}</span>
                        )}
                      </div>

                      {/* Target Language Output */}
                      <div className="phrase-target-box">
                        <div className="phrase-native-script">{translation.text}</div>
                        {translation.phonetic && (
                          <div className="phrase-phonetic-pill">
                            <span className="phonetic-label">Say:</span>
                            <span className="phonetic-text">"{translation.phonetic}"</span>
                          </div>
                        )}
                        {translation.note && (
                          <div className="phrase-cultural-note">
                            <Info size={13} className="note-icon" />
                            <span>{translation.note}</span>
                          </div>
                        )}
                      </div>

                      {/* Copy Action Bar */}
                      <div className="phrase-card-footer">
                        <button
                          type="button"
                          className={`btn-copy-phrase ${isCopied ? 'copied' : ''}`}
                          onClick={() =>
                            handleCopyText(
                              `${translation.text} (${translation.phonetic || ''})`,
                              phrase.id
                            )
                          }
                          aria-label="Copy phrase"
                        >
                          {isCopied ? <Check size={15} /> : <Copy size={15} />}
                          <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Phrase'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Search/Filter State */
              <div className="card-white phrasebook-empty-state">
                <AlertCircle size={42} className="empty-icon" />
                <h3>No matching phrases found</h3>
                <p>
                  {filterFavouritesOnly
                    ? "You haven't saved any phrases yet. Click the bookmark icon on any phrase to save it for quick offline reference."
                    : `We couldn't find any phrase matching "${searchQuery}". Try searching for words like 'chai', 'water', 'left', or 'discount'.`}
                </p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setFilterFavouritesOnly(false);
                    setSearchQuery('');
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Show All Phrases</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: LIVE TEXT TRANSLATOR
            =================================================================== */}
        {activeTab === 'translator' && (
          <div className="translator-section">
            {/* Provider Connection Status Banner */}
            <div className={`card-white translator-status-banner ${providerStatus.isConfigured ? 'status-connected' : 'status-unconfigured'}`}>
              <div className="status-left">
                {providerStatus.isConfigured ? (
                  <CheckCircle2 size={22} className="status-icon connected" />
                ) : (
                  <Key size={22} className="status-icon unconfigured" />
                )}
                <div>
                  <div className="status-title-row">
                    <strong>Translation Provider: {providerStatus.providerName}</strong>
                    <span className={`status-badge-pill ${providerStatus.isConfigured ? 'pill-green' : 'pill-amber'}`}>
                      {providerStatus.isConfigured ? 'Connected' : 'Setup Required'}
                    </span>
                  </div>
                  <p className="status-desc-text">
                    {providerStatus.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-toggle-guide"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                aria-expanded={showSetupGuide}
              >
                <HelpCircle size={15} />
                <span>{showSetupGuide ? 'Hide Provider Setup Guide' : 'How to Connect a Provider'}</span>
                {showSetupGuide ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {/* Collapsible Setup Guide */}
            {showSetupGuide && (
              <div className="card-white translator-guide-card">
                <div className="guide-header">
                  <Key size={20} className="guide-icon" />
                  <h4>How to Connect a Real Translation Service</h4>
                </div>
                <p className="guide-intro">
                  ROOTS Lingua is designed with a pluggable architecture. To protect privacy and prevent secret leakage,
                  all real API keys are securely stored in your local <code>.env.local</code> file and never hardcoded in client code.
                </p>

                <div className="guide-steps-grid">
                  <div className="guide-step-box">
                    <span className="step-num">Option 1</span>
                    <strong>Google Gemini AI (Recommended)</strong>
                    <p>Provides authentic, colloquial, dialect-aware Indian travel translations.</p>
                    <ol>
                      <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a> and get an API key.</li>
                      <li>Open or create <code>.env.local</code> in your root folder.</li>
                      <li>Add: <code>VITE_GEMINI_API_KEY=your_actual_key</code></li>
                      <li>Restart the Vite dev server.</li>
                    </ol>
                  </div>

                  <div className="guide-step-box">
                    <span className="step-num">Option 2</span>
                    <strong>LibreTranslate / Custom REST API</strong>
                    <p>Self-hosted or hosted open-source translation server.</p>
                    <ol>
                      <li>Obtain your endpoint URL (e.g. <code>https://libretranslate.com/translate</code>).</li>
                      <li>In <code>.env.local</code>, add: <code>VITE_TRANSLATION_API_URL=https://...</code></li>
                      <li>Optional: Add <code>VITE_TRANSLATION_API_KEY</code> if required.</li>
                      <li>Restart the Vite dev server.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Translator Card */}
            <div className="card-white translator-workspace-card">
              {/* Language Selector Controls */}
              <div className="translator-lang-bar">
                <div className="lang-selector-box">
                  <label htmlFor="sourceLanguageSelect" className="selector-label">Source Language</label>
                  <select
                    id="sourceLanguageSelect"
                    className="lang-dropdown"
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={`src-${lang.code}`} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.native})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="btn-swap-languages"
                  onClick={handleSwapLanguages}
                  title="Swap languages"
                  aria-label="Swap source and target languages"
                >
                  <ArrowLeftRight size={18} />
                </button>

                <div className="lang-selector-box">
                  <label htmlFor="targetLanguageSelect" className="selector-label">Target Language</label>
                  <select
                    id="targetLanguageSelect"
                    className="lang-dropdown"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={`tgt-${lang.code}`} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.native})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Translation Panels Grid */}
              <div className="translator-io-grid">
                {/* Input Panel */}
                <div className="translator-panel input-panel">
                  <div className="panel-header">
                    <span className="panel-title">
                      {SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name} Text
                    </span>
                    {inputText && (
                      <button
                        type="button"
                        className="btn-text-clear"
                        onClick={() => {
                          setInputText('');
                          setTranslationResult(null);
                          setTranslationError(null);
                        }}
                        aria-label="Clear input text"
                      >
                        <X size={15} />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  <textarea
                    className="translator-textarea"
                    placeholder={`Type or paste travel phrases in ${SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name} to translate...`}
                    rows={6}
                    maxLength={500}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    aria-label="Text to translate"
                  />

                  <div className="panel-footer">
                    <span className="char-count">
                      {inputText.length} / 500 characters
                    </span>

                    <button
                      type="button"
                      className="btn btn-primary btn-translate-action"
                      disabled={!inputText.trim() || isTranslating}
                      onClick={handleTranslate}
                    >
                      {isTranslating ? (
                        <>
                          <RotateCcw size={16} className="spin-icon" />
                          <span>Translating...</span>
                        </>
                      ) : (
                        <>
                          <Languages size={16} />
                          <span>Translate Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output Panel */}
                <div className="translator-panel output-panel">
                  <div className="panel-header">
                    <span className="panel-title">
                      {SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.name} Result
                    </span>
                    {translationResult?.translatedText && (
                      <button
                        type="button"
                        className={`btn-copy-result ${copiedTranslator ? 'copied' : ''}`}
                        onClick={() =>
                          handleCopyText(translationResult.translatedText, 'translator')
                        }
                        aria-label="Copy translated text"
                      >
                        {copiedTranslator ? <Check size={15} /> : <Copy size={15} />}
                        <span>{copiedTranslator ? 'Copied!' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  <div className="translator-result-body">
                    {/* 1. Loading State */}
                    {isTranslating && (
                      <div className="translator-loading-box">
                        <div className="pulse-loader"></div>
                        <p>Communicating with translation engine...</p>
                      </div>
                    )}

                    {/* 2. Error / Unavailable State */}
                    {!isTranslating && translationError && (
                      <div className="translator-error-box">
                        <AlertCircle size={24} className="error-icon" />
                        <div>
                          <strong>{translationError.message}</strong>
                          {translationError.error === 'NO_PROVIDER_CONFIGURED' && (
                            <p className="error-hint">
                              As required by ROOTS security standards, arbitrary translations are not fabricated.
                              Add <code>VITE_GEMINI_API_KEY</code> to <code>.env.local</code> to activate live AI translation.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 3. Successful Result State */}
                    {!isTranslating && !translationError && translationResult && (
                      <div className="translator-success-box">
                        <div className="translated-text-display">
                          {translationResult.translatedText}
                        </div>
                        {translationResult.phonetic && (
                          <div className="translated-phonetic-badge">
                            <span className="badge-lbl">Pronunciation:</span>
                            <span className="badge-val">"{translationResult.phonetic}"</span>
                          </div>
                        )}
                        <div className="translation-provider-tag">
                          <span>Verified response via {translationResult.provider}</span>
                        </div>
                      </div>
                    )}

                    {/* 4. Empty Initial State */}
                    {!isTranslating && !translationError && !translationResult && (
                      <div className="translator-empty-prompt">
                        <Languages size={36} className="empty-lingua-icon" />
                        <p>Enter your text on the left and click <strong>Translate Text</strong>.</p>
                        <span className="sample-quick-prompt">
                          Tip: For common phrases like "How much is this?" or "Less spicy please",
                          browse the verified <strong>Travel Phrasebook</strong> tab!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
