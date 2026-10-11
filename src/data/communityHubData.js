// ROOTS Community Data Layer
// Manages community-contributed Travel Diaries, Places & Food Spots, Local Experiences,
// and Moderation Workflow.
// Notice: Clearly labelled sample prototype data. No live external APIs or fabricated verification.

import communityData from './communityData.json' with { type: 'json' };

// Initial sample community travel diaries (Approved demonstration records)
export const INITIAL_COMMUNITY_DIARIES = [
  {
    id: "diary-varkala-cliff",
    title: "Quiet Tides & Red Clay: 5 Days Beyond the Varkala Tourist Cliff",
    destination: "Varkala Cliff & Backwaters",
    destinationId: "varkala",
    tripDates: "Nov 12 – Nov 17, 2024",
    story: "Instead of staying at commercial cliff resorts, I rented a simple room behind Odayam beach with a fisher family. Every dawn, I joined local shore-seine fishermen hauling coconut-fibre nets. We walked the unpaved Kappil estuary where freshwater lagoons meet Arabian tides, drinking fresh sweet neera and eating grandmother's roasted shallot sadya on banana leaves.",
    cover: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    placesVisited: ["Edava Coconut Canal", "Kappil Sand Spit", "Odayam Tide Pools"],
    foodDiscovered: ["Subhadra Amma's Clay Pot Pearl Spot", "Fresh Coconut Neera at Dawn", "Tapioca with Shallot Chutney"],
    activities: ["Shore-seine net hauling", "Sunset cliff ridge trail", "Country canoe rowboat"],
    expenseType: "actual", // "actual" vs "estimated" clearly distinguished!
    expensesINR: 14200,
    expenseBreakdown: "Stay: ₹6,500 (Homestay 5N), Food: ₹3,800, Local Auto & Canoe: ₹2,400, Misc: ₹1,500",
    travellerTips: "Avoid cliff-side tourist cabs; hire local auto drivers stationed near Edava railway crossing for half the fare. Bring an eco-friendly water canteen as no single-use plastic bottles are allowed past the estuary.",
    tags: ["Local Food", "Hiking", "Swimming", "Meeting Locals"],
    contributor: {
      name: "Siddharth Menon",
      origin: "Kochi, Kerala",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-11-20T10:30:00Z",
    moderatedAt: "2024-11-21T09:15:00Z",
    moderationNotes: "Approved for community feed and slow-travel planner recommendations.",
    likes: 42
  },
  {
    id: "diary-nongriat-roots",
    title: "Descending 3,500 Wet Stone Steps to the Living Root Bridges",
    destination: "Nongriat & Cherrapunji",
    destinationId: "meghalaya",
    tripDates: "Oct 18 – Oct 24, 2024",
    story: "The descent to Nongriat valley leaves your knees shaking, but the moment you step onto the double-decker root bridge woven across two centuries by Khasi ancestors, time pauses. The river beneath is transparent jade. We stayed at Byron's bamboo hut, eating boiled wild pumpkin greens, fermented bamboo shoots, and smoky rice while rain drummed on corrugated tin roofs.",
    cover: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    ],
    placesVisited: ["Nongriat Double Decker Bridge", "Rainbow Falls Basins", "Tyrna Village Steps"],
    foodDiscovered: ["Wild Khasi Mustard Greens Soup", "Smoked Pork with Black Sesame", "Mountain Spring Tea"],
    activities: ["Deep valley hiking", "Ficus elastica bio-architecture study", "River pool swimming"],
    expenseType: "actual",
    expensesINR: 19800,
    expenseBreakdown: "Shared Sumo Taxi from Guwahati: ₹3,200, Village Community Homestay: ₹7,000, Local Guides: ₹4,500, Meals: ₹5,100",
    travellerTips: "Pack only a small 25L daypack for the descent down the steps. Store excess heavy luggage at the Tyrna tourist community cloakroom for ₹100/day. Grip rubber trekking sandals are essential for slippery limestone slabs.",
    tags: ["Hiking", "Nature", "Culture", "Adventure"],
    contributor: {
      name: "Tanya Sen",
      origin: "Kolkata, West Bengal",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-10-26T14:20:00Z",
    moderatedAt: "2024-10-27T11:00:00Z",
    moderationNotes: "Verified cultural respect guidelines and safety disclosures.",
    likes: 67
  },
  {
    id: "diary-spiti-langza",
    title: "14,000 Feet Under the Milky Way: Earthen Homestays of Langza",
    destination: "Spiti Valley & Pin Valley",
    destinationId: "spiti",
    tripDates: "Sep 05 – Sep 12, 2024",
    story: "Langza feels like the edge of another planet. In Tenzin's mudbrick home, a single wood stove heats the central living hall. We drank salted yak butter tea, learned to shape tsampa barley flour dough, and searched the fossil shale slopes beneath Chau Chau Kang Nilda peak for ancient ammonite impressions without disturbing the sacred soil.",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    placesVisited: ["Langza Golden Buddha Hill", "Hikkim World's Highest Post Office", "Komik Monastic Hall"],
    foodDiscovered: ["Tsampa Roasted Barley Porridge", "Steamed Tingmo Breads with Wild Garlic Lentils", "Sea Buckthorn Tea"],
    activities: ["High-altitude fossil ridge walk", "Monastery morning chanting", "Astrophotography"],
    expenseType: "estimated", // Clearly marked as estimated
    expensesINR: 23500,
    expenseBreakdown: "Shared Bolero Taxi: ₹11,000, Village Earthen Homestay: ₹6,500, Meals & Chai: ₹4,000, Community entry: ₹2,000",
    travellerTips: "Never rush acclimatisation; spend two full nights in Kaza before sleeping in Langza or Komik. Always carry diamox and respect local dry composting toilets by not flushing wet wipes.",
    tags: ["Culture", "Photography", "Nature", "Hidden Places"],
    contributor: {
      name: "Rohit Varma",
      origin: "Chandigarh",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80"
    },
    isApproximate: true,
    status: "approved",
    submittedAt: "2024-09-15T08:00:00Z",
    moderatedAt: "2024-09-16T16:30:00Z",
    moderationNotes: "Approved with approximate cost badge and safety acclimatisation note.",
    likes: 58
  }
];

// Initial sample community places & food discoveries (Approved demonstration records)
export const INITIAL_COMMUNITY_PLACES = [
  {
    id: "place-varkala-edava-estuary",
    name: "Edava Lagoon Estuary & Mangrove Shallows",
    destination: "Varkala Cliff & Backwaters",
    destinationId: "varkala",
    village: "Edava Village, 4 km North of Varkala",
    category: "nature", // nature, hiking, food, culture, attraction, other
    description: "A tranquil mangrove wetland where freshwater canals meet the sea. Migratory egrets and kingfishers fish in the low tide sandbanks. Completely free of commercial sunbeds.",
    approximateLocation: "North end of Edava beach road, near Pozhikkara bridge",
    photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"],
    priceRangeINR: "Free access (₹200 optional country canoe tip)",
    estimatedCostINR: 0,
    bestTime: "Dawn (06:00 – 08:30 AM) or sunset tide",
    safetyNotes: "Tidal currents at the estuary mouth can be strong; strictly wade only in the canal shallows and do not swim into open sea.",
    accessibilityDetails: "Flat dirt footpath; accessible by bicycle or auto-rickshaw up to 50 meters from the sand bank.",
    visitDate: "November 2024",
    contributor: {
      name: "Deepa K.",
      notes: "Local resident & coastal conservationist"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-11-10T12:00:00Z",
    moderatedAt: "2024-11-11T10:00:00Z",
    moderationNotes: "Verified safety warning regarding estuary mouth currents."
  },
  {
    id: "place-varkala-ammachi-mess",
    name: "Ammachi's Earthen Hearth Seafood & Sadya",
    destination: "Varkala Cliff & Backwaters",
    destinationId: "varkala",
    village: "Kurakkanni Junction, Varkala",
    category: "food",
    description: "Run by an elder fisherwoman cooking over fragrant tamarind wood firewood. Freshly caught karimeen (pearl spot) roasted in banana leaf alongside five vegetable curries.",
    approximateLocation: "Behind Kurakkanni temple bus stop, small blue tin door",
    photos: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"],
    priceRangeINR: "₹180 – ₹280 per thali",
    estimatedCostINR: 230,
    bestTime: "Lunch only: 12:15 PM – 02:30 PM (Food finishes early)",
    safetyNotes: "Very popular locally; arrive before 1:00 PM. Cash only; no card terminal.",
    accessibilityDetails: "Ground floor courtyard, two steps at threshold.",
    visitDate: "December 2024",
    contributor: {
      name: "Karan S.",
      notes: "Slow food writer"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-12-05T09:00:00Z",
    moderatedAt: "2024-12-06T15:20:00Z",
    moderationNotes: "Approved. Great authentic culinary addition."
  },
  {
    id: "place-meghalaya-rainbow-pool",
    name: "Rainbow Falls Natural Turquoise Basin",
    destination: "Nongriat & Cherrapunji",
    destinationId: "meghalaya",
    village: "Nongriat Valley Upper Ridge",
    category: "hiking",
    description: "A breathtaking waterfall 1.5 hours further up the gorge past the Double Decker living root bridge. Mist hits sunlight around 11:30 AM creating perpetual circular rainbows.",
    approximateLocation: "Follow marked village stone trail beyond Nongriat church",
    photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"],
    priceRangeINR: "₹50 village maintenance fee",
    estimatedCostINR: 50,
    bestTime: "10:30 AM – 01:30 PM for maximum sunlight refraction",
    safetyNotes: "Granite boulders surrounding the basin are coated in slippery moss. Do not jump from rocks; deep submerged boulders present.",
    accessibilityDetails: "Strenuous uphill rocky scramble with two suspension wire bridges.",
    visitDate: "October 2024",
    contributor: {
      name: "Marcus L.",
      notes: "Trek guide"
    },
    isApproximate: true, // Marked approximate
    status: "approved",
    submittedAt: "2024-10-22T11:45:00Z",
    moderatedAt: "2024-10-23T14:00:00Z",
    moderationNotes: "Approved with approximate trail marker advisory."
  },
  {
    id: "place-coorg-devarakadu",
    name: "Ammangala Sacred Forest Grove (Devarakadu)",
    destination: "Madikeri & Coorg Highlands",
    destinationId: "coorg",
    village: "Virajpet Taluk",
    category: "culture",
    description: "An ancestral sacred forest protected by village clans for over 800 years. Towering ironwood and wild nutmeg canopies with shrine stones worshiped by Kodava families.",
    approximateLocation: "Near Ammangala village entrance, signposted with Kodava emblem",
    photos: ["https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"],
    priceRangeINR: "Free (Donation box for village grove committee)",
    estimatedCostINR: 0,
    bestTime: "Morning 07:30 – 10:00 AM for bird chorus",
    safetyNotes: "Remove footwear before entering the central sanctum. Strictly no smoking, littering, or pluck of medicinal leaves permitted.",
    accessibilityDetails: "Flat forest trail with natural tree roots across the path.",
    visitDate: "November 2024",
    contributor: {
      name: "Cauvery Muthappa",
      notes: "Kodava cultural researcher"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-11-18T08:30:00Z",
    moderatedAt: "2024-11-19T09:40:00Z",
    moderationNotes: "Approved. Sacred etiquette guidelines properly articulated."
  }
];

// Initial sample community experiences (Cultural workshops, activities, language tips)
export const INITIAL_COMMUNITY_EXPERIENCES = [
  {
    id: "exp-varkala-coir-weaving",
    title: "Handloom Coir Spinning with Paravur Women's Collective",
    destination: "Varkala Cliff & Backwaters",
    destinationId: "varkala",
    village: "Paravur Lake Basin",
    category: "art_craft", // cultural_workshop, traditional_food, art_craft, language_tip, nature_walk, other
    duration: "2.5 Hours",
    estimatedCostINR: 350,
    location: "Paravur Coir Weavers Shed, beside lake canal",
    bookingRequirements: "No advance booking required; drop by on weekday mornings (09:00 AM – 12:00 PM)",
    availableDates: "Monday through Friday all year round",
    safetyAndPermissionNotes: "Wear clothes that can handle dust from shredded coconut husks. Always ask permission before filming artisans.",
    description: "Learn how aged coconut husks are retting-soaked in brackish water, beaten with wooden mallets, and hand-spun into marine-grade rope on traditional wooden wheels.",
    contributor: {
      name: "Suresh P.",
      role: "Coir Collective Secretary"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-11-12T10:00:00Z",
    moderatedAt: "2024-11-13T11:00:00Z",
    moderationNotes: "Approved. Directly supports women's artisan collective."
  },
  {
    id: "exp-spiti-tsampa-workshop",
    title: "High-Altitude Barley Tsampa Roasting & Tibetan Dialect Exchange",
    destination: "Spiti Valley & Pin Valley",
    destinationId: "spiti",
    village: "Kaza Old Village",
    category: "cultural_workshop",
    duration: "3 Hours",
    estimatedCostINR: 500,
    location: "Dechen's Traditional Mudbrick Kitchen",
    bookingRequirements: "Inquire at Kaza Ecosphere community office 1 day in advance",
    availableDates: "June to October, mornings 10:00 AM",
    safetyAndPermissionNotes: "Keep warm socks as shoes are left at the door of the mudbrick home. Suitable for all fitness levels.",
    description: "Roast organic high-altitude black barley over wood fires, grind it into flour using watermills, and learn 20 essential respectful greeting phrases in Bhoti dialect.",
    contributor: {
      name: "Dechen Chonzom",
      role: "Community Host"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-09-10T14:00:00Z",
    moderatedAt: "2024-09-11T12:00:00Z",
    moderationNotes: "Approved. Valuable linguistic and culinary immersion."
  },
  {
    id: "exp-hampi-coracle-building",
    title: "Traditional Buffalo-Hide Coracle Crafting Demo",
    destination: "Anegundi & Hampi Beyond Ruins",
    destinationId: "hampi",
    village: "Anegundi North Bank",
    category: "art_craft",
    duration: "2 Hours",
    estimatedCostINR: 400,
    location: "Anegundi river ghat workshop",
    bookingRequirements: "Ask for Master Weaver Timmappa near the old fortified gate",
    availableDates: "Daily except monsoon floods (August to March)",
    safetyAndPermissionNotes: "Life jackets provided if crossing onto the river. Never attempt during high monsoon dam releases.",
    description: "Observe generational boat builders bend split bamboo cane into circular hull frames, coated in natural resin. Includes a quiet row past ancient monolithic granite carvings.",
    contributor: {
      name: "Timmappa G.",
      role: "Hereditary Boatmaker"
    },
    isApproximate: false,
    status: "approved",
    submittedAt: "2024-12-01T08:00:00Z",
    moderatedAt: "2024-12-02T09:30:00Z",
    moderationNotes: "Approved with dam release safety check."
  }
];

// Initial pre-seeded PENDING submissions for Moderation Dashboard demo
export const INITIAL_PENDING_SUBMISSIONS = [
  {
    id: "sub-pending-01",
    submissionType: "place", // "diary" | "place" | "experience"
    title: "Secret Ammonite Fossil Ridge behind Langza Buddha",
    name: "Secret Ammonite Fossil Ridge behind Langza Buddha",
    destination: "Spiti Valley & Pin Valley",
    destinationId: "spiti",
    village: "Langza Valley",
    category: "hiking",
    description: "A trail leading 2 km above Langza village where marine fossils from the ancient Tethys Sea are naturally weathered out of black shale.",
    approximateLocation: "Upper ridge 300m above the golden Buddha statue",
    photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"],
    priceRangeINR: "Free",
    estimatedCostINR: 0,
    bestTime: "Morning 09:00 AM before high valley winds pick up",
    safetyNotes: "Altitude is above 4,400 meters. Do not remove fossils; local law strictly prohibits fossil extraction.",
    accessibilityDetails: "Steep scree slope; sturdy hiking boots required.",
    visitDate: "September 2026",
    contributor: {
      name: "Arunav K.",
      notes: "Amateur geologist & trekker"
    },
    isApproximate: true,
    status: "pending_review",
    submittedAt: "2026-10-08T15:30:00Z",
    statusHistory: [
      { status: "pending_review", timestamp: "2026-10-08T15:30:00Z", note: "Submitted for community moderation review." }
    ]
  },
  {
    id: "sub-pending-02",
    submissionType: "experience",
    title: "Organic Bamboo Rice & Fermented Fish Cooking with Apatani Homemakers",
    name: "Organic Bamboo Rice & Fermented Fish Cooking with Apatani Homemakers",
    destination: "Ziro Pine Valley",
    destinationId: "ziro",
    village: "Hong Village, Ziro",
    category: "traditional_food",
    duration: "3 Hours",
    estimatedCostINR: 650,
    location: "Hong Village Stilt House #14",
    bookingRequirements: "Notify host 24 hours prior so fresh bamboo stalks can be cut from the grove",
    availableDates: "October to April harvest season",
    safetyAndPermissionNotes: "Traditional open fire hearth inside bamboo home; open flame precautions apply.",
    description: "Learn the ancient Apatani culinary tradition of stuffing soaked hill rice and mountain trout inside hollow green bamboo shoots, slowly roasted over glowing hearth embers.",
    contributor: {
      name: "Yamang Kojin",
      notes: "Hong Village elder & cook"
    },
    isApproximate: false,
    status: "pending_review",
    submittedAt: "2026-10-09T11:20:00Z",
    statusHistory: [
      { status: "pending_review", timestamp: "2026-10-09T11:20:00Z", note: "Awaiting administrator validation of open fire safety note." }
    ]
  },
  {
    id: "sub-pending-03",
    submissionType: "diary",
    title: "Monsoon Cycling through Ancient Banana Groves of Anegundi",
    name: "Monsoon Cycling through Ancient Banana Groves of Anegundi",
    destination: "Anegundi & Hampi Beyond Ruins",
    destinationId: "hampi",
    tripDates: "Aug 14 – Aug 18, 2026",
    story: "Crossing the Tungabhadra river during light monsoon drizzles. Rented a black bicycle for ₹80/day and wandered through ancient aqueducts, stopping at village temples where priests offered freshly broken coconut and sweet jaggery poha.",
    cover: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"],
    placesVisited: ["Anegundi Fort Gate", "Sanapur Lake Rim", "Navabrindavana Island Viewpoint"],
    foodDiscovered: ["Banana Blossom Fritters", "Jaggery Poha Prasadam", "Tender Coconut Water"],
    activities: ["Bicycle touring", "Coracle river view", "Mythological folklore walk"],
    expenseType: "estimated",
    expensesINR: 8500,
    travellerTips: "Carry a waterproof phone pouch; sudden showers are frequent in August.",
    tags: ["Culture", "Nature", "Local Food"],
    contributor: {
      name: "Pooja Hegde",
      origin: "Hubli, Karnataka",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    isApproximate: true,
    status: "changes_requested",
    submittedAt: "2026-10-07T09:10:00Z",
    moderatedAt: "2026-10-08T10:00:00Z",
    moderationNotes: "Please clarify that crossing the Tungabhadra in coracles during peak monsoon dam releases is strictly regulated by river police.",
    statusHistory: [
      { status: "pending_review", timestamp: "2026-10-07T09:10:00Z", note: "Original submission" },
      { status: "changes_requested", timestamp: "2026-10-08T10:00:00Z", note: "Please add river safety note for August monsoon releases." }
    ]
  }
];

// Initial sample reported content for Moderation Dashboard demo
export const INITIAL_REPORTED_ITEMS = [
  {
    id: "report-01",
    targetType: "place",
    targetId: "place-unauthorized-cave",
    targetTitle: "Commercial Night Camp on Sensitive Cliff Edge",
    reportedReason: "Safety violation: camping on eroding laterite cliff without permit",
    reportedBy: "Local Panchayat Eco-Club",
    timestamp: "2026-10-09T18:30:00Z",
    status: "active", // active | hidden | dismissed
    notes: "Commercial tour group advertising tents directly over unstable cliff ledge."
  }
];

// =====================================================================
// LOCALSTORAGE DATA ACCESSORS AND PERSISTENCE MANAGERS
// =====================================================================

// Safe localStorage wrapper with in-memory fallback for test/SSR runtimes
const memoryStore = {};

function safeGetItem(key) {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStore[key] || null;
    }
  }
  return memoryStore[key] || null;
}

function safeSetItem(key, value) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
  memoryStore[key] = value;
}

export function getCommunityDiaries() {
  const customDiaries = (() => {
    try {
      const c = safeGetItem('roots_db_travel_diaries');
      return c ? JSON.parse(c) : [];
    } catch { return []; }
  })();
  const stored = safeGetItem('roots_community_diaries_v2');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const ids = new Set(customDiaries.map(d => d.id));
      return [...customDiaries, ...parsed.filter(p => !ids.has(p.id))];
    } catch (e) {}
  }
  const ids = new Set(customDiaries.map(d => d.id));
  return [...customDiaries, ...INITIAL_COMMUNITY_DIARIES.filter(p => !ids.has(p.id))];
}

export function saveCommunityDiary(newDiary, isDraft = false) {
  const all = getCommunityDiaries();
  const entry = {
    ...newDiary,
    id: newDiary.id || `diary-${Date.now()}`,
    status: isDraft ? 'draft' : 'pending_review',
    submittedAt: new Date().toISOString(),
    statusHistory: [
      {
        status: isDraft ? 'draft' : 'pending_review',
        timestamp: new Date().toISOString(),
        note: isDraft ? 'Draft saved locally.' : 'Submitted for moderation review.'
      }
    ],
    likes: 0
  };

  const updated = [entry, ...all.filter(d => d.id !== entry.id)];
  safeSetItem('roots_community_diaries_v2', JSON.stringify(updated));

  // Also add to moderation submissions if not draft
  if (!isDraft) {
    addModerationSubmission({
      ...entry,
      submissionType: 'diary'
    });
  }

  return entry;
}

export function getCommunityPlaces() {
  const customPlaces = (() => {
    try {
      const c = safeGetItem('roots_db_destination_tips');
      return c ? JSON.parse(c) : [];
    } catch { return []; }
  })();
  const stored = safeGetItem('roots_community_places_v2');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const ids = new Set(customPlaces.map(p => p.id));
      return [...customPlaces, ...parsed.filter(p => !ids.has(p.id))];
    } catch (e) {}
  }
  const ids = new Set(customPlaces.map(p => p.id));
  return [...customPlaces, ...INITIAL_COMMUNITY_PLACES.filter(p => !ids.has(p.id))];
}

