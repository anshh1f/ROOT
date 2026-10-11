// Curated sample data for ROOTS Prototype
// Notice: Clearly labelled sample prototype data. No live APIs or fabricated availability.

export const SAMPLE_ACTIVITIES = [
  {
    id: "local-food",
    name: "Local Food",
    tagline: "Farm-to-table traditions & street recipes",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Cook traditional curry with spice growers in Wayanad"
  },
  {
    id: "hiking",
    name: "Hiking",
    tagline: "Secret ridge walks & untrodden trails",
    icon: "Mountain",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Sunrise cliff trail overlooking secluded bay"
  },
  {
    id: "swimming",
    name: "Swimming",
    tagline: "Pristine tide pools & emerald rivers",
    icon: "Waves",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Natural freshwater sinkhole swim at dawn"
  },
  {
    id: "culture",
    name: "Culture",
    tagline: "Ancient crafts, folklore & living history",
    icon: "Landmark",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Artisan block-printing workshop in heritage quarter"
  },
  {
    id: "dance",
    name: "Dance",
    tagline: "Rhythmic rites & community celebrations",
    icon: "Music",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Folk percussion and harvest dance gathering under banyan trees"
  },
  {
    id: "meeting-locals",
    name: "Meeting Locals",
    tagline: "Chai chats & genuine neighborhood hospitality",
    icon: "Users",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Evening courtyard storytelling with village elders"
  },
  {
    id: "photography",
    name: "Photography",
    tagline: "Golden hour viewpoints away from crowds",
    icon: "Camera",
    image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Mist-covered valley sunrise panorama"
  },
  {
    id: "nature",
    name: "Nature",
    tagline: "Sacred groves, botanical trails & wildlife quietude",
    icon: "TreePine",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Quiet birding stroll along bamboo forest streams"
  },
  {
    id: "adventure",
    name: "Adventure",
    tagline: "Coracle crossings, deep limestone caves & high ridges",
    icon: "Compass",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Whitewater paddle and limestone cave fossil scramble"
  },
  {
    id: "local-language",
    name: "Local Language",
    tagline: "Dialect exchanges, oral folklore & greeting traditions",
    icon: "Languages",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Learn indigenous greeting phrases with homestay elders"
  },
  {
    id: "hidden-places",
    name: "Hidden Places",
    tagline: "Unmapped springs, boulder nooks & secret valleys",
    icon: "EyeOff",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    color: "#EAF3FF",
    sampleExperience: "Discover quiet stone-cut hermit cell overlooking river canyon"
  }
];

