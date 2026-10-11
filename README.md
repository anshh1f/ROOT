# 🌿 ROOTS — Discover the place beyond the places

> **A community-powered personalised travel planner, authentic homestay network, and traveler connection platform.**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🧭 About ROOTS

ROOTS was created to help travelers move beyond generic tourist trails and commercial traps. By connecting curious explorers directly with local homestay families, verified village hosts, authentic cultural experiences, and like-minded companions, ROOTS makes slow, conscious, and immersive travel accessible.

### 🎨 Brand Identity & Design System
- **Brand Palette**: ROOTS Ocean Blue & Clean White
  - **Deep Blue**: `#123B73` (Primary Headings & Badges)
  - **Ocean Accent**: `#3478F6` (Interactive Accents & Buttons)
  - **Dark Blue**: `#1746A2` (Hover States & Borders)
  - **Pale Blue Tint**: `#EAF3FF` (Highlight Panels & Active Tabs)
  - **Canvas Surface**: `#F7FAFF` (Warm Off-White App Background)
  - **Pure White**: `#FFFFFF` (Cards & Modal Surfaces)
- **Typography**: Clean, readable modern sans-serif (*Plus Jakarta Sans*, *Inter*) paired with elegant editorial display serif (*Playfair Display*) for hero destinations.

---

## ⚡ Core Features & Architecture

### 1. 🏡 ROOTS Stay — Homestays & Scenic Destinations
- **Local Stays**: Browse verified rural and ancestral homestays across Alleppey canals, Meghalaya bamboo bridges, Varkala coastal cliffs, Spiti mudbrick peaks, and Coorg coffee estates.
- **Become a Host Multi-Step Application**:
  - Applicant profile and 18+ identity declarations.
  - Property details, rooms, capacity, and bathroom arrangements.
  - Traditional meals and cultural immersion activities.
  - Fair pricing in INR and respectful house rules.
  - Safety equipment compliance (first-aid kit, fire extinguisher, potable water).
  - *Strict Rule*: Applications enter `pending_verification` status and are never published automatically without administrative vetting.
- **Stay Booking Workflow**:
  - Travelers submit dates, guests, dinner preferences, and an introduction message.
  - Live transparent pricing math: `(Nightly Rate × Nights) + Cleaning Fee + (Dinner × Guests × Nights)`.
  - Date conflict detection against host calendars.
  - *No instant fake locks*: Bookings remain `pending_host_approval` until the host reviews and accepts the request.
- **Host Inbox vs. Traveler Inquiries**:
  - Travelers track request progress and can cancel pending inquiries.
  - Hosts access a dedicated **Host Inbox** to review guest messages and click **Accept Reservation (Confirm)** or **Decline Request**.
  - Host isolation prevents Host A from accessing Host B's private bookings.

---

### 2. 📖 Travel Diaries & Community Discoveries
- **Travel Diaries**:
  - Long-form narratives with photos, visited locations, and local food discoveries.
  - **Receipt Transparency**: Clear distinction between *Actual Incurred* expenses and *Estimated Approx* expenses in INR.
  - Ownership enforcement: Authors can edit and delete their own diaries; non-owners are denied.
- **Community Places & Food Spots**:
  - Hidden cafes, scenic view trails, and local eateries.
  - Approximate vs. verified badges.
  - Moderated before feeding into public recommendation engines.
- **Local Cultural Experiences**:
  - Traditional cooking workshops, pottery craft, living root bridge walks, and indigenous etiquette guidelines.

---

### 3. 🎯 Personalized Trip Planner & Itinerary Engine
- **Deterministic Recommendation Engine** ([`src/data/itineraryEngine.js`](src/data/itineraryEngine.js)):
  - Generates tailored daily itineraries based on duration, budget, travel style (*Adventure*, *Cultural*, *Relaxed*, *Mixed*), and experience preferences.
  - **Gatekeeping Integrity**: Feeds directly from community-vetted entries and database-approved homestays. Unapproved or pending records are strictly excluded.

---

