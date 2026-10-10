import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ActivityCards } from './components/ActivityCards';
import { TripPlanner } from './components/TripPlanner';
import { CuratedDestinations } from './components/CuratedDestinations';
import { TravelDiaries } from './components/TravelDiaries';
import { RootsConnect } from './components/RootsConnect';
import { RootsStay } from './components/RootsStay';
import { Footer } from './components/Footer';
import { SavedTripsDrawer } from './components/SavedTripsDrawer';
import { ItineraryResults } from './components/ItineraryResults';
import { RootsConnectHub } from './components/RootsConnectHub';
import { RootsCommunityHub } from './components/RootsCommunityHub';
import { RootsStayHub } from './components/RootsStayHub';
import { RootsLingua } from './components/RootsLingua';
import { generateItinerary } from './data/itineraryEngine';

function AppContent() {
  const { requireAuth } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'results' | 'connect' | 'community' | 'stay' | 'lingua'
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [plannerPrefill, setPlannerPrefill] = useState(null);
  const [prefilledDestination, setPrefilledDestination] = useState('');
  const [selectedActivities, setSelectedActivities] = useState(['local-food', 'nature', 'hiking', 'swimming']);
  
  const [savedTrips, setSavedTrips] = useState(() => {
    const stored = localStorage.getItem('roots_saved_trips');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Incoming requests count for navbar badge
  const [incomingRequestsCount, setIncomingRequestsCount] = useState(() => {
    const saved = localStorage.getItem('roots_connect_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Object.values(parsed).filter(s => s === 'incoming').length;
      } catch (e) {}
    }
    return 1; // Default 1 incoming request (Aarav Mehta)
  });

  // Listen to connect request changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('roots_connect_requests');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setIncomingRequestsCount(Object.values(parsed).filter(s => s === 'incoming').length);
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toggle activity selection from homepage cards
  const handleToggleActivity = (activityId) => {
    setSelectedActivities((prev) => {
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  // Scroll to planner and prefill destination
  const handleSelectDestination = (destName) => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setPrefilledDestination(destName);
    setTimeout(() => {
      const plannerEl = document.getElementById('plan-trip');
      if (plannerEl) {
        plannerEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Scroll to planner from hero
  const handleStartPlanning = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const plannerEl = document.getElementById('plan-trip');
      if (plannerEl) {
        plannerEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Scroll to activities
  const handleExploreActivities = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const exploreEl = document.getElementById('explore');
      if (exploreEl) {
        exploreEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Handle new itinerary generated
  const handleItineraryGenerated = (newItinerary) => {
    setActiveItinerary(newItinerary);
    setPlannerPrefill(newItinerary);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit preferences: return to planner form
  const handleEditPreferences = () => {
    setCurrentView('home');
    setTimeout(() => {
      const plannerEl = document.getElementById('plan-trip');
      if (plannerEl) {
        plannerEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Regenerate with existing parameters
  const handleRegenerate = () => {
    if (!activeItinerary) return;
    const regenerated = generateItinerary({
      startLocation: activeItinerary.startLocation,
      destination: activeItinerary.destination,
      durationDays: activeItinerary.durationDays,
      travellers: activeItinerary.travellers,
      budgetINR: activeItinerary.budgetSummary.userTotalBudget,
      preferredExperiences: activeItinerary.preferredExperiences,
      travelStyle: activeItinerary.travelStyle,
      accommodationPreference: activeItinerary.accommodationPreference
    });

    if (regenerated.success) {
      setActiveItinerary(regenerated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Internal persistence for saved trips
  const executeSaveTrip = (item) => {
    setSavedTrips((prev) => {
      const exists = prev.find((t) => t.id === item.id);
      let updated;
      if (exists) {
        updated = prev.map((t) => (t.id === item.id ? item : t));
      } else {
        updated = [item, ...prev];
      }
      localStorage.setItem('roots_saved_trips', JSON.stringify(updated));
      return updated;
    });
  };

  // Save trip: prompts guest-first authentication contextual modal if not signed in
  const handleSaveTrip = (tripToSave) => {
    const item = tripToSave || activeItinerary;
    if (!item) return;

    requireAuth({
      actionName: 'Save trip',
      message: 'Create an account to save your journey and keep everything in one place.',
      onAuthenticated: () => executeSaveTrip(item)
    });
  };

  // Delete saved trip
  const handleDeleteTrip = (tripId) => {
    setSavedTrips((prev) => {
      const updated = prev.filter((t) => t.id !== tripId);
      localStorage.setItem('roots_saved_trips', JSON.stringify(updated));
      return updated;
    });
  };

  // Open saved trip in results view
  const handleSelectTrip = (savedTrip) => {
    setActiveItinerary(savedTrip);
    setPlannerPrefill(savedTrip);
    setCurrentView('results');
    setIsSavedDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update itinerary after user customizes and saves changes
  const handleUpdateItinerary = (updatedItinerary) => {
    setActiveItinerary(updatedItinerary);
    setSavedTrips((prev) => {
      const exists = prev.find((t) => t.id === updatedItinerary.id);
      if (exists) {
        const updated = prev.map((t) => (t.id === updatedItinerary.id ? updatedItinerary : t));
        localStorage.setItem('roots_saved_trips', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const isCurrentTripSaved = activeItinerary
    ? savedTrips.some((t) => t.id === activeItinerary.id)
    : false;

  return (
    <div className="roots-app">
      {/* 1. Modern Unified Navigation Header */}

      {/* 1. Navigation Bar */}
      <Navbar
        savedTripsCount={savedTrips.length}
        onOpenSavedTrips={() => setIsSavedDrawerOpen(true)}
        onNavigate={(view) => setCurrentView(view)}
        currentView={currentView}
        incomingRequestsCount={incomingRequestsCount}
      />

      <main>
        {currentView === 'lingua' ? (
          /* Dedicated ROOTS Lingua — Speak Like a Local View */
          <RootsLingua
            onBackToHome={() => setCurrentView('home')}
          />
        ) : currentView === 'stay' ? (
          /* Dedicated ROOTS Stay Community Homestay Hub View */
          <RootsStayHub
            onBackToHome={() => setCurrentView('home')}
            onOpenPlanner={handleStartPlanning}
          />
        ) : currentView === 'community' ? (
          /* Dedicated ROOTS Community Hub View */
          <RootsCommunityHub
            onBackToHome={() => setCurrentView('home')}
            onOpenPlanner={handleStartPlanning}
          />
        ) : currentView === 'connect' ? (
          /* Dedicated ROOTS Connect Hub View */
          <RootsConnectHub
            userTripContext={activeItinerary}
            onBackToHome={() => setCurrentView('home')}
          />
        ) : currentView === 'results' && activeItinerary ? (
          /* Dedicated Complete Itinerary Results Page */
          <ItineraryResults
            itinerary={activeItinerary}
            onBackToPlanner={() => setCurrentView('home')}
            onEditPreferences={handleEditPreferences}
            onRegenerate={handleRegenerate}
            onSaveTrip={handleSaveTrip}
            onUpdateItinerary={handleUpdateItinerary}
            isAlreadySaved={isCurrentTripSaved}
            onFindBuddies={() => {
              setCurrentView('connect');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* Homepage View with All Sections */
          <>
            {/* Hero Section */}
            <HeroSection
              onStartPlanning={handleStartPlanning}
              onExploreActivities={handleExploreActivities}
            />

            {/* Activity Selection Cards */}
            <ActivityCards
              selectedActivities={selectedActivities}
              onToggleActivity={handleToggleActivity}
            />

            {/* Complete Trip-Planning Form */}
            <TripPlanner
              initialValues={plannerPrefill}
              prefilledDestination={prefilledDestination}
              onItineraryGenerated={handleItineraryGenerated}
            />

            {/* Curated Destinations Section */}
            <CuratedDestinations
              onSelectDestination={handleSelectDestination}
            />

            {/* Community Travel Diaries */}
            <TravelDiaries
              onOpenCommunity={() => {
                setCurrentView('community');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* ROOTS Connect Homepage Preview */}
            <RootsConnect
              onOpenConnectHub={() => {
                setCurrentView('connect');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* ROOTS Stay */}
            <RootsStay
              onOpenStayHub={() => {
                setCurrentView('stay');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* ROOTS Lingua Showcase Section */}
            <section id="lingua" className="section lingua-showcase-section">
              <div className="container">
                <div className="card-white lingua-showcase-card">
                  <div className="lingua-showcase-content">
                    <div className="section-tag">
                      <Languages size={14} />
                      <span>ROOTS Lingua</span>
                    </div>
                    <h2 className="showcase-title">Speak Like a Local on Your Journey</h2>
                    <p className="showcase-desc">
                      Break language barriers with authentic Malayalam, Hindi, Tamil, and Arabic travel expressions.
                      Explore 7 curated categories with native script and phonetic guides, or use the live translator module.
                    </p>
                    <div className="showcase-chips-row">
                      <span className="showcase-chip">🌴 7 Travel Categories</span>
                      <span className="showcase-chip">🗣️ Phonetic Pronunciation</span>
                      <span className="showcase-chip">⭐ Offline Favourites</span>
                      <span className="showcase-chip">🌐 Pluggable Translator</span>
                    </div>
                    <div className="showcase-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setCurrentView('lingua');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <Languages size={18} />
                        <span>Open Travel Phrasebook & Translator</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Saved Trips Drawer */}
      <SavedTripsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedTrips={savedTrips}
        onDeleteTrip={handleDeleteTrip}
        onSelectTrip={handleSelectTrip}
      />

      {/* Global Contextual Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