export const SAMPLE_DESTINATIONS = [
  {
    id: "varkala-kerala",
    name: "Varkala Cliff & Backwaters",
    region: "Kerala, India",
    vibe: "Secluded Coastal & Ayurvedic Haven",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=900&q=80",
    highlights: ["Red laterite cliff trails", "Artisan bamboo cafes", "Quiet Kapil black beach"],
    bestFor: ["swimming", "local-food", "nature"],
    sampleCost: "₹2,400 / day estimated",
    localInsiderTip: "Head south of the main helipad at 6:30 AM to watch local fishermen haul nets with rhythmic sea chants."
  },
  {
    id: "living-root-bridges",
    name: "Nongriat & Cherrapunji",
    region: "Meghalaya, India",
    vibe: "Cloud Forest & Bio-engineering Wonders",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80",
    highlights: ["Double-decker living root bridge", "Rainbow Falls trek", "Khasi community homestays"],
    bestFor: ["hiking", "nature", "photography"],
    sampleCost: "₹1,800 / day estimated",
    localInsiderTip: "Stay in village homestays rather than day-tripping from Shillong for sunrise in the sacred canopy."
  },
  {
    id: "spiti-valley",
    name: "Spiti High Altitude Valleys",
    region: "Himachal Pradesh, India",
    vibe: "Stark Moonscapes & Ancient Monasteries",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    highlights: ["Dhankar cliffside monastery", "Fossil hunting in Langza", "Stargazing at Kibber"],
    bestFor: ["hiking", "culture", "photography", "meeting-locals"],
    sampleCost: "₹2,900 / day estimated",
    localInsiderTip: "Share butter tea with monastery caretakers during early morning chant ceremonies."
  },
  {
    id: "coorg-estates",
    name: "Madikeri & Coorg Highlands",
    region: "Karnataka, India",
    vibe: "Mist, Pepper Vines & Kodava Hospitality",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=900&q=80",
    highlights: ["Family-run coffee plantations", "Traditional pandi curry tastings", "Tadiandamol ridge trek"],
    bestFor: ["local-food", "nature", "meeting-locals"],
    sampleCost: "₹3,100 / day estimated",
    localInsiderTip: "Ask estate owners to walk you through wild honey extraction and cardamom drying sheds."
  },
  {
    id: "ziro-valley",
    name: "Ziro Pine Valley",
    region: "Arunachal Pradesh, India",
    vibe: "Apatani Sustainable Rice-Fish Paddies",
    image: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=900&q=80",
    highlights: ["Apatani cultural architecture", "Bamboo grove trails", "Handmade organic millet brews"],
    bestFor: ["culture", "dance", "meeting-locals", "hiking"],
    sampleCost: "₹2,200 / day estimated",
    localInsiderTip: "Visit during spring or autumn harvest when community songs echo across terraced slopes."
  },
  {
    id: "hampi-boulders",
    name: "Anegundi & Hampi Beyond Ruins",
    region: "Karnataka, India",
    vibe: "Granite Boulders, Coracle Boats & Myth",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    highlights: ["Coracle crossing on the Tungabhadra", "Banana fibre craft collectives", "Sunset at Sanapur Lake"],
    bestFor: ["culture", "photography", "swimming", "local-food"],
    sampleCost: "₹1,600 / day estimated",
    localInsiderTip: "Cross the river to quiet Anegundi village to cycle through ancient water channels and mango groves."
  }
];

export const SAMPLE_TRAVEL_DIARIES = [
  {
    id: "diary-1",
    title: "Sunrise Chai with the Toddy Tappers of Kumarakom",
    author: "Ananya Rao",
    location: "Vembanad Backwaters, Kerala",
    date: "November 2024",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    cover: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    snippet: "Instead of booking a commercial houseboat, I rented a wooden rowboat from Murugan at 5:30 AM. He sang boat songs that had been passed down four generations...",
    fullText: "Instead of booking a commercial houseboat, I rented a wooden rowboat from Murugan at 5:30 AM. He sang boat songs that had been passed down four generations. We pulled up beside a quiet palm canal where coconut nectar was being collected fresh in earthen pots. Drinking fresh sweet neera while white egrets skimmed the lotus pads was an experience no standard tour itinerary ever mentioned. Murugan's wife then cooked kappa (tapioca) with roasted red shallot chutney in their open-air hearth.",
    tags: ["Meeting Locals", "Local Food", "Waterways"],
    likes: 84,
    readTime: "4 min read"
  },
  {
    id: "diary-2",
    title: "The Silent Bamboo Flute of Ziro Valley",
    author: "Tenzing Norbu",
    location: "Hong Village, Arunachal Pradesh",
    date: "October 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    cover: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    snippet: "Sitting on the bamboo veranda of Yamang's stilt home as fog rolled in over the paddy fields. We didn't share a common dialect, yet tea and smiling music spoke everything...",
    fullText: "Sitting on the bamboo veranda of Yamang's stilt home as fog rolled in over the paddy fields. We didn't share a common dialect, yet tea and smiling music spoke everything. Yamang showed me how each bamboo joint is carved with a simple parang knife to produce distinct pitches matching wind currents through the pines. For three days, I learned more about sustainable water irrigation and forest respect than any university textbook ever imparted.",
    tags: ["Culture", "Nature", "Music"],
    likes: 129,
    readTime: "5 min read"
  },
  {
    id: "diary-3",
    title: "Bouldering and Stargazing Behind Hampi's Matanga Hill",
    author: "Elena Rostova",
    location: "Anegundi, Karnataka",
    date: "January 2025",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    cover: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    snippet: "Away from the bus tour parking lots, the northern bank feels like another era. We spent dusk listening to temple bells reverberate against thousand-year-old granite formations...",
    fullText: "Away from the bus tour parking lots, the northern bank feels like another era. We spent dusk listening to temple bells reverberate against thousand-year-old granite formations. Our local guide Shashi brought along roasted groundnuts and jaggery. By 9 PM, the light pollution had vanished entirely, revealing the Milky Way arching directly over the Virupaksha tower silhouette.",
    tags: ["Hiking", "Photography", "Culture"],
    likes: 96,
    readTime: "3 min read"
  }
];

