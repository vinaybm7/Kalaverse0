import { supabase } from '@/lib/supabase'
import { Profile, ProfileInsert, ProfileUpdate } from '@/types/database'

export class ProfileService {
  // Get current user's profile
  static async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }

  // Get profile by ID
  static async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }

  // Create or update profile
  static async upsertProfile(profile: ProfileInsert | ProfileUpdate): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single()

    if (error) {
      console.error('Error upserting profile:', error)
      throw error
    }

    return data
  }

  // Update profile
  static async updateProfile(id: string, updates: ProfileUpdate): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  }

  // Upload avatar
  static async uploadAvatar(file: File, userId: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      throw uploadError
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // Get artist profiles with pagination
  static async getArtists(page = 0, limit = 12, filters?: {
    location?: string
    specialization?: string[]
    verified?: boolean
  }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'artist')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters?.specialization && filters.specialization.length > 0) {
      query = query.overlaps('specialization', filters.specialization)
    }

    if (filters?.verified !== undefined) {
      query = query.eq('is_verified', filters.verified)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching artists:', error)
      throw error
    }

    return data
  }

  // Get artist profile with statistics
  static async getArtistWithStats(artistId: string) {
    const { data, error } = await supabase
      .rpc('get_artist_profile_with_stats', { artist_id: artistId })

    if (error) {
      console.error('Error fetching artist with stats:', error)
      throw error
    }

    return data?.[0] || null
  }

  // Search profiles
  static async searchProfiles(query: string, userType?: 'artist' | 'buyer') {
    let supabaseQuery = supabase
      .from('profiles')
      .select('*')
      .eq('is_active', true)

    if (userType) {
      supabaseQuery = supabaseQuery.eq('user_type', userType)
    }

    // Search in multiple fields
    supabaseQuery = supabaseQuery.or(`
      full_name.ilike.%${query}%,
      username.ilike.%${query}%,
      artist_name.ilike.%${query}%,
      location.ilike.%${query}%
    `)

    const { data, error } = await supabaseQuery
      .order('is_verified', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error searching profiles:', error)
      throw error
    }

    return data
  }

  // Check username availability
  static async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('username', username)

    if (excludeUserId) {
      query = query.neq('id', excludeUserId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error checking username:', error)
      return false
    }

    return data.length === 0
  }
}