import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/database.types';
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

// Profile Management
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        return createDefaultProfile(userId);
      }
      
      return null;
    }
    
    // Explicitly map database response to Profile type
    const profile: Profile = {
      id: data.id,
      username: data.username,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      role: data.role,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return profile;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
};

const createDefaultProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log(`Creating default profile for user ${userId}`);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: null,
        full_name: null,
        avatar_url: null,
        role: 'user',
        email: null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating default profile:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }
    
    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create default profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    // Convert database response to Profile type
    const profile: Profile = {
      id: data.id,
      username: data.username,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      role: data.role,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return profile;
  } catch (error) {
    console.error('Failed to update profile:', error);
    return null;
  }
};

// Venue Management
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  try {
    let query = supabase.from('venues').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.sport_type && filters.sport_type !== 'All Sports') {
        query = query.eq('sport_type', filters.sport_type);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('hourly_price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('hourly_price', filters.maxPrice);
      }
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching venues:', error);
      return getMockVenues(); // Return mock data as fallback
    }
    
    if (!data || data.length === 0) {
      return getMockVenues(); // Return mock data if no real data exists
    }
    
    // Convert database result to Venue type
    return data.map(venue => ({
      id: venue.id,
      owner_id: venue.owner_id,
      name: venue.name,
      description: venue.description,
      location: venue.location,
      address: venue.address,
      amenities: venue.amenities as Json | null,
      images: venue.images,
      hourly_price: venue.hourly_price,
      half_day_price: venue.half_day_price,
      full_day_price: venue.full_day_price,
      sport_type: venue.sport_type,
      capacity: venue.capacity,
      created_at: venue.created_at,
      updated_at: venue.updated_at
    }));
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    return getMockVenues(); // Return mock data on error
  }
};

export const getVenueById = async (venueId: string): Promise<Venue | null> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single();
    
    if (error) throw error;
    return data as Venue;
  } catch (error) {
    return handleError(error, 'Failed to fetch venue details');
  }
};

export const createVenue = async (venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>): Promise<Venue | null> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .insert({
        ...venue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return handleSuccess(data, 'Venue created successfully');
  } catch (error) {
    return handleError(error, 'Failed to create venue');
  }
};

export const updateVenue = async (venueId: string, venue: Partial<Venue>): Promise<Venue | null> => {
  try {
    const updates = {
      ...venue,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', venueId)
      .select()
      .single();
    
    if (error) throw error;
    return handleSuccess(data, 'Venue updated successfully');
  } catch (error) {
    return handleError(error, 'Failed to update venue');
  }
};

export const deleteVenue = async (venueId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', venueId);
    
    if (error) throw error;
    toast.success('Venue deleted successfully');
    return true;
  } catch (error) {
    handleError(error, 'Failed to delete venue');
    return false;
  }
};

export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBookingWithDetails | null> => {
  try {
    // Ensure required fields are present
    if (!booking.venue_id || !booking.user_id || !booking.booking_date || 
        !booking.start_time || !booking.end_time || !booking.total_price) {
      throw new Error('Missing required booking fields');
    }

    // First, check for booking conflicts
    const { data: existingBookings, error: conflictError } = await supabase
      .from('venue_bookings')
      .select('*')
      .eq('venue_id', booking.venue_id)
      .eq('booking_date', booking.booking_date)
      .or(`start_time.lte.${booking.end_time},end_time.gte.${booking.start_time}`);
    
    if (conflictError) throw conflictError;
    
    if (existingBookings && existingBookings.length > 0) {
      toast.error('This time slot is already booked. Please select another time.');
      return null;
    }
    
    // Map PaymentStatus to database enum values
    let dbStatus: string = booking.status || 'pending';
    // Convert to string literals that match the database enum
    if (dbStatus === 'confirmed' || dbStatus === 'pending' || 
        dbStatus === 'cancelled' || dbStatus === 'completed') {
      // Valid values, use as is
    } else {
      dbStatus = 'pending'; // Fallback
    }
    
    let dbPaymentStatus: string = 'pending';
    if (booking.payment_status === 'paid') {
      dbPaymentStatus = 'completed';
    } else if (booking.payment_status === 'pending' || 
               booking.payment_status === 'refunded' || 
               booking.payment_status === 'failed') {
      dbPaymentStatus = booking.payment_status;
    }

    // Create booking with valid database enum values
    const { data, error } = await supabase
      .from('venue_bookings')
      .insert([{
        venue_id: booking.venue_id,
        user_id: booking.user_id,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        total_price: booking.total_price,
        status: dbStatus,
        payment_status: dbPaymentStatus,
        payment_id: booking.payment_id,
        notes: booking.notes
      }] as any)
      .select()
      .single();
    
    if (error) throw error;
    
    // Get venue details to return with the booking
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('name, location, sport_type, images')
      .eq('id', booking.venue_id)
      .single();
    
    if (venueError) throw venueError;
    
    // Map database response to application type
    const appPaymentStatus: PaymentStatus = 
      data.payment_status === 'completed' ? 'paid' : 
      (data.payment_status === 'pending' || 
       data.payment_status === 'refunded' || 
       data.payment_status === 'failed' ? 
        data.payment_status as PaymentStatus : 'pending');
    
    const bookingWithDetails: VenueBookingWithDetails = {
      id: data.id,
      venue_id: data.venue_id,
      user_id: data.user_id,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      total_price: data.total_price,
      status: data.status as BookingStatus,
      payment_status: appPaymentStatus,
      payment_id: data.payment_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      venue_details: {
        name: venue.name,
        location: venue.location,
        sport_type: venue.sport_type,
        images: venue.images || []
      }
    };
    
    console.log('Booking data:', data);
    console.log('Venue details:', venue);
    
    return handleSuccess(bookingWithDetails, 'Booking created successfully');
  } catch (error) {
    return handleError(error, 'Failed to create booking');
  }
};