export const SAMPLE_BUDDIES = [
  {
    id: "buddy-1",
    name: "Vikramaditya S.",
    location: "Bengaluru, India",
    upcoming: "Western Ghats Waterfall Hikes",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    interests: ["Hiking", "Photography", "Local Food"],
    languages: ["English", "Kannada", "Hindi"],
    bio: "Slow travel enthusiast and amateur landscape photographer. Looking for 1-2 partners to split rural cab hires and explore monsoon ridge paths safely.",
    travelStyle: "Slow Explorer • Budget Conscious",
    verifiedPrototype: true
  },
  {
    id: "buddy-2",
    name: "Meera & Tanvi",
    location: "Mumbai, India",
    upcoming: "Spiti & Kinnaur Monastery Loop",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    interests: ["Culture", "Nature", "Meeting Locals"],
    languages: ["English", "Hindi", "Marathi"],
    bio: "Architecture grads documenting indigenous earthen building techniques. Seeking fellow travelers who prefer community homestays over sterile hotels.",
    travelStyle: "Cultural Immersion • Shared Stays",
    verifiedPrototype: true
  },
  {
    id: "buddy-3",
    name: "Arjun Nair",
    location: "Kochi, India",
    upcoming: "Gokarna to Karwar Hidden Coves",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
    interests: ["Swimming", "Dance", "Local Food"],
    languages: ["English", "Malayalam", "Tamil"],
    bio: "Freediver and acoustic guitarist. Keen on secret beach camping, communal cookouts, and discovering indie folk artists in coastal villages.",
    travelStyle: "Adventure & Camp • High Energy",
    verifiedPrototype: true
  }
];

export const SAMPLE_HOSTS = [
  {
    id: "host-1",
    name: "Eldho & Mary's Riverside Homestay",
    host: "Eldho Varghese",
    location: "Periyar Riverbank, Thattekad, Kerala",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    stayType: "Traditional Teakwood Courtyard",
    experience: "Early morning river canoe birdwatching & Mary's clay-pot fish curry recipe",
    priceIndication: "₹2,200 / night (including family breakfast)",
    communityImpact: "10% of revenue goes toward Thattekad Hornbill habitat preservation",
    ratingSample: "4.95 (Sample prototype badge)",
    badges: ["Traditional Meals Included", "River Access", "Forest Guide"]
  },
  {
    id: "host-2",
    name: "Dolkar's Traditional Earthen Retreat",
    host: "Stanzin & Dolkar",
    location: "Alchi Village, Ladakh",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    stayType: "Sundried Mudbrick Solar House",
    experience: "Apricot harvesting, baking Khambir bread & butter lamp monastery walks",
    priceIndication: "₹2,800 / night (all home-cooked meals included)",
    communityImpact: "Supports local women's wool spinning guild",
    ratingSample: "4.98 (Sample prototype badge)",
    badges: ["Solar Heated", "Organic Orchard", "Monastery Proximity"]
  },
  {
    id: "host-3",
    name: "Muthu's Heritage Chettinad Courtyard",
    host: "Muthuraman Chettiar",
    location: "Kanadukathan, Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    stayType: "Burma Teak & Athangudi Tile Mansion",
    experience: "Handmade Athangudi tile casting & authentic 18-spice Chettinad feast",
    priceIndication: "₹3,400 / night",
    communityImpact: "Preserves 120-year-old ancestral craft architecture",
    ratingSample: "4.92 (Sample prototype badge)",
    badges: ["Heritage Architecture", "Culinary Masterclass", "Quiet Courtyard"]
  }
];

