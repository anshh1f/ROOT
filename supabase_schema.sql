-- =====================================================================
-- ROOTS APPLICATION DATABASE SCHEMA
-- Comprehensive schema with Row Level Security (RLS) policies
-- Supabase PostgreSQL migration script
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
-- Extends Supabase auth.users with app-specific roles and verification
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'traveler' CHECK (role IN ('traveler', 'host', 'admin')),
  bio TEXT,
  origin TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 3. HOST APPLICATIONS TABLE
-- Stores host onboarding applications awaiting verification
CREATE TABLE IF NOT EXISTS public.host_applications (
  id TEXT PRIMARY KEY DEFAULT ('app-' || gen_random_uuid()),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  languages TEXT[] DEFAULT '{}',
  intro TEXT NOT NULL,
  avatar_url TEXT,
  phone_or_email TEXT NOT NULL,
  lives_on_property BOOLEAN DEFAULT true,
  property_title TEXT NOT NULL,
  property_type TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  general_location TEXT NOT NULL,
  rooms_count INTEGER NOT NULL DEFAULT 1,
  beds_count INTEGER NOT NULL DEFAULT 1,
  max_guests INTEGER NOT NULL DEFAULT 2,
  bathroom_privacy TEXT NOT NULL,
  nightly_rate_inr NUMERIC NOT NULL,
  cleaning_fee_inr NUMERIC DEFAULT 0,
  breakfast_included BOOLEAN DEFAULT true,
  dinner_available BOOLEAN DEFAULT false,
  dinner_rate_inr NUMERIC DEFAULT 0,
  food_description TEXT,
  amenities TEXT[] DEFAULT '{}',
  cultural_activities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  house_rules TEXT[] DEFAULT '{}',
  accessibility_notes TEXT,
  safety_features TEXT[] DEFAULT '{}',
  cancellation_policy TEXT DEFAULT 'Flexible',
  gov_id_type TEXT NOT NULL,
  gov_id_masked_ref TEXT NOT NULL,
  ownership_doc_ref TEXT NOT NULL,
  safety_checklist JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'approved', 'rejected', 'changes_requested', 'suspended')),
  admin_notes TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own host applications" 
  ON public.host_applications FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Authenticated users can submit a host application" 
  ON public.host_applications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update host applications" 
  ON public.host_applications FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- 4. HOMESTAYS / APPROVED LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.homestays (
  id TEXT PRIMARY KEY DEFAULT ('stay-' || gen_random_uuid()),
  application_id TEXT REFERENCES public.host_applications(id) ON DELETE SET NULL,
  host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  general_location TEXT NOT NULL,
  property_type TEXT NOT NULL,
  tagline TEXT,
  host_info JSONB NOT NULL,
  rooms INTEGER NOT NULL DEFAULT 1,
  beds INTEGER NOT NULL DEFAULT 1,
  max_guests INTEGER NOT NULL DEFAULT 2,
  bathroom_privacy TEXT NOT NULL,
  nightly_rate_inr NUMERIC NOT NULL,
  cleaning_fee_inr NUMERIC DEFAULT 0,
  meal_options JSONB NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  cultural_activities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  accessibility TEXT,
  safety_features TEXT[] DEFAULT '{}',
  house_rules TEXT[] DEFAULT '{}',
  cancellation_policy TEXT DEFAULT 'Flexible',
  verification_info JSONB NOT NULL,
  blocked_dates TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'hidden', 'suspended')),
  rating_score NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.homestays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved homestays are viewable by everyone" 
  ON public.homestays FOR SELECT 
  USING (status = 'approved' OR auth.uid() = host_user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Admins and hosts can insert homestays" 
  ON public.homestays FOR INSERT 
  WITH CHECK (auth.uid() = host_user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Hosts can update their own homestays and admins can update all" 
  ON public.homestays FOR UPDATE 
  USING (auth.uid() = host_user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- 5. STAY BOOKING REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.stay_bookings (
  id TEXT PRIMARY KEY DEFAULT ('book-' || gen_random_uuid()),
  stay_id TEXT REFERENCES public.homestays(id) ON DELETE CASCADE NOT NULL,
  stay_title TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  guest_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_contact TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  guests_count INTEGER NOT NULL,
  include_dinner BOOLEAN DEFAULT false,
  nightly_rate_inr NUMERIC NOT NULL,
  cleaning_fee_inr NUMERIC DEFAULT 0,
  dinner_total_inr NUMERIC DEFAULT 0,
  total_price_inr NUMERIC NOT NULL,
  guest_message TEXT,
  status TEXT DEFAULT 'pending_host_approval' CHECK (status IN ('pending_host_approval', 'confirmed', 'declined', 'cancelled')),
  action_reason TEXT,
  status_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stay_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests and hosts can view their relevant bookings" 
  ON public.stay_bookings FOR SELECT 
  USING (
    auth.uid() = guest_user_id OR 
    auth.uid() = host_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Authenticated users can submit a stay request" 
  ON public.stay_bookings FOR INSERT 
  WITH CHECK (auth.uid() = guest_user_id OR guest_user_id IS NULL);

CREATE POLICY "Hosts can update status of requests for their properties" 
  ON public.stay_bookings FOR UPDATE 
  USING (
    auth.uid() = host_user_id OR 
    auth.uid() = guest_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 6. TRAVEL DIARIES TABLE
CREATE TABLE IF NOT EXISTS public.travel_diaries (
  id TEXT PRIMARY KEY DEFAULT ('diary-' || gen_random_uuid()),
  author_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_origin TEXT,
  author_avatar TEXT,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  trip_dates TEXT,
  story TEXT NOT NULL,
  cover_photo TEXT,
  photos TEXT[] DEFAULT '{}',
  places_visited TEXT[] DEFAULT '{}',
  food_discovered TEXT[] DEFAULT '{}',
  activities TEXT[] DEFAULT '{}',
  expense_type TEXT DEFAULT 'actual' CHECK (expense_type IN ('actual', 'estimated')),
  expenses_inr NUMERIC DEFAULT 0,
  expense_breakdown TEXT,
  traveller_tips TEXT,
  tags TEXT[] DEFAULT '{}',
  is_approximate BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'draft')),
  moderation_notes TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.travel_diaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved diaries are viewable by public" 
  ON public.travel_diaries FOR SELECT 
  USING (
    status = 'approved' OR 
    auth.uid() = author_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Users can create diaries" 
  ON public.travel_diaries FOR INSERT 
  WITH CHECK (auth.uid() = author_user_id OR author_user_id IS NULL);

CREATE POLICY "Authors can update their own diaries and admins can moderate" 
  ON public.travel_diaries FOR UPDATE 
  USING (
    auth.uid() = author_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Authors and admins can delete diaries" 
  ON public.travel_diaries FOR DELETE 
  USING (
    auth.uid() = author_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 7. DESTINATION TIPS & PLACES TABLE
CREATE TABLE IF NOT EXISTS public.destination_tips (
  id TEXT PRIMARY KEY DEFAULT ('tip-' || gen_random_uuid()),
  author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Traveler',
  author_avatar TEXT,
  destination_id TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nature', 'food', 'hiking', 'culture', 'workshop', 'attraction', 'general')),
  description TEXT NOT NULL,
  approximate_location TEXT,
  photos TEXT[] DEFAULT '{}',
  estimated_cost_inr NUMERIC DEFAULT 0,
  price_notes TEXT,
  practical_notes TEXT,
  best_time_to_visit TEXT,
  accessibility_notes TEXT,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'draft')),
  moderation_notes TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.destination_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved destination tips are viewable by public" 
  ON public.destination_tips FOR SELECT 
  USING (
    status = 'approved' OR 
    auth.uid() = author_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Users can submit destination tips" 
  ON public.destination_tips FOR INSERT 
  WITH CHECK (auth.uid() = author_user_id OR author_user_id IS NULL);

CREATE POLICY "Authors and admins can update tips" 
  ON public.destination_tips FOR UPDATE 
  USING (
    auth.uid() = author_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 8. REPORTS TABLE (Safety & Inappropriate Content)
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT ('rep-' || gen_random_uuid()),
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('stay', 'diary', 'tip', 'user')),
  target_id TEXT NOT NULL,
  target_title TEXT NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view and manage all reports" 
  ON public.reports FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Users can submit reports" 
  ON public.reports FOR INSERT 
  WITH CHECK (true);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('notif-' || gen_random_uuid()),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'host_status', 'booking_status', 'moderation')),
  reference_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own notifications" 
  ON public.notifications FOR ALL 
  USING (auth.uid() = user_id);

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_homestays_destination ON public.homestays(destination_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_host ON public.stay_bookings(host_user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest ON public.stay_bookings(guest_user_id, status);
CREATE INDEX IF NOT EXISTS idx_diaries_destination ON public.travel_diaries(destination_id, status);
CREATE INDEX IF NOT EXISTS idx_tips_destination ON public.destination_tips(destination_id, status);
CREATE INDEX IF NOT EXISTS idx_host_apps_user ON public.host_applications(user_id, status);
