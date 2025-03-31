
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  Profile,
  Venue,
  VenueAvailability,
  VenueBooking,
  Equipment,
  EquipmentRental,
  Tutorial,
  TutorialLesson,
  UserTutorialProgress,
  Notification,
  UserRole
} from '@/types/supabase';

// Profile Management
export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Profile updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    toast.error('Failed to update profile');
    return null;
  }
};

export const changeUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
    toast.success(`User role changed to ${role}`);
    return true;
  } catch (error: any) {
    console.error('Error changing user role:', error.message);
    toast.error('Failed to change user role');
    return false;
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
    return data || [];
  } catch (error: any) {
    console.error('Error fetching venues:', error.message);
    toast.error('Failed to load venues');
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
    return data;
  } catch (error: any) {
    console.error('Error fetching venue:', error.message);
    return null;
  }
};

export const createVenue = async (venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>): Promise<Venue | null> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .insert(venue)
      .select()
      .single();

    if (error) throw error;
    toast.success('Venue created successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating venue:', error.message);
    toast.error('Failed to create venue');
    return null;
  }
};

export const updateVenue = async (venueId: string, updates: Partial<Venue>): Promise<Venue | null> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', venueId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Venue updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error updating venue:', error.message);
    toast.error('Failed to update venue');
    return null;
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
  } catch (error: any) {
    console.error('Error deleting venue:', error.message);
    toast.error('Failed to delete venue');
    return false;
  }
};

// Venue Availability
export const getVenueAvailability = async (venueId: string): Promise<VenueAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('venue_availability')
      .select('*')
      .eq('venue_id', venueId);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching venue availability:', error.message);
    return [];
  }
};

export const addVenueAvailability = async (availability: Omit<VenueAvailability, 'id'>): Promise<VenueAvailability | null> => {
  try {
    const { data, error } = await supabase
      .from('venue_availability')
      .insert(availability)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error adding venue availability:', error.message);
    return null;
  }
};

// Venue Bookings
export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBooking | null> => {
  try {
    // First check if venue is available
    const { data: available, error: availabilityError } = await supabase
      .rpc('check_venue_availability', {
        venue_id: booking.venue_id,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time
      });

    if (availabilityError) throw availabilityError;

    if (!available) {
      toast.error('This venue is not available for the selected time slot');
      return null;
    }

    const { data, error } = await supabase
      .from('venue_bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    toast.success('Booking created successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating booking:', error.message);
    toast.error('Failed to create booking');
    return null;
  }
};

export const getUserBookings = async (userId: string): Promise<VenueBooking[]> => {
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
      .order('booking_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching user bookings:', error.message);
    return [];
  }
};

export const getVenueBookings = async (venueId: string): Promise<VenueBooking[]> => {
  try {
    const { data, error } = await supabase
      .from('venue_bookings')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('venue_id', venueId)
      .order('booking_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching venue bookings:', error.message);
    return [];
  }
};

