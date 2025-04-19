
import { Database } from '@/integrations/supabase/database.types';

// Define the Profile type based on the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type UserRole = 'user' | 'venue_owner' | 'admin';
export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TutorialProgress = 'not_started' | 'in_progress' | 'completed';

export type Venue = Database['public']['Tables']['venues']['Row'];
export type VenueAvailability = Database['public']['Tables']['venue_availability']['Row'];
export type VenueBooking = Database['public']['Tables']['venue_bookings']['Row'] & {
  venue_details?: {
    name: string;
    location: string;
    sport_type: string;
    images: string[];
  };
};

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type EquipmentRental = Database['public']['Tables']['equipment_rentals']['Row'] & {
  equipment_details?: {
    name: string;
    brand: string;
    category: string;
    images: string[];
  };
};

export type Tutorial = Database['public']['Tables']['tutorials']['Row'];
export type TutorialLesson = Database['public']['Tables']['tutorial_lessons']['Row'];
export type UserTutorialProgress = Database['public']['Tables']['user_tutorial_progress']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
