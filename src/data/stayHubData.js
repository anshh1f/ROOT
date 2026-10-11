// ROOTS Stay Data Layer
// Manages community homestays, host onboarding, admin verification, booking requests, and safety controls.
// Transparent prototype data: Clearly labelled demo records, no external real-world booking APIs.

import communityData from './communityData.json' with { type: 'json' };

// In-memory fallback for safe runtime in Node/test environments
const memoryStore = {};

function safeGetItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memoryStore[key] || null;
  } catch (e) {
    return memoryStore[key] || null;
  }
}

function safeSetItem(key, val) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
    memoryStore[key] = val;
  } catch (e) {
    memoryStore[key] = val;
  }
}

// 1. Initial Curated Approved Stays (Demonstration Records)
export const INITIAL_APPROVED_STAYS = [
  {
    id: "stay-thattekad-riverside",
    name: "Eldho & Mary's Riverside Teakwood Homestay",
    destinationId: "varkala",
    generalLocation: "Periyar Riverbank, Thattekad, Kerala (Approx. 4km from bird sanctuary)",
    propertyType: "Ancestral Courtyard",
    tagline: "Slow-cooked clay pot karimeen fish & dawn canoe rows on the Periyar riverbank.",
    host: {
      name: "Eldho Varghese",
      ageVerified: true,
      languages: ["Malayalam", "English", "Tamil"],
      intro: "Former teak boatwright and nature guide. Our family has lived along the Periyar banks for four generations.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 2,
    beds: 3,
    maxGuests: 5,
    bathroomPrivacy: "Private Ensuite Washroom",
    nightlyRateINR: 2200,
    cleaningOrCommunityFeeINR: 200,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: true,
      dinnerCostPerPersonINR: 250,
      description: "Mary's slow-cooked clay pot karimeen fish or vegetarian jackfruit seed curry on banana leaves."
    },
    amenities: ["Wi-Fi", "Homecooked Meals", "Hot Water", "Farm/River Walk", "Work Desk", "Balcony", "Filtered Well Water"],
    culturalActivities: [
      "Traditional Kerala clay pot cooking demo",
      "Dawn country canoe rowboat on backwaters",
      "Medicinal spice orchard walk"
    ],
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    ],
    accessibility: "Ground floor bedroom available. 2 steps to veranda. Wide doorways.",
    safetyFeatures: ["First aid kit on site", "Fire extinguisher in kitchen", "Solar emergency lighting", "Emergency contact card in room"],
    houseRules: [
      "Quiet hours after 10:00 PM to respect river fauna",
      "Footwear left on exterior teak veranda",
      "No single-use plastic bottles; refillable copper jugs provided",
      "Prior notice for family dinner by 4:00 PM"
    ],
    cancellationPolicy: "Flexible: Full refund up to 48 hours prior to check-in. Community credit thereafter.",
    checkInTime: "01:00 PM",
    checkOutTime: "11:00 AM",
    verification: {
      idChecked: true,
      ownershipOrPermissionVerified: true,
      safetyInspectionPassed: true,
      verificationBadge: "Community Verified Host",
      isSampleDemo: true
    },
    blockedDates: ["2026-10-25_2026-10-28"],
    status: "approved",
    ratingScore: 4.95,
    reviewsCount: 38,
    statusHistory: [
      { status: "approved", timestamp: "2024-08-10T10:00:00Z", note: "Verified ancestral property papers and safety kit inspection." }
    ]
  },
  {
    id: "stay-nongriat-bamboo",
    name: "Byron's Ficus Canopy Bamboo Homestay",
    destinationId: "meghalaya",
    generalLocation: "Lower Nongriat Village, East Khasi Hills (At the foot of the 3,500 stone steps)",
    propertyType: "Bamboo Stilt Home",
    tagline: "Living root bridge bio-architecture home with wild forest greens over wood hearth.",
    host: {
      name: "Byron Nongriat",
      ageVerified: true,
      languages: ["Khasi", "English", "Hindi"],
      intro: "Village schoolteacher and living root bridge custodian. Passionate about preserving indigenous bio-architecture.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 3,
    beds: 4,
    maxGuests: 6,
    bathroomPrivacy: "Shared Eco-friendly Washroom",
    nightlyRateINR: 1400,
    cleaningOrCommunityFeeINR: 100,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: true,
      dinnerCostPerPersonINR: 180,
      description: "Boiled wild pumpkin greens, fermented bamboo shoots, and hill red rice over wood hearth."
    },
    amenities: ["Homecooked Meals", "Mountain Stream Water", "Balcony", "Trek Guide Advice", "Valley View"],
    culturalActivities: [
      "Living Root Bridge evening folklore circle",
      "Rainbow falls hidden stream guide walk",
      "Traditional Khasi bamboo basketry intro"
    ],
    photos: [
      "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    accessibility: "Requires walking down 3,500 valley steps. Sturdy trekking footwear mandatory. Not wheelchair accessible.",
    safetyFeatures: ["Village dispensary first aid contact", "Torchlights & solar lanterns", "Direct liaison with Dorbar Shnong (village council)"],
    houseRules: [
      "Pack out all non-biodegradable waste (strict village council mandate)",
      "Bathing in sacred river pools requires modest attire",
      "Smoking strictly forbidden near bamboo and thatch structures"
    ],
    cancellationPolicy: "Moderate: Free cancellation up to 5 days before check-in due to remote logistics.",
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
    verification: {
      idChecked: true,
      ownershipOrPermissionVerified: true,
      safetyInspectionPassed: true,
      verificationBadge: "Dorbar Shnong Endorsed",
      isSampleDemo: true
    },
    blockedDates: ["2026-11-02_2026-11-05"],
    status: "approved",
    ratingScore: 4.88,
    reviewsCount: 29,
    statusHistory: [
      { status: "approved", timestamp: "2024-09-01T12:00:00Z", note: "Approved with village headman permission verification." }
    ]
  },
  {
    id: "stay-spiti-langza",
    name: "Tenzin's Mudbrick Homestay Under Chau Chau Peak",
    destinationId: "spiti",
    generalLocation: "Langza Village, Spiti Valley (Elevation 14,400 ft, near Golden Buddha)",
    propertyType: "Mudbrick Mountain Retreat",
    tagline: "High-altitude mudbrick sanctuary with tsampa porridge & Himalayan dark-sky stargazing terrace.",
    host: {
      name: "Tenzin & Choden",
      ageVerified: true,
      languages: ["Bhoti (Spitian)", "Hindi", "Basic English"],
      intro: "Farming family cultivating green peas and barley in the trans-Himalayan rain shadow. Stargazing enthusiasts.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 2,
    beds: 3,
    maxGuests: 4,
    bathroomPrivacy: "Dry Composting Spitian Washroom",
    nightlyRateINR: 2100,
    cleaningOrCommunityFeeINR: 150,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: true,
      dinnerCostPerPersonINR: 200,
      description: "Tsampa roasted barley porridge, butter tea, steamed tingmo breads with wild mountain garlic lentils."
    },
    amenities: ["Homecooked Meals", "Solar Heated Water (Afternoon)", "Stargazing Terrace", "Wood Bukhari Stove", "Warm Yak Wool Quilts"],
    culturalActivities: [
      "Early dawn monastery chant walk to Komik",
      "Fossil shale identification along Langza ridge",
      "Traditional tsampa kneading workshop"
    ],
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
    ],
    accessibility: "High altitude (4,400m). Acclimatisation required. 1 floor interior stairs.",
    safetyFeatures: ["Emergency medical oxygen canister on site", "Satellite phone contact in village", "First aid for AMS"],
    houseRules: [
      "Do not flush paper or wipes into dry composting toilets",
      "Respect sacred fossil fields (no commercial collecting)",
      "No alcohol or loud music at any hour"
    ],
    cancellationPolicy: "Flexible: Weather disruptions honored with 100% rescheduling or refund.",
    checkInTime: "02:00 PM",
    checkOutTime: "11:00 AM",
    verification: {
      idChecked: true,
      ownershipOrPermissionVerified: true,
      safetyInspectionPassed: true,
      verificationBadge: "High-Altitude Safety Verified",
      isSampleDemo: true
    },
    blockedDates: [],
    status: "approved",
    ratingScore: 4.96,
    reviewsCount: 42,
    statusHistory: [
      { status: "approved", timestamp: "2024-07-20T08:00:00Z", note: "Verified oxygen supply and local guide compliance." }
    ]
  },
  {
    id: "stay-coorg-plantation",
    name: "Biddappa Family Coffee & Pepper Estate Homestay",
    destinationId: "coorg",
    generalLocation: "Kakkabe Foothills, Kodagu, Karnataka (Near Tadiandamol base)",
    propertyType: "Heritage Farm Cottage",
    tagline: "Canopy Arabica coffee estate. Warm Kodava akki roti feasts & private stream walks.",
    host: {
      name: "Rohan & Ananya Biddappa",
      ageVerified: true,
      languages: ["Kodava", "Kannada", "English", "Hindi"],
      intro: "Organic planters cultivating Arabica coffee, Malabar black pepper, and jungle cardamom for over 60 years.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 3,
    beds: 4,
    maxGuests: 6,
    bathroomPrivacy: "Private Ensuite Washroom",
    nightlyRateINR: 3200,
    cleaningOrCommunityFeeINR: 250,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: true,
      dinnerCostPerPersonINR: 350,
      description: "Authentic Kodava akki roti with kootu curry, bamboo shoot stir fry, and fresh estate-ground pour-over coffee."
    },
    amenities: ["Wi-Fi", "Homecooked Meals", "Hot Water", "Farm/River Walk", "Work Desk", "Balcony", "Fireplace", "Parking"],
    culturalActivities: [
      "Estate harvesting and manual coffee pulping walk",
      "Wild honey tasting and Kodava spice blending",
      "Guided stream trek up to Tadiandamol ridge"
    ],
    photos: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    accessibility: "Ramped entrance to main cottage, ground floor suite available.",
    safetyFeatures: ["Doctor-on-call in Kakkabe (10 min)", "Fire extinguisher", "First aid & leech guards for wet season", "Power backup generator"],
    houseRules: [
      "Estate gates closed at 9:30 PM for wildlife safety",
      "No entering plantation zones after dusk without an estate guide",
      "Pets welcome with prior notification"
    ],
    cancellationPolicy: "Flexible: Free cancellation up to 48 hours before check-in.",
    checkInTime: "01:00 PM",
    checkOutTime: "11:00 AM",
    verification: {
      idChecked: true,
      ownershipOrPermissionVerified: true,
      safetyInspectionPassed: true,
      verificationBadge: "Kodava Heritage Certified",
      isSampleDemo: true
    },
    blockedDates: ["2026-10-18_2026-10-21"],
    status: "approved",
    ratingScore: 4.92,
    reviewsCount: 35,
    statusHistory: [
      { status: "approved", timestamp: "2024-06-15T15:00:00Z", note: "Heritage estate records and safety audit confirmed." }
    ]
  },
  {
    id: "stay-varkala-claypot",
    name: "Subhadra Amma's Ancestral Seaside Nallukettu",
    destinationId: "varkala",
    generalLocation: "Odayam Fishing Hamlet, Varkala (200m from uncrowded red cliff trail)",
    propertyType: "Ancestral Courtyard",
    tagline: "Ancestral seaside Nallukettu courtyard with open skies, appams & quiet shoreline trails.",
    host: {
      name: "Subhadra Amma & Sreekanth",
      ageVerified: true,
      languages: ["Malayalam", "English"],
      intro: "Grandmother and grandson duo. We preserve coastal architecture with breezy open inner courtyards and clay-tile roofs.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 2,
    beds: 2,
    maxGuests: 4,
    bathroomPrivacy: "Private Ensuite Washroom",
    nightlyRateINR: 1950,
    cleaningOrCommunityFeeINR: 150,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: true,
      dinnerCostPerPersonINR: 200,
      description: "Appams with fresh stewed coconut milk, roasted shallot sadya, and sweet jaggery payasam."
    },
    amenities: ["Wi-Fi", "Homecooked Meals", "Hot Water", "Hammock Garden", "Work Desk", "Ceiling Fan", "Bicycle Loan"],
    culturalActivities: [
      "Traditional coconut-scraper & appam batter lesson",
      "Morning walk to watch shore-seine fishermen draw nets",
      "Ayurvedic herbal garden tour"
    ],
    photos: [
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    accessibility: "Single level cottage, no stairs to guest bedrooms.",
    safetyFeatures: ["First aid box", "Fire blanket", "Mosquito nets & organic neem vaporizers"],
    houseRules: [
      "Shoes left outside the central thinnai veranda",
      "No loud parties; this is a peaceful multigenerational residential neighborhood",
      "Beach rinse-off shower in garden before entering the house"
    ],
    cancellationPolicy: "Flexible: Full refund up to 48 hours before check-in.",
    checkInTime: "01:00 PM",
    checkOutTime: "11:00 AM",
    verification: {
      idChecked: true,
      ownershipOrPermissionVerified: true,
      safetyInspectionPassed: true,
      verificationBadge: "Community Verified Host",
      isSampleDemo: true
    },
    blockedDates: [],
    status: "approved",
    ratingScore: 4.97,
    reviewsCount: 51,
    statusHistory: [
      { status: "approved", timestamp: "2024-05-12T10:00:00Z", note: "Approved with complete local inspection." }
    ]
  },
  {
    id: "stay-hampi-banana",
    name: "Shashi's Banana Grove Stone Veranda",
    destinationId: "hampi",
    generalLocation: "Anegundi Rural Village, Hampi North Bank (Adjacent to ancient stone aqueduct)",
    propertyType: "Village Homestay",
    tagline: "Ancient stone veranda beside Tungabhadra river with sorghum rottis & evening folklore.",
    host: {
      name: "Shashikanth Kulkarni",
      ageVerified: true,
      languages: ["Kannada", "Hindi", "English"],
      intro: "Local folklore storyteller and heritage conservator. Born and raised in Anegundi, older than Hampi itself.",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 2,
    beds: 3,
    maxGuests: 4,
    bathroomPrivacy: "Private Ensuite Washroom",
    nightlyRateINR: 1650,
    cleaningOrCommunityFeeINR: 100,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: true,
      dinnerCostPerPersonINR: 180,
      description: "Jolada rotti (sorghum flatbread) with spiced brinjal curry, shenga chutney, and organic sugarcane jaggery."
    },
    amenities: ["Wi-Fi", "Homecooked Meals", "Hot Water", "Farm/River Walk", "Work Desk", "Terrace Stargazing", "Bicycle Loan"],
    culturalActivities: [
      "Ancient Anegundi oral mythology walk at twilight",
      "Coracle boat ride on Tungabhadra river",
      "Banana fibre weaving workshop with village artisan guild"
    ],
    photos: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
    ],
    accessibility: "Ground floor, wide stone doors, 1 low threshold step.",
    safetyFeatures: ["First aid kit", "Emergency auto rickshaw driver contact", "Solar lamps"],
    houseRules: [
      "Respect village temple customs and dress appropriately",
      "No non-vegetarian cooking inside the family kitchen",
      "Quiet hours after 10:00 PM"
    ],
    cancellationPolicy: "Flexible: Full refund up to 48 hours prior to check-in.",
    checkInTime: "12:00 PM",
    checkOutTime: "10:30 AM",
    verification: {
      idChecked: true,
      ownershipOrPermissionVerified: true,
      safetyInspectionPassed: true,
      verificationBadge: "Heritage Village Guild",
      isSampleDemo: true
    },
    blockedDates: [],
    status: "approved",
    ratingScore: 4.89,
    reviewsCount: 22,
    statusHistory: [
      { status: "approved", timestamp: "2024-04-20T11:00:00Z", note: "Approved with artisan guild certification." }
    ]
  }
];