export const updateBookingStatus = async (bookingId: string, status: VenueBooking['status']): Promise<VenueBooking | null> => {
  try {
    const { data, error } = await supabase
      .from('venue_bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    toast.success(`Booking ${status} successfully`);
    return data;
  } catch (error: any) {
    console.error('Error updating booking status:', error.message);
    toast.error('Failed to update booking');
    return null;
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
      if (filters.minPrice !== undefined) {
        query = query.gte('daily_price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('daily_price', filters.maxPrice);
      }
      // Only show equipment with available stock
      if (filters.onlyAvailable) {
        query = query.gt('available_quantity', 0);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching equipment:', error.message);
    toast.error('Failed to load equipment');
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
    return data;
  } catch (error: any) {
    console.error('Error fetching equipment:', error.message);
    return null;
  }
};

export const createEquipment = async (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Promise<Equipment | null> => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .insert(equipment)
      .select()
      .single();

    if (error) throw error;
    toast.success('Equipment created successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating equipment:', error.message);
    toast.error('Failed to create equipment');
    return null;
  }
};

// Equipment Rentals
export const createRental = async (rental: Omit<EquipmentRental, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentRental | null> => {
  try {
    // Check if equipment is available in sufficient quantity
    const { data: available, error: availabilityError } = await supabase
      .rpc('check_equipment_availability', {
        equipment_id: rental.equipment_id,
        start_date: rental.start_date,
        end_date: rental.end_date,
        quantity: rental.quantity
      });

    if (availabilityError) throw availabilityError;

    if (!available) {
      toast.error('This equipment is not available in sufficient quantity for the selected dates');
      return null;
    }

    const { data, error } = await supabase
      .from('equipment_rentals')
      .insert(rental)
      .select()
      .single();

    if (error) throw error;
    toast.success('Rental created successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating rental:', error.message);
    toast.error('Failed to create rental');
    return null;
  }
};

export const getUserRentals = async (userId: string): Promise<EquipmentRental[]> => {
  try {
    const { data, error } = await supabase
      .from('equipment_rentals')
      .select(`
        *,
        equipment:equipment_id (
          name,
          category,
          brand,
          images
        )
      `)
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching user rentals:', error.message);
    return [];
  }
};

// Tutorials Management
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
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching tutorials:', error.message);
    toast.error('Failed to load tutorials');
    return [];
  }
};

export const getTutorialById = async (tutorialId: string): Promise<{ tutorial: Tutorial, lessons: TutorialLesson[] } | null> => {
  try {
    // Get tutorial details
    const { data: tutorial, error: tutorialError } = await supabase
      .from('tutorials')
      .select('*')
      .eq('id', tutorialId)
      .single();

    if (tutorialError) throw tutorialError;

    // Get tutorial lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('tutorial_lessons')
      .select('*')
      .eq('tutorial_id', tutorialId)
      .order('sequence_order', { ascending: true });

    if (lessonsError) throw lessonsError;

    return { 
      tutorial,
      lessons: lessons || []
    };
  } catch (error: any) {
    console.error('Error fetching tutorial details:', error.message);
    return null;
  }
};

export const getUserTutorialProgress = async (userId: string, tutorialId: string): Promise<UserTutorialProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('user_tutorial_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('tutorial_id', tutorialId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching tutorial progress:', error.message);
    return null;
  }
};

export const updateTutorialProgress = async (
  userId: string,
  tutorialId: string,
  lessonId: string,
  progress: UserTutorialProgress['progress'],
  completedLessons: number
): Promise<UserTutorialProgress | null> => {
  try {
    // Check if a progress record exists
    const { data: existingProgress } = await supabase
      .from('user_tutorial_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('tutorial_id', tutorialId)
      .maybeSingle();

    let result;
    
    // Get total lesson count for this tutorial
    const { count } = await supabase
      .from('tutorial_lessons')
      .select('*', { count: 'exact', head: true })
      .eq('tutorial_id', tutorialId);
      
    const totalLessons = count || 1;

    // Add completion date if all lessons are completed
    const isCompleted = completedLessons >= totalLessons;
    const completionDate = isCompleted ? new Date().toISOString() : null;

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .update({
          current_lesson_id: lessonId,
          progress,
          completed_lessons: completedLessons,
          last_accessed: new Date().toISOString(),
          completion_date: completionDate,
          certificate_issued: isCompleted
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('user_tutorial_progress')
        .insert({
          user_id: userId,
          tutorial_id: tutorialId,
          current_lesson_id: lessonId,
          progress,
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          last_accessed: new Date().toISOString(),
          completion_date: completionDate,
          certificate_issued: isCompleted
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    if (isCompleted) {
      toast.success('Congratulations! You have completed this tutorial.');
    } else {
      toast.success('Progress updated');
    }

    return result;
  } catch (error: any) {
    console.error('Error updating tutorial progress:', error.message);
    toast.error('Failed to update progress');
    return null;
  }
};

// Notifications
export const getUserNotifications = async (userId: string, limit = 10): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching notifications:', error.message);
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
  } catch (error: any) {
    console.error('Error marking notification as read:', error.message);
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
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error.message);
    return false;
  }
};

// File upload helper
export const uploadImage = async (file: File, bucket: string, folder: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error.message);
    toast.error('Failed to upload image');
    return null;
  }
};

// Listen to real-time updates (example for bookings)
export const subscribeToBookingUpdates = (
  venueId: string,
  onInsert?: (payload: any) => void,
  onUpdate?: (payload: any) => void,
  onDelete?: (payload: any) => void
) => {
  const channel = supabase
    .channel('venue-bookings')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'venue_bookings',
        filter: `venue_id=eq.${venueId}`
      },
      (payload) => onInsert && onInsert(payload)
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'venue_bookings',
        filter: `venue_id=eq.${venueId}`
      },
      (payload) => onUpdate && onUpdate(payload)
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'venue_bookings',
        filter: `venue_id=eq.${venueId}`
      },
      (payload) => onDelete && onDelete(payload)
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

// Listen to notifications in real-time
export const subscribeToUserNotifications = (
  userId: string,
  onNotification: (payload: any) => void
) => {
  const channel = supabase
    .channel('user-notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => onNotification && onNotification(payload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
