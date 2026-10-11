import {
  checkIsAdmin,
  submitHostApplication,
  getHostApplications,
  moderateHostApplication,
  getAllHomestays,
  submitDiary,
  getApprovedDiaries,
  getAllDiariesForModeration,
  moderateDiary,
  deleteDiary,
  submitDestinationTip,
  getApprovedDestinationTips,
  getAllTipsForModeration,
  moderateDestinationTip,
  createStayBookingRequest,
  getBookingsForGuest,
  getBookingsForHost,
  updateStayBookingStatus,
  getNotificationsForUser
} from './src/services/dbService.js';

// Polyfill window and localStorage for Node testing environment
const storage = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => storage.get(k) || null,
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: (k) => storage.delete(k),
    clear: () => storage.clear()
  }
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING ROOTS END-TO-END WORKFLOW INTEGRATION TESTS');
  console.log('====================================================\n');

  // -----------------------------------------------------------------
  // 1. HOST WORKFLOW
  // -----------------------------------------------------------------
  console.log('Test Scenario 1: Host Application & Stay Publication Workflow');
  const hostUser = { id: 'usr-host-101', email: 'host.kerala@example.com', name: 'Mathew Abraham' };
  const adminUser = { id: 'usr-admin-1', email: 'admin@roots.internal', name: 'ROOTS Lead Moderator' };

  const appData = {
    propertyName: "Mathew's Cardamom Plantation Hermitage",
    destinationId: "coorg",
    generalLocation: "Madikeri Hillside, Kodagu, Karnataka",
    propertyType: "Plantation Homestay",
    hostFullName: "Mathew Abraham",
    hostIntro: "Third-generation coffee & cardamom planter welcoming mindful travellers.",
    nightlyRateINR: 2800,
    rooms: 2,
    maxGuests: 4,
    breakfastIncluded: true,
    culturalActivities: "Cardamom drying tour, birdwatching trail",
    contactVerified: true,
    hasFireExtinguisher: true,
    hasFirstAidKit: true
  };

  const submittedApp = await submitHostApplication(appData, hostUser);
  assert(submittedApp.id && submittedApp.id.startsWith('app-'), 'Application generated unique ID');
  assert(submittedApp.user_id === hostUser.id, 'Application attributed to authenticated host user ID');
  assert(submittedApp.status === 'pending_verification', 'New host application starts in pending_verification status');

  const pendingQueue = await getHostApplications('pending_verification');
  const foundInQueue = pendingQueue.some(a => a.id === submittedApp.id);
  assert(foundInQueue, 'Application visible in Admin Host Applications queue');

  // Verify NOT visible in public homestays yet
  let publicStays = await getAllHomestays();
  const initiallyInPublic = publicStays.some(s => s.id === submittedApp.id || s.name === appData.propertyName);
  assert(!initiallyInPublic, 'Pending application is NOT visible in public homestay catalog');

  // Admin approves application
  const approvedApp = await moderateHostApplication(submittedApp.id, 'approved', 'Verified land ownership tax record & first-aid compliance', adminUser);
  assert(approvedApp.status === 'approved', 'Application status updated to approved');

  // Verify now published in public stays
  publicStays = await getAllHomestays();
  const nowInPublic = publicStays.some(s => s.name === appData.propertyName && s.status === 'approved');
  assert(nowInPublic, 'Approved homestay is immediately live in public Stay catalog');

  // Verify applicant notification
  const hostNotifs = await getNotificationsForUser(hostUser.id);
  assert(hostNotifs.some(n => n.type === 'host_status' && n.title.includes('Approved')), 'Host received approval notification');

  console.log('');

  // -----------------------------------------------------------------
  // 2. DIARY WORKFLOW
  // -----------------------------------------------------------------
  console.log('Test Scenario 2: Community Travel Diary Submission & Moderation');
  const authorUser = { id: 'usr-author-202', email: 'aarav.trek@example.com', name: 'Aarav Mehta' };

  const diaryInput = {
    title: 'Dawn Canoe through the Mangrove Creeks of Munroe Island',
    destination: 'Munroe Island & Ashtamudi Lake',
    destinationId: 'varkala',
    story: 'We met Vijayan uncle at 5:30 AM before the motorboats started. Total silence, kingfishers diving into mist.',
    coverPhoto: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f',
    photos: ['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f'],
    placesVisited: 'Dutch Church Canal, Ashtamudi estuary',
    foodDiscovered: 'Steamed pathiri with spicy vegetable stew',
    approximateBudgetINR: 1200
  };

  const submittedDiary = await submitDiary(diaryInput, authorUser);
  assert(submittedDiary.author_user_id === authorUser.id, 'Diary attributed to authenticated author ID');
  assert(submittedDiary.status === 'pending_review', 'New diary initialized in pending_review status');

  // Verify NOT visible in public approved feed
  let approvedFeed = await getApprovedDiaries();
  const foundInFeedPre = approvedFeed.some(d => d.id === submittedDiary.id);
  assert(!foundInFeedPre, 'Pending diary is NOT visible in public approved community feed');

  // Admin approves diary
  await moderateDiary(submittedDiary.id, 'approved', 'Inspiring local narrative adhering to community guidelines', adminUser);
  approvedFeed = await getApprovedDiaries();
  const foundInFeedPost = approvedFeed.some(d => d.id === submittedDiary.id);
  assert(foundInFeedPost, 'Approved diary is now visible in public community feed');

  // Test ownership enforcement: non-owner stranger cannot delete
  const strangerUser = { id: 'usr-stranger-999', email: 'stranger@example.com' };
  try {
    await deleteDiary(submittedDiary.id, strangerUser);
    assert(false, 'Stranger should NOT be able to delete another users diary');
  } catch (err) {
    assert(true, 'Unauthorized deletion rejected with security check');
  }

  // Owner CAN delete own diary
  const deleted = await deleteDiary(submittedDiary.id, authorUser);
  assert(deleted === true, 'Author can successfully delete own diary');

  console.log('');

  // -----------------------------------------------------------------
  // 3. STAY BOOKING & INBOX WORKFLOW
  // -----------------------------------------------------------------
  console.log('Test Scenario 3: Traveller Stay Request & Host Inbox Confirmation');
  const travellerUser = { id: 'usr-traveller-303', email: 'priya.wander@example.com', name: 'Priya Iyer' };

  const bookingInput = {
    stayId: 'stay-thattekad-riverside',
    stayTitle: "Eldho & Mary's Riverside Teakwood Homestay",
    destinationId: 'periyar',
    hostUserId: 'host-eldho-varghese',
    hostName: 'Eldho Varghese',
    guestName: 'Priya Iyer',
    guestContact: 'priya.wander@example.com',
    checkInDate: '2026-11-20',
    checkOutDate: '2026-11-23',
    nights: 3,
    guestsCount: 2,
    includeDinner: true,
    nightlyRateINR: 2200,
    cleaningFeeINR: 200,
    dinnerTotalINR: 1500,
    totalPriceINR: 8300,
    guestMessage: 'Excited to observe the hornbill migration and taste traditional Kerala cooking.'
  };

  const booking = await createStayBookingRequest(bookingInput, travellerUser);
  assert(booking.guest_user_id === travellerUser.id, 'Booking request attributed to traveller user ID');
  assert(booking.status === 'pending_host_approval', 'Booking request starts as pending_host_approval (no fake instant booking)');

  // Host queries inbox
  const hostInbox = await getBookingsForHost('host-eldho-varghese');
  const foundInHostInbox = hostInbox.some(b => b.id === booking.id);
  assert(foundInHostInbox, 'Host Eldho sees request in Host Inbox');

  // Other host cannot see Eldho's booking
  const otherHostInbox = await getBookingsForHost('host-unrelated-person');
  const inOtherInbox = otherHostInbox.some(b => b.id === booking.id);
  assert(!inOtherInbox, 'Host isolation enforced: Unrelated host cannot view private request');

  // Host accepts reservation
  const confirmedBooking = await updateStayBookingStatus(booking.id, 'confirmed', 'Dates confirmed, family looking forward to welcoming you.', { id: 'host-eldho-varghese' });
  assert(confirmedBooking.status === 'confirmed', 'Host confirmed booking status updated in database');

  // Traveller checks their requests
  const travellerRequests = await getBookingsForGuest(travellerUser.id);
  const updatedForTraveller = travellerRequests.find(b => b.id === booking.id);
  assert(updatedForTraveller.status === 'confirmed', 'Traveller observes updated Confirmed status');

  console.log('');

  // -----------------------------------------------------------------
  // 4. SECURITY & AUTHORIZATION WORKFLOW
  // -----------------------------------------------------------------
  console.log('Test Scenario 4: Role-Based Authorization & Admin Guard');

  const regularUser = { id: 'usr-regular-404', email: 'regular.user@example.com', role: 'traveller' };
  const isAdminRegular = await checkIsAdmin(regularUser);
  assert(isAdminRegular === false, 'Standard user is denied admin permissions');

  const verifiedAdmin = { id: 'usr-admin-1', email: 'admin@roots.internal', user_metadata: { role: 'admin' } };
  const isAdminVerified = await checkIsAdmin(verifiedAdmin);
  assert(isAdminVerified === true, 'Authorized admin user is granted admin permissions');

  console.log('');

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('====================================================');
  console.log(`TEST RUN COMPLETE: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('====================================================');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test run encountered fatal error:', err);
  process.exit(1);
});
