-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    user_type TEXT NOT NULL DEFAULT 'buyer' CHECK (user_type IN ('artist', 'buyer')),
    
    -- Artist-specific fields
    artist_name TEXT,
    specialization TEXT[],
    experience_years INTEGER,
    location TEXT,
    phone TEXT,
    website_url TEXT,
    social_links JSONB DEFAULT '{}',
    
    -- Buyer-specific fields
    preferred_art_styles TEXT[],
    budget_range TEXT,
    
    -- Common fields
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);

-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Row Level Security policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view public profile information
CREATE POLICY "Anyone can view public profiles" ON public.profiles
FOR SELECT USING (is_active = true);

-- Users can view their own complete profile
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $
BEGIN
    INSERT INTO public.profiles (id, email, full_name, user_type)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer')
    );
    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get artist profile with artwork count
CREATE OR REPLACE FUNCTION get_artist_profile_with_stats(artist_id UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    username TEXT,
    avatar_url TEXT,
    bio TEXT,
    artist_name TEXT,
    specialization TEXT[],
    experience_years INTEGER,
    location TEXT,
    phone TEXT,
    website_url TEXT,
    social_links JSONB,
    is_verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    artwork_count BIGINT,
    total_likes BIGINT,
    total_views BIGINT
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.username,
        p.avatar_url,
        p.bio,
        p.artist_name,
        p.specialization,
        p.experience_years,
        p.location,
        p.phone,
        p.website_url,
        p.social_links,
        p.is_verified,
        p.created_at,
        COALESCE(COUNT(a.id), 0) as artwork_count,
        COALESCE(SUM(a.likes), 0) as total_likes,
        COALESCE(SUM(a.views), 0) as total_views
    FROM public.profiles p
    LEFT JOIN public.artworks a ON p.id = a.artist_id AND a.status = 'published'
    WHERE p.id = artist_id AND p.user_type = 'artist'
    GROUP BY p.id, p.email, p.full_name, p.username, p.avatar_url, p.bio, 
             p.artist_name, p.specialization, p.experience_years, p.location, 
             p.phone, p.website_url, p.social_links, p.is_verified, p.created_at;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;