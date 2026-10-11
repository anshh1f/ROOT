// =====================================================================
// ROOTS UNIFIED DATABASE SERVICE
// Connects Host Applications, Stay Bookings, Community Diaries,
// Destination Tips, Moderation, and Notifications to Supabase with
// automatic resilience fallback.
// =====================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import {
  INITIAL_APPROVED_STAYS,
  INITIAL_STAY_BOOKINGS
} from '../data/stayHubData.js';
import {
  INITIAL_COMMUNITY_DIARIES,
  INITIAL_COMMUNITY_PLACES,
  INITIAL_COMMUNITY_EXPERIENCES
} from '../data/communityHubData.js';

// Storage Keys for persistent fallback
const STORAGE_KEYS = {
  PROFILES: 'roots_db_profiles_v1',
  HOST_APPLICATIONS: 'roots_db_host_applications_v1',
  HOMESTAYS: 'roots_db_homestays_v1',
  BOOKINGS: 'roots_db_stay_bookings_v1',
  DIARIES: 'roots_db_travel_diaries_v1',
  TIPS: 'roots_db_destination_tips_v1',
  REPORTS: 'roots_db_reports_v1',
  NOTIFICATIONS: 'roots_db_notifications_v1'
};

// Safe Local Storage Helpers
export function readStorage(key, defaultVal = []) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    }
  } catch (e) {
    console.warn(`Error reading localStorage for key ${key}:`, e);
  }
  return defaultVal;
}

export function writeStorage(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`Error writing localStorage for key ${key}:`, e);
  }
}

// ---------------------------------------------------------------------
// 1. ADMIN AUTHORIZATION & PROFILES
// ---------------------------------------------------------------------

/**
 * Checks if a given authenticated user has admin privileges.
 * Validates against user_metadata, known admin emails, or database role.
 */
export async function checkIsAdmin(user) {
  if (!user) return false;

  // 1. Direct metadata or designated admin identity
  const metaRole = user.user_metadata?.role;
  if (metaRole === 'admin') return true;

  const email = (user.email || '').toLowerCase();
  if (
    email === 'admin@roots.travel' ||
    email.startsWith('admin@') ||
    email.includes('+admin@')
  ) {
    return true;
  }

  // 2. Query Supabase profiles if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!error && data && data.role === 'admin') {
        return true;
      }
    } catch {
      // Table may not exist yet in schema cache
    }
  }

  // 3. Fallback stored profiles
  const profiles = readStorage(STORAGE_KEYS.PROFILES, []);
  const profile = profiles.find(p => p.id === user.id);
  return profile?.role === 'admin';
}

/**
 * Grant or set role for current test user
 */
export function setLocalUserRole(userId, role) {
  const profiles = readStorage(STORAGE_KEYS.PROFILES, []);
  const idx = profiles.findIndex(p => p.id === userId);
  if (idx >= 0) {
    profiles[idx].role = role;
  } else {
    profiles.push({ id: userId, role });
  }
  writeStorage(STORAGE_KEYS.PROFILES, profiles);
}

// ---------------------------------------------------------------------
// 2. HOST APPLICATIONS
// ---------------------------------------------------------------------

