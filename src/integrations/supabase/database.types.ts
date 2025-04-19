
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      venues: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          location: string
          address: string
          amenities: Json | null
          images: string[] | null
          hourly_price: number
          half_day_price: number | null
          full_day_price: number | null
          sport_type: string
          capacity: number | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          location: string
          address: string
          amenities?: Json | null
          images?: string[] | null
          hourly_price: number
          half_day_price?: number | null
          full_day_price?: number | null
          sport_type: string
          capacity?: number | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          location?: string
          address?: string
          amenities?: Json | null
          images?: string[] | null
          hourly_price?: number
          half_day_price?: number | null
          full_day_price?: number | null
          sport_type?: string
          capacity?: number | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "venues_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      venue_availability: {
        Row: {
          id: string
          venue_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
        }
        Insert: {
          id?: string
          venue_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
        }
        Update: {
          id?: string
          venue_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "venue_availability_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      venue_bookings: {
        Row: {
          id: string
          venue_id: string
          user_id: string
          booking_date: string
          start_time: string
          end_time: string
          total_price: number
          status: string
          payment_status: string
          payment_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          user_id: string
          booking_date: string
          start_time: string
          end_time: string
          total_price: number
          status?: string
          payment_status?: string
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          venue_id?: string
          user_id?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          total_price?: number
          status?: string
          payment_status?: string
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      equipment: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          category: string
          brand: string
          images: string[] | null
          hourly_price: number
          daily_price: number
          weekly_price: number
          total_quantity: number
          available_quantity: number
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          category: string
          brand: string
          images?: string[] | null
          hourly_price: number
          daily_price: number
          weekly_price: number
          total_quantity?: number
          available_quantity?: number
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          category?: string
          brand?: string
          images?: string[] | null
          hourly_price?: number
          daily_price?: number
          weekly_price?: number
          total_quantity?: number
          available_quantity?: number
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      equipment_rentals: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          start_date: string
          end_date: string
          quantity: number
          total_price: number
          status: string
          payment_status: string
          payment_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          user_id: string
          start_date: string
          end_date: string
          quantity?: number
          total_price: number
          status?: string
          payment_status?: string
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          quantity?: number
          total_price?: number
          status?: string
          payment_status?: string
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_rentals_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_rentals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tutorials: {
        Row: {
          id: string
          title: string
          description: string | null
          sport_category: string
          difficulty: string
          instructor_id: string | null
          video_url: string | null
          duration: number | null
          thumbnail: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          sport_category: string
          difficulty: string
          instructor_id?: string | null
          video_url?: string | null
          duration?: number | null
          thumbnail?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          sport_category?: string
          difficulty?: string
          instructor_id?: string | null
          video_url?: string | null
          duration?: number | null
          thumbnail?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutorials_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tutorial_lessons: {
        Row: {
          id: string
          tutorial_id: string
          title: string
          description: string | null
          video_url: string | null
          duration: number | null
          sequence_order: number
          created_at: string
        }
        Insert: {
          id?: string
          tutorial_id: string
          title: string
          description?: string | null
          video_url?: string | null
          duration?: number | null
          sequence_order: number
          created_at?: string
        }
        Update: {
          id?: string
          tutorial_id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          duration?: number | null
          sequence_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutorial_lessons_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          }
        ]
      }
      user_tutorial_progress: {
        Row: {
          id: string
          user_id: string
          tutorial_id: string
          current_lesson_id: string | null
          progress: string
          completed_lessons: number
          total_lessons: number
          last_accessed: string
          completion_date: string | null
          certificate_issued: boolean
        }
        Insert: {
          id?: string
          user_id: string
          tutorial_id: string
          current_lesson_id?: string | null
          progress?: string
          completed_lessons?: number
          total_lessons?: number
          last_accessed?: string
          completion_date?: string | null
          certificate_issued?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          tutorial_id?: string
          current_lesson_id?: string | null
          progress?: string
          completed_lessons?: number
          total_lessons?: number
          last_accessed?: string
          completion_date?: string | null
          certificate_issued?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_tutorial_progress_current_lesson_id_fkey"
            columns: ["current_lesson_id"]
            isOneToOne: false
            referencedRelation: "tutorial_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tutorial_progress_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tutorial_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          type: string | null
          entity_type: string | null
          entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          type?: string | null
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          is_read?: boolean
          type?: string | null
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_equipment_availability: {
        Args: {
          equipment_id_param: string
          start_date_param: string
          end_date_param: string
          quantity_param: number
        }
        Returns: boolean
      }
      check_venue_booking_conflict: {
        Args: {
          venue_id_param: string
          booking_date_param: string
          start_time_param: string
          end_time_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