// 2. Initial Pre-seeded Pending Host Applications for Admin Verification Testing
export const INITIAL_PENDING_APPLICATIONS = [
  {
    id: "app-ziro-haven",
    name: "Talo's Pine Valley Bamboo Stilt Home",
    destinationId: "meghalaya", // or nearest Northeast hub
    generalLocation: "Hong Village, Ziro Valley, Arunachal Pradesh (Approx 2km from Hapoli)",
    propertyType: "Bamboo Stilt Home",
    host: {
      name: "Talo Kojin",
      ageVerified: true,
      languages: ["Apatani", "English", "Hindi"],
      intro: "Apatani community farmer and traditional craftsperson. We wish to host respectful travellers keen to understand our ancient fish-paddy agroforestry.",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 2,
    beds: 2,
    maxGuests: 4,
    bathroomPrivacy: "Detached Washroom (Covered Walkway)",
    nightlyRateINR: 1750,
    cleaningOrCommunityFeeINR: 150,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: true,
      dinnerCostPerPersonINR: 220,
      description: "Traditional bamboo cylinder smoked chicken/vegetables, millet brews, and organic seasonal forest herbs."
    },
    amenities: ["Homecooked Meals", "Hot Water", "Farm/River Walk", "Balcony", "Wood Fireplace"],
    culturalActivities: [
      "Apatani paddy-cum-fish farming tour",
      "Traditional cane basketry and wood carving",
      "Folk tales by the central hearth"
    ],
    photos: [
      "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    ],
    accessibility: "Stilt structure with wooden ladder steps. Handrails installed.",
    safetyFeatures: ["First aid box", "Fire bucket with sand", "Emergency contacts for Ziro district hospital"],
    houseRules: [
      "Respect sacred village groves (Tago groves)",
      "Ask permission before photographing elderly villagers",
      "No smoking indoors"
    ],
    cancellationPolicy: "Flexible: Full refund up to 48 hours prior to check-in.",
    checkInTime: "01:00 PM",
    checkOutTime: "11:00 AM",
    verification: {
      idChecked: false, // PENDING ADMIN REVIEW
      ownershipOrPermissionVerified: false, // PENDING ADMIN REVIEW
      safetyInspectionPassed: false, // PENDING ADMIN REVIEW
      verificationBadge: "Application Under Review",
      isSampleDemo: true
    },
    blockedDates: [],
    status: "pending_verification",
    submittedAt: "2024-11-28T09:30:00Z",
    statusHistory: [
      {
        status: "pending_verification",
        timestamp: "2024-11-28T09:30:00Z",
        note: "Submitted by host. Awaiting identity and property inspection review."
      }
    ]
  },
  {
    id: "app-munnar-cardamom",
    name: "Kurian's Mist Cottage in the Cardamom Hills",
    destinationId: "wayanad",
    generalLocation: "Rajakkad Village, Idukki District, Kerala",
    propertyType: "Farm Cottage",
    host: {
      name: "Kurian Joseph",
      ageVerified: true,
      languages: ["Malayalam", "English"],
      intro: "Spices planter cultivating organic black pepper and vanilla. We built this guest cottage for travellers seeking quiet retreat.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      phoneEmailVerified: true
    },
    hostLivesOnProperty: true,
    rooms: 1,
    beds: 2,
    maxGuests: 3,
    bathroomPrivacy: "Private Ensuite Washroom",
    nightlyRateINR: 2400,
    cleaningOrCommunityFeeINR: 200,
    mealOptions: {
      breakfastIncluded: true,
      dinnerAvailable: false,
      dinnerCostPerPersonINR: 0,
      description: "Steamed puttu with spicy kadala curry and black pepper tea."
    },
    amenities: ["Wi-Fi", "Homecooked Meals", "Hot Water", "Farm/River Walk", "Balcony", "Parking"],
    culturalActivities: [
      "Cardamom drying furnace inspection",
      "Birdwatching trail to waterfall stream"
    ],
    photos: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
    ],
    accessibility: "Ground floor cottage, 3 entrance steps.",
    safetyFeatures: ["First aid kit", "Fire extinguisher"],
    houseRules: [
      "No smoking",
      "Quiet hours after 10 PM"
    ],
    cancellationPolicy: "Flexible: Up to 48 hours prior.",
    checkInTime: "02:00 PM",
    checkOutTime: "11:00 AM",
    verification: {
      idChecked: false,
      ownershipOrPermissionVerified: false,
      safetyInspectionPassed: false,
      verificationBadge: "Application Under Review",
      isSampleDemo: true
    },
    blockedDates: [],
    status: "pending_verification",
    submittedAt: "2024-11-29T14:15:00Z",
    statusHistory: [
      {
        status: "pending_verification",
        timestamp: "2024-11-29T14:15:00Z",
        note: "Initial registration. Need verification of local panchayat registration certificate."
      }
    ]
  }
];

