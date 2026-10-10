// Sample traveller profiles for ROOTS Connect prototype
// Clearly labelled demonstration data. Not real registered travellers.

export const SAMPLE_CONNECT_PROFILES = [
  {
    id: "buddy-aarav",
    name: "Aarav Mehta",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    homeBase: "Mumbai, Maharashtra",
    destination: "Varkala Cliff & Backwaters",
    destinationId: "varkala",
    startDate: "2026-11-12",
    endDate: "2026-11-18",
    dateDisplay: "Nov 12 – Nov 18, 2026",
    budgetMinINR: 15000,
    budgetMaxINR: 26000,
    budgetDisplay: "₹15,000 – ₹26,000",
    preferredActivities: ["hiking", "local-food", "swimming", "photography"],
    travelStyle: "Mixed",
    bio: "Slow travel enthusiast exploring the southern coastal trails. Looking to split auto-rickshaw hire to Kappil backwaters, try grandmother seafood sadya, and catch sunset cliff viewpoints responsibly.",
    languages: ["English", "Hindi", "Gujarati"],
    initialStatus: "incoming", // Default incoming request so user can test Accept / Decline right away
    initialMessage: "Hey! Saw you are also heading to Varkala in November. Would love to split cab hire from Trivandrum and explore secret backwater canals together."
  },
  {
    id: "buddy-meera",
    name: "Meera Sen",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    homeBase: "Kolkata, West Bengal",
    destination: "Nongriat & Cherrapunji",
    destinationId: "meghalaya",
    startDate: "2026-11-14",
    endDate: "2026-11-21",
    dateDisplay: "Nov 14 – Nov 21, 2026",
    budgetMinINR: 18000,
    budgetMaxINR: 30000,
    budgetDisplay: "₹18,000 – ₹30,000",
    preferredActivities: ["hiking", "nature", "culture", "photography"],
    travelStyle: "Adventure",
    bio: "Architectural researcher documenting bio-engineered Ficus root bridges and Khasi matrilineal village traditions. Looking for a trek partner for the 3,500-step Nongriat valley descent and Rainbow Falls.",
    languages: ["English", "Bengali", "Hindi"],
    initialStatus: "accepted", // Default accepted connection so user can test conversation UI immediately!
    initialMessage: "Hi! Looking forward to sharing the Meghalaya trail. Have you packed good river sandals for the stream crossings?"
  },
  {
    id: "buddy-rohan",
    name: "Rohan & Kabir",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    homeBase: "Bengaluru, Karnataka",
    destination: "Varkala Cliff & Backwaters",
    destinationId: "varkala",
    startDate: "2026-11-10",
    endDate: "2026-11-16",
    dateDisplay: "Nov 10 – Nov 16, 2026",
    budgetMinINR: 12000,
    budgetMaxINR: 22000,
    budgetDisplay: "₹12,000 – ₹22,000",
    preferredActivities: ["swimming", "local-food", "meeting-locals", "adventure"],
    travelStyle: "Relaxed",
    bio: "Two college friends taking a break between design semesters. Big on uncommercialized swimming coves, early morning fish market walks, and trying regional coconut neera.",
    languages: ["English", "Kannada", "Hindi"],
    initialStatus: "no_request",
    initialMessage: ""
  },
  {
    id: "buddy-ananya",
    name: "Ananya Deshmukh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    homeBase: "Pune, Maharashtra",
    destination: "Spiti Valley & Pin Valley",
    destinationId: "spiti",
    startDate: "2026-10-25",
    endDate: "2026-11-04",
    dateDisplay: "Oct 25 – Nov 04, 2026",
    budgetMinINR: 22000,
    budgetMaxINR: 35000,
    budgetDisplay: "₹22,000 – ₹35,000",
    preferredActivities: ["hiking", "culture", "photography", "hidden-places"],
    travelStyle: "Cultural",
    bio: "Amateur landscape photographer fascinated by 1,000-year-old mudbrick gompas and high-altitude ammonite fossil hunting in Langza. Keen on quiet earthen homestays.",
    languages: ["English", "Marathi", "Hindi"],
    initialStatus: "no_request",
    initialMessage: ""
  },
  {
    id: "buddy-priya",
    name: "Priya Nair",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    homeBase: "Kochi, Kerala",
    destination: "Madikeri & Coorg Highlands",
    destinationId: "coorg",
    startDate: "2026-11-15",
    endDate: "2026-11-20",
    dateDisplay: "Nov 15 – Nov 20, 2026",
    budgetMinINR: 14000,
    budgetMaxINR: 24000,
    budgetDisplay: "₹14,000 – ₹24,000",
    preferredActivities: ["local-food", "nature", "meeting-locals"],
    travelStyle: "Relaxed",
    bio: "Botanical illustrator exploring shaded pepper and cardamom agroforests. Eager to connect with fellow travelers who appreciate quiet porch journaling and ancestral Kodava recipes.",
    languages: ["English", "Malayalam", "Tamil"],
    initialStatus: "no_request",
    initialMessage: ""
  },
  {
    id: "buddy-tsering",
    name: "Tsering Norbu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    homeBase: "Dharamshala, Himachal",
    destination: "Ziro Pine Valley",
    destinationId: "ziro",
    startDate: "2026-11-12",
    endDate: "2026-11-19",
    dateDisplay: "Nov 12 – Nov 19, 2026",
    budgetMinINR: 16000,
    budgetMaxINR: 28000,
    budgetDisplay: "₹16,000 – ₹28,000",
    preferredActivities: ["culture", "dance-music", "meeting-locals", "local-language"],
    travelStyle: "Cultural",
    bio: "Sound designer recording folk bamboo rhythms and organic agricultural songs of the Apatani valley. Respectful traveler who always seeks elder permission before capturing audio.",
    languages: ["English", "Tibetan", "Hindi"],
    initialStatus: "no_request",
    initialMessage: ""
  },
  {
    id: "buddy-kavya",
    name: "Kavya & Shruti",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    homeBase: "Chennai, Tamil Nadu",
    destination: "Anegundi & Hampi Beyond Ruins",
    destinationId: "hampi",
    startDate: "2026-11-14",
    endDate: "2026-11-18",
    dateDisplay: "Nov 14 – Nov 18, 2026",
    budgetMinINR: 10000,
    budgetMaxINR: 18000,
    budgetDisplay: "₹10,000 – ₹18,000",
    preferredActivities: ["culture", "swimming", "photography", "local-food"],
    travelStyle: "Mixed",
    bio: "Heritage buffs crossing to the northern bank of the Tungabhadra to cycle ancient village water channels, visit banana fiber weavers, and swim at Sanapur lake.",
    languages: ["English", "Tamil", "Kannada"],
    initialStatus: "no_request",
    initialMessage: ""
  },
  {
    id: "buddy-vikram",
    name: "Vikram Singhania",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    homeBase: "New Delhi",
    destination: "Varkala Cliff & Backwaters",
    destinationId: "varkala",
    startDate: "2026-11-20",
    endDate: "2026-11-26",
    dateDisplay: "Nov 20 – Nov 26, 2026",
    budgetMinINR: 20000,
    budgetMaxINR: 35000,
    budgetDisplay: "₹20,000 – ₹35,000",
    preferredActivities: ["swimming", "adventure", "hiking", "local-food"],
    travelStyle: "Adventure",
    bio: "Freediver and trail runner escaping Delhi winter smog. Looking for early risers to explore secluded laterite headlands and try country canoe routes.",
    languages: ["English", "Hindi"],
    initialStatus: "no_request",
    initialMessage: ""
  }
];

