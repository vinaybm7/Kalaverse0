import { supabase } from '@/lib/supabase'
import { Artwork, ArtworkInsert, ArtworkUpdate, ArtworkWithArtist } from '@/types/database'

export class ArtworkService {
  // Upload artwork image
  static async uploadArtworkImage(file: File, artistId: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${artistId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('artwork-images')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading artwork image:', uploadError)
      throw uploadError
    }

    const { data } = supabase.storage
      .from('artwork-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // Create artwork with image upload
  static async createArtwork(artwork: ArtworkInsert, imageFile?: File): Promise<Artwork | null> {
    let imageUrl = null

    // Upload image if provided
    if (imageFile && artwork.artist_id) {
      imageUrl = await this.uploadArtworkImage(imageFile, artwork.artist_id)
    }

    // Add image URL to artwork data
    const artworkData = {
      ...artwork,
      image_url: imageUrl
    }

    const { data, error } = await supabase
      .from('artworks')
      .insert(artworkData)
      .select()
      .single()

    if (error) {
      console.error('Error creating artwork:', error)
      throw error
    }

    return data
  }

  // Update artwork
  static async updateArtwork(id: string, updates: ArtworkUpdate): Promise<Artwork | null> {
    const { data, error } = await supabase
      .from('artworks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating artwork:', error)
      throw error
    }

    return data
  }

  // Delete artwork
  static async deleteArtwork(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting artwork:', error)
      throw error
    }

    return true
  }

  // Get artwork by ID with artist info
  static async getArtworkWithArtist(id: string): Promise<ArtworkWithArtist | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artist:profiles(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching artwork:', error)
      return null
    }

    return data as ArtworkWithArtist
  }

  // Get artworks with pagination and filters
  static async getArtworks(page = 0, limit = 12, filters?: {
    artistId?: string
    status?: 'draft' | 'published'
    artStyle?: string
    medium?: string
    minPrice?: number
    maxPrice?: number
    tags?: string[]
  }) {
    let query = supabase
      .from('artworks')
      .select(`
        *,
        artist:profiles(*)
      `)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (filters?.artistId) {
      query = query.eq('artist_id', filters.artistId)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    } else {
      // Default to published artworks only
      query = query.eq('status', 'published')
    }

    if (filters?.artStyle) {
      query = query.ilike('art_style', `%${filters.artStyle}%`)
    }

    if (filters?.medium) {
      query = query.ilike('medium', `%${filters.medium}%`)
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching artworks:', error)
      throw error
    }

    return data as ArtworkWithArtist[]
  }

  // Get artist's artworks
  static async getArtistArtworks(artistId: string, includePrivate = false): Promise<Artwork[]> {
    let query = supabase
      .from('artworks')
      .select('*')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false })

    if (!includePrivate) {
      query = query.eq('status', 'published')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching artist artworks:', error)
      throw error
    }

    return data
  }

  // Search artworks
  static async searchArtworks(searchQuery: string, filters?: {
    artStyle?: string
    medium?: string
    minPrice?: number
    maxPrice?: number
  }) {
    let query = supabase
      .from('artworks')
      .select(`
        *,
        artist:profiles(*)
      `)
      .eq('status', 'published')
      .or(`
        title.ilike.%${searchQuery}%,
        description.ilike.%${searchQuery}%,
        art_style.ilike.%${searchQuery}%,
        medium.ilike.%${searchQuery}%
      `)

    if (filters?.artStyle) {
      query = query.ilike('art_style', `%${filters.artStyle}%`)
    }

    if (filters?.medium) {
      query = query.ilike('medium', `%${filters.medium}%`)
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error searching artworks:', error)
      throw error
    }

    return data as ArtworkWithArtist[]
  }

  // Increment artwork views
  static async incrementViews(artworkId: string): Promise<void> {
    const { error } = await supabase
      .rpc('increment_artwork_views', { artwork_id: artworkId })

    if (error) {
      console.error('Error incrementing views:', error)
    }
  }

  // Toggle artwork like
  static async toggleLike(artworkId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('toggle_favorite', { artwork_id: artworkId })

    if (error) {
      console.error('Error toggling like:', error)
      throw error
    }

    // Also increment/decrement likes count
    if (data) {
      await supabase.rpc('increment_artwork_likes', { artwork_id: artworkId })
    } else {
      await supabase.rpc('decrement_artwork_likes', { artwork_id: artworkId })
    }

    return data
  }

  // Get user's favorite artworks
  static async getFavoriteArtworks(userId: string): Promise<ArtworkWithArtist[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        artwork:artworks(
          *,
          artist:profiles(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorite artworks:', error)
      throw error
    }

    return data.map(item => item.artwork).filter(Boolean) as ArtworkWithArtist[]
  }

  // Check if artwork is favorited by user
  static async isArtworkFavorited(artworkId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('artwork_id', artworkId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking favorite status:', error)
      return false
    }

    return !!data
  }

  // Get trending artworks (most liked/viewed recently)
  static async getTrendingArtworks(limit = 12): Promise<ArtworkWithArtist[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artist:profiles(*)
      `)
      .eq('status', 'published')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('likes', { ascending: false })
      .order('views', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching trending artworks:', error)
      throw error
    }

    return data as ArtworkWithArtist[]
  }

  // Get featured artworks (verified artists, high quality)
  static async getFeaturedArtworks(limit = 8): Promise<ArtworkWithArtist[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artist:profiles!inner(*)
      `)
      .eq('status', 'published')
      .eq('artist.is_verified', true)
      .order('likes', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured artworks:', error)
      throw error
    }

    return data as ArtworkWithArtist[]
  }
}