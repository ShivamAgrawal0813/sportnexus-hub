
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
  generateMockBooking, 
  generateMockEquipment, 
  generateMockRental, 
  generateMockVenue,
  generateMockId
} from './api-helper';

// Local storage keys for simulating database tables
const STORAGE_VENUES = 'sport_nexus_venues';
const STORAGE_BOOKINGS = 'sport_nexus_bookings';
const STORAGE_EQUIPMENT = 'sport_nexus_equipment';
const STORAGE_RENTALS = 'sport_nexus_rentals';

// Helper functions to get and set mock data
const getMockData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setMockData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize with some mock data if empty
const initMockData = () => {
  // Initialize venues
  if (!localStorage.getItem(STORAGE_VENUES)) {
    const mockVenues = [
      generateMockVenue({ name: 'Downtown Basketball Court', sport_type: 'basketball' }),
      generateMockVenue({ name: 'City Tennis Center', sport_type: 'tennis' }),
      generateMockVenue({ name: 'Riverside Soccer Field', sport_type: 'soccer' })
    ];
    setMockData(STORAGE_VENUES, mockVenues);
  }
  
  // Initialize equipment
  if (!localStorage.getItem(STORAGE_EQUIPMENT)) {
    const mockEquipment = [
      generateMockEquipment({ name: 'Basketball Set', category: 'ball' }),
      generateMockEquipment({ name: 'Tennis Racket', category: 'racket' }),
      generateMockEquipment({ name: 'Soccer Ball', category: 'ball' })
    ];
    setMockData(STORAGE_EQUIPMENT, mockEquipment);
  }
};

// Call initialization on module load
initMockData();

// Venue Management
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let venues = getMockData<Venue>(STORAGE_VENUES);
  
  // Apply filters
  if (filters) {
    if (filters.sport_type) {
      venues = venues.filter(v => v.sport_type === filters.sport_type);
    }
    if (filters.location) {
      venues = venues.filter(v => v.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.minPrice !== undefined) {
      venues = venues.filter(v => v.hourly_price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      venues = venues.filter(v => v.hourly_price <= filters.maxPrice);
    }
  }
  
  return venues;
};

// Venue Bookings
export const getUserBookings = async (userId: string): Promise<VenueBooking[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const bookings = getMockData<VenueBooking>(STORAGE_BOOKINGS);
  return bookings.filter(booking => booking.user_id === userId);
};

export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBooking | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const venues = getMockData<Venue>(STORAGE_VENUES);
  const venue = venues.find(v => v.id === booking.venue_id);
  
  if (!venue) {
    toast.error('Venue not found');
    return null;
  }
  
  const newBooking: VenueBooking = {
    id: generateMockId(),
    ...booking,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    venue_details: {
      name: venue.name,
      location: venue.location,
      sport_type: venue.sport_type,
      images: venue.images || []
    }
  };
  
  // Store to "database"
  const bookings = getMockData<VenueBooking>(STORAGE_BOOKINGS);
  bookings.push(newBooking);
  setMockData(STORAGE_BOOKINGS, bookings);
  
  toast.success('Booking created successfully');
  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<VenueBooking | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const bookings = getMockData<VenueBooking>(STORAGE_BOOKINGS);
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    toast.error('Booking not found');
    return null;
  }
  
  const updatedBooking = {
    ...bookings[bookingIndex],
    status,
    updated_at: new Date().toISOString()
  };
  
  // Update in "database"
  bookings[bookingIndex] = updatedBooking;
  setMockData(STORAGE_BOOKINGS, bookings);
  
  toast.success(`Booking ${status} successfully`);
  return updatedBooking;
};

// Equipment Rentals
export const createRental = async (rental: Omit<EquipmentRental, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentRental | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const equipment = getMockData<Equipment>(STORAGE_EQUIPMENT);
  const equipmentItem = equipment.find(e => e.id === rental.equipment_id);
  
  if (!equipmentItem) {
    toast.error('Equipment not found');
    return null;
  }
  
  if (equipmentItem.available_quantity < rental.quantity) {
    toast.error('Not enough equipment available');
    return null;
  }
  
  const newRental: EquipmentRental = {
    id: generateMockId(),
    ...rental,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Update equipment availability
  equipmentItem.available_quantity -= rental.quantity;
  const equipmentIndex = equipment.findIndex(e => e.id === rental.equipment_id);
  equipment[equipmentIndex] = equipmentItem;
  setMockData(STORAGE_EQUIPMENT, equipment);
  
  // Store rental
  const rentals = getMockData<EquipmentRental>(STORAGE_RENTALS);
  rentals.push(newRental);
  setMockData(STORAGE_RENTALS, rentals);
  
  toast.success('Equipment rental created successfully');
  return newRental;
};

export const getUserRentals = async (userId: string): Promise<EquipmentRental[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const rentals = getMockData<EquipmentRental>(STORAGE_RENTALS);
  return rentals.filter(rental => rental.user_id === userId);
};

// Re-export all functions from the mock implementation
export * from './api-mock';
