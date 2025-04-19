
import { 
  Venue, 
  VenueBooking, 
  Equipment, 
  EquipmentRental, 
  Tutorial, 
  TutorialLesson,
  UserTutorialProgress,
  Notification,
  VenueBookingWithDetails,
  EquipmentRentalWithDetails,
  BookingStatus,
  PaymentStatus,
  TutorialProgress,
  TutorialDifficulty
} from '@/types/supabase';
import { Json } from '@/integrations/supabase/database.types';

// Mock Venues
export const mockVenues: Venue[] = [
  {
    id: 'venue-1',
    owner_id: 'owner-1',
    name: 'Downtown Tennis Court',
    description: 'Professional tennis court in the heart of downtown',
    location: 'Downtown',
    address: '123 Main St, Downtown',
    amenities: { parking: true, showers: true, lockers: true } as Json,
    images: ['/images/venues/tennis-court.jpg'],
    hourly_price: 40,
    half_day_price: 150,
    full_day_price: 280,
    sport_type: 'tennis',
    capacity: 4,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z'
  },
  {
    id: 'venue-2',
    owner_id: 'owner-1',
    name: 'Suburban Basketball Court',
    description: 'Full-size basketball court with premium flooring',
    location: 'Suburban Area',
    address: '456 Oak St, Suburbia',
    amenities: { parking: true, showers: true, coaching: true } as Json,
    images: ['/images/venues/basketball-court.jpg'],
    hourly_price: 35,
    half_day_price: 130,
    full_day_price: 250,
    sport_type: 'basketball',
    capacity: 10,
    created_at: '2023-01-16T10:00:00Z',
    updated_at: '2023-01-16T10:00:00Z'
  }
];

// Mock Venue Bookings
export const mockVenueBookings: VenueBookingWithDetails[] = [
  {
    id: 'booking-1',
    venue_id: 'venue-1',
    user_id: 'user-1',
    booking_date: '2023-02-15',
    start_time: '14:00:00',
    end_time: '16:00:00',
    total_price: 80,
    status: 'confirmed',
    payment_status: 'paid',
    payment_id: 'pay_123456',
    notes: 'Please have 4 rackets ready',
    created_at: '2023-02-10T10:00:00Z',
    updated_at: '2023-02-10T10:00:00Z',
    venue_details: {
      name: 'Downtown Tennis Court',
      location: 'Downtown',
      sport_type: 'tennis',
      images: ['/images/venues/tennis-court.jpg']
    }
  },
  {
    id: 'booking-2',
    venue_id: 'venue-2',
    user_id: 'user-1',
    booking_date: '2023-02-20',
    start_time: '18:00:00',
    end_time: '20:00:00',
    total_price: 70,
    status: 'pending',
    payment_status: 'pending',
    payment_id: null,
    notes: null,
    created_at: '2023-02-12T10:00:00Z',
    updated_at: '2023-02-12T10:00:00Z',
    venue_details: {
      name: 'Suburban Basketball Court',
      location: 'Suburban Area',
      sport_type: 'basketball',
      images: ['/images/venues/basketball-court.jpg']
    }
  }
];

// Mock Equipment
export const mockEquipment: Equipment[] = [
  {
    id: 'equipment-1',
    owner_id: 'owner-1',
    name: 'Professional Tennis Racket',
    description: 'High-quality tennis racket for professional players',
    category: 'tennis',
    brand: 'Wilson',
    images: ['/images/equipment/tennis-racket.jpg'],
    daily_price: 20,
    weekly_price: 100,
    monthly_price: null,
    stock_quantity: 10,
    created_at: '2023-03-01T10:00:00Z',
    updated_at: '2023-03-01T10:00:00Z'
  },
  {
    id: 'equipment-2',
    owner_id: 'owner-1',
    name: 'Basketball',
    description: 'Official size and weight basketball',
    category: 'basketball',
    brand: 'Spalding',
    images: ['/images/equipment/basketball.jpg'],
    daily_price: 8,
    weekly_price: 40,
    monthly_price: null,
    stock_quantity: 20,
    created_at: '2023-03-02T10:00:00Z',
    updated_at: '2023-03-02T10:00:00Z'
  }
];

export const mockEquipmentRentals: EquipmentRental[] = [
  {
    id: '1',
    equipment_id: '1',
    user_id: 'user1',
    start_date: '2023-06-15',
    end_date: '2023-06-16',
    quantity: 2,
    total_price: 30,
    status: 'confirmed' as BookingStatus,
    payment_status: 'paid' as PaymentStatus,
    payment_id: 'pay_456',
    notes: null,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  }
];

export const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Basketball Fundamentals',
    description: 'Learn the basic techniques of basketball',
    sport_category: 'basketball',
    difficulty: 'beginner' as TutorialDifficulty,
    instructor_id: 'instructor1',
    video_url: 'https://example.com/basketball-fundamentals',
    duration: 60,
    thumbnail: 'https://placehold.co/600x400?text=Basketball+Tutorial',
    is_premium: false,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

export const mockTutorialLessons: TutorialLesson[] = [
  {
    id: '1',
    tutorial_id: '1',
    title: 'Dribbling Basics',
    description: 'Learn proper dribbling techniques',
    video_url: 'https://example.com/dribbling-basics',
    duration: 15,
    sequence_order: 1,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    tutorial_id: '1',
    title: 'Shooting Form',
    description: 'Master the perfect shooting form',
    video_url: 'https://example.com/shooting-form',
    duration: 20,
    sequence_order: 2,
    created_at: '2023-01-01T00:00:00Z'
  }
];

export const mockUserProgress: UserTutorialProgress[] = [
  {
    id: '1',
    user_id: 'user1',
    tutorial_id: '1',
    current_lesson_id: '1',
    progress: 'in_progress' as TutorialProgress,
    completed_lessons: 1,
    total_lessons: 2,
    last_accessed: '2023-06-01T00:00:00Z',
    completion_date: null,
    certificate_issued: false,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Booking Confirmed',
    message: 'Your booking at Downtown Sports Complex has been confirmed.',
    is_read: false,
    type: 'booking_confirmation',
    entity_type: 'venue_booking',
    entity_id: '1',
    created_at: '2023-06-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user1',
    title: 'New Tutorial Available',
    message: 'Check out our new tennis tutorial!',
    is_read: true,
    type: 'new_content',
    entity_type: 'tutorial',
    entity_id: '2',
    created_at: '2023-05-15T00:00:00Z'
  }
];
