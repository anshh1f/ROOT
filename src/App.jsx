import React, { useState, useEffect } from 'react';
import './App.css';
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
import { generateItinerary } from './data/itineraryEngine';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'results' | 'connect' | 'community' | 'stay'
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

  // Save trip to localStorage
  const handleSaveTrip = (tripToSave) => {
    const item = tripToSave || activeItinerary;
    if (!item) return;

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

  const isCurrentTripSaved = activeItinerary
    ? savedTrips.some((t) => t.id === activeItinerary.id)
    : false;

  return (
    <div className="roots-app">
      {/* Prototype Transparent Notification Header */}
      <div className="prototype-top-banner">
        <div className="container banner-inner">
          <div className="banner-message">
            <span className="banner-tag">ROOTS Community Prototype</span>
            <span>
              Community-powered travel planner & buddy matching • Demo profiles & verified local places
            </span>
          </div>
          <div className="banner-nav-quick">
            <button
              type="button"
              className={`banner-quick-btn ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Homepage
            </button>
            <button
              type="button"
              className={`banner-quick-btn ${currentView === 'community' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('community');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ROOTS Community
            </button>
            <button
              type="button"
              className={`banner-quick-btn ${currentView === 'stay' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('stay');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ROOTS Stay
            </button>
            <button
              type="button"
              className={`banner-quick-btn ${currentView === 'connect' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('connect');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ROOTS Connect Hub {incomingRequestsCount > 0 ? `(${incomingRequestsCount} new)` : ''}
            </button>
          </div>
        </div>
      </div>

      {/* 1. Navigation Bar */}
      <Navbar
        savedTripsCount={savedTrips.length}
        onOpenSavedTrips={() => setIsSavedDrawerOpen(true)}
        onNavigate={(view) => setCurrentView(view)}
        currentView={currentView}
        incomingRequestsCount={incomingRequestsCount}
      />

      <main>
        {currentView === 'stay' ? (
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
    </div>
  );
}

export default App;
