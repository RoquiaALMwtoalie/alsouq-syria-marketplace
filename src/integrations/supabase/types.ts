export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          active: boolean
          created_at: string
          id: string
          link_url: string | null
          sort_order: number
          text_ar: string
          text_en: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          link_url?: string | null
          sort_order?: number
          text_ar: string
          text_en?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          link_url?: string | null
          sort_order?: number
          text_ar?: string
          text_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          active: boolean
          created_at: string
          cta_label_ar: string | null
          cta_label_en: string | null
          id: string
          image_url: string
          link_url: string | null
          sort_order: number
          subtitle_ar: string | null
          subtitle_en: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta_label_ar?: string | null
          cta_label_en?: string | null
          id?: string
          image_url: string
          link_url?: string | null
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta_label_ar?: string | null
          cta_label_en?: string | null
          id?: string
          image_url?: string
          link_url?: string | null
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          currency: string
          customer_id: string
          ends_at: string | null
          guests: number
          id: string
          listing_id: string
          notes: string | null
          provider_id: string
          starts_at: string
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id: string
          ends_at?: string | null
          guests?: number
          id?: string
          listing_id: string
          notes?: string | null
          provider_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string
          ends_at?: string | null
          guests?: number
          id?: string
          listing_id?: string
          notes?: string | null
          provider_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          accent_from: string
          accent_to: string
          active: boolean
          created_at: string
          icon: string | null
          id: string
          image_url: string | null
          name_ar: string
          name_en: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          accent_from?: string
          accent_to?: string
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          name_ar: string
          name_en: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          accent_from?: string
          accent_to?: string
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          name_ar?: string
          name_en?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      governorates: {
        Row: {
          id: string
          name_ar: string
          name_en: string
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          name_ar: string
          name_en: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          name_ar?: string
          name_en?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category_id: string | null
          cover_url: string | null
          created_at: string
          currency: string
          delivery_method: string | null
          delivery_note: string | null
          description_ar: string | null
          description_en: string | null
          discount_percent: number | null
          favorites_count: number
          featured_sort: number
          governorate_id: string | null
          id: string
          is_available: boolean
          is_featured: boolean
          is_offer: boolean
          kind: Database["public"]["Enums"]["listing_kind"]
          metadata: Json
          old_price: number | null
          owner_id: string
          payment_method: string | null
          price: number
          price_usd: number | null
          rating: number
          status: Database["public"]["Enums"]["listing_status"]
          title_ar: string
          title_en: string | null
          updated_at: string
          views: number
        }
        Insert: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          delivery_method?: string | null
          delivery_note?: string | null
          description_ar?: string | null
          description_en?: string | null
          discount_percent?: number | null
          favorites_count?: number
          featured_sort?: number
          governorate_id?: string | null
          id?: string
          is_available?: boolean
          is_featured?: boolean
          is_offer?: boolean
          kind: Database["public"]["Enums"]["listing_kind"]
          metadata?: Json
          old_price?: number | null
          owner_id: string
          payment_method?: string | null
          price?: number
          price_usd?: number | null
          rating?: number
          status?: Database["public"]["Enums"]["listing_status"]
          title_ar: string
          title_en?: string | null
          updated_at?: string
          views?: number
        }
        Update: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          delivery_method?: string | null
          delivery_note?: string | null
          description_ar?: string | null
          description_en?: string | null
          discount_percent?: number | null
          favorites_count?: number
          featured_sort?: number
          governorate_id?: string | null
          id?: string
          is_available?: boolean
          is_featured?: boolean
          is_offer?: boolean
          kind?: Database["public"]["Enums"]["listing_kind"]
          metadata?: Json
          old_price?: number | null
          owner_id?: string
          payment_method?: string | null
          price?: number
          price_usd?: number | null
          rating?: number
          status?: Database["public"]["Enums"]["listing_status"]
          title_ar?: string
          title_en?: string | null
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          listing_id: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          listing_id?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          listing_id?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          currency: string
          id: string
          listing_id: string
          notes: string | null
          quantity: number
          seller_id: string
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          currency?: string
          id?: string
          listing_id: string
          notes?: string | null
          quantity?: number
          seller_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          currency?: string
          id?: string
          listing_id?: string
          notes?: string | null
          quantity?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_details: string | null
          address_text: string | null
          allows_bookings: boolean
          allows_messaging: boolean
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          featured_sort: number
          full_name: string | null
          id: string
          is_featured: boolean
          lat: number | null
          lng: number | null
          phone: string | null
          store_accepts_bookings: boolean
          store_accepts_messages: boolean
          store_active: boolean
          store_closes_at: string | null
          store_cover_url: string | null
          store_description: string | null
          store_logo_url: string | null
          store_name: string | null
          store_online: boolean
          store_opens_at: string | null
          store_phone: string | null
          updated_at: string
        }
        Insert: {
          address_details?: string | null
          address_text?: string | null
          allows_bookings?: boolean
          allows_messaging?: boolean
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          featured_sort?: number
          full_name?: string | null
          id: string
          is_featured?: boolean
          lat?: number | null
          lng?: number | null
          phone?: string | null
          store_accepts_bookings?: boolean
          store_accepts_messages?: boolean
          store_active?: boolean
          store_closes_at?: string | null
          store_cover_url?: string | null
          store_description?: string | null
          store_logo_url?: string | null
          store_name?: string | null
          store_online?: boolean
          store_opens_at?: string | null
          store_phone?: string | null
          updated_at?: string
        }
        Update: {
          address_details?: string | null
          address_text?: string | null
          allows_bookings?: boolean
          allows_messaging?: boolean
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          featured_sort?: number
          full_name?: string | null
          id?: string
          is_featured?: boolean
          lat?: number | null
          lng?: number | null
          phone?: string | null
          store_accepts_bookings?: boolean
          store_accepts_messages?: boolean
          store_active?: boolean
          store_closes_at?: string | null
          store_cover_url?: string | null
          store_description?: string | null
          store_logo_url?: string | null
          store_name?: string | null
          store_online?: boolean
          store_opens_at?: string | null
          store_phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          listing_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_applications: {
        Row: {
          admin_note: string | null
          allows_bookings: boolean
          allows_messaging: boolean
          created_at: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          store_cover_url: string | null
          store_description: string | null
          store_logo_url: string | null
          store_name: string
          store_phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          allows_bookings?: boolean
          allows_messaging?: boolean
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          store_cover_url?: string | null
          store_description?: string | null
          store_logo_url?: string | null
          store_name: string
          store_phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          allows_bookings?: boolean
          allows_messaging?: boolean
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          store_cover_url?: string | null
          store_description?: string | null
          store_logo_url?: string | null
          store_name?: string
          store_phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_text: string
          created_at: string
          details: string
          id: string
          is_default: boolean
          label: string
          lat: number | null
          lng: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_text: string
          created_at?: string
          details: string
          id?: string
          is_default?: boolean
          label: string
          lat?: number | null
          lng?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_text?: string
          created_at?: string
          details?: string
          id?: string
          is_default?: boolean
          label?: string
          lat?: number | null
          lng?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "seller" | "admin"
      listing_kind:
        | "product"
        | "property"
        | "vehicle"
        | "service"
        | "food"
        | "travel"
        | "health"
        | "beauty"
        | "farm"
        | "tourism"
      listing_status: "draft" | "pending" | "published" | "archived"
      order_status:
        | "pending"
        | "accepted"
        | "completed"
        | "rejected"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "seller", "admin"],
      listing_kind: [
        "product",
        "property",
        "vehicle",
        "service",
        "food",
        "travel",
        "health",
        "beauty",
        "farm",
        "tourism",
      ],
      listing_status: ["draft", "pending", "published", "archived"],
      order_status: [
        "pending",
        "accepted",
        "completed",
        "rejected",
        "cancelled",
      ],
    },
  },
} as const
