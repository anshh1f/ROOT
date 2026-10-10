import communityData from './communityData.json' with { type: 'json' };
import { getApprovedPlannerEntries } from './communityHubData.js';
import { getApprovedStaysForPlanner } from './stayHubData.js';

/**
 * Normalizes and finds matching approved destination from communityData
 */
export function findMatchingDestination(destinationQuery) {
  if (!destinationQuery || typeof destinationQuery !== 'string') return null;
  const clean = destinationQuery.trim().toLowerCase();

  for (const dest of communityData.approvedDestinations) {
    if (dest.name.toLowerCase().includes(clean) || clean.includes(dest.name.toLowerCase())) {
      return dest;
    }
    if (dest.keywords.some((kw) => clean.includes(kw) || kw.includes(clean))) {
      return dest;
    }
  }
  return null;
}

/**
 * Core Itinerary Generator
 */
export function generateItinerary({
  startLocation,
  destination,
  durationDays = 3,
  travellers = 1,
  budgetINR = 15000,
  preferredExperiences = [],
  travelStyle = 'Mixed',
  accommodationPreference = 'Any'
}) {
  const days = Math.min(14, Math.max(1, parseInt(durationDays, 10) || 3));
  const numTravellers = Math.max(1, parseInt(travellers, 10) || 1);
  const totalBudget = Math.max(0, parseInt(budgetINR, 10) || 0);

  // 1. Match destination
  const matchedDest = findMatchingDestination(destination);
  if (!matchedDest) {
    return {
      success: false,
      reason: 'insufficient_destination',
      destinationEntered: destination,
      message: `No approved community sample data available for "${destination}". To maintain authenticity and avoid fabricating unverified places, ROOTS only generates itineraries from community-vetted entries.`,
      availableDestinations: communityData.approvedDestinations
    };
  }

  // 2. Fetch destination entries (Base curated + community-approved submissions)
  const allDestEntries = getApprovedPlannerEntries(matchedDest.id);

  if (allDestEntries.length === 0) {
    return {
      success: false,
      reason: 'no_entries',
      destinationEntered: matchedDest.name,
      message: `Community data entries are currently undergoing review for ${matchedDest.name}. Please select another curated destination.`,
      availableDestinations: communityData.approvedDestinations
    };
  }

  // 3. Score entries according to preferred experiences and travel style
  const scoredEntries = allDestEntries.map((entry) => {
    let score = 0;
    // Match experience tags
    if (preferredExperiences && preferredExperiences.length > 0) {
      const matchCount = entry.tags.filter((t) => preferredExperiences.includes(t)).length;
      score += matchCount * 3;
    }
    // Match travel style
    if (entry.travelStyle && (entry.travelStyle.includes(travelStyle) || entry.travelStyle.includes('Mixed'))) {
      score += 2;
    }
    return { ...entry, matchScore: score };
  });

  // Sort by highest score
  scoredEntries.sort((a, b) => b.matchScore - a.matchScore);

  // Group by time slots & category
  const morningPool = scoredEntries.filter((e) => e.timeSlot === 'morning' || e.category === 'place' || e.category === 'activity');
  const afternoonPool = scoredEntries.filter((e) => e.timeSlot === 'afternoon' || e.category === 'food_spot' || e.category === 'activity');
  const eveningPool = scoredEntries.filter((e) => e.timeSlot === 'evening' || e.category === 'food_spot' || e.category === 'activity' || e.category === 'place');

  // 4. Select Accommodation (curated base + approved community homestays)
  const approvedCommunityStays = getApprovedStaysForPlanner(matchedDest.id);
  const baseAccommodations = communityData.accommodations.filter(
    (a) => a.destinationId === matchedDest.id
  );
  const destAccommodations = [...baseAccommodations, ...approvedCommunityStays];

  let selectedAcc = null;
  if (accommodationPreference && accommodationPreference !== 'Any') {
    selectedAcc = destAccommodations.find((a) => a.type === accommodationPreference);
  }
  if (!selectedAcc && destAccommodations.length > 0) {
    selectedAcc = destAccommodations[0];
  }

  // 5. Distribute activities across days
  const schedule = [];
  let totalActivityCostPerPerson = 0;

  for (let i = 1; i <= days; i++) {
    const morningItem = morningPool[(i - 1) % morningPool.length];
    const afternoonItem = afternoonPool[(i - 1) % afternoonPool.length];
    const eveningItem = eveningPool[(i - 1) % eveningPool.length];

    const dayActivities = [
      {
        slot: 'Morning',
        timeRange: '07:00 AM - 11:30 AM',
        item: morningItem,
        slotTitle: morningItem.name,
        category: morningItem.category,
        description: morningItem.description,
        costINR: morningItem.estimatedCostINR,
        duration: morningItem.suggestedDuration,
        tags: morningItem.tags,
        source: morningItem.sourceContributor,
        reviewStatus: morningItem.reviewStatus,
        practicalNotes: morningItem.practicalNotes
      },
      {
        slot: 'Afternoon',
        timeRange: '12:30 PM - 04:30 PM',
        item: afternoonItem,
        slotTitle: afternoonItem.name,
        category: afternoonItem.category,
        description: afternoonItem.description,
        costINR: afternoonItem.estimatedCostINR,
        duration: afternoonItem.suggestedDuration,
        tags: afternoonItem.tags,
        source: afternoonItem.sourceContributor,
        reviewStatus: afternoonItem.reviewStatus,
        practicalNotes: afternoonItem.practicalNotes
      },
      {
        slot: 'Evening',
        timeRange: '05:30 PM - 08:30 PM',
        item: eveningItem,
        slotTitle: eveningItem.name,
        category: eveningItem.category,
        description: eveningItem.description,
        costINR: eveningItem.estimatedCostINR,
        duration: eveningItem.suggestedDuration,
        tags: eveningItem.tags,
        source: eveningItem.sourceContributor,
        reviewStatus: eveningItem.reviewStatus,
        practicalNotes: eveningItem.practicalNotes
      }
    ];

    dayActivities.forEach((act) => {
      totalActivityCostPerPerson += act.costINR || 0;
    });

    schedule.push({
      dayNumber: i,
      dayTheme: i === 1
        ? `Arrive from ${startLocation || 'Origin'} & Settle into ${matchedDest.name}`
        : i === days
          ? `Slow Morning, Farewells & Mindful Departure`
          : `Deep Cultural Roots & Hidden Pathways`,
      activities: dayActivities,
      dayHighlights: [morningItem.name, afternoonItem.name, eveningItem.name]
    });
  }

  // 6. Calculate itemized budget
  const nights = Math.max(1, days - 1);
  let accommodationTotal = 0;

  if (selectedAcc) {
    if (selectedAcc.priceUnit && selectedAcc.priceUnit.includes('person')) {
      accommodationTotal = selectedAcc.estimatedCostINR * nights * numTravellers;
    } else {
      const roomsNeeded = Math.ceil(numTravellers / (selectedAcc.capacityPerRoom || 2));
      accommodationTotal = selectedAcc.estimatedCostINR * nights * roomsNeeded;
    }
  }

  const activitiesTotal = totalActivityCostPerPerson * numTravellers;
  const dailyFoodAllowancePerPerson = 550; // INR for 3 local meals & tea
  const foodTotal = dailyFoodAllowancePerPerson * days * numTravellers;
  const transportDailyRate = matchedDest.defaultDailyTransportINR || 800;
  const transportTotal = transportDailyRate * days;

  const totalEstimatedCost = accommodationTotal + activitiesTotal + foodTotal + transportTotal;
  const budgetDifference = totalBudget - totalEstimatedCost;
  const isOverBudget = budgetDifference < 0;
  const deficitAmount = isOverBudget ? Math.abs(budgetDifference) : 0;
  const remainingBudget = isOverBudget ? 0 : budgetDifference;

  return {
    success: true,
    id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    startLocation: startLocation.trim(),
    destination: matchedDest.name,
    destinationId: matchedDest.id,
    destinationMeta: matchedDest,
    durationDays: days,
    travellers: numTravellers,
    travelStyle,
    preferredExperiences,
    accommodationPreference,
    accommodation: selectedAcc,
    schedule,
    budgetSummary: {
      userTotalBudget: totalBudget,
      totalEstimatedCost,
      remainingBudget,
      isOverBudget,
      deficitAmount,
      currency: 'INR',
      breakdown: {
        accommodation: {
          label: 'Local Stays & Homestays',
          cost: accommodationTotal,
          note: selectedAcc ? `${selectedAcc.name} (${nights} nights)` : 'Homestay allowance'
        },
        activities: {
          label: 'Activities, Entry & Workshops',
          cost: activitiesTotal,
          note: `All entries for ${numTravellers} traveller${numTravellers > 1 ? 's' : ''}`
        },
        food: {
          label: 'Local Food & Hearth Dining Allowance',
          cost: foodTotal,
          note: `₹${dailyFoodAllowancePerPerson}/day per traveller`
        },
        transport: {
          label: 'Local Transport & Rickshaw Allowance',
          cost: transportTotal,
          note: `₹${transportDailyRate}/day local travel allowance`
        }
      }
    }
  };
}
