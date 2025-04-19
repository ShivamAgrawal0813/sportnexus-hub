import { toast } from '@/hooks/use-toast';
import {
  Venue,
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
  TutorialProgress,
  TutorialWithLessons,
  Profile
} from '@/types/supabase';

// Define the missing UploadResult type at the top of the file
export interface UploadResult {
  url: string | null;
  error: string | null;
}

// Helper functions for error and success handling
const handleError = (error: any, message: string = 'An error occurred'): null => {
  console.error(`${message}:`, error);
  toast.error(message);
  return null;
};

const handleSuccess = <T>(data: T, message?: string): T => {
  if (message) {
    toast.success(message);
  }
  return data;
};

// Mock data for venues
let mockVenues: Venue[] = [
  {
    id: '1',
    owner_id: 'system',
    name: 'Grand Tennis Court',
    description: 'Professional tennis court with top-quality surface and lighting',
    location: 'Downtown Sports Center',
    address: '123 Main St, Metropolis',
    amenities: {
      showers: true,
      locker_rooms: true,
      parking: true,
      equipment_rental: true,
      cafe: true
    },
    images: [
      'https://placehold.co/600x400/green/white?text=Tennis+Court',
      'https://placehold.co/600x400/green/white?text=Tennis+Court+2'
    ],
    hourly_price: 45,
    half_day_price: 120,
    full_day_price: 200,
    sport_type: 'Tennis',
    capacity: 4,
    created_at: '2023-08-01T00:00:00Z',
    updated_at: '2023-08-01T00:00:00Z'
  },
  {
    id: '2',
    owner_id: 'system',
    name: 'Indoor Basketball Court',
    description: 'Full-size indoor basketball court with professional flooring',
    location: 'West Side Gym',
    address: '456 West Ave, Metropolis',
    amenities: {
      showers: true,
      locker_rooms: true,
      parking: true,
      spectator_seating: true,
      water_fountain: true
    },
    images: [
      'https://placehold.co/600x400/orange/white?text=Basketball+Court',
      'https://placehold.co/600x400/orange/white?text=Basketball+Court+2'
    ],
    hourly_price: 60,
    half_day_price: 160,
    full_day_price: 280,
    sport_type: 'Basketball',
    capacity: 10,
    created_at: '2023-08-02T00:00:00Z',
    updated_at: '2023-08-02T00:00:00Z'
  }
];

// Mock data for bookings
let mockBookings: VenueBooking[] = [
  {
    id: '1',
    venue_id: '1',
    user_id: 'user123',
    booking_date: new Date().toISOString().split('T')[0],
    start_time: '09:00:00',
    end_time: '11:00:00',
    total_price: 90,
    status: 'confirmed',
    payment_status: 'paid',
    payment_id: 'pay_123456',
    notes: 'Please prepare the court in advance',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    venue_id: '2',
    user_id: 'user456',
    booking_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '14:00:00',
    end_time: '16:00:00',
    total_price: 120,
    status: 'completed',
    payment_status: 'paid',
    payment_id: 'pay_789012',
    notes: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock data for equipment
let mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Wilson Pro Tennis Racket',
    description: 'High-performance tennis racket for professional players',
    brand: 'Wilson',
    category: 'Tennis',
    images: [
      'https://placehold.co/600x400/green/white?text=Tennis+Racket',
      'https://placehold.co/600x400/green/white?text=Tennis+Racket+2'
    ],
    daily_price: 35,
    weekly_price: 150,
    monthly_price: 450,
    stock_quantity: 10,
    owner_id: 'system',
    created_at: '2023-08-05T00:00:00Z',
    updated_at: '2023-08-05T00:00:00Z'
  },
  {
    id: '2',
    name: 'Spalding NBA Basketball',
    description: 'Official size and weight basketball for indoor and outdoor play',
    brand: 'Spalding',
    category: 'Basketball',
    images: [
      'https://placehold.co/600x400/orange/white?text=Basketball',
      'https://placehold.co/600x400/orange/white?text=Basketball+2'
    ],
    daily_price: 15,
    weekly_price: 60,
    monthly_price: 180,
    stock_quantity: 20,
    owner_id: 'system',
    created_at: '2023-08-06T00:00:00Z',
    updated_at: '2023-08-06T00:00:00Z'
  }
];

