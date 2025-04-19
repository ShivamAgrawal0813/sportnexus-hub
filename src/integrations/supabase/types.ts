export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      equipment: {
        Row: {
          brand: string | null
          category: string
          created_at: string | null
          daily_price: number
          description: string | null
          id: string
          images: string[] | null
          monthly_price: number | null
          name: string
          owner_id: string | null
          stock_quantity: number
          updated_at: string | null
          weekly_price: number | null
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string | null
          daily_price: number
          description?: string | null
          id?: string
          images?: string[] | null
          monthly_price?: number | null
          name: string
          owner_id?: string | null
          stock_quantity?: number
          updated_at?: string | null
          weekly_price?: number | null
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string | null
          daily_price?: number
          description?: string | null
          id?: string
          images?: string[] | null
          monthly_price?: number | null
          name?: string
          owner_id?: string | null
          stock_quantity?: number
          updated_at?: string | null
          weekly_price?: number | null
        }
        Relationships: []
      }
      equipment_rentals: {
        Row: {
          created_at: string | null
          end_date: string
          equipment_id: string | null
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string
          quantity: number
          start_date: string
          status: string
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          quantity?: number
          start_date: string
          status?: string
          total_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          quantity?: number
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_rentals_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      venue_bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string
          start_time: string
          status: string
          total_price: number
          updated_at: string | null
          user_id: string | null
          venue_id: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          start_time: string
          status?: string
          total_price: number
          updated_at?: string | null
          user_id?: string | null
          venue_id?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          start_time?: string
          status?: string
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          amenities: Json | null
          capacity: number | null
          created_at: string | null
          description: string | null
          full_day_price: number | null
          half_day_price: number | null
          hourly_price: number
          id: string
          images: string[] | null
          location: string
          name: string
          owner_id: string | null
          sport_type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          full_day_price?: number | null
          half_day_price?: number | null
          hourly_price: number
          id?: string
          images?: string[] | null
          location: string
          name: string
          owner_id?: string | null
          sport_type: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          full_day_price?: number | null
          half_day_price?: number | null
          hourly_price?: number
          id?: string
          images?: string[] | null
          location?: string
          name?: string
          owner_id?: string | null
          sport_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
