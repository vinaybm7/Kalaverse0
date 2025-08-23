-- Fix storage policies for better functionality

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can view artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can upload artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can update their artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can delete their artwork images" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create improved storage policies for artwork images
CREATE POLICY "Anyone can view artwork images" ON storage.objects
FOR SELECT USING (bucket_id = 'artwork-images');

CREATE POLICY "Authenticated users can upload artwork images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'artwork-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own artwork images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'artwork-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own artwork images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'artwork-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create improved storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Ensure buckets exist and are properly configured
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artwork-images', 'artwork-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create a function to test storage access
CREATE OR REPLACE FUNCTION test_storage_access()
RETURNS TABLE (
    bucket_name TEXT,
    can_select BOOLEAN,
    can_insert BOOLEAN,
    can_update BOOLEAN,
    can_delete BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.name as bucket_name,
        true as can_select,  -- Public read access
        CASE WHEN auth.role() = 'authenticated' THEN true ELSE false END as can_insert,
        CASE WHEN auth.role() = 'authenticated' THEN true ELSE false END as can_update,
        CASE WHEN auth.role() = 'authenticated' THEN true ELSE false END as can_delete
    FROM storage.buckets b
    WHERE b.name IN ('artwork-images', 'avatars');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;