// Mock data for rentals
let mockRentals: EquipmentRental[] = [
  {
    id: '1',
    equipment_id: '1',
    user_id: 'user123',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 2,
    total_price: 75,
    status: 'confirmed',
    payment_status: 'paid',
    payment_id: 'pay_123456',
    notes: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    equipment_id: '2',
    user_id: 'user456',
    start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 1,
    total_price: 40,
    status: 'completed',
    payment_status: 'paid',
    payment_id: 'pay_789012',
    notes: 'Handle with care',
    created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock data for tutorials
let mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Tennis Basics',
    description: 'Learn the fundamentals of tennis',
    sport_category: 'Tennis',
    difficulty: 'beginner',
    instructor_id: 'instructor123',
    video_url: 'https://example.com/tennis-basics.mp4',
    thumbnail: 'https://placehold.co/600x400/green/white?text=Tennis+Basics',
    duration: 60,
    is_premium: false,
    created_at: '2023-08-10T00:00:00Z',
    updated_at: '2023-08-10T00:00:00Z'
  },
  {
    id: '2',
    title: 'Advanced Basketball Drills',
    description: 'Improve your basketball skills with advanced drills',
    sport_category: 'Basketball',
    difficulty: 'advanced',
    instructor_id: 'instructor456',
    video_url: 'https://example.com/basketball-drills.mp4',
    thumbnail: 'https://placehold.co/600x400/orange/white?text=Basketball+Drills',
    duration: 90,
    is_premium: true,
    created_at: '2023-08-11T00:00:00Z',
    updated_at: '2023-08-11T00:00:00Z'
  }
];

// Mock data for user tutorial progress
let mockUserTutorialProgress: UserTutorialProgress[] = [
  {
    id: '1',
    user_id: 'user123',
    tutorial_id: '1',
    current_lesson_id: 'lesson1',
    progress: 'in_progress',
    completed_lessons: 5,
    total_lessons: 10,
    last_accessed: new Date().toISOString(),
    completion_date: null,
    certificate_issued: false,
    created_at: '2023-08-15T00:00:00Z',
    updated_at: '2023-08-15T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user456',
    tutorial_id: '2',
    current_lesson_id: 'lesson2',
    progress: 'completed',
    completed_lessons: 10,
    total_lessons: 10,
    last_accessed: new Date().toISOString(),
    completion_date: new Date().toISOString(),
    certificate_issued: true,
    created_at: '2023-08-16T00:00:00Z',
    updated_at: '2023-08-16T00:00:00Z'
  }
];

// Mock data for notifications
let mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 'user123',
    title: 'Booking Confirmation',
    message: 'Your booking for Grand Tennis Court on 2023-08-20 has been confirmed.',
    is_read: false,
    type: 'booking',
    entity_type: 'venue',
    entity_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user456',
    title: 'Equipment Rental Reminder',
    message: 'Your rental for Spalding NBA Basketball is due on 2023-08-22.',
    is_read: false,
    type: 'rental',
    entity_type: 'equipment',
    entity_id: '2',
    created_at: new Date().toISOString()
  }
];

