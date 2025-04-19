import { supabase } from '@/integrations/supabase/client';
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

    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, 'Error fetching profile');
  }
};

export const updateUserProfile = async (userId: string, profile: Partial<Profile>): Promise<Profile | null> => {
  try {
    const updates = {
      ...profile,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return handleSuccess(data, 'Profile updated successfully');
  } catch (error) {
    return handleError(error, 'Failed to update profile');
  }
};

// Venue Management
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  try {
    let query = supabase.from('venues').select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.sport_type) {
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
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Venue[];
  } catch (error) {
    console.error('Error fetching venues:', error);
    // Still return an empty array to not break the UI
    return [];
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
    
    // If no conflicts, create the booking
    const now = new Date().toISOString();
    const newBooking = {
      ...booking,
      status: booking.status || 'pending',
      payment_status: booking.payment_status || 'pending',
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('venue_bookings')
      .insert(newBooking)
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
    
    const bookingWithDetails = {
      ...data,
      venue_details: {
        name: venue.name,
        location: venue.location,
        sport_type: venue.sport_type,
        images: venue.images || []
      }
    };
    
    return handleSuccess(bookingWithDetails, 'Booking created successfully');
  } catch (error) {
    return handleError(error, 'Failed to create booking');
  }
};

export const getUserBookings = async (userId: string): Promise<VenueBookingWithDetails[]> => {
  try {
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
    
    if (error) throw error;
    
    // Transform to expected format
    const formattedData = data.map(booking => ({
      ...booking,
      venue_details: {
        name: booking.venues.name,
        location: booking.venues.location,
        sport_type: booking.venues.sport_type,
        images: booking.venues.images || []
      }
    }));
    
    return formattedData as VenueBookingWithDetails[];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
};

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
    
    return handleSuccess(data, `Booking ${status} successfully`);
  } catch (error) {
    return handleError(error, 'Failed to update booking status');
  }
};

export const updateBookingPayment = async (bookingId: string, paymentId: string, paymentStatus: PaymentStatus = 'completed'): Promise<VenueBooking | null> => {
  try {
    const { data, error } = await supabase
      .from('venue_bookings')
      .update({ 
        payment_id: paymentId,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    
    return handleSuccess(data, 'Payment updated successfully');
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
    return data as Equipment[];
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
    return data as Equipment;
  } catch (error) {
    return handleError(error, 'Failed to fetch equipment details');
  }
};

export const createEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Promise<Equipment | null> => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .insert({
        ...equipment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return handleSuccess(data, 'Equipment created successfully');
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
    return handleSuccess(data, 'Equipment updated successfully');
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
      .insert(newRental)
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
    
    return handleSuccess(rentalWithDetails, 'Rental created successfully');
  } catch (error) {
    return handleError(error, 'Failed to create rental');
  }
};

export const getUserRentals = async (userId: string): Promise<EquipmentRentalWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('equipment_rentals')
      .select(`
        *,
        equipment:equipment_id (
          name,
          brand,
          category,
          images
        )
      `)
      .eq('user_id', userId)
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    
    // Transform to expected format
    const formattedData = data.map(rental => ({
      ...rental,
      equipment_details: {
        name: rental.equipment.name,
        brand: rental.equipment.brand,
        category: rental.equipment.category,
        images: rental.equipment.images || []
      }
    }));
    
    return formattedData as EquipmentRentalWithDetails[];
  } catch (error) {
    console.error('Failed to fetch rentals:', error);
    return [];
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
    
    return handleSuccess(data, `Rental ${status} successfully`);
  } catch (error) {
    return handleError(error, 'Failed to update rental status');
  }
};

export const updateRentalPayment = async (rentalId: string, paymentId: string, paymentStatus: PaymentStatus = 'completed'): Promise<EquipmentRental | null> => {
  try {
    const { data, error } = await supabase
      .from('equipment_rentals')
      .update({ 
        payment_id: paymentId,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', rentalId)
      .select()
      .single();
    
    if (error) throw error;
    
    return handleSuccess(data, 'Payment updated successfully');
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

export const uploadImage = async (bucket: string, path: string, file: File): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    return handleError(error, 'Failed to upload image');
  }
};