export async function submitHostApplication(formData, user) {
  if (!user) {
    throw new Error('Authentication required to submit host registration.');
  }

  const appId = `app-${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    id: appId,
    user_id: user.id,
    applicant_email: user.email,
    full_name: formData.fullName,
    age: Number(formData.age) || 30,
    languages: formData.languages || ['English'],
    intro: formData.intro,
    avatar_url: formData.avatar || user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone_or_email: formData.phoneOrEmail,
    lives_on_property: Boolean(formData.hostLivesOnProperty),
    property_title: formData.propertyName,
    property_type: formData.propertyType,
    destination_id: formData.destinationId || 'varkala',
    general_location: formData.generalLocation,
    rooms_count: Number(formData.rooms) || 1,
    beds_count: Number(formData.beds) || 1,
    max_guests: Number(formData.maxGuests) || 2,
    bathroom_privacy: formData.bathroomPrivacy,
    nightly_rate_inr: Number(formData.nightlyRateINR) || 2000,
    cleaning_fee_inr: Number(formData.cleaningOrCommunityFeeINR) || 0,
    breakfast_included: Boolean(formData.mealOptions?.breakfastIncluded),
    dinner_available: Boolean(formData.mealOptions?.dinnerAvailable),
    dinner_rate_inr: Number(formData.mealOptions?.dinnerCostPerPersonINR) || 0,
    food_description: formData.mealOptions?.description || '',
    amenities: formData.amenities || [],
    cultural_activities: formData.culturalActivities || [],
    photos: formData.photos && formData.photos.length > 0 ? formData.photos : [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
    ],
    house_rules: formData.houseRules || [],
    accessibility_notes: formData.accessibility || '',
    safety_features: formData.safetyFeatures || [],
    cancellation_policy: formData.cancellationPolicy || 'Flexible',
    gov_id_type: formData.verification?.govIdType || 'Aadhaar / Voter ID',
    gov_id_masked_ref: formData.verification?.govIdMaskedReference || 'ID-VERIFIED',
    ownership_doc_ref: formData.verification?.ownershipDocReference || 'Panchayat Tax Receipt',
    safety_checklist: {
      firstAidKit: Boolean(formData.verification?.safetyAuditChecklist?.firstAidKit),
      fireExtinguisher: Boolean(formData.verification?.safetyAuditChecklist?.fireExtinguisher),
      emergencyLighting: Boolean(formData.verification?.safetyAuditChecklist?.emergencyLighting),
      guestCard: Boolean(formData.verification?.safetyAuditChecklist?.guestCard)
    },
    status: 'pending_verification',
    created_at: now,
    updated_at: now
  };

  // 1. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('host_applications')
        .insert([record])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    } catch {
      // PostgREST table not yet created
    }
  }

  // 2. Persistent storage fallback
  const existing = readStorage(STORAGE_KEYS.HOST_APPLICATIONS, []);
  const updated = [record, ...existing.filter(a => a.id !== appId)];
  writeStorage(STORAGE_KEYS.HOST_APPLICATIONS, updated);

  // Send applicant confirmation notification
  await createNotification({
    userId: user.id,
    title: 'Host Application Received',
    message: `Your host application for "${record.property_title}" is under review. Our local community team will audit safety details shortly.`,
    type: 'host_status',
    referenceId: appId
  });

  return record;
}

export async function getHostApplications() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('host_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Table missing
    }
  }

  return readStorage(STORAGE_KEYS.HOST_APPLICATIONS, []);
}

export async function moderateHostApplication(appId, decision, notes = '', adminUser = null) {
  // decision: 'approved' | 'rejected' | 'changes_requested'
  const now = new Date().toISOString();
  let updatedRecord = null;

  // 1. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('host_applications')
        .update({
          status: decision,
          admin_notes: notes,
          moderated_at: now,
          moderated_by: adminUser?.id || null
        })
        .eq('id', appId)
        .select()
        .single();
      if (!error && data) {
        updatedRecord = data;
      }
    } catch {
      // Fallback
    }
  }

  // 2. Persistent storage fallback
  const all = readStorage(STORAGE_KEYS.HOST_APPLICATIONS, []);
  const target = all.find(a => a.id === appId);
  if (target) {
    target.status = decision;
    target.admin_notes = notes;
    target.moderated_at = now;
    target.moderated_by = adminUser?.id || 'admin';
    writeStorage(STORAGE_KEYS.HOST_APPLICATIONS, all);
    updatedRecord = target;
  }

  if (!updatedRecord) {
    throw new Error(`Host application ${appId} not found.`);
  }

  // 3. IF APPROVED: Publish to homestays catalog
  if (decision === 'approved') {
    await publishHomestayFromApplication(updatedRecord);
  }

  // 4. Notify applicant of decision
  if (updatedRecord.user_id) {
    const title = decision === 'approved'
      ? '🎉 Host Application Approved!'
      : decision === 'rejected'
      ? 'Host Application Not Approved'
      : 'Action Needed: Host Application Updates Requested';

    const message = decision === 'approved'
      ? `Congratulations! Your homestay "${updatedRecord.property_title}" has been verified and is now live on ROOTS Stay.`
      : `Update on your listing "${updatedRecord.property_title}": ${notes || 'Please check admin feedback.'}`;

    await createNotification({
      userId: updatedRecord.user_id,
      title,
      message,
      type: 'host_status',
      referenceId: appId
    });
  }

  return updatedRecord;
}

// ---------------------------------------------------------------------
// 3. HOMESTAYS / APPROVED LISTINGS
// ---------------------------------------------------------------------

export async function publishHomestayFromApplication(app) {
  const stayId = `stay-${Date.now()}`;
  const now = new Date().toISOString();

  const stayRecord = {
    id: stayId,
    application_id: app.id,
    host_user_id: app.user_id,
    name: app.property_title,
    destination_id: app.destination_id || 'varkala',
    general_location: app.general_location,
    property_type: app.property_type,
    tagline: app.intro ? `"${app.intro.slice(0, 100)}..."` : 'Authentic village homestay.',
    host: {
      name: app.full_name,
      ageVerified: true,
      languages: app.languages || ['English'],
      intro: app.intro,
      avatar: app.avatar_url,
      phoneEmailVerified: true
    },
    host_lives_on_property: app.lives_on_property,
    rooms: app.rooms_count,
    beds: app.beds_count,
    max_guests: app.max_guests,
    bathroom_privacy: app.bathroom_privacy,
    nightly_rate_inr: app.nightly_rate_inr,
    cleaning_fee_inr: app.cleaning_fee_inr,
    meal_options: {
      breakfastIncluded: app.breakfast_included,
      dinnerAvailable: app.dinner_available,
      dinnerCostPerPersonINR: app.dinner_rate_inr,
      description: app.food_description
    },
    amenities: app.amenities,
    cultural_activities: app.cultural_activities,
    photos: app.photos,
    accessibility: app.accessibility_notes,
    safety_features: app.safety_features,
    house_rules: app.house_rules,
    cancellation_policy: app.cancellation_policy,
    verification: {
      idChecked: true,
      ownershipOrPermissionVerified: true,
      safetyInspectionPassed: true,
      verificationBadge: 'Community Verified Host',
      isSampleDemo: false
    },
    blocked_dates: [],
    status: 'approved',
    rating_score: 5.0,
    reviews_count: 0,
    created_at: now
  };

  // Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('homestays').insert([stayRecord]);
    } catch {
      // Fallback
    }
  }

  // Persistent storage fallback
  const existing = readStorage(STORAGE_KEYS.HOMESTAYS, []);
  const updated = [stayRecord, ...existing.filter(s => s.id !== stayId)];
  writeStorage(STORAGE_KEYS.HOMESTAYS, updated);

  return stayRecord;
}

export async function getAllHomestays() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('homestays')
        .select('*')
        .eq('status', 'approved');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const customStays = readStorage(STORAGE_KEYS.HOMESTAYS, []);
  // Combine custom approved stays with curated initial approved stays
  return [...customStays, ...INITIAL_APPROVED_STAYS];
}

// ---------------------------------------------------------------------
// 4. STAY BOOKING REQUESTS
// ---------------------------------------------------------------------

export async function createStayBookingRequest(bookingData, user = null) {
  const bookingId = `book-${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    id: bookingId,
    stay_id: bookingData.stayId,
    stay_title: bookingData.stayTitle,
    destination_id: bookingData.destinationId || 'varkala',
    host_user_id: bookingData.hostUserId || 'host-sample',
    host_name: bookingData.hostName || 'Local Host',
    guest_user_id: user?.id || null,
    guest_name: bookingData.guestName.trim(),
    guest_contact: bookingData.guestContact.trim(),
    check_in_date: bookingData.checkInDate,
    check_out_date: bookingData.checkOutDate,
    nights: Number(bookingData.nights) || 1,
    guests_count: Number(bookingData.guestsCount) || 1,
    include_dinner: Boolean(bookingData.includeDinner),
    nightly_rate_inr: bookingData.nightlyRateINR,
    cleaning_fee_inr: bookingData.cleaningFeeINR || 0,
    dinner_total_inr: bookingData.dinnerTotalINR || 0,
    total_price_inr: bookingData.totalPriceINR,
    guest_message: (bookingData.guestMessage || '').trim(),
    status: 'pending_host_approval',
    created_at: now,
    status_history: [
      {
        status: 'pending_host_approval',
        timestamp: now,
        note: 'Stay request submitted by traveller. Awaiting host confirmation.'
      }
    ]
  };

  // Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('stay_bookings')
        .insert([record])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  // Persistent storage fallback
  const existing = readStorage(STORAGE_KEYS.BOOKINGS, INITIAL_STAY_BOOKINGS);
  const updated = [record, ...existing];
  writeStorage(STORAGE_KEYS.BOOKINGS, updated);

  // Notify traveler
  if (user) {
    await createNotification({
      userId: user.id,
      title: 'Stay Request Sent',
      message: `Your request for ${record.stay_title} (${record.check_in_date} to ${record.check_out_date}) was sent to ${record.host_name}.`,
      type: 'booking_status',
      referenceId: bookingId
    });
  }

  return record;
}

