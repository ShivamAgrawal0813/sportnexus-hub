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
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
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
    return handleError(error, 'Failed to fetch venues') || [];
  }
};

export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBookingWithDetails | null> => {
  try {
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
    const { data, error } = await supabase
      .from('venue_bookings')
      .insert({
        ...booking,
        status: 'pending',
        payment_status: 'pending',
        created_at: now,
        updated_at: now
      })
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
    return handleError(error, 'Failed to fetch your bookings') || [];
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
    return handleError(error, 'Failed to fetch equipment') || [];
  }
};

export const createRental = async (rental: Omit<EquipmentRental, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentRentalWithDetails | null> => {
  try {
    // First, check equipment availability
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', rental.equipment_id)
      .single();
    
    if (equipmentError) throw equipmentError;
    
    if (!equipment || equipment.available_quantity < rental.quantity) {
      toast.error('Not enough equipment available for the requested quantity');
      return null;
    }
    
    // Create the rental
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('equipment_rentals')
      .insert({
        ...rental,
        status: 'pending',
        payment_status: 'pending',
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update equipment available quantity
    const { error: updateError } = await supabase
      .from('equipment')
      .update({ 
        available_quantity: equipment.available_quantity - rental.quantity,
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
    return handleError(error, 'Failed to fetch your rentals') || [];
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
    return handleError(error, 'Failed to fetch tutorials') || [];
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
      .single();
    
    if (error) {
      // If no progress exists, return null without error
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    return handleError(error, 'Failed to fetch tutorial progress');
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
      .single();
    
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
    return handleError(error, 'Failed to fetch notifications') || [];
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