// Activity ID to display name mapping
export const ACTIVITY_NAMES = {
  "local-food": "Local Food",
  "hiking": "Hiking",
  "swimming": "Swimming",
  "culture": "Culture",
  "dance-music": "Dance & Music",
  "meeting-locals": "Meeting Locals",
  "photography": "Photography",
  "nature": "Nature",
  "adventure": "Adventure",
  "local-language": "Local Language",
  "hidden-places": "Hidden Places"
};

/**
 * Deterministic Matching Logic:
 * Computes destination match, date overlap, shared interests, and budget compatibility.
 * Returns transparent score and human-readable explanation without artificial numbers.
 */
export function evaluateBuddyMatch(userCriteria, buddy) {
  if (!userCriteria) {
    return {
      isMatch: false,
      score: 50,
      destinationMatch: false,
      dateOverlap: false,
      sharedInterests: [],
      budgetCompatible: true,
      explanation: "Set your travel dates and destination to view personalized match compatibility."
    };
  }

  // 1. Destination Match
  const userDest = (userCriteria.destination || "").toLowerCase().trim();
  const buddyDest = (buddy.destination || "").toLowerCase();
  const buddyDestId = (buddy.destinationId || "").toLowerCase();

  const destinationMatch = 
    userDest.length > 0 &&
    (buddyDest.includes(userDest) || 
     userDest.includes(buddyDestId) || 
     buddyDestId.includes(userDest) ||
     (userCriteria.destinationId && userCriteria.destinationId === buddy.destinationId));

  // 2. Date Overlap Match
  let dateOverlap = false;
  if (userCriteria.startDate && userCriteria.endDate && buddy.startDate && buddy.endDate) {
    const uStart = new Date(userCriteria.startDate).getTime();
    const uEnd = new Date(userCriteria.endDate).getTime();
    const bStart = new Date(buddy.startDate).getTime();
    const bEnd = new Date(buddy.endDate).getTime();

    // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
    dateOverlap = (uStart <= bEnd) && (uEnd >= bStart);
  } else {
    // If user has not specified dates or month matches
    dateOverlap = true;
  }

  // 3. Shared Activity Interests
  const userInterests = userCriteria.preferredActivities || [];
  const buddyInterests = buddy.preferredActivities || [];
  const sharedInterests = buddyInterests.filter(act => userInterests.includes(act));

  // 4. Budget Range Compatibility
  let budgetCompatible = true;
  if (userCriteria.budgetINR) {
    const userBudget = parseInt(userCriteria.budgetINR, 10);
    // Compatible if within reasonable proximity
    budgetCompatible = userBudget >= (buddy.budgetMinINR * 0.7) && userBudget <= (buddy.budgetMaxINR * 1.5);
  }

  // 5. Defined Scoring Rules:
  // Destination: 40 points
  // Date Overlap: 30 points
  // Shared interests: 10 points each (max 30 points)
  let score = 0;
  if (destinationMatch) score += 40;
  if (dateOverlap) score += 30;
  score += Math.min(30, sharedInterests.length * 10);
  if (budgetCompatible) score += 10;
  score = Math.min(100, Math.max(10, score));

  // 6. Natural Language Match Explanation
  const explanationParts = [];
  if (destinationMatch) {
    explanationParts.push("Same destination");
  } else {
    explanationParts.push("Different destination");
  }

  if (dateOverlap) {
    explanationParts.push("overlapping travel dates");
  }

  if (sharedInterests.length > 0) {
    explanationParts.push(`${sharedInterests.length} shared interest${sharedInterests.length > 1 ? 's' : ''}`);
  }

  if (budgetCompatible) {
    explanationParts.push("compatible budget");
  }

  const explanation = explanationParts.join(", ");

  return {
    isMatch: destinationMatch || (sharedInterests.length >= 2 && dateOverlap),
    score,
    destinationMatch,
    dateOverlap,
    sharedInterests,
    budgetCompatible,
    explanation
  };
}
