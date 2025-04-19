import { Database } from '@/integrations/supabase/database.types';
import { Json } from '@/integrations/supabase/database.types';

// Define the Profile type based on the database schema
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'venue_owner' | 'admin';
  email: string | null;
  created_at: string;
  updated_at: string;
};


// Export enum types from the database
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type RentalStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type DatabasePaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type UserRole = Database['public']['Enums']['user_role'];
export type TutorialDifficulty = Database['public']['Enums']['tutorial_difficulty'];
export type TutorialProgress = Database['public']['Enums']['tutorial_progress'];

// Export table types from the database
export type Venue = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  amenities: Json | null;
  images: string[] | null;
  hourly_price: number;
  half_day_price: number | null;
  full_day_price: number | null;
  sport_type: string;
  capacity: number | null;
  created_at: string;
  updated_at: string;
};
export type VenueAvailability = Database['public']['Tables']['venue_availability']['Row'];
export type VenueBooking = {
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
};
export type Equipment = {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  category: string;
  images: string[] | null;
  daily_price: number;
  weekly_price: number | null;
  monthly_price: number | null;
  stock_quantity: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
};
export type EquipmentRental = {
  id: string;
  equipment_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  quantity: number;
  total_price: number;
  status: RentalStatus;
  payment_status: PaymentStatus;
  payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};export type Tutorial = Database['public']['Tables']['tutorials']['Row'];
export type TutorialLesson = Database['public']['Tables']['tutorial_lessons']['Row'];
export type UserTutorialProgress = Database['public']['Tables']['user_tutorial_progress']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Additional view types for the UI
export interface VenueWithAvailability extends Venue {
  availabilities?: VenueAvailability[];
}

export type VenueBookingWithDetails = VenueBooking & {
  venue_details: {
    name: string;
    location: string;
    sport_type: string;
    images: string[] | null;
  };
};

export type EquipmentRentalWithDetails = EquipmentRental & {
  equipment_details: {
    id: string;
    name: string;
    brand: string | null;
    category: string;
    images: string[] | null;
  };
};


export interface TutorialWithLessons extends Tutorial {
  lessons?: TutorialLesson[];
}

export interface UserTutorialProgressWithDetails extends UserTutorialProgress {
  tutorial?: {
    title: string;
    sport_category: string;
    difficulty: TutorialDifficulty;
    thumbnail: string | null;
  };
  current_lesson?: {
    title: string;
    sequence_order: number;
  };
}
