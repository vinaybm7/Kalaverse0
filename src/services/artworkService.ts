import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Artwork = Database['public']['Tables']['artworks']['Row'];
type ArtworkInsert = Database['public']['Tables']['artworks']['Insert'];
type ArtworkUpdate = Database['public']['Tables']['artworks']['Update'];

export class ArtworkService {
  // Upload image to Supabase Storage
  static async uploadImage(file: File, artworkId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${artworkId}.${fileExt}`;
      const filePath = `artworks/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('artwork-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('artwork-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  }

  // Create new artwork
  static async createArtwork(artworkData: Omit<ArtworkInsert, 'id' | 'created_at' | 'updated_at'>, imageFile?: File): Promise<Artwork | null> {
    try {
      // Generate artwork ID
      const artworkId = crypto.randomUUID();
      
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile, artworkId);
      }

      // Insert artwork into database
      const { data, error } = await supabase
        .from('artworks')
        .insert({
          id: artworkId,
          ...artworkData,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating artwork:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createArtwork:', error);
      return null;
    }
  }

  // Get artworks by artist
  static async getArtworksByArtist(artistId: string): Promise<Artwork[]> {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching artworks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getArtworksByArtist:', error);
      return [];
    }
  }

  // Update artwork
  static async updateArtwork(id: string, updates: ArtworkUpdate): Promise<Artwork | null> {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating artwork:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateArtwork:', error);
      return null;
    }
  }

  // Delete artwork
  static async deleteArtwork(id: string): Promise<boolean> {
    try {
      // First, delete the image from storage
      const { data: artwork } = await supabase
        .from('artworks')
        .select('image_url')
        .eq('id', id)
        .single();

      if (artwork?.image_url) {
        // Extract file path from URL
        const url = new URL(artwork.image_url);
        const filePath = url.pathname.split('/').slice(-2).join('/'); // Get 'artworks/filename.ext'
        
        await supabase.storage
          .from('artwork-images')
          .remove([filePath]);
      }

      // Delete artwork from database
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting artwork:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteArtwork:', error);
      return false;
    }
  }

  // Increment views
  static async incrementViews(id: string): Promise<void> {
    try {
      await supabase.rpc('increment_artwork_views', { artwork_id: id });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // Toggle like
  static async toggleLike(id: string, increment: boolean): Promise<void> {
    try {
      if (increment) {
        await supabase.rpc('increment_artwork_likes', { artwork_id: id });
      } else {
        await supabase.rpc('decrement_artwork_likes', { artwork_id: id });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }
}