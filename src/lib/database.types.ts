export interface Database {
  public: {
    Tables: {
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
    }
  }
}