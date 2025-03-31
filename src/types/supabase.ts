
import { Database } from '@/integrations/supabase/types';

// Define the Profile type based on the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  role?: UserRole;
};

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type UserRole = 'user' | 'venue_owner' | 'admin';
export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TutorialProgress = 'not_started' | 'in_progress' | 'completed';

export interface Venue {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location: string;
  address: string;
  amenities: any | null;
  images: string[] | null;
  hourly_price: number;
  half_day_price: number | null;
  full_day_price: number | null;
  sport_type: string;
  capacity: number | null;
  created_at: string;
  updated_at: string;
}

export interface VenueAvailability {
  id: string;
  venue_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface VenueBooking {
  id: string;
  venue_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Add this optional property to fix the type error in UserBookingList
  venue_details?: {
    name: string;
    location: string;
    sport_type: string;
    images: string[];
  };
}

export interface Equipment {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  category: string;
  brand: string;
  images: string[] | null;
  hourly_price: number;
  daily_price: number;
  weekly_price: number;
  total_quantity: number;
  available_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface EquipmentRental {
  id: string;
  equipment_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  quantity: number;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string | null;
  sport_category: string;
  difficulty: TutorialDifficulty;
  instructor_id: string | null;
  video_url: string | null;
  duration: number | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export interface TutorialLesson {
  id: string;
  tutorial_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: number | null;
  sequence_order: number;
  created_at: string;
}

export interface UserTutorialProgress {
  id: string;
  user_id: string;
  tutorial_id: string;
  current_lesson_id: string | null;
  progress: TutorialProgress;
  completed_lessons: number;
  total_lessons: number;
  last_accessed: string;
  completion_date: string | null;
  certificate_issued: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}
