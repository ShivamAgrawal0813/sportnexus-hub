
import { toast } from '@/hooks/use-toast';
import { 
  BookingStatus, 
  Equipment, 
  EquipmentRental, 
  Notification, 
  Profile, 
  Tutorial, 
  TutorialLesson, 
  UserRole, 
  UserTutorialProgress, 
  Venue, 
  VenueAvailability, 
  VenueBooking 
} from '@/types/supabase';
import { Json } from '@/integrations/supabase/database.types';

// Mock data generators for development
export const generateMockId = (): string => `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export const generateMockVenue = (overrides: Partial<Venue> = {}): Venue => ({
  id: overrides.id || generateMockId(),
  owner_id: overrides.owner_id || 'default-owner',
  name: overrides.name || 'Sample Venue',
  description: overrides.description || 'A great venue for sports',
  location: overrides.location || 'New York, NY',
  address: overrides.address || '123 Main St',
  amenities: overrides.amenities || { wifi: true, parking: true },
  images: overrides.images || ['https://via.placeholder.com/300'],
  hourly_price: overrides.hourly_price || 50,
  half_day_price: overrides.half_day_price || 200,
  full_day_price: overrides.full_day_price || 350,
  sport_type: overrides.sport_type || 'basketball',
  capacity: overrides.capacity || 20,
  status: overrides.status || 'active', // Add status field
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
});

export const generateMockProfile = (overrides: Partial<Profile> = {}): Profile => ({
  // Use the properties from the Database type definition
  id: overrides.id || generateMockId(),
  username: overrides.username || 'user123',
  full_name: overrides.full_name || 'John Doe',
  avatar_url: overrides.avatar_url || null,
  phone: overrides.phone || null, // Add required phone field
  preferences: overrides.preferences || null, // Add required preferences field
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
  // Add the role which is our extension
  role: overrides.role || 'user'
});

export const generateMockBooking = (overrides: Partial<VenueBooking> = {}): VenueBooking => ({
  id: overrides.id || generateMockId(),
  venue_id: overrides.venue_id || generateMockId(),
  user_id: overrides.user_id || generateMockId(),
  booking_date: overrides.booking_date || new Date().toISOString().split('T')[0],
  start_time: overrides.start_time || '10:00:00',
  end_time: overrides.end_time || '12:00:00',
  total_price: overrides.total_price || 100,
  status: overrides.status || 'pending',
  payment_status: overrides.payment_status || 'pending',
  payment_id: overrides.payment_id || null,
  notes: overrides.notes || null,
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
  venue_details: overrides.venue_details || {
    name: 'Sample Venue',
    location: 'New York, NY',
    sport_type: 'basketball',
    images: ['https://via.placeholder.com/300']
  }
});

export const generateMockEquipment = (overrides: Partial<Equipment> = {}): Equipment => ({
  id: overrides.id || generateMockId(),
  owner_id: overrides.owner_id || generateMockId(),
  name: overrides.name || 'Basketball',
  description: overrides.description || 'Professional basketball in great condition',
  category: overrides.category || 'ball',
  brand: overrides.brand || 'Nike',
  images: overrides.images || ['https://via.placeholder.com/300'],
  hourly_price: overrides.hourly_price || 5,
  daily_price: overrides.daily_price || 20,
  weekly_price: overrides.weekly_price || 80,
  total_quantity: overrides.total_quantity || 10,
  available_quantity: overrides.available_quantity || 8,
  status: overrides.status || 'available', // Add status field
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
});

export const generateMockRental = (overrides: Partial<EquipmentRental> = {}): EquipmentRental => ({
  id: overrides.id || generateMockId(),
  equipment_id: overrides.equipment_id || generateMockId(),
  user_id: overrides.user_id || generateMockId(),
  start_date: overrides.start_date || new Date().toISOString().split('T')[0],
  end_date: overrides.end_date || new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
  quantity: overrides.quantity || 1,
  total_price: overrides.total_price || 20,
  status: overrides.status || 'pending',
  payment_status: overrides.payment_status || 'pending',
  payment_id: overrides.payment_id || null,
  notes: overrides.notes || null,
  created_at: overrides.created_at || new Date().toISOString(),
  updated_at: overrides.updated_at || new Date().toISOString(),
});

// Helper functions for API error handling
export const handleError = (error: any, message: string = 'An error occurred'): null => {
  console.error(`${message}:`, error);
  toast.error(message);
  return null;
};

export const handleSuccess = <T>(data: T, message?: string): T => {
  if (message) {
    toast.success(message);
  }
  return data;
};