// 3. Initial Stay Booking Requests (Pre-seeded for testing Host decisions & User states)
export const INITIAL_STAY_BOOKINGS = [
  {
    id: "book-sample-1",
    stayId: "stay-thattekad-riverside",
    stayTitle: "Eldho & Mary's Riverside Teakwood Homestay",
    hostName: "Eldho Varghese",
    guestName: "Aanya Sharma",
    guestContact: "aanya.travel@example.com",
    checkInDate: "2026-11-10",
    checkOutDate: "2026-11-13",
    nights: 3,
    guestsCount: 2,
    includeDinner: true,
    nightlyRateINR: 2200,
    cleaningFeeINR: 200,
    dinnerTotalINR: 1500, // 2 guests * 3 nights * 250
    totalPriceINR: 8300,
    guestMessage: "Hi Eldho! We are two slow travel enthusiasts hoping to spot the Malabar hornbill and learn Mary's clay pot recipes.",
    status: "pending_host_approval", // 'pending_host_approval' | 'confirmed' | 'declined' | 'cancelled'
    createdAt: "2026-10-08T11:20:00Z",
    statusHistory: [
      {
        status: "pending_host_approval",
        timestamp: "2026-10-08T11:20:00Z",
        note: "Stay request submitted by guest. Awaiting host confirmation."
      }
    ]
  },
  {
    id: "book-sample-2",
    stayId: "stay-nongriat-bamboo",
    stayTitle: "Byron's Ficus Canopy Bamboo Homestay",
    hostName: "Byron Nongriat",
    guestName: "Karthik Raja",
    guestContact: "karthik.raja@example.com",
    checkInDate: "2026-11-18",
    checkOutDate: "2026-11-20",
    nights: 2,
    guestsCount: 1,
    includeDinner: true,
    nightlyRateINR: 1400,
    cleaningFeeINR: 100,
    dinnerTotalINR: 360,
    totalPriceINR: 3260,
    guestMessage: "Trekking down from Tyrna. Excited to stay with Byron and see the double-decker root bridge at dawn.",
    status: "confirmed",
    createdAt: "2026-10-05T09:00:00Z",
    confirmedAt: "2026-10-05T14:30:00Z",
    statusHistory: [
      {
        status: "pending_host_approval",
        timestamp: "2026-10-05T09:00:00Z",
        note: "Request submitted."
      },
      {
        status: "confirmed",
        timestamp: "2026-10-05T14:30:00Z",
        note: "Host accepted request: Room prepared with warm blankets."
      }
    ]
  }
];