export async function getBookingsForGuest(userId) {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('stay_bookings')
        .select('*')
        .eq('guest_user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.BOOKINGS, INITIAL_STAY_BOOKINGS);
  if (!userId) return all;
  return all.filter(b => b.guest_user_id === userId || !b.guest_user_id);
}

export async function getBookingsForHost(hostUserId) {
  if (isSupabaseConfigured && supabase && hostUserId) {
    try {
      const { data, error } = await supabase
        .from('stay_bookings')
        .select('*')
        .eq('host_user_id', hostUserId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.BOOKINGS, INITIAL_STAY_BOOKINGS);
  // Filter strictly for this host's properties
  return all.filter(b => b.host_user_id === hostUserId);
}

export async function updateStayBookingStatus(bookingId, newStatus, reason = '', actorUser = null) {
  // newStatus: 'confirmed' | 'declined' | 'cancelled'
  const now = new Date().toISOString();
  let target = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('stay_bookings')
        .update({
          status: newStatus,
          action_reason: reason,
          updated_at: now
        })
        .eq('id', bookingId)
        .select()
        .single();
      if (!error && data) {
        target = data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.BOOKINGS, INITIAL_STAY_BOOKINGS);
  const updated = all.map(b => {
    if (b.id === bookingId) {
      target = {
        ...b,
        status: newStatus,
        action_reason: reason,
        updated_at: now,
        status_history: [
          ...(b.status_history || []),
          {
            status: newStatus,
            timestamp: now,
            note: reason || `Booking marked as ${newStatus}`
          }
        ]
      };
      return target;
    }
    return b;
  });
  writeStorage(STORAGE_KEYS.BOOKINGS, updated);

  if (!target) {
    throw new Error(`Booking request ${bookingId} not found.`);
  }

  // Notify guest of decision
  if (target.guest_user_id) {
    const title = newStatus === 'confirmed'
      ? '✅ Stay Request Confirmed!'
      : newStatus === 'declined'
      ? 'Stay Request Declined by Host'
      : 'Stay Request Cancelled';

    const message = newStatus === 'confirmed'
      ? `Your booking at ${target.stay_title} is confirmed for ${target.check_in_date}. We have saved your stay details.`
      : `Host response for ${target.stay_title}: ${reason || 'Dates unavailable.'}`;

    await createNotification({
      userId: target.guest_user_id,
      title,
      message,
      type: 'booking_status',
      referenceId: bookingId
    });
  }

  return target;
}

// ---------------------------------------------------------------------
// 5. TRAVEL DIARIES
// ---------------------------------------------------------------------

export async function submitDiary(diaryData, user = null) {
  const diaryId = `diary-${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    id: diaryId,
    author_user_id: user?.id || null,
    author_name: diaryData.authorName || user?.user_metadata?.full_name || 'Community Traveler',
    author_origin: diaryData.authorOrigin || 'India',
    author_avatar: user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    title: diaryData.title.trim(),
    destination: diaryData.destination.trim(),
    destination_id: diaryData.destinationId || 'varkala',
    trip_dates: diaryData.tripDates || 'Recent Journey',
    story: diaryData.story.trim(),
    cover_photo: diaryData.coverPhoto || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80',
    photos: diaryData.photos || [],
    places_visited: diaryData.placesVisited || [],
    food_discovered: diaryData.foodDiscovered || [],
    activities: diaryData.activities || [],
    expense_type: diaryData.expenseType || 'actual',
    expenses_inr: Number(diaryData.expensesINR) || 0,
    expense_breakdown: diaryData.expenseBreakdown || '',
    traveller_tips: diaryData.travellerTips || '',
    tags: diaryData.tags || ['Community Story'],
    is_approximate: Boolean(diaryData.isApproximate),
    likes_count: 0,
    status: 'pending_review',
    created_at: now,
    updated_at: now
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('travel_diaries')
        .insert([record])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const existing = readStorage(STORAGE_KEYS.DIARIES, INITIAL_COMMUNITY_DIARIES);
  const updated = [record, ...existing];
  writeStorage(STORAGE_KEYS.DIARIES, updated);

  if (user) {
    await createNotification({
      userId: user.id,
      title: 'Diary Submitted for Moderation',
      message: `Your story "${record.title}" is in the moderation queue. It will appear on ROOTS Community once verified.`,
      type: 'moderation',
      referenceId: diaryId
    });
  }

  return record;
}

export async function getApprovedDiaries() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('travel_diaries')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.DIARIES, INITIAL_COMMUNITY_DIARIES);
  // STRICT FILTER: Only approved entries appear publicly
  return all.filter(d => d.status === 'approved');
}

export async function getAllDiariesForModeration() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('travel_diaries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  return readStorage(STORAGE_KEYS.DIARIES, INITIAL_COMMUNITY_DIARIES);
}

export async function moderateDiary(diaryId, decision, notes = '', adminUser = null) {
  // decision: 'approved' | 'rejected'
  const now = new Date().toISOString();
  let target = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('travel_diaries')
        .update({
          status: decision,
          moderation_notes: notes,
          moderated_at: now,
          moderated_by: adminUser?.id || null
        })
        .eq('id', diaryId)
        .select()
        .single();
      if (!error && data) {
        target = data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.DIARIES, INITIAL_COMMUNITY_DIARIES);
  const updated = all.map(d => {
    if (d.id === diaryId) {
      target = {
        ...d,
        status: decision,
        moderation_notes: notes,
        moderated_at: now
      };
      return target;
    }
    return d;
  });
  writeStorage(STORAGE_KEYS.DIARIES, updated);

  if (target?.author_user_id) {
    await createNotification({
      userId: target.author_user_id,
      title: decision === 'approved' ? '✨ Travel Diary Published!' : 'Diary Review Feedback',
      message: decision === 'approved'
        ? `Your diary "${target.title}" was approved by community moderators and is now visible to all travelers.`
        : `Update on "${target.title}": ${notes || 'Did not meet community slow-travel standards.'}`,
      type: 'moderation',
      referenceId: diaryId
    });
  }

  return target;
}

export async function deleteDiary(diaryId, user) {
  const isAdmin = await checkIsAdmin(user);
  const all = readStorage(STORAGE_KEYS.DIARIES, INITIAL_COMMUNITY_DIARIES);
  const target = all.find(d => d.id === diaryId);

  if (!target) {
    throw new Error('Diary not found.');
  }

  // Security check: Only author or admin can delete
  if (target.author_user_id && target.author_user_id !== user?.id && !isAdmin) {
    throw new Error('Unauthorized: You can only delete your own diary posts.');
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('travel_diaries').delete().eq('id', diaryId);
    } catch {
      // Fallback
    }
  }

  const updated = all.filter(d => d.id !== diaryId);
  writeStorage(STORAGE_KEYS.DIARIES, updated);
  return true;
}

// ---------------------------------------------------------------------
// 6. DESTINATION TIPS & PLACES
// ---------------------------------------------------------------------

export async function submitDestinationTip(tipData, user = null) {
  const tipId = `tip-${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    id: tipId,
    author_user_id: user?.id || null,
    author_name: tipData.authorName || user?.user_metadata?.full_name || 'Community Contributor',
    author_role: tipData.authorRole || 'Local Explorer',
    author_avatar: user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    destination_id: tipData.destinationId || 'varkala',
    destination_name: tipData.destinationName || 'Varkala',
    title: tipData.title.trim(),
    category: tipData.category || 'nature',
    description: tipData.description.trim(),
    approximate_location: tipData.approximateLocation || '',
    photos: tipData.photos || [],
    estimated_cost_inr: Number(tipData.estimatedCostINR) || 0,
    price_notes: tipData.priceNotes || '',
    practical_notes: tipData.practicalNotes || '',
    best_time_to_visit: tipData.bestTimeToVisit || 'Morning',
    accessibility_notes: tipData.accessibilityNotes || '',
    status: 'pending_review',
    created_at: now,
    updated_at: now
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('destination_tips')
        .insert([record])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const existing = readStorage(STORAGE_KEYS.TIPS, INITIAL_COMMUNITY_PLACES);
  const updated = [record, ...existing];
  writeStorage(STORAGE_KEYS.TIPS, updated);

  return record;
}

export async function getApprovedDestinationTips(destinationId = null) {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('destination_tips').select('*').eq('status', 'approved');
      if (destinationId) query = query.eq('destination_id', destinationId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.TIPS, INITIAL_COMMUNITY_PLACES);
  return all.filter(t => {
    if (t.status !== 'approved') return false;
    if (destinationId && t.destination_id !== destinationId) return false;
    return true;
  });
}

export async function getAllTipsForModeration() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('destination_tips')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  return readStorage(STORAGE_KEYS.TIPS, INITIAL_COMMUNITY_PLACES);
}

export async function moderateDestinationTip(tipId, decision, notes = '', adminUser = null) {
  const now = new Date().toISOString();
  let target = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('destination_tips')
        .update({
          status: decision,
          moderation_notes: notes,
          moderated_at: now,
          moderated_by: adminUser?.id || null
        })
        .eq('id', tipId)
        .select()
        .single();
      if (!error && data) {
        target = data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.TIPS, INITIAL_COMMUNITY_PLACES);
  const updated = all.map(t => {
    if (t.id === tipId) {
      target = {
        ...t,
        status: decision,
        moderation_notes: notes,
        moderated_at: now
      };
      return target;
    }
    return t;
  });
  writeStorage(STORAGE_KEYS.TIPS, updated);

  return target;
}

// ---------------------------------------------------------------------
// 7. REPORTS (Safety & Content Moderation)
// ---------------------------------------------------------------------

export async function submitSafetyReport(reportData, user = null) {
  const reportId = `rep-${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    id: reportId,
    reporter_user_id: user?.id || null,
    reporter_name: reportData.reporterName || user?.user_metadata?.full_name || 'Community Traveler',
    target_type: reportData.targetType, // 'stay' | 'diary' | 'tip'
    target_id: reportData.targetId,
    target_title: reportData.targetTitle,
    reason: reportData.reason,
    notes: reportData.notes || '',
    status: 'active',
    created_at: now
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('reports').insert([record]);
    } catch {
      // Fallback
    }
  }

  const existing = readStorage(STORAGE_KEYS.REPORTS, []);
  const updated = [record, ...existing];
  writeStorage(STORAGE_KEYS.REPORTS, updated);

  return record;
}

export async function getSafetyReports() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  return readStorage(STORAGE_KEYS.REPORTS, []);
}

export async function resolveSafetyReport(reportId, action, notes = '') {
  // action: 'resolved' | 'dismissed'
  const now = new Date().toISOString();

  const all = readStorage(STORAGE_KEYS.REPORTS, []);
  const updated = all.map(r => r.id === reportId ? {
    ...r,
    status: action,
    resolution_notes: notes,
    resolved_at: now
  } : r);
  writeStorage(STORAGE_KEYS.REPORTS, updated);
  return true;
}

// ---------------------------------------------------------------------
// 8. NOTIFICATIONS
// ---------------------------------------------------------------------

export async function createNotification({ userId, title, message, type = 'info', referenceId = null }) {
  if (!userId) return null;

  const notifId = `notif-${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    id: notifId,
    user_id: userId,
    title,
    message,
    type,
    reference_id: referenceId,
    is_read: false,
    created_at: now
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').insert([record]);
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = [record, ...all];
  writeStorage(STORAGE_KEYS.NOTIFICATIONS, updated);

  return record;
}

export async function getUserNotifications(userId) {
  if (!userId) return [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const all = readStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  return all.filter(n => n.user_id === userId);
}

export const getNotificationsForUser = getUserNotifications;

