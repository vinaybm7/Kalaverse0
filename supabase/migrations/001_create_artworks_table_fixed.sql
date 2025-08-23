-- Create artworks table
CREATE TABLE IF NOT EXISTS public.artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    art_style TEXT,
    medium TEXT,
    dimensions TEXT,
    price DECIMAL(10,2) NOT NULL,
    tags TEXT[],
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    image_url TEXT,
    artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON public.artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON public.artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON public.artworks(created_at DESC);

-- Create storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artwork-images', 'artwork-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view artwork images" ON storage.objects
FOR SELECT USING (bucket_id = 'artwork-images');

CREATE POLICY "Artists can upload artwork images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'artwork-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Artists can update their artwork images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'artwork-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Artists can delete their artwork images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'artwork-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Row Level Security policies for artworks table
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Anyone can view published artworks
CREATE POLICY "Anyone can view published artworks" ON public.artworks
FOR SELECT USING (status = 'published');

-- Artists can view their own artworks (including drafts)
CREATE POLICY "Artists can view their own artworks" ON public.artworks
FOR SELECT USING (auth.uid() = artist_id);

-- Artists can insert their own artworks
CREATE POLICY "Artists can insert their own artworks" ON public.artworks
FOR INSERT WITH CHECK (auth.uid() = artist_id);

-- Artists can update their own artworks
CREATE POLICY "Artists can update their own artworks" ON public.artworks
FOR UPDATE USING (auth.uid() = artist_id);

-- Artists can delete their own artworks
CREATE POLICY "Artists can delete their own artworks" ON public.artworks
FOR DELETE USING (auth.uid() = artist_id);

-- Create functions for incrementing likes and views
CREATE OR REPLACE FUNCTION increment_artwork_likes(artwork_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.artworks 
    SET likes = likes + 1, updated_at = NOW()
    WHERE id = artwork_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_artwork_likes(artwork_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.artworks 
    SET likes = GREATEST(likes - 1, 0), updated_at = NOW()
    WHERE id = artwork_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_artwork_views(artwork_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.artworks 
    SET views = views + 1, updated_at = NOW()
    WHERE id = artwork_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artworks_updated_at
    BEFORE UPDATE ON public.artworks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();