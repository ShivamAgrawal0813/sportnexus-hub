
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type {
  Profile,
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
export const getVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching venues:', error);
    return [];
  }

  return data || [];
};

export const createBooking = async (booking: Partial<VenueBooking>): Promise<VenueBooking | null> => {
  // Remove the array wrap which was causing the type error
  const { data, error } = await supabase
    .from('venue_bookings')
    .insert(booking)
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    toast.error('Failed to create booking');
    return null;
  }

  toast.success('Booking created successfully');
  return data;
};

export const getUserBookings = async (userId: string): Promise<VenueBooking[]> => {
  const { data, error } = await supabase
    .from('venue_bookings')
    .select(`
      *,
      venue:venues (
        name,
        location,
        sport_type,
        images
      )
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  // Transform the data to match our expected format
  return data.map(booking => ({
    ...booking,
    venue_details: booking.venue as any
  }));
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
): Promise<VenueBooking | null> => {
  const { data, error } = await supabase
    .from('venue_bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    toast.error('Failed to update booking');
    return null;
  }

  toast.success('Booking updated successfully');
  return data;
};

// Equipment Management
export const getEquipment = async (): Promise<Equipment[]> => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }

  return data || [];
};

export const createRental = async (rental: Partial<EquipmentRental>): Promise<EquipmentRental | null> => {
  // Remove the array wrap which was causing the type error
  const { data, error } = await supabase
    .from('equipment_rentals')
    .insert(rental)
    .select()
    .single();

  if (error) {
    console.error('Error creating rental:', error);
    toast.error('Failed to create rental');
    return null;
  }

  toast.success('Rental created successfully');
  return data;
};

export const getUserRentals = async (userId: string): Promise<EquipmentRental[]> => {
  const { data, error } = await supabase
    .from('equipment_rentals')
    .select(`
      *,
      equipment (
        name,
        brand,
        category,
        images
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rentals:', error);
    return [];
  }

  return data || [];
};

// Tutorial Management
export const getTutorials = async (): Promise<Tutorial[]> => {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }

  return data || [];
};

export const getTutorialById = async (tutorialId: string): Promise<{
  tutorial: Tutorial;
  lessons: TutorialLesson[];
} | null> => {
  const { data: tutorial, error: tutorialError } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', tutorialId)
    .single();

  if (tutorialError) {
    console.error('Error fetching tutorial:', tutorialError);
    return null;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from('tutorial_lessons')
    .select('*')
    .eq('tutorial_id', tutorialId)
    .order('sequence_order', { ascending: true });

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError);
    return null;
  }

  return {
    tutorial,
    lessons: lessons || []
  };
};

export const getUserTutorialProgress = async (
  userId: string,
  tutorialId: string
): Promise<UserTutorialProgress | null> => {
  const { data, error } = await supabase
    .from('user_tutorial_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('tutorial_id', tutorialId)
    .single();

  if (error && error.code !== 'PGRST116') { // Not found error
    console.error('Error fetching tutorial progress:', error);
    return null;
  }

  return data || null;
};

export const updateTutorialProgress = async (
  userId: string,
  tutorialId: string,
  currentLessonId: string,
  progress: 'not_started' | 'in_progress' | 'completed',
  completedLessons: number
): Promise<UserTutorialProgress | null> => {
  const { data, error } = await supabase
    .from('user_tutorial_progress')
    .upsert({
      user_id: userId,
      tutorial_id: tutorialId,
      current_lesson_id: currentLessonId,
      progress,
      completed_lessons: completedLessons,
      last_accessed: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating tutorial progress:', error);
    return null;
  }

  return data;
};

// Notifications
export const getUserNotifications = async (userId: string, limit = 10): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }

  return true;
};

export const subscribeToUserNotifications = (
  userId: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel('notifications')
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

  return () => {
    subscription.unsubscribe();
  };
};

// Let's also create a file upload helper
export const uploadFile = async (
  file: File,
  bucket: string,
  path?: string
): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const filePath = path 
    ? `${path}/${Date.now()}.${fileExt}`
    : `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    toast.error('Failed to upload file');
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};