// Booking functions
export const getUserBookings = async (userId: string): Promise<VenueBookingWithDetails[]> => {
  try {
    // First check if the table exists
    const { error: checkError } = await supabase
      .from('venue_bookings')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Table check error:', checkError);
      return getMockBookings(userId);
    }
    
    // If table exists, proceed with query
    const { data, error } = await supabase
      .from('venue_bookings')
      .select(`
        *,
        venues:venue_id (
          name,
          location,
          sport_type,
          images
        )
      `)
      .eq('user_id', userId)
      .order('booking_date', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch bookings:', error);
      return getMockBookings(userId);
    }
    
    if (!data || data.length === 0) {
      return getMockBookings(userId);
    }
    
    // Transform data and return with correct type mapping
    return data.map(booking => ({
      id: booking.id,
      venue_id: booking.venue_id,
      user_id: booking.user_id,
      booking_date: booking.booking_date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      total_price: booking.total_price,
      status: booking.status as BookingStatus,
      payment_status: booking.payment_status === 'completed' ? 'paid' : booking.payment_status as PaymentStatus,
      payment_id: booking.payment_id,
      notes: booking.notes,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      venue_details: {
        name: booking.venues?.name || 'Unknown Venue',
        location: booking.venues?.location || 'Unknown Location',
        sport_type: booking.venues?.sport_type || 'Unknown Sport',
        images: booking.venues?.images || []
      }
    }));
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return getMockBookings(userId);
  }
};