export function saveCommunityPlace(newPlace, isDraft = false) {
  const all = getCommunityPlaces();
  const entry = {
    ...newPlace,
    id: newPlace.id || `place-${Date.now()}`,
    status: isDraft ? 'draft' : 'pending_review',
    submittedAt: new Date().toISOString(),
    statusHistory: [
      {
        status: isDraft ? 'draft' : 'pending_review',
        timestamp: new Date().toISOString(),
        note: isDraft ? 'Draft saved locally.' : 'Submitted for moderation review.'
      }
    ]
  };

  const updated = [entry, ...all.filter(p => p.id !== entry.id)];
  safeSetItem('roots_community_places_v2', JSON.stringify(updated));

  if (!isDraft) {
    addModerationSubmission({
      ...entry,
      submissionType: 'place'
    });
  }

  return entry;
}

export function getCommunityExperiences() {
  const stored = safeGetItem('roots_community_experiences_v2');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return INITIAL_COMMUNITY_EXPERIENCES;
}

export function saveCommunityExperience(newExp, isDraft = false) {
  const all = getCommunityExperiences();
  const entry = {
    ...newExp,
    id: newExp.id || `exp-${Date.now()}`,
    status: isDraft ? 'draft' : 'pending_review',
    submittedAt: new Date().toISOString(),
    statusHistory: [
      {
        status: isDraft ? 'draft' : 'pending_review',
        timestamp: new Date().toISOString(),
        note: isDraft ? 'Draft saved locally.' : 'Submitted for moderation review.'
      }
    ]
  };

  const updated = [entry, ...all.filter(e => e.id !== entry.id)];
  safeSetItem('roots_community_experiences_v2', JSON.stringify(updated));

  if (!isDraft) {
    addModerationSubmission({
      ...entry,
      submissionType: 'experience'
    });
  }

  return entry;
}

