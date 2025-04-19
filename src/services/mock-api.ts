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
  TutorialProgress,
  TutorialWithLessons,
  Profile
} from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

// Mock data for venues
const mockVenues: Venue[] = [
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Grand Tennis Court',
    description: 'Professional tennis courts with top-quality surfaces',
    location: 'Downtown Sports Center',
    address: '123 Main St, Downtown',
    amenities: null,
    images: ['/placeholder.svg'],
    hourly_price: 25,
    half_day_price: 100,
    full_day_price: 180,
    sport_type: 'Tennis',
    capacity: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Olympic Swimming Pool',
    description: 'Olympic-sized swimming pool with 8 lanes',
    location: 'City Sports Complex',
    address: '456 Center Ave, Midtown',
    amenities: null,
    images: ['/placeholder.svg'],
    hourly_price: 15,
    half_day_price: 60,
    full_day_price: 110,
    sport_type: 'Swimming',
    capacity: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    owner_id: 'owner2',
    name: 'Premier Basketball Court',
    description: 'Indoor basketball court with professional flooring',
    location: 'Westside Recreation Center',
    address: '789 West Blvd, Westside',
    amenities: null,
    images: ['/placeholder.svg'],
    hourly_price: 30,
    half_day_price: 120,
    full_day_price: 220,
    sport_type: 'Basketball',
    capacity: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    owner_id: 'owner2',
    name: 'Indoor Soccer Field',
    description: 'Full-sized indoor soccer field with artificial turf',
    location: 'East Valley Sports Hub',
    address: '101 East St, Valley',
    amenities: null,
    images: ['/placeholder.svg'],
    hourly_price: 40,
    half_day_price: 160,
    full_day_price: 300,
    sport_type: 'Soccer',
    capacity: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    owner_id: 'owner3',
    name: 'Professional Golf Course',
    description: '18-hole professional golf course with amazing views',
    location: 'Green Valley Golf Club',
    address: '202 Green Valley Rd, Hillside',
    amenities: null,
    images: ['/placeholder.svg'],
    hourly_price: 50,
    half_day_price: 200,
    full_day_price: 380,
    sport_type: 'Golf',
    capacity: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    owner_id: 'owner3',
    name: 'Yoga & Fitness Studio',
    description: 'Peaceful studio for yoga and fitness classes',
    location: 'Mindful Movement Center',
    address: '303 Zen St, Peaceful Heights',
    amenities: null,
    images: ['/placeholder.svg'],
    hourly_price: 20,
    half_day_price: 80,
    full_day_price: 150,
    sport_type: 'Yoga',
    capacity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock bookings for the demo
const mockBookings: VenueBookingWithDetails[] = [
  {
    id: '1',
    user_id: 'user1',
    venue_id: '1',
    booking_date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '12:00',
    total_price: 50,
    status: 'confirmed',
    payment_status: 'paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    venue_details: {
      name: 'Grand Tennis Court',
      location: 'Downtown Sports Center',
      sport_type: 'Tennis',
      images: ['/placeholder.svg']
    }
  }
];

// Helper function for simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Venue Management
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  try {
    // Simulate API delay
    await delay(500);
    
    let venues = [...mockVenues];
    
    // Apply filters if provided
    if (filters) {
      if (filters.sport_type) {
        venues = venues.filter(venue => venue.sport_type.toLowerCase() === filters.sport_type.toLowerCase());
      }
      if (filters.location) {
        venues = venues.filter(venue => venue.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.minPrice !== undefined) {
        venues = venues.filter(venue => venue.hourly_price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        venues = venues.filter(venue => venue.hourly_price <= filters.maxPrice);
      }
    }
    
    // Return the filtered venues
    return venues;
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    toast.error('Failed to fetch venues');
    return [];
  }
};

export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBookingWithDetails | null> => {
  try {
    // Simulate API delay
    await delay(500);
    
    // Generate a new booking with mock data
    const newBooking: VenueBookingWithDetails = {
      id: Math.random().toString(36).substring(2, 11),
      ...booking,
      status: 'pending',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      venue_details: {
        name: mockVenues.find(v => v.id === booking.venue_id)?.name || 'Unknown Venue',
        location: mockVenues.find(v => v.id === booking.venue_id)?.location || 'Unknown Location',
        sport_type: mockVenues.find(v => v.id === booking.venue_id)?.sport_type || 'Unknown Sport',
        images: mockVenues.find(v => v.id === booking.venue_id)?.images || []
      }
    };
    
    // In a real app, we would save this to a database
    // For now, just return the new booking
    toast.success('Booking created successfully');
    return newBooking;
  } catch (error) {
    console.error('Failed to create booking:', error);
    toast.error('Failed to create booking');
    return null;
  }
};

export const getUserBookings = async (userId: string): Promise<VenueBookingWithDetails[]> => {
  try {
    // Simulate API delay
    await delay(500);
    
    // Return mock bookings for the user
    // In a real app, we would filter by user_id
    return mockBookings;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    toast.error('Failed to fetch your bookings');
    return [];
  }
}; 