### 4. 🤝 ROOTS Connect — Travel Companion Matching
- **Deterministic Matcher**: Compares traveler preferences, planned dates, destination overlap, and shared activities to suggest compatible slow-travel buddies.
- **6-State Connection Lifecycle**: `no_request` → `request_sent` → `incoming` → `accepted` → `declined` / `cancelled`.
- **Safe Messaging Simulation**: Unlocked exclusively after mutual connection acceptance. Emphasizes public daytime meetups and independent bookings.

---

### 5. 🗣️ ROOTS Lingua — Regional Dialect & Cultural Etiquette
- Essential phrases, audio pronunciation guides, and cultural context for regional languages (Malayalam, Khasi, Spitian/Tibetan, Kannada, Hindi, and Marathi).

---

### 6. 🛡️ Centralized Admin Moderation Dashboard
- Dedicated moderation interface at `/admin` guarded by role verification (`checkIsAdmin`):
  1. **Host Applications**: Inspect applicant details, review property photos, and approve or reject applications with feedback. Approving an application publishes the listing directly to the public Stay catalog and triggers an in-app applicant notification.
  2. **Active Stays Moderation**: Monitor published listings and suspend non-compliant properties.
  3. **Community Diaries**: Review user submissions before they appear in public feeds.
  4. **Destination Tips**: Approve places and food spots to enrich the Trip Planner.
  5. **Safety Reports**: Review and resolve user-submitted inaccuracy or safety flags.

---

## 🗄️ Database & Security Architecture

### PostgreSQL & Supabase Integration
- Managed schema defined in [`supabase_schema.sql`](supabase_schema.sql) with 8 relational tables:
  - `profiles`, `host_applications`, `homestays`, `stay_bookings`, `travel_diaries`, `destination_tips`, `reports`, `notifications`.
- **Row Level Security (RLS)**:
  - Public read access restricted to `status = 'approved'`.
  - Authors can insert and modify their own records.
  - Hosts can read and update only reservations for their assigned properties.
  - Full write/moderation permissions restricted to authorized administrators.
- **Unified Database Client Layer** ([`src/services/dbService.js`](src/services/dbService.js)):
  - Directly queries Supabase PostgREST tables.
  - Seamless persistence fallback with relational foreign keys and user auditing when remote tables have not yet been migrated in the Supabase console.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anshh1f/ROOT.git
cd ROOT

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build & Linting

```bash
# Build optimized production bundle
npm run build

# Run static linter
npm run lint
```

### Automated Integration Testing

Run the end-to-end integration test suite verifying Host, Diary, Stay, and Security workflows:

```bash
node test_workflows.mjs
```

---

## 📂 Project Structure

```
ROOT/
├── index.html                     # Application entry point & Google Fonts
├── package.json                   # Dependencies & scripts
├── supabase_schema.sql            # PostgreSQL DDL with RLS & Triggers
├── test_workflows.mjs             # E2E integration test suite
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── App.jsx                    # Top-level view router
    ├── App.css                    # Design system & styles
    ├── main.jsx                   # React DOM entry point
    ├── context/
    │   └── AuthContext.jsx        # Authentication & session provider
    ├── lib/
    │   └── supabaseClient.js      # Supabase initialization client
    ├── services/
    │   └── dbService.js           # Unified database client & fallback layer
    ├── components/
    │   ├── Navbar.jsx             # Responsive brand navbar & user menu
    │   ├── RootsStayHub.jsx       # Stays, host applications & bookings
    │   ├── RootsCommunityHub.jsx  # Community diaries & destination tips
    │   ├── RootsConnectHub.jsx    # Buddy matching & simulated chats
    │   ├── RootsLingua.jsx        # Language guides & dialect tips
    │   ├── TripPlanner.jsx        # Interactive itinerary builder
    │   ├── AdminDashboard.jsx     # Centralized 5-section moderation panel
    │   └── AuthModal.jsx          # Login & signup modal
    └── data/
        ├── stayHubData.js         # Homestay data models & validation
        ├── communityHubData.js    # Community submissions & moderation
        ├── communityData.json     # Curated regional destinations
        ├── connectData.js         # Buddy discovery profiles & matching
        ├── itineraryEngine.js     # Deterministic itinerary generator
        └── sampleData.js          # Curated showcase destinations & stories
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
