import { Database } from '@/integrations/supabase/database.types';
import { Json } from '@/integrations/supabase/database.types';

// Define the Profile type based on the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Export enum types from the database
export type BookingStatus = Database['public']['Enums']['booking_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type UserRole = Database['public']['Enums']['user_role'];
export type TutorialDifficulty = Database['public']['Enums']['tutorial_difficulty'];
export type TutorialProgress = Database['public']['Enums']['tutorial_progress'];

// Export table types from the database
export type Venue = Database['public']['Tables']['venues']['Row'];
export type VenueAvailability = Database['public']['Tables']['venue_availability']['Row'];
export type VenueBooking = Database['public']['Tables']['venue_bookings']['Row'];
export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type EquipmentRental = Database['public']['Tables']['equipment_rentals']['Row'];
export type Tutorial = Database['public']['Tables']['tutorials']['Row'];
export type TutorialLesson = Database['public']['Tables']['tutorial_lessons']['Row'];
export type UserTutorialProgress = Database['public']['Tables']['user_tutorial_progress']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Additional view types for the UI
export interface VenueWithAvailability extends Venue {
  availabilities?: VenueAvailability[];
}

export interface VenueBookingWithDetails extends VenueBooking {
  venue_details?: {
    name: string;
    location: string;
    sport_type: string;
    images: string[];
  };
}

export interface EquipmentRentalWithDetails extends EquipmentRental {
  equipment_details?: {
    name: string;
    brand: string;
    category: string;
    images: string[];
  };
}

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
