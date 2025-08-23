export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          user_type: 'artist' | 'buyer'
          artist_name: string | null
          specialization: string[] | null
          experience_years: number | null
          location: string | null
          phone: string | null
          website_url: string | null
          social_links: Record<string, any> | null
          preferred_art_styles: string[] | null
          budget_range: string | null
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          user_type?: 'artist' | 'buyer'
          artist_name?: string | null
          specialization?: string[] | null
          experience_years?: number | null
          location?: string | null
          phone?: string | null
          website_url?: string | null
          social_links?: Record<string, any> | null
          preferred_art_styles?: string[] | null
          budget_range?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          user_type?: 'artist' | 'buyer'
          artist_name?: string | null
          specialization?: string[] | null
          experience_years?: number | null
          location?: string | null
          phone?: string | null
          website_url?: string | null
          social_links?: Record<string, any> | null
          preferred_art_styles?: string[] | null
          budget_range?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      artworks: {
        Row: {
          id: string
          title: string
          description: string
          art_style: string | null
          medium: string | null
          dimensions: string | null
          price: number
          tags: string[] | null
          status: 'draft' | 'published'
          image_url: string | null
          artist_id: string
          likes: number
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          art_style?: string | null
          medium?: string | null
          dimensions?: string | null
          price: number
          tags?: string[] | null
          status?: 'draft' | 'published'
          image_url?: string | null
          artist_id: string
          likes?: number
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          art_style?: string | null
          medium?: string | null
          dimensions?: string | null
          price?: number
          tags?: string[] | null
          status?: 'draft' | 'published'
          image_url?: string | null
          artist_id?: string
          likes?: number
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          artwork_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artwork_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          artwork_id?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          artist_id: string
          artwork_id: string
          quantity: number
          unit_price: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          shipping_address: Record<string, any>
          shipping_method: string | null
          tracking_number: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          payment_id: string | null
          order_date: string
          confirmed_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          artist_id: string
          artwork_id: string
          quantity?: number
          unit_price: number
          total_amount: number
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          shipping_address: Record<string, any>
          shipping_method?: string | null
          tracking_number?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          order_date?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          artist_id?: string
          artwork_id?: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          shipping_address?: Record<string, any>
          shipping_method?: string | null
          tracking_number?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          order_date?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          artist_id: string
          artwork_id: string | null
          order_id: string | null
          rating: number
          title: string | null
          comment: string | null
          is_verified: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          artist_id: string
          artwork_id?: string | null
          order_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          artist_id?: string
          artwork_id?: string | null
          order_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'order' | 'review' | 'like' | 'follow' | 'system'
          title: string
          message: string
          related_id: string | null
          related_type: string | null
          is_read: boolean
          is_sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'order' | 'review' | 'like' | 'follow' | 'system'
          title: string
          message: string
          related_id?: string | null
          related_type?: string | null
          is_read?: boolean
          is_sent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'order' | 'review' | 'like' | 'follow' | 'system'
          title?: string
          message?: string
          related_id?: string | null
          related_type?: string | null
          is_read?: boolean
          is_sent?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      toggle_favorite: {
        Args: {
          artwork_id: string
        }
        Returns: boolean
      }
      get_artist_statistics: {
        Args: {
          artist_id: string
        }
        Returns: {
          total_artworks: number
          published_artworks: number
          total_orders: number
          completed_orders: number
          total_revenue: number
          average_rating: number
          total_reviews: number
        }[]
      }
      get_artist_profile_with_stats: {
        Args: {
          artist_id: string
        }
        Returns: {
          id: string
          email: string
          full_name: string
          username: string
          avatar_url: string
          bio: string
          artist_name: string
          specialization: string[]
          experience_years: number
          location: string
          phone: string
          website_url: string
          social_links: Record<string, any>
          is_verified: boolean
          created_at: string
          artwork_count: number
          total_likes: number
          total_views: number
        }[]
      }
      increment_artwork_likes: {
        Args: {
          artwork_id: string
        }
        Returns: void
      }
      decrement_artwork_likes: {
        Args: {
          artwork_id: string
        }
        Returns: void
      }
      increment_artwork_views: {
        Args: {
          artwork_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Artwork = Database['public']['Tables']['artworks']['Row']
export type ArtworkInsert = Database['public']['Tables']['artworks']['Insert']
export type ArtworkUpdate = Database['public']['Tables']['artworks']['Update']

export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Extended types with relations
export type ArtworkWithArtist = Artwork & {
  artist: Profile
}

export type OrderWithDetails = Order & {
  artwork: Artwork
  artist: Profile
  buyer: Profile
}

export type ReviewWithDetails = Review & {
  reviewer: Profile
  artist: Profile
  artwork?: Artwork
}