// Profile Management
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    // Mock implementation: return a default profile
    const mockProfile: Profile = {
      id: userId,
      username: 'mockuser',
      full_name: 'Mock User',
      avatar_url: 'https://placehold.co/200x200/blue/white?text=Mock+User',
      role: 'user',
      email: 'mock@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return mockProfile;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<Profile | null> => {
  try {
    // Mock implementation: update the mock profile data
    const mockProfile: Profile = {
      id: userId,
      username: profileData.username || 'mockuser',
      full_name: profileData.full_name || 'Mock User',
      avatar_url: profileData.avatar_url || 'https://placehold.co/200x200/blue/white?text=Mock+User',
      role: profileData.role || 'user',
      email: profileData.email || 'mock@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return mockProfile;
  } catch (error) {
    console.error('Failed to update profile:', error);
    return null;
  }
};

// Venue Management
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  try {
    // Mock implementation: return mock venues based on filters
    let filteredVenues = mockVenues;
    if (filters) {
      if (filters.sport_type && filters.sport_type !== 'All Sports') {
        filteredVenues = filteredVenues.filter(venue => venue.sport_type === filters.sport_type);
      }
      if (filters.location) {
        filteredVenues = filteredVenues.filter(venue => venue.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.minPrice !== undefined) {
        filteredVenues = filteredVenues.filter(venue => venue.hourly_price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        filteredVenues = filteredVenues.filter(venue => venue.hourly_price <= filters.maxPrice);
      }
    }
    return filteredVenues;
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    return [];
  }
};

export const getVenueById = async (venueId: string): Promise<Venue | null> => {
  try {
    // Mock implementation: return a mock venue by ID
    const mockVenue = mockVenues.find(venue => venue.id === venueId);
    return mockVenue || null;
  } catch (error) {
    console.error('Failed to fetch venue details:', error);
    return null;
  }
};

export const createVenue = async (venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>): Promise<Venue | null> => {
  try {
    // Mock implementation: create a mock venue
    const newVenue: Venue = {
      id: Date.now().toString(),
      owner_id: 'system',
      ...venue,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockVenues.push(newVenue);
    return newVenue;
  } catch (error) {
    console.error('Failed to create venue:', error);
    return null;
  }
};

export const updateVenue = async (venueId: string, venue: Partial<Venue>): Promise<Venue | null> => {
  try {
    // Mock implementation: update a mock venue
    const venueIndex = mockVenues.findIndex(v => v.id === venueId);
    if (venueIndex === -1) {
      throw new Error(`Venue with ID ${venueId} not found`);
    }
    mockVenues[venueIndex] = {
      ...mockVenues[venueIndex],
      ...venue,
      updated_at: new Date().toISOString()
    };
    return mockVenues[venueIndex];
  } catch (error) {
    console.error('Failed to update venue:', error);
    return null;
  }
};

export const deleteVenue = async (venueId: string): Promise<boolean> => {
  try {
    // Mock implementation: delete a mock venue
    mockVenues = mockVenues.filter(venue => venue.id !== venueId);
    return true;
  } catch (error) {
    console.error('Failed to delete venue:', error);
    return false;
  }
};

// Booking functions
export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBookingWithDetails | null> => {
  try {
    // Mock implementation: create a mock booking
    const newBooking: VenueBooking = {
      id: Date.now().toString(),
      ...booking,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockBookings.push(newBooking);

    // Transform to VenueBookingWithDetails
    const bookingWithDetails: VenueBookingWithDetails = {
      ...newBooking,
      venue_details: {
        name: 'Mock Venue',
        location: 'Mock Location',
        sport_type: 'Mixed',
        images: ['https://placehold.co/600x400/green/white?text=Mock+Venue']
      }
    };
    return bookingWithDetails;
  } catch (error) {
    console.error('Failed to create booking:', error);
    return null;
  }
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<VenueBooking | null> => {
  try {
    // Mock implementation: update booking status
    const bookingIndex = mockBookings.findIndex(booking => booking.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }
    mockBookings[bookingIndex].status = status;
    mockBookings[bookingIndex].updated_at = new Date().toISOString();
    return mockBookings[bookingIndex];
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return null;
  }
};

export const updateBookingPayment = async (bookingId: string, paymentId: string, paymentStatus: PaymentStatus = 'paid'): Promise<VenueBooking | null> => {
  try {
    // Find the booking by ID
    const bookingIndex = mockBookings.findIndex(booking => booking.id === bookingId);
    
    if (bookingIndex === -1) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }
    
    // Update booking payment info
    mockBookings[bookingIndex].payment_id = paymentId;
    mockBookings[bookingIndex].payment_status = paymentStatus;
    mockBookings[bookingIndex].updated_at = new Date().toISOString();
    
    return handleSuccess(mockBookings[bookingIndex], 'Payment updated successfully');
  } catch (error) {
    return handleError(error, 'Failed to update payment information');
  }
};

export const getUserBookings = async (userId: string): Promise<VenueBookingWithDetails[]> => {
  try {
    // Check if mockBookings exists and is not empty
    if (mockBookings.length === 0) {
      return getMockBookings(userId);
    }
    
    // Filter the mockBookings by user ID
    const userBookings = mockBookings.filter(booking => booking.user_id === userId);
    
    if (userBookings.length === 0) {
      return getMockBookings(userId);
    }
    
    // Transform to VenueBookingWithDetails
    return userBookings.map(booking => ({
      ...booking,
      venue_details: {
        name: 'Mock Venue',
        location: 'Mock Location',
        sport_type: 'Mixed',
        images: ['https://placehold.co/600x400/green/white?text=Mock+Venue']
      }
    }));
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return getMockBookings(userId);
  }
};

// Equipment Management
export const getEquipment = async (filters?: any): Promise<Equipment[]> => {
  try {
    // Mock implementation: return mock equipment based on filters
    let filteredEquipment = mockEquipment;
    if (filters) {
      if (filters.category) {
        filteredEquipment = filteredEquipment.filter(equipment => equipment.category === filters.category);
      }
      if (filters.brand) {
        filteredEquipment = filteredEquipment.filter(equipment => equipment.brand === filters.brand);
      }
      if (filters.maxPrice !== undefined) {
        filteredEquipment = filteredEquipment.filter(equipment => equipment.daily_price <= filters.maxPrice);
      }
    }
    return filteredEquipment;
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
    return [];
  }
};

export const getEquipmentById = async (equipmentId: string): Promise<Equipment | null> => {
  try {
    // Mock implementation: return a mock equipment by ID
    const mockEquipmentItem = mockEquipment.find(equipment => equipment.id === equipmentId);
    return mockEquipmentItem || null;
  } catch (error) {
    console.error('Failed to fetch equipment details:', error);
    return null;
  }
};

export const createEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Promise<Equipment | null> => {
  try {
    // Mock implementation: create a mock equipment
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      owner_id: 'system',
      ...equipment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockEquipment.push(newEquipment);
    return newEquipment;
  } catch (error) {
    console.error('Failed to create equipment:', error);
    return null;
  }
};

export const updateEquipment = async (equipmentId: string, equipment: Partial<Equipment>): Promise<Equipment | null> => {
  try {
    // Mock implementation: update a mock equipment
    const equipmentIndex = mockEquipment.findIndex(e => e.id === equipmentId);
    if (equipmentIndex === -1) {
      throw new Error(`Equipment with ID ${equipmentId} not found`);
    }
    mockEquipment[equipmentIndex] = {
      ...mockEquipment[equipmentIndex],
      ...equipment,
      updated_at: new Date().toISOString()
    };
    return mockEquipment[equipmentIndex];
  } catch (error) {
    console.error('Failed to update equipment:', error);
    return null;
  }
};

export const deleteEquipment = async (equipmentId: string): Promise<boolean> => {
  try {
    // Mock implementation: delete a mock equipment
    mockEquipment = mockEquipment.filter(equipment => equipment.id !== equipmentId);
    return true;
  } catch (error) {
    console.error('Failed to delete equipment:', error);
    return false;
  }
};

// Rental functions
export const createRental = async (rental: Omit<EquipmentRental, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentRentalWithDetails | null> => {
  try {
    // Mock implementation: create a mock rental
    const newRental: EquipmentRental = {
      id: Date.now().toString(),
      ...rental,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockRentals.push(newRental);

    // Transform to EquipmentRentalWithDetails
    const rentalWithDetails: EquipmentRentalWithDetails = {
      ...newRental,
      equipment_details: {
        id: '1',
        name: 'Mock Equipment',
        brand: 'Mock Brand',
        category: 'Mixed',
        images: ['https://placehold.co/600x400/green/white?text=Mock+Equipment']
      }
    };
    return rentalWithDetails;
  } catch (error) {
    console.error('Failed to create rental:', error);
    return null;
  }
};

export const getUserRentals = async (userId: string): Promise<EquipmentRentalWithDetails[]> => {
  try {
    // Mock implementation: return mock rentals for a user
    const userRentals = mockRentals.filter(rental => rental.user_id === userId);

    // Transform to EquipmentRentalWithDetails
    return userRentals.map(rental => ({
      ...rental,
      equipment_details: {
        id: '1',
        name: 'Mock Equipment',
        brand: 'Mock Brand',
        category: 'Mixed',
        images: ['https://placehold.co/600x400/green/white?text=Mock+Equipment']
      }
    }));
  } catch (error) {
    console.error('Failed to fetch rentals:', error);
    return [];
  }
};

export const updateRentalStatus = async (rentalId: string, status: BookingStatus): Promise<EquipmentRental | null> => {
  try {
    // Mock implementation: update rental status
    const rentalIndex = mockRentals.findIndex(rental => rental.id === rentalId);
    if (rentalIndex === -1) {
      throw new Error(`Rental with ID ${rentalId} not found`);
    }
    mockRentals[rentalIndex].status = status;
    mockRentals[rentalIndex].updated_at = new Date().toISOString();
    return mockRentals[rentalIndex];
  } catch (error) {
    console.error('Failed to update rental status:', error);
    return null;
  }
};

export const updateRentalPayment = async (rentalId: string, paymentId: string, paymentStatus: PaymentStatus = 'paid'): Promise<EquipmentRental | null> => {
  try {
    // Mock implementation: update rental payment
    const rentalIndex = mockRentals.findIndex(rental => rental.id === rentalId);
    if (rentalIndex === -1) {
      throw new Error(`Rental with ID ${rentalId} not found`);
    }
    mockRentals[rentalIndex].payment_id = paymentId;
    mockRentals[rentalIndex].payment_status = paymentStatus;
    mockRentals[rentalIndex].updated_at = new Date().toISOString();
    return mockRentals[rentalIndex];
  } catch (error) {
    console.error('Failed to update rental payment:', error);
    return null;
  }
};

// Tutorial Management
export const getTutorials = async (filters?: any): Promise<Tutorial[]> => {
  try {
    // Mock implementation: return mock tutorials based on filters
    let filteredTutorials = mockTutorials;
    if (filters) {
      if (filters.sport_category) {
        filteredTutorials = filteredTutorials.filter(tutorial => tutorial.sport_category === filters.sport_category);
      }
      if (filters.difficulty) {
        filteredTutorials = filteredTutorials.filter(tutorial => tutorial.difficulty === filters.difficulty);
      }
      if (filters.isPremium !== undefined) {
        filteredTutorials = filteredTutorials.filter(tutorial => tutorial.is_premium === filters.isPremium);
      }
    }
    return filteredTutorials;
  } catch (error) {
    console.error('Failed to fetch tutorials:', error);
    return [];
  }
};

export const getTutorialById = async (tutorialId: string): Promise<TutorialWithLessons | null> => {
  try {
    // Mock implementation: return a mock tutorial by ID
    const mockTutorial = mockTutorials.find(tutorial => tutorial.id === tutorialId);

    // Mock lessons
    const mockLessons: TutorialLesson[] = [
      {
        id: 'lesson1',
        tutorial_id: tutorialId,
        title: 'Lesson 1',
        description: 'Introduction',
        video_url: 'https://example.com/lesson1.mp4',
        duration: 30,
        sequence_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 'lesson2',
        tutorial_id: tutorialId,
        title: 'Lesson 2',
        description: 'Advanced Techniques',
        video_url: 'https://example.com/lesson2.mp4',
        duration: 45,
        sequence_order: 2,
        created_at: new Date().toISOString()
      }
    ];

    const tutorialWithLessons: TutorialWithLessons = {
      ...mockTutorial,
      lessons: mockLessons
    };
    return tutorialWithLessons;
  } catch (error) {
    console.error('Failed to fetch tutorial details:', error);
    return null;
  }
};

export const getUserTutorialProgress = async (userId: string, tutorialId: string): Promise<UserTutorialProgress | null> => {
  try {
    // Mock implementation: return mock user tutorial progress
    const mockProgress = mockUserTutorialProgress.find(progress => progress.user_id === userId && progress.tutorial_id === tutorialId);
    return mockProgress || null;
  } catch (error) {
    console.error('Failed to fetch tutorial progress:', error);
    return null;
  }
};

export const updateTutorialProgress = async (
  userId: string,
  tutorialId: string,
  currentLessonId: string,
  progress: TutorialProgress,
  completedLessons: number
): Promise<UserTutorialProgress | null> => {
  try {
    // Mock implementation: update mock tutorial progress
    const progressIndex = mockUserTutorialProgress.findIndex(progress => progress.user_id === userId && progress.tutorial_id === tutorialId);
    if (progressIndex === -1) {
      throw new Error(`Tutorial progress not found for user ${userId} and tutorial ${tutorialId}`);
    }
    mockUserTutorialProgress[progressIndex].current_lesson_id = currentLessonId;
    mockUserTutorialProgress[progressIndex].progress = progress;
    mockUserTutorialProgress[progressIndex].completed_lessons = completedLessons;
    mockUserTutorialProgress[progressIndex].updated_at = new Date().toISOString();
    return mockUserTutorialProgress[progressIndex];
  } catch (error) {
    console.error('Failed to update tutorial progress:', error);
    return null;
  }
};

// Notifications
export const getUserNotifications = async (userId: string, limit: number = 10): Promise<Notification[]> => {
  try {
    // Mock implementation: return mock notifications for a user
    const userNotifications = mockNotifications.filter(notification => notification.user_id === userId);
    return userNotifications.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // Mock implementation: mark a notification as read
    const notificationIndex = mockNotifications.findIndex(notification => notification.id === notificationId);
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${notificationId} not found`);
    }
    mockNotifications[notificationIndex].is_read = true;
    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    // Mock implementation: mark all notifications as read for a user
    mockNotifications.forEach(notification => {
      if (notification.user_id === userId) {
        notification.is_read = true;
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }
};

export const subscribeToUserNotifications = (
  userId: string,
  callback: (payload: { new: Notification }) => void
): (() => void) => {
  // Mock implementation: simulate a subscription
  console.log(`Subscribed to notifications for user ${userId}`);
  return () => {
    console.log(`Unsubscribed from notifications for user ${userId}`);
  };
};

// Storage API
export const getImageUrl = (path: string): string => {
  // Mock implementation: return a placeholder image URL
