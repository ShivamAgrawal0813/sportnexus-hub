
import { 
  Venue, 
  VenueBooking,
  Equipment,
  EquipmentRental,
  Tutorial,
  TutorialLesson,
  UserTutorialProgress,
  Notification,
  BookingStatus,
  PaymentStatus,
  TutorialDifficulty,
  TutorialProgress
} from '@/types/supabase';

// Mock data to use until database is fully configured
export const mockVenues: Venue[] = [
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Downtown Sports Complex',
    description: 'Modern sports facility with multiple courts',
    location: 'Downtown',
    address: '123 Main St, City Center',
    amenities: { parking: true, showers: true, lockers: true },
    images: ['https://placehold.co/600x400?text=Sports+Complex'],
    hourly_price: 50,
    half_day_price: 200,
    full_day_price: 350,
    sport_type: 'basketball',
    capacity: 50,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    owner_id: 'owner2',
    name: 'Riverside Tennis Club',
    description: 'Premium tennis courts with river views',
    location: 'Riverside',
    address: '789 River Rd, Riverside',
    amenities: { parking: true, showers: true, coaching: true },
    images: ['https://placehold.co/600x400?text=Tennis+Club'],
    hourly_price: 30,
    half_day_price: 120,
    full_day_price: 220,
    sport_type: 'tennis',
    capacity: 20,
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  }
];

export const mockVenueBookings: VenueBooking[] = [
  {
    id: '1',
    venue_id: '1',
    user_id: 'user1',
    booking_date: '2023-06-15',
    start_time: '14:00:00',
    end_time: '16:00:00',
    total_price: 100,
    status: 'confirmed' as BookingStatus,
    payment_status: 'completed' as PaymentStatus,
    payment_id: 'pay_123',
    notes: null,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z',
    venue_details: {
      name: 'Downtown Sports Complex',
      location: 'Downtown',
      sport_type: 'basketball',
      images: ['https://placehold.co/600x400?text=Sports+Complex']
    }
  },
  {
    id: '2',
    venue_id: '2',
    user_id: 'user1',
    booking_date: '2023-06-20',
    start_time: '10:00:00',
    end_time: '12:00:00',
    total_price: 60,
    status: 'pending' as BookingStatus,
    payment_status: 'pending' as PaymentStatus,
    payment_id: null,
    notes: 'Bringing own equipment',
    created_at: '2023-06-05T00:00:00Z',
    updated_at: '2023-06-05T00:00:00Z',
    venue_details: {
      name: 'Riverside Tennis Club',
      location: 'Riverside',
      sport_type: 'tennis',
      images: ['https://placehold.co/600x400?text=Tennis+Club']
    }
  }
];

export const mockEquipment: Equipment[] = [
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Professional Basketball',
    description: 'Official size and weight professional basketball',
    category: 'basketball',
    brand: 'Wilson',
    images: ['https://placehold.co/600x400?text=Basketball'],
    hourly_price: 5,
    daily_price: 15,
    weekly_price: 50,
    total_quantity: 10,
    available_quantity: 8,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    owner_id: 'owner2',
    name: 'Tennis Racket Set',
    description: 'Premium tennis racket set with balls',
    category: 'tennis',
    brand: 'Babolat',
    images: ['https://placehold.co/600x400?text=Tennis+Racket'],
    hourly_price: 10,
    daily_price: 30,
    weekly_price: 100,
    total_quantity: 5,
    available_quantity: 3,
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
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
    payment_status: 'completed' as PaymentStatus,
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
    certificate_issued: false
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
