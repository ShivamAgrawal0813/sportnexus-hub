import { 
  createMockVenue, 
  createMockProfile, 
  createMockVenueBooking, 
  createMockEquipment, 
  createMockEquipmentRental, 
  createMockTutorial, 
  createMockTutorialLesson,
  createMockUserTutorialProgress
} from './api-helper';

import { 
  mockVenues, 
  mockVenueBookings, 
  mockEquipment
} from './mock-data';

import { 
  Venue, 
  Profile, 
  VenueBooking, 
  VenueBookingWithDetails,
  Equipment, 
  EquipmentRental, 
  EquipmentRentalWithDetails,
  Tutorial, 
  TutorialLesson,
  UserTutorialProgress,
  Notification,
  BookingStatus,
  PaymentStatus,
  TutorialProgress
} from '@/types/supabase';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// VENUE APIs
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  await delay(500);
  return mockVenues;
};

export const getVenueById = async (id: string): Promise<Venue | null> => {
  await delay(300);
  const venue = mockVenues.find(v => v.id === id);
  return venue || null;
};

export const createVenue = async (venueData: Partial<Venue>): Promise<Venue> => {
  await delay(800);
  const newVenue = createMockVenue(venueData);
  return newVenue;
};

export const updateVenue = async (id: string, venueData: Partial<Venue>): Promise<Venue> => {
  await delay(600);
  const venue = mockVenues.find(v => v.id === id) || createMockVenue({});
  return { ...venue, ...venueData, updated_at: new Date().toISOString() };
};

export const deleteVenue = async (id: string): Promise<boolean> => {
  await delay(400);
  return true;
};

// BOOKINGS APIs
export const createBooking = async (bookingData: Partial<VenueBooking>): Promise<VenueBookingWithDetails> => {
  await delay(700);
  const newBooking = createMockVenueBooking(bookingData);
  return newBooking;
};

export const getUserBookings = async (userId: string): Promise<VenueBookingWithDetails[]> => {
  await delay(600);
  return mockVenueBookings.filter(b => b.user_id === userId);
};

export const getBookingById = async (id: string): Promise<VenueBookingWithDetails | null> => {
  await delay(300);
  const booking = mockVenueBookings.find(b => b.id === id);
  return booking || null;
};

export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<VenueBooking> => {
  await delay(500);
  const booking = mockVenueBookings.find(b => b.id === id) || mockVenueBookings[0];
  return { ...booking, status, updated_at: new Date().toISOString() };
};

export const updateBookingPayment = async (id: string, paymentId: string, status: PaymentStatus = 'paid'): Promise<VenueBooking> => {
  await delay(600);
  const booking = mockVenueBookings.find(b => b.id === id) || mockVenueBookings[0];
  return { 
    ...booking, 
    payment_id: paymentId, 
    payment_status: status,
    updated_at: new Date().toISOString() 
  };
};

// EQUIPMENT APIs
export const getEquipment = async (filters?: any): Promise<Equipment[]> => {
  await delay(500);
  return mockEquipment;
};

export const getEquipmentById = async (id: string): Promise<Equipment | null> => {
  await delay(300);
  const equipment = mockEquipment.find(e => e.id === id);
  return equipment || null;
};

export const createEquipment = async (equipmentData: Partial<Equipment>): Promise<Equipment> => {
  await delay(800);
  const newEquipment = createMockEquipment(equipmentData);
  return newEquipment;
};

export const updateEquipment = async (id: string, equipmentData: Partial<Equipment>): Promise<Equipment> => {
  await delay(600);
  const equipment = mockEquipment.find(e => e.id === id) || createMockEquipment({});
  return { ...equipment, ...equipmentData, updated_at: new Date().toISOString() };
};

export const deleteEquipment = async (id: string): Promise<boolean> => {
  await delay(400);
  return true;
};

// RENTALS APIs
export const createRental = async (rentalData: Partial<EquipmentRental>): Promise<EquipmentRentalWithDetails> => {
  await delay(700);
  const newRental = createMockEquipmentRental(rentalData);
  return newRental;
};

export const getUserRentals = async (userId: string): Promise<EquipmentRentalWithDetails[]> => {
  await delay(600);
  return [createMockEquipmentRental({ user_id: userId })];
};

export const getRentalById = async (id: string): Promise<EquipmentRentalWithDetails | null> => {
  await delay(300);
  return createMockEquipmentRental({ id });
};

export const updateRentalStatus = async (id: string, status: BookingStatus): Promise<EquipmentRental> => {
  await delay(500);
  const rental = createMockEquipmentRental({ id });
  return { ...rental, status, updated_at: new Date().toISOString() };
};

export const updateRentalPayment = async (id: string, paymentId: string, status: PaymentStatus = 'paid'): Promise<EquipmentRental> => {
  await delay(600);
  const rental = createMockEquipmentRental({ id });
  return { 
    ...rental, 
    payment_id: paymentId, 
    payment_status: status,
    updated_at: new Date().toISOString() 
  };
};

// TUTORIAL APIs
export const getTutorials = async (filters?: any): Promise<Tutorial[]> => {
  await delay(500);
  return [createMockTutorial({})];
};

export const getTutorialById = async (id: string): Promise<Tutorial | null> => {
  await delay(300);
  return createMockTutorial({ id });
};

export const getTutorialLessons = async (tutorialId: string): Promise<TutorialLesson[]> => {
  await delay(400);
  return [
    createMockTutorialLesson({ tutorial_id: tutorialId, sequence_order: 1 }),
    createMockTutorialLesson({ tutorial_id: tutorialId, sequence_order: 2 }),
    createMockTutorialLesson({ tutorial_id: tutorialId, sequence_order: 3 })
  ];
};

export const getUserTutorialProgress = async (userId: string, tutorialId: string): Promise<UserTutorialProgress | null> => {
  await delay(300);
  return createMockUserTutorialProgress({ user_id: userId, tutorial_id: tutorialId });
};

export const updateTutorialProgress = async (
  userId: string,
  tutorialId: string,
  currentLessonId: string,
  progress: TutorialProgress,
  completedLessons: number
): Promise<UserTutorialProgress> => {
  await delay(500);
  return createMockUserTutorialProgress({
    user_id: userId,
    tutorial_id: tutorialId,
    current_lesson_id: currentLessonId,
    progress,
    completed_lessons: completedLessons,
    updated_at: new Date().toISOString()
  });
};

// PROFILE APIs
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  await delay(400);
  return createMockProfile({ id: userId });
};

export const updateUserProfile = async (userId: string, profileData: Partial<Profile>): Promise<Profile> => {
  await delay(600);
  return createMockProfile({ id: userId, ...profileData, updated_at: new Date().toISOString() });
};

// NOTIFICATION APIs
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  await delay(500);
  return [
    {
      id: 'notif-1',
      user_id: userId,
      title: 'Booking Confirmed',
      message: 'Your tennis court booking has been confirmed.',
      is_read: false,
      type: 'booking',
      entity_type: 'venue_booking',
      entity_id: 'booking-1',
      created_at: new Date().toISOString()
    },
    {
      id: 'notif-2',
      user_id: userId,
      title: 'New Tutorial Available',
      message: 'Check out our new tennis fundamentals tutorial!',
      is_read: true,
      type: 'tutorial',
      entity_type: 'tutorial',
      entity_id: 'tutorial-1',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  await delay(300);
  return true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  await delay(400);
  return true;
};
