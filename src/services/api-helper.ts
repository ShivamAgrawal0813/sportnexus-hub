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
  BookingStatus,
  PaymentStatus,
  TutorialProgress
} from '@/types/supabase';

// Helper function to create mock venues
export const createMockVenue = (partial: Partial<Venue>): Venue => {
  return {
    id: `venue-${Math.floor(Math.random() * 1000)}`,
    owner_id: 'owner-1',
    name: 'Default Venue',
    description: 'A nice venue for sports',
    location: 'City Center',
    address: '123 Main St',
    amenities: {
      parking: true,
      showers: true,
      lockers: true
    },
    images: ['/images/venues/tennis-court.jpg'],
    hourly_price: 50,
    half_day_price: 200,
    full_day_price: 350,
    sport_type: 'tennis',
    capacity: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial
  };
};

// Helper function to create mock user profiles
export const createMockProfile = (partial: Partial<Profile>): Profile => {
  return {
    id: `user-${Math.floor(Math.random() * 1000)}`,
    username: 'johndoe',
    full_name: 'John Doe',
    avatar_url: '/images/avatars/default.jpg',
    role: 'user',
    email: 'john@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial
  };
};

// Helper function to create mock venue bookings
export const createMockVenueBooking = (partial: Partial<VenueBooking>): VenueBookingWithDetails => {
  const booking: VenueBooking = {
    id: `booking-${Math.floor(Math.random() * 1000)}`,
    venue_id: 'venue-1',
    user_id: 'user-1',
    booking_date: new Date().toISOString().split('T')[0],
    start_time: '14:00:00',
    end_time: '16:00:00',
    total_price: 100,
    status: 'pending',
    payment_status: 'pending',
    payment_id: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial
  };

  // Add venue details
  return {
    ...booking,
    venue_details: {
      name: 'Tennis Court',
      location: 'Sports Center',
      sport_type: 'tennis',
      images: ['/images/venues/tennis-court.jpg']
    }
  };
};

// Helper function to create mock equipment
export const createMockEquipment = (partial: Partial<Equipment>): Equipment => {
  return {
    id: `equipment-${Math.floor(Math.random() * 1000)}`,
    owner_id: 'owner-1',
    name: 'Tennis Racket',
    description: 'Professional-grade tennis racket',
    category: 'tennis',
    brand: 'Wilson',
    images: ['/images/equipment/tennis-racket.jpg'],
    daily_price: 20,
    weekly_price: 100,
    monthly_price: null,
    stock_quantity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial
  };
};

// Helper function to create mock equipment rentals
export const createMockEquipmentRental = (partial: Partial<EquipmentRental>): EquipmentRentalWithDetails => {
  const rental: EquipmentRental = {
    id: `rental-${Math.floor(Math.random() * 1000)}`,
    equipment_id: 'equipment-1',
    user_id: 'user-1',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    quantity: 1,
    total_price: 60,
    status: 'pending',
    payment_status: 'pending',
    payment_id: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial
  };

  // Add equipment details
  return {
    ...rental,
    equipment_details: {
      id: 'equipment-1',
      name: 'Tennis Racket',
      brand: 'Wilson',
      category: 'tennis',
      images: ['/images/equipment/tennis-racket.jpg']
    }
  };
};

// Helper function to create mock tutorials
export const createMockTutorial = (partial: Partial<Tutorial>): Tutorial => {
  return {
    id: `tutorial-${Math.floor(Math.random() * 1000)}`,
    title: 'Tennis Fundamentals',
    description: 'Learn the basics of playing tennis',
    sport_category: 'tennis',
    difficulty: 'beginner',
    instructor_id: 'instructor-1',
    video_url: 'https://example.com/tennis-basics.mp4',
    thumbnail: '/images/tutorials/tennis-fundamentals.jpg',
    duration: 45,
    is_premium: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial
  };
};

// Helper function to create mock tutorial lessons
export const createMockTutorialLesson = (partial: Partial<TutorialLesson>): TutorialLesson => {
  return {
    id: `lesson-${Math.floor(Math.random() * 1000)}`,
    tutorial_id: 'tutorial-1',
    title: 'Getting Started with Tennis',
    description: 'Introduction to tennis equipment and basic stance',
    video_url: 'https://example.com/tennis-intro.mp4',
    duration: 10,
    sequence_order: 1,
    created_at: new Date().toISOString(),
    ...partial
  };
};

// Helper function to create mock user tutorial progress
export const createMockUserTutorialProgress = (partial: Partial<UserTutorialProgress>): UserTutorialProgress => {
  return {
    id: `progress-${Math.floor(Math.random() * 1000)}`,
    user_id: 'user-1',
    tutorial_id: 'tutorial-1',
    current_lesson_id: 'lesson-1',
    progress: 'in_progress',
    completed_lessons: 2,
    total_lessons: 5,
    last_accessed: new Date().toISOString(),
    completion_date: null,
    certificate_issued: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...partial
  };
};