// 4. Initial Reported Stays
export const INITIAL_STAY_REPORTS = [
  {
    id: "rep-stay-1",
    stayId: "stay-thattekad-riverside",
    stayTitle: "Eldho & Mary's Riverside Teakwood Homestay",
    reason: "Inaccurate photo of external road",
    notes: "The road is unpaved red mud after monsoon, needs a high-clearance auto.",
    reporterName: "Demo User",
    timestamp: "2026-10-01T10:00:00Z",
    status: "active" // 'active' | 'dismissed' | 'hidden'
  }
];

// --- GETTERS & PERSISTENCE ---

export function getAllStays() {
  const customStays = (() => {
    try {
      const c = safeGetItem('roots_db_homestays');
      return c ? JSON.parse(c) : [];
    } catch { return []; }
  })();
  const stored = safeGetItem('roots_stays_v1');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const ids = new Set(customStays.map(s => s.id));
      return [...customStays, ...parsed.filter(p => !ids.has(p.id))];
    } catch (e) {}
  }
  const ids = new Set(customStays.map(s => s.id));
  const base = [...INITIAL_APPROVED_STAYS, ...INITIAL_PENDING_APPLICATIONS].filter(p => !ids.has(p.id));
  return [...customStays, ...base];
}

export function getApprovedStays() {
  const all = getAllStays();
  return all.filter(s => s.status === 'approved');
}