// Mock data functions (implement these with your own mock data)
function getMockVenues(): Venue[] {
  return [
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
}

function getMockBookings(userId: string): VenueBookingWithDetails[] {
  return [
    {
      id: '1',
      venue_id: '1',
      user_id: userId,
      booking_date: new Date().toISOString().split('T')[0],
      start_time: '09:00:00',
      end_time: '11:00:00',
      total_price: 90,
      status: 'confirmed',
      payment_status: 'paid',
      payment_id: 'pay_123456',
      notes: 'Please prepare the court in advance',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      venue_details: {
        name: 'Grand Tennis Court',
        location: 'Downtown Sports Center',
        sport_type: 'Tennis',
        images: ['https://placehold.co/600x400/green/white?text=Tennis+Court']
      }
    },
    {
      id: '2',
      venue_id: '2',
      user_id: userId,
      booking_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      start_time: '14:00:00',
      end_time: '16:00:00',
      total_price: 120,
      status: 'completed',
      payment_status: 'paid',
      payment_id: 'pay_789012',
      notes: null,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      venue_details: {
        name: 'Indoor Basketball Court',
        location: 'West Side Gym',
        sport_type: 'Basketball',
        images: ['https://placehold.co/600x400/orange/white?text=Basketball+Court']
      }
    }
  ];
}

function getMockRentals(userId: string): EquipmentRentalWithDetails[] {
  return [
    {
      id: '1',
      equipment_id: '1',
      user_id: userId,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 2,
      total_price: 75,
      status: 'confirmed',
      payment_status: 'paid',
      payment_id: 'pay_123456',
      notes: null,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      equipment_details: {
        id: '1',
        name: 'Wilson Pro Tennis Racket',
        brand: 'Wilson',
        category: 'Tennis',
        images: ['https://placehold.co/600x400/green/white?text=Tennis+Racket']
      }
    },
    {
      id: '2',
      equipment_id: '2',
      user_id: userId,
      start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 1,
      total_price: 40,
      status: 'completed',
      payment_status: 'paid',
      payment_id: 'pay_789012',
      notes: 'Handle with care',
      created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      equipment_details: {
        id: '2',
        name: 'Spalding NBA Basketball',
        brand: 'Spalding',
        category: 'Basketball',
        images: ['https://placehold.co/600x400/orange/white?text=Basketball']
      }
    }
  ];
}

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<VenueBooking | null> => {
  try {
    const { data, error } = await supabase
      .from('venue_bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    
    return handleSuccess(data as VenueBooking, `Booking ${status} successfully`);
  } catch (error) {
    return handleError(error, 'Failed to update booking status');
  }
};

export const updateBookingPayment = async (bookingId: string, paymentId: string, paymentStatus: PaymentStatus = 'paid'): Promise<VenueBooking | null> => {
  try {
    // Map PaymentStatus to database enum value
    const dbPaymentStatus = paymentStatus === 'paid' ? 'completed' : paymentStatus;
    
    const { data, error } = await supabase
      .from('venue_bookings')
      .update({ 
        payment_id: paymentId,
        payment_status: dbPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map database response to VenueBooking
    const booking: VenueBooking = {
      id: data.id,
      venue_id: data.venue_id,
      user_id: data.user_id,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      total_price: data.total_price,
      status: data.status as BookingStatus,
      payment_status: data.payment_status === 'completed' ? 'paid' : data.payment_status as PaymentStatus,
      payment_id: data.payment_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return handleSuccess(booking, 'Payment updated successfully');
  } catch (error) {
    return handleError(error, 'Failed to update payment information');
  }
};

// Equipment Management
export const getEquipment = async (filters?: any): Promise<Equipment[]> => {
  try {
    let query = supabase.from('equipment').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('daily_price', filters.maxPrice);
      }
      if (filters.available) {
        query = query.gt('available_quantity', 0);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as unknown as Equipment[];
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }
};

export const getEquipmentById = async (equipmentId: string): Promise<Equipment | null> => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', equipmentId)
      .single();
    
    if (error) throw error;
    return data as unknown as Equipment;
  } catch (error) {
    return handleError(error, 'Failed to fetch equipment details');
  }
};

export const createEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Promise<Equipment | null> => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .insert([{
        ...equipment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }] as any)
      .select()
      .single();
    
    if (error) throw error;
    return handleSuccess(data as unknown as Equipment, 'Equipment created successfully');
  } catch (error) {
    return handleError(error, 'Failed to create equipment');
  }
};

export const updateEquipment = async (equipmentId: string, equipment: Partial<Equipment>): Promise<Equipment | null> => {
  try {
    const updates = {
      ...equipment,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('equipment')
      .update(updates)
      .eq('id', equipmentId)
      .select()
      .single();
    
    if (error) throw error;
    return handleSuccess(data as unknown as Equipment, 'Equipment updated successfully');
  } catch (error) {
    return handleError(error, 'Failed to update equipment');
  }
};

export const deleteEquipment = async (equipmentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', equipmentId);
    
    if (error) throw error;
    toast.success('Equipment deleted successfully');
    return true;
  } catch (error) {
    handleError(error, 'Failed to delete equipment');
    return false;
  }
};

export const createRental = async (rental: Omit<EquipmentRental, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentRentalWithDetails | null> => {
  try {
    // Ensure required fields are present
    if (!rental.equipment_id || !rental.user_id || !rental.start_date || 
        !rental.end_date || !rental.total_price) {
      throw new Error('Missing required rental fields');
    }

    // First, check equipment availability
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', rental.equipment_id)
      .single();
    
    if (equipmentError) throw equipmentError;
    
    if (!equipment || equipment.available_quantity < (rental.quantity || 1)) {
      toast.error('Not enough equipment available for the requested quantity');
      return null;
    }
    
    // Create the rental
    const now = new Date().toISOString();
    const newRental = {
      ...rental,
      quantity: rental.quantity || 1,
      status: rental.status || 'pending',
      payment_status: rental.payment_status || 'pending',
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('equipment_rentals')
      .insert([newRental] as any)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update equipment available quantity
    const { error: updateError } = await supabase
      .from('equipment')
      .update({ 
        available_quantity: equipment.available_quantity - (rental.quantity || 1),
        updated_at: now
      })
      .eq('id', rental.equipment_id);
    
    if (updateError) throw updateError;
    
    // Get equipment details to return with the rental
    const rentalWithDetails = {
      ...data,
      equipment_details: {
        name: equipment.name,
        brand: equipment.brand,
        category: equipment.category,
        images: equipment.images || []
      }
    };
    
    return handleSuccess(rentalWithDetails as unknown as EquipmentRentalWithDetails, 'Rental created successfully');
  } catch (error) {
    return handleError(error, 'Failed to create rental');
  }
};

export const getUserRentals = async (userId: string): Promise<EquipmentRentalWithDetails[]> => {
  try {
    // First check if table exists
    const { error: checkError } = await supabase
      .from('equipment_rentals')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Table check error:', checkError);
      return getMockRentals(userId);
    }
    
    // If table exists, proceed with query
    const { data, error } = await supabase
      .from('equipment_rentals')
      .select(`
        *,
        equipment:equipment_id (
          id,
          name,
          brand,
          category,
          images
        )
      `)
      .eq('user_id', userId)
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch rentals:', error);
      return getMockRentals(userId);
    }
    
    if (!data || data.length === 0) {
      return getMockRentals(userId);
    }
    
    // Transform data and return
    return data.map(rental => ({
      ...rental,
      equipment_details: {
        id: rental.equipment?.id || 'unknown',
        name: rental.equipment?.name || 'Unknown Equipment',
        brand: rental.equipment?.brand || null,
        category: rental.equipment?.category || 'Unknown Category',
        images: rental.equipment?.images || []
      }
    })) as unknown as EquipmentRentalWithDetails[];
  } catch (error) {
    console.error('Failed to fetch rentals:', error);
    return getMockRentals(userId);
  }
};

export const updateRentalStatus = async (rentalId: string, status: BookingStatus): Promise<EquipmentRental | null> => {
  try {
    const { data, error } = await supabase
      .from('equipment_rentals')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', rentalId)
      .select()
      .single();
    
    if (error) throw error;
    
    return handleSuccess(data as unknown as EquipmentRental, `Rental ${status} successfully`);
  } catch (error) {
    return handleError(error, 'Failed to update rental status');
  }
};

export const updateRentalPayment = async (rentalId: string, paymentId: string, paymentStatus: PaymentStatus = 'paid'): Promise<EquipmentRental | null> => {
  try {
    // Map PaymentStatus to database enum value
    const dbPaymentStatus = paymentStatus === 'paid' ? 'completed' : paymentStatus;
    
    const { data, error } = await supabase
      .from('equipment_rentals')
      .update({ 
        payment_id: paymentId,
        payment_status: dbPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', rentalId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map database response to EquipmentRental
    const rental: EquipmentRental = {
      id: data.id,
      equipment_id: data.equipment_id,
      user_id: data.user_id,
      start_date: data.start_date,
      end_date: data.end_date,
      quantity: data.quantity,
      total_price: data.total_price,
      status: data.status as BookingStatus,
      payment_status: data.payment_status === 'completed' ? 'paid' : data.payment_status as PaymentStatus,
      payment_id: data.payment_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return handleSuccess(rental, 'Payment updated successfully');
  } catch (error) {
    return handleError(error, 'Failed to update payment information');
  }
};

// Tutorial Management
export const getTutorials = async (filters?: any): Promise<Tutorial[]> => {
  try {
    let query = supabase.from('tutorials').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.sport_category) {
        query = query.eq('sport_category', filters.sport_category);
      }
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters.isPremium !== undefined) {
        query = query.eq('is_premium', filters.isPremium);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Tutorial[];
  } catch (error) {
    console.error('Failed to fetch tutorials:', error);
    return [];
  }
};

export const getTutorialById = async (tutorialId: string): Promise<TutorialWithLessons | null> => {
  try {
    // Get tutorial details
    const { data: tutorial, error: tutorialError } = await supabase
      .from('tutorials')
      .select('*')
      .eq('id', tutorialId)
      .single();
    
    if (tutorialError) throw tutorialError;
    
    // Get all lessons for this tutorial
    const { data: lessons, error: lessonsError } = await supabase
      .from('tutorial_lessons')
      .select('*')
      .eq('tutorial_id', tutorialId)
      .order('sequence_order', { ascending: true });
    
    if (lessonsError) throw lessonsError;
    
    // Combine data
    const tutorialWithLessons: TutorialWithLessons = {
      ...tutorial,
      lessons: lessons
    };
    
    return tutorialWithLessons;
  } catch (error) {
    return handleError(error, 'Failed to fetch tutorial details');
  }
};

export const getUserTutorialProgress = async (userId: string, tutorialId: string): Promise<UserTutorialProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('user_tutorial_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('tutorial_id', tutorialId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no progress exists
    
    // Return null if no progress exists without error
    if (error) throw error;
    
    return data;
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
    // Check if a progress record already exists
    const { data: existingProgress, error: fetchError } = await supabase
      .from('user_tutorial_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('tutorial_id', tutorialId)
      .maybeSingle();
    
    const now = new Date().toISOString();
    
    // If progress exists, update it
    if (existingProgress) {
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .update({
          current_lesson_id: currentLessonId,
          progress,
          completed_lessons: completedLessons,
          last_accessed: now,
          completion_date: progress === 'completed' ? now : existingProgress.completion_date,
          updated_at: now
        })
        .eq('id', existingProgress.id)
        .select()
        .single();
      
      if (error) throw error;
      return handleSuccess(data, 'Progress updated');
    } 
    // If no progress exists, create a new record
    else {
      // Get total lessons count
      const { data: lessons, error: countError } = await supabase
        .from('tutorial_lessons')
        .select('id')
        .eq('tutorial_id', tutorialId);
      
      if (countError) throw countError;
      
      const totalLessons = lessons.length;
      
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .insert({
          user_id: userId,
          tutorial_id: tutorialId,
          current_lesson_id: currentLessonId,
          progress,
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          last_accessed: now,
          completion_date: progress === 'completed' ? now : null,
          certificate_issued: false,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();
      
      if (error) throw error;
      return handleSuccess(data, 'Progress saved');
    }
  } catch (error) {
    return handleError(error, 'Failed to update tutorial progress');
  }
};

// Notifications
export const getUserNotifications = async (userId: string, limit: number = 10): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'Failed to mark notification as read');
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'Failed to mark all notifications as read');
    return false;
  }
};

export const subscribeToUserNotifications = (
  userId: string,
  callback: (payload: { new: Notification }) => void
): (() => void) => {
  const subscription = supabase
    .channel('notifications-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Storage API
export const getImageUrl = (path: string): string => {
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
};

export const uploadImage = async (
  file: File,
  bucket: string,
  folder: string = ''
): Promise<UploadResult> => {
  try {
    // Check if bucket exists first
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      console.error(`Bucket '${bucket}' does not exist`);
      return { url: null, error: 'Bucket not found' };
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { url: null, error: 'Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.' };
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { url: null, error: 'File too large. Maximum size is 5MB.' };
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const filePath = folder 
      ? `${folder}/${Date.now()}.${fileExt}`
      : `${Date.now()}.${fileExt}`;
    
    console.log(`Uploading to ${bucket}/${filePath}`);
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return { url: null, error: error.message };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    return { url: null, error: error.message };
  }
};

// 1. First, enhance your existing auth checks to verify admin status
export const isAdmin = (profile: Profile | null): boolean => {
  return profile?.role === 'admin';
};

// 2. Create admin-only API functions to add content
export const addVenue = async (venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>, 
                               profile: Profile): Promise<Venue | null> => {
  try {
    // Check if user is admin
    if (!isAdmin(profile)) {
      toast.error('Unauthorized: Admin access required');
      return null;
    }
    
    // Add admin ID as owner
    const venueWithOwner = {
      ...venue,
      owner_id: profile.id
    };
    
    // Use your existing createVenue function
    return createVenue(venueWithOwner);
  } catch (error) {
    return handleError(error, 'Failed to add venue');
  }
};

// 3. Similar functions for equipment and tutorials
export const addEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>, 
                                  profile: Profile): Promise<Equipment | null> => {
  try {
    // Check if user is admin
    if (!isAdmin(profile)) {
      toast.error('Unauthorized: Admin access required');
      return null;
    }
    
    // Add admin ID as owner
    const equipmentWithOwner = {
      ...equipment,
      owner_id: profile.id
    };
    
    // Use your existing createEquipment function
    return createEquipment(equipmentWithOwner);
  } catch (error) {
    return handleError(error, 'Failed to add equipment');
  }
};

export const addTutorial = async (tutorial: Omit<Tutorial, 'id' | 'created_at' | 'updated_at'>, 
                                 profile: Profile): Promise<Tutorial | null> => {
  try {
    // Check if user is admin
    if (!isAdmin(profile)) {
      toast.error('Unauthorized: Admin access required');
      return null;
    }
    
    // Add admin ID as creator
    const tutorialWithCreator = {
      ...tutorial,
      creator_id: profile.id
    };
    
    // Create the tutorial
    const { data, error } = await supabase
      .from('tutorials')
      .insert([{
        ...tutorialWithCreator,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }] as any)
      .select()
      .single();
    
    if (error) throw error;
    return handleSuccess(data, 'Tutorial created successfully');
  } catch (error) {
    return handleError(error, 'Failed to add tutorial');
  }
};