// Helper to generate a personalized local itinerary based on user input
export function generateCuratedItinerary({ startLocation, destination, durationDays, budget, selectedInterests }) {
  const days = parseInt(durationDays, 10) || 3;
  const destName = destination.trim() || "Varkala Cliff & Backwaters";
  const startLoc = startLocation.trim() || "Local Origin";
  const interests = selectedInterests && selectedInterests.length > 0
    ? selectedInterests
    : ["local-food", "nature", "meeting-locals"];

  const activitiesMap = {
    "local-food": ["Visit neighborhood morning spice market", "Cook slow meal with a local host family", "Evening chai stall hopping & snack tasting"],
    "hiking": ["Sunrise ridge hike avoiding crowded viewpoints", "Follow quiet ancient shepherd trails", "Late afternoon panoramic hill descent"],
    "swimming": ["Dawn dip in secluded freshwater spring or bay", "Kayak through quiet mangrove channels", "Sunset coastal swim with local lifeguards"],
    "culture": ["Visit traditional handloom weaver collective", "Historical walk guided by a local historian", "Evening temple bell ceremonies & cultural folklore"],
    "dance": ["Watch traditional folk practice sessions", "Interactive rhythm & percussion intro with local performers", "Participate in festive village circle dance"],
    "meeting-locals": ["Courtyard evening storytelling with elders", "Join village community chai gathering", "Visit artisans at their family work studios"],
    "photography": ["Golden hour landscape composition workshop", "Street portrait session in quiet historic lanes", "Night sky astrophotography above tree canopy"],
    "nature": ["Guided botanical walk discovering medicinal plants", "Quiet bird listening in protected grove", "Relax under ancient banyan tree with a book"]
  };

  const schedule = [];
  for (let i = 1; i <= days; i++) {
    // Pick tailored activities
    const interestIndex = (i - 1) % interests.length;
    const currentInterest = interests[interestIndex];
    const interestItems = activitiesMap[currentInterest] || activitiesMap["nature"];
    const activityHighlight = interestItems[(i - 1) % interestItems.length];

    schedule.push({
      day: i,
      title: i === 1
        ? `Arrive from ${startLoc} & Ground into ${destName}`
        : i === days
          ? `Farewell Tea, Souvenir Exchange & Gentle Departure`
          : `Deep Dive into Local Roots & Hidden Pathways`,
      morning: i === 1 
        ? `Check in to authentic community stay; meet your hosts for welcome herbal tea.`
        : `6:30 AM: ${activityHighlight}.`,
      afternoon: `1:00 PM: Slow, locally prepared regional lunch; rest during midday heat and browse local artisan works.`,
      evening: `5:30 PM: Walk through tranquil neighborhood backstreets; join hosts or travel buddies for sunset reflections.`,
      insiderTip: `Support small family-owned vendors directly; always ask permission before taking close portraits of artisans.`
    });
  }

  return {
    id: `trip-${Date.now()}`,
    createdAt: new Date().toISOString(),
    startLocation: startLoc,
    destination: destName,
    durationDays: days,
    budget: budget || "Moderate",
    selectedInterests: interests,
    schedule,
    estimatedCost: budget === "Budget-friendly"
      ? `₹${days * 1400} - ₹${days * 2000}`
      : budget === "Premium"
        ? `₹${days * 3500} - ₹${days * 5000}`
        : `₹${days * 2200} - ₹${days * 3200}`
  };
}