export function getStayById(id) {
  const all = getAllStays();
  return all.find(s => s.id === id) || null;
}

// 2. BECOME A HOST SUBMISSION
// Validates input, strictly stores as pending_verification (never auto-verified!)
export function submitHostRegistration(formData) {
  const allStays = getAllStays();

  const newStayId = `stay-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const newListing = {
    id: newStayId,
    name: formData.propertyName.trim(),
    destinationId: formData.destinationId || 'coorg',
    generalLocation: formData.generalLocation.trim(),
    propertyType: formData.propertyType || 'Village Homestay',
    host: {
      name: formData.hostFullName.trim(),
      ageVerified: Boolean(formData.age18Plus),
      languages: formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(Boolean) : ['English'],
      intro: formData.hostIntro ? formData.hostIntro.trim() : 'Local host passionate about sharing culture.',
      avatar: formData.hostAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      phoneEmailVerified: Boolean(formData.contactVerified)
    },
    hostLivesOnProperty: Boolean(formData.hostLivesOnProperty),
    rooms: Number(formData.rooms) || 1,
    beds: Number(formData.beds) || 1,
    maxGuests: Number(formData.maxGuests) || 2,
    bathroomPrivacy: formData.bathroomPrivacy || 'Private Ensuite Washroom',
    nightlyRateINR: Number(formData.nightlyRateINR) || 1500,
    cleaningOrCommunityFeeINR: Number(formData.cleaningFeeINR) || 150,
    mealOptions: {
      breakfastIncluded: Boolean(formData.breakfastIncluded),
      dinnerAvailable: Boolean(formData.dinnerAvailable),
      dinnerCostPerPersonINR: Number(formData.dinnerCostINR) || 0,
      description: formData.mealsDescription ? formData.mealsDescription.trim() : 'Traditional homemade meals.'
    },
    amenities: formData.amenities || ['Homecooked Meals', 'Hot Water'],
    culturalActivities: formData.culturalActivities ? formData.culturalActivities.split(',').map(a => a.trim()).filter(Boolean) : ['Village walk'],
    photos: formData.photos && formData.photos.length > 0 ? formData.photos : [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
    ],
    accessibility: formData.accessibility ? formData.accessibility.trim() : 'Standard rural ground floor entry.',
    safetyFeatures: formData.safetyFeatures || ['First aid kit on site', 'Emergency contact info'],
    houseRules: formData.houseRules ? formData.houseRules.split('\n').map(r => r.trim()).filter(Boolean) : ['Quiet hours after 10 PM'],
    cancellationPolicy: formData.cancellationPolicy || 'Flexible: Free cancellation up to 48 hours before check-in.',
    checkInTime: formData.checkInTime || '01:00 PM',
    checkOutTime: formData.checkOutTime || '11:00 AM',
    // Verification is NEVER granted automatically
    verification: {
      idChecked: false,
      ownershipOrPermissionVerified: false,
      safetyInspectionPassed: false,
      verificationBadge: 'Application Under Review',
      isSampleDemo: true,
      govIdType: formData.govIdType || 'Aadhaar / Voter ID (Masked)',
      ownershipDocReference: formData.ownershipDocType || 'Panchayat Tax Receipt / Property Deed',
      complianceDeclarations: {
        hasFireExtinguisher: Boolean(formData.hasFireExtinguisher),
        hasFirstAidKit: Boolean(formData.hasFirstAidKit),
        potableWaterCertified: Boolean(formData.potableWaterCertified)
      }
    },
    blockedDates: [],
    status: 'pending_verification',
    submittedAt: timestamp,
    ratingScore: 5.0,
    reviewsCount: 0,
    statusHistory: [
      {
        status: 'pending_verification',
        timestamp,
        note: 'Host registration submitted. Queued for community admin review.'
      }
    ]
  };

  const updatedStays = [newListing, ...allStays];
  safeSetItem('roots_stays_v1', JSON.stringify(updatedStays));

  // Add to applications queue
  const applications = getHostApplications();
  const updatedApps = [newListing, ...applications.filter(a => a.id !== newListing.id)];
  safeSetItem('roots_stay_applications_queue_v1', JSON.stringify(updatedApps));

  return newListing;
}

// 3. ADMIN VERIFICATION DASHBOARD
export function getHostApplications() {
  const stored = safeGetItem('roots_stay_applications_queue_v1');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  const allStays = getAllStays();
  return allStays.filter(s => s.status === 'pending_verification' || s.status === 'changes_requested');
}

export function moderateHostApplication(appId, decision, reason = '', checklistUpdates = {}) {
  // decision: 'approve' | 'reject' | 'request_info' | 'suspend'
  const allStays = getAllStays();
  const timestamp = new Date().toISOString();

  let targetStay = null;
  const updatedStays = allStays.map(stay => {
    if (stay.id === appId) {
      let nextStatus = stay.status;
      let badge = stay.verification.verificationBadge;
      let idChecked = checklistUpdates.idChecked ?? stay.verification.idChecked;
      let ownershipVerified = checklistUpdates.ownershipVerified ?? stay.verification.ownershipOrPermissionVerified;
      let safetyPassed = checklistUpdates.safetyPassed ?? stay.verification.safetyInspectionPassed;

      if (decision === 'approve') {
        nextStatus = 'approved';
        badge = 'Community Verified Host';
        idChecked = true;
        ownershipVerified = true;
        safetyPassed = true;
      } else if (decision === 'reject') {
        nextStatus = 'rejected';
        badge = 'Application Rejected';
      } else if (decision === 'request_info') {
        nextStatus = 'changes_requested';
        badge = 'More Information Requested';
      } else if (decision === 'suspend') {
        nextStatus = 'suspended';
        badge = 'Listing Suspended';
      }

      targetStay = {
        ...stay,
        status: nextStatus,
        moderatedAt: timestamp,
        moderatorNotes: reason,
        verification: {
          ...stay.verification,
          idChecked,
          ownershipOrPermissionVerified: ownershipVerified,
          safetyInspectionPassed: safetyPassed,
          verificationBadge: badge
        },
        statusHistory: [
          ...(stay.statusHistory || []),
          {
            status: nextStatus,
            timestamp,
            note: reason || `Application updated to ${nextStatus}`
          }
        ]
      };
      return targetStay;
    }
    return stay;
  });

  safeSetItem('roots_stays_v1', JSON.stringify(updatedStays));

  // Sync applications queue
  const apps = getHostApplications();
  const updatedApps = apps.map(a => a.id === appId ? targetStay : a).filter(Boolean);
  safeSetItem('roots_stay_applications_queue_v1', JSON.stringify(updatedApps));

  return targetStay;
}

// 4. STAY BOOKING REQUESTS FLOW
export function getStayBookings() {
  const stored = safeGetItem('roots_stay_bookings_v1');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return INITIAL_STAY_BOOKINGS;
}

export function createStayBookingRequest(data) {
  const bookings = getStayBookings();
  const stay = getStayById(data.stayId);

  if (!stay) {
    throw new Error('Homestay not found.');
  }

  // Calculate nights
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const rawNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(rawNights) || rawNights <= 0) {
    throw new Error('Check-out date must be after check-in date.');
  }

  const nights = rawNights;

  // Validate property capacity
  const maxCap = stay.maxGuests || (stay.rooms ? stay.rooms * 2 : 4);
  const guests = Number(data.guestsCount) || 1;
  if (guests < 1 || guests > maxCap) {
    throw new Error(`Guest count must be between 1 and ${maxCap} guests for this property.`);
  }

  // Date-overlap check against configured blocked dates
  const isConflict = stay.blockedDates && stay.blockedDates.some(range => {
    const [bStart, bEnd] = range.split('_');
    return (data.checkInDate <= bEnd && data.checkOutDate >= bStart);
  });

  if (isConflict) {
    throw new Error(`The host has marked the dates around ${data.checkInDate} as unavailable. Please select alternative dates.`);
  }

  // Price Calculation
  const nightlyBase = stay.nightlyRateINR * nights;
  const cleaningFee = stay.cleaningOrCommunityFeeINR || 0;
  const dinnerTotal = data.includeDinner && stay.mealOptions?.dinnerCostPerPersonINR
    ? stay.mealOptions.dinnerCostPerPersonINR * guests * nights
    : 0;
  const totalPrice = nightlyBase + cleaningFee + dinnerTotal;

  const newBooking = {
    id: `book-${Date.now()}`,
    stayId: stay.id,
    stayTitle: stay.name,
    destinationId: stay.destinationId,
    hostName: stay.host?.name || 'Local Host',
    guestName: data.guestName.trim(),
    guestContact: data.guestContact.trim(),
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    nights,
    guestsCount: guests,
    includeDinner: Boolean(data.includeDinner),
    nightlyRateINR: stay.nightlyRateINR,
    cleaningFeeINR: cleaningFee,
    dinnerTotalINR: dinnerTotal,
    totalPriceINR: totalPrice,
    guestMessage: data.guestMessage ? data.guestMessage.trim() : '',
    status: 'pending_host_approval',
    createdAt: new Date().toISOString(),
    statusHistory: [
      {
        status: 'pending_host_approval',
        timestamp: new Date().toISOString(),
        note: 'Stay request submitted by guest. Pending host confirmation.'
      }
    ]
  };

  const updatedBookings = [newBooking, ...bookings];
  safeSetItem('roots_stay_bookings_v1', JSON.stringify(updatedBookings));

  return newBooking;
}

export function updateBookingStatus(bookingId, newStatus, reason = '') {
  // newStatus: 'confirmed' | 'declined' | 'cancelled'
  const bookings = getStayBookings();
  const timestamp = new Date().toISOString();

  let targetBooking = null;
  const updated = bookings.map(b => {
    if (b.id === bookingId) {
      targetBooking = {
        ...b,
        status: newStatus,
        updatedAt: timestamp,
        actionReason: reason,
        statusHistory: [
          ...(b.statusHistory || []),
          {
            status: newStatus,
            timestamp,
            note: reason || `Booking status changed to ${newStatus}`
          }
        ]
      };
      return targetBooking;
    }
    return b;
  });

  safeSetItem('roots_stay_bookings_v1', JSON.stringify(updated));

  // If confirmed, optionally block dates on the stay
  if (newStatus === 'confirmed' && targetBooking) {
    const allStays = getAllStays();
    const stayUpdated = allStays.map(s => {
      if (s.id === targetBooking.stayId) {
        const rangeStr = `${targetBooking.checkInDate}_${targetBooking.checkOutDate}`;
        const currentBlocked = s.blockedDates || [];
        if (!currentBlocked.includes(rangeStr)) {
          return {
            ...s,
            blockedDates: [...currentBlocked, rangeStr]
          };
        }
      }
      return s;
    });
    safeSetItem('roots_stays_v1', JSON.stringify(stayUpdated));
  }

  return targetBooking;
}

// 5. STAY REPORTS
export function getStayReports() {
  const stored = safeGetItem('roots_stay_reports_v1');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return INITIAL_STAY_REPORTS;
}

export function reportStayListing(stayId, stayTitle, reason, notes = '', reporterName = 'Community Traveler') {
  const reports = getStayReports();
  const newReport = {
    id: `rep-stay-${Date.now()}`,
    stayId,
    stayTitle,
    reason,
    notes,
    reporterName,
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  const updated = [newReport, ...reports];
  safeSetItem('roots_stay_reports_v1', JSON.stringify(updated));
  return newReport;
}

export function moderateStayReport(reportId, action) {
  // action: 'hide_listing' | 'dismiss_report'
  const reports = getStayReports();
  const targetReport = reports.find(r => r.id === reportId);

  const updatedReports = reports.map(r => r.id === reportId ? {
    ...r,
    status: action === 'hide_listing' ? 'hidden' : 'dismissed',
    resolvedAt: new Date().toISOString()
  } : r);
  safeSetItem('roots_stay_reports_v1', JSON.stringify(updatedReports));

  if (action === 'hide_listing' && targetReport) {
    moderateHostApplication(targetReport.stayId, 'suspend', 'Listing suspended following user safety/accuracy report.');
  }

  return updatedReports;
}

// 6. PLANNER INTEGRATION HELPER
// STRICT CRITERIA: ONLY returns stays with status === 'approved'.
// Pending, rejected, or suspended stays are NEVER returned to the trip planner.
export function getApprovedStaysForPlanner(destinationId) {
  const approvedStays = getApprovedStays().filter(s => {
    if (!destinationId) return true;
    return s.destinationId === destinationId;
  });

  return approvedStays.map(s => ({
    id: s.id,
    destinationId: s.destinationId,
    name: s.name,
    category: "accommodation",
    type: s.propertyType || "Village Homestay",
    description: `${s.generalLocation}. Hosted by ${s.host?.name || 'Local Host'}. ${s.mealOptions?.description || ''}`,
    estimatedCostINR: s.nightlyRateINR,
    priceUnit: "per room/night",
    capacityPerRoom: s.maxGuests || 2,
    tags: ["nature", "meeting-locals", "community-stay", ...(s.amenities || [])],
    sourceContributor: s.host?.name || "Community Host",
    reviewStatus: s.verification?.verificationBadge || "Community Verified Host",
    amenities: s.amenities || [],
    image: s.photos && s.photos[0] ? s.photos[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  }));
}