// Moderation queue management
export function getModerationSubmissions() {
  const stored = safeGetItem('roots_moderation_queue_v2');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return INITIAL_PENDING_SUBMISSIONS;
}

export function addModerationSubmission(submission) {
  const queue = getModerationSubmissions();
  const updated = [submission, ...queue.filter(s => s.id !== submission.id)];
  safeSetItem('roots_moderation_queue_v2', JSON.stringify(updated));
}

export function updateModerationStatus(id, newStatus, reason = '', notes = '') {
  const queue = getModerationSubmissions();
  const timestamp = new Date().toISOString();

  let targetSubmission = null;
  const updatedQueue = queue.map(sub => {
    if (sub.id === id) {
      targetSubmission = {
        ...sub,
        status: newStatus,
        moderatedAt: timestamp,
        moderationNotes: reason || notes || `Marked as ${newStatus}`,
        statusHistory: [
          ...(sub.statusHistory || []),
          {
            status: newStatus,
            timestamp,
            note: reason || notes || `Status changed to ${newStatus}`
          }
        ]
      };
      return targetSubmission;
    }
    return sub;
  });

  safeSetItem('roots_moderation_queue_v2', JSON.stringify(updatedQueue));

  // Sync back to corresponding storage if exists
  if (targetSubmission) {
    if (targetSubmission.submissionType === 'diary') {
      const diaries = getCommunityDiaries();
      const updatedDiaries = diaries.map(d => d.id === id ? { ...d, status: newStatus, moderatedAt: timestamp, moderationNotes: reason } : d);
      if (!diaries.some(d => d.id === id)) {
        updatedDiaries.unshift(targetSubmission);
      }
      safeSetItem('roots_community_diaries_v2', JSON.stringify(updatedDiaries));
    } else if (targetSubmission.submissionType === 'place') {
      const places = getCommunityPlaces();
      const updatedPlaces = places.map(p => p.id === id ? { ...p, status: newStatus, moderatedAt: timestamp, moderationNotes: reason } : p);
      if (!places.some(p => p.id === id)) {
        updatedPlaces.unshift(targetSubmission);
      }
      safeSetItem('roots_community_places_v2', JSON.stringify(updatedPlaces));
    } else if (targetSubmission.submissionType === 'experience') {
      const exps = getCommunityExperiences();
      const updatedExps = exps.map(e => e.id === id ? { ...e, status: newStatus, moderatedAt: timestamp, moderationNotes: reason } : e);
      if (!exps.some(e => e.id === id)) {
        updatedExps.unshift(targetSubmission);
      }
      safeSetItem('roots_community_experiences_v2', JSON.stringify(updatedExps));
    }
  }

  return targetSubmission;
}

