
import { toast } from '@/hooks/use-toast';
import {
  Venue,
  VenueBooking,
  Equipment,
  EquipmentRental,
  Tutorial,
  TutorialLesson,
  UserTutorialProgress,
  Notification,
  BookingStatus
} from '@/types/supabase';
import { 
  mockVenues, 
  mockVenueBookings, 
  mockEquipment, 
  mockEquipmentRentals,
  mockTutorials,
  mockTutorialLessons,
  mockUserProgress,
  mockNotifications
} from './mock-data';

// Temporary mock implementations of API functions
// Note: These functions simulate the behavior of the real API functions
// with mock data until the Supabase database is fully configured

// Venue Management
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredVenues = [...mockVenues];
  
  if (filters) {
    if (filters.sport_type) {
      filteredVenues = filteredVenues.filter(v => v.sport_type === filters.sport_type);
    }
    if (filters.location) {
      filteredVenues = filteredVenues.filter(v => v.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.minPrice !== undefined) {
      filteredVenues = filteredVenues.filter(v => v.hourly_price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      filteredVenues = filteredVenues.filter(v => v.hourly_price <= filters.maxPrice);
    }
  }
  
  return filteredVenues;
};

// Venue Bookings
export const getUserBookings = async (userId: string): Promise<VenueBooking[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockVenueBookings.filter(booking => booking.user_id === userId);
};

export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBooking | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBooking: VenueBooking = {
    id: `booking_${Date.now()}`,
    ...booking,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    venue_details: mockVenues.find(v => v.id === booking.venue_id) ? {
      name: mockVenues.find(v => v.id === booking.venue_id)!.name,
      location: mockVenues.find(v => v.id === booking.venue_id)!.location,
      sport_type: mockVenues.find(v => v.id === booking.venue_id)!.sport_type,
      images: mockVenues.find(v => v.id === booking.venue_id)!.images || []
    } : undefined
  };
  
  // In a real implementation, we would push this to the database
  // For now, we're just returning the new booking
  toast.success('Booking created successfully');
  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<VenueBooking | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const bookingIndex = mockVenueBookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) {
    toast.error('Booking not found');
    return null;
  }
  
  const updatedBooking = {
    ...mockVenueBookings[bookingIndex],
    status,
    updated_at: new Date().toISOString()
  };
  
  // In a real implementation, we would update the database
  // For now, we're just returning the updated booking
  toast.success(`Booking ${status} successfully`);
  return updatedBooking;
};

// Equipment Rentals
export const createRental = async (rental: Omit<EquipmentRental, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentRental | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newRental: EquipmentRental = {
    id: `rental_${Date.now()}`,
    ...rental,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // In a real implementation, we would push this to the database
  // For now, we're just returning the new rental
  toast.success('Equipment rental created successfully');
  return newRental;
};

export const getUserRentals = async (userId: string): Promise<EquipmentRental[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockEquipmentRentals.filter(rental => rental.user_id === userId);
};

// Re-export all functions from the mock implementation
export * from './api-mock';