// Reported content management
export function getReportedItems() {
  const stored = safeGetItem('roots_community_reports_v2');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return INITIAL_REPORTED_ITEMS;
}

export function reportContent(itemType, itemId, itemTitle, reason, notes) {
  const reports = getReportedItems();
  const newReport = {
    id: `rep-${Date.now()}`,
    targetType: itemType,
    targetId: itemId,
    targetTitle: itemTitle,
    reportedReason: reason,
    notes,
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  const updated = [newReport, ...reports];
  safeSetItem('roots_community_reports_v2', JSON.stringify(updated));
  return newReport;
}

export function updateReportStatus(reportId, newStatus) { // 'hidden' | 'dismissed'
  const reports = getReportedItems();
  const updated = reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r);
  safeSetItem('roots_community_reports_v2', JSON.stringify(updated));
  return updated;
}

/**
 * PLANNER INTEGRATION HELPER
 * Returns approved community places and experiences mapped into the planner format.
 * STRICT CRITERIA: ONLY items with status === 'approved' are returned.
 * Pending, rejected, or changes_requested items are NEVER included.
 */
export function getApprovedPlannerEntries(destinationId) {
  const baseEntries = communityData.communityEntries.filter(
    e => !destinationId || e.destinationId === destinationId
  );

  // Fetch approved places
  const communityPlaces = getCommunityPlaces().filter(p => {
    if (p.status !== 'approved') return false;
    if (destinationId && p.destinationId !== destinationId) return false;
    return true;
  });

  // Fetch approved experiences
  const communityExps = getCommunityExperiences().filter(e => {
    if (e.status !== 'approved') return false;
    if (destinationId && e.destinationId !== destinationId) return false;
    return true;
  });

  // Transform community places to planner entry schema
  const mappedPlaces = communityPlaces.map(p => ({
    id: p.id,
    destinationId: p.destinationId,
    name: p.name,
    category: p.category === 'food' ? 'food_spot' : (p.category === 'hiking' || p.category === 'nature' ? 'place' : 'activity'),
    timeSlot: p.category === 'food' ? 'afternoon' : 'morning',
    description: p.description,
    estimatedCostINR: p.estimatedCostINR || 0,
    suggestedDuration: p.bestTime || "2 hours",
    tags: [p.category, p.destinationId, 'community-approved'],
    sourceContributor: p.contributor?.name || "Community Traveler",
    reviewStatus: "Community Approved (Vetted)",
    practicalNotes: `${p.safetyNotes || ''} ${p.accessibilityDetails || ''}`.trim(),
    travelStyle: ["Cultural", "Adventure", "Relaxed", "Mixed"]
  }));

  // Transform community experiences to planner entry schema
  const mappedExps = communityExps.map(e => ({
    id: e.id,
    destinationId: e.destinationId,
    name: e.title,
    category: 'activity',
    timeSlot: 'afternoon',
    description: e.description,
    estimatedCostINR: e.estimatedCostINR || 0,
    suggestedDuration: e.duration || "2.5 hours",
    tags: [e.category, e.destinationId, 'local-workshop', 'community-approved'],
    sourceContributor: e.contributor?.name || "Local Artisan",
    reviewStatus: "Community Approved (Vetted)",
    practicalNotes: `${e.safetyAndPermissionNotes || ''} ${e.bookingRequirements || ''}`.trim(),
    travelStyle: ["Cultural", "Adventure", "Mixed"]
  }));

  return [...baseEntries, ...mappedPlaces, ...mappedExps];
}
