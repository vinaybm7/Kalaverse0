-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, artwork_id)
);

-- Create indexes for favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_artwork_id ON public.favorites(artwork_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
    
    -- Order details
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    
    -- Shipping details
    shipping_address JSONB NOT NULL,
    shipping_method TEXT,
    tracking_number TEXT,
    
    -- Payment details
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    payment_id TEXT,
    
    -- Timestamps
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_artist_id ON public.orders(artist_id);
CREATE INDEX IF NOT EXISTS idx_orders_artwork_id ON public.orders(artwork_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON public.orders(order_date DESC);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    
    -- Review status
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one review per order
    UNIQUE(reviewer_id, order_id)
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_artist_id ON public.reviews(artist_id);
CREATE INDEX IF NOT EXISTS idx_reviews_artwork_id ON public.reviews(artwork_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_public ON public.reviews(is_public);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Notification content
    type TEXT NOT NULL CHECK (type IN ('order', 'review', 'like', 'follow', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    related_id UUID, -- Can reference orders, artworks, users, etc.
    related_type TEXT, -- 'order', 'artwork', 'user', etc.
    
    -- Notification status
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Row Level Security policies

-- Favorites policies
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON public.favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites" ON public.favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their favorites" ON public.favorites
FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their orders" ON public.orders
FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Artists can view orders for their artworks" ON public.orders
FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Buyers can create orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Artists can update order status" ON public.orders
FOR UPDATE USING (auth.uid() = artist_id);

CREATE POLICY "Buyers can update shipping info" ON public.orders
FOR UPDATE USING (auth.uid() = buyer_id);

-- Reviews policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public reviews" ON public.reviews
FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own reviews" ON public.reviews
FOR SELECT USING (auth.uid() = reviewer_id);

CREATE POLICY "Artists can view reviews for their work" ON public.reviews
FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Users can create reviews for their orders" ON public.reviews
FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id 
    AND EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_id AND buyer_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own reviews" ON public.reviews
FOR UPDATE USING (auth.uid() = reviewer_id);

-- Notifications policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true); -- This will be restricted by application logic

CREATE POLICY "Users can update their notification read status" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Functions for common operations

-- Function to toggle favorite
CREATE OR REPLACE FUNCTION toggle_favorite(artwork_id UUID)
RETURNS BOOLEAN AS $
DECLARE
    is_favorited BOOLEAN;
BEGIN
    -- Check if already favorited
    SELECT EXISTS(
        SELECT 1 FROM public.favorites 
        WHERE user_id = auth.uid() AND artwork_id = toggle_favorite.artwork_id
    ) INTO is_favorited;
    
    IF is_favorited THEN
        -- Remove from favorites
        DELETE FROM public.favorites 
        WHERE user_id = auth.uid() AND artwork_id = toggle_favorite.artwork_id;
        RETURN false;
    ELSE
        -- Add to favorites
        INSERT INTO public.favorites (user_id, artwork_id) 
        VALUES (auth.uid(), toggle_favorite.artwork_id);
        RETURN true;
    END IF;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get artist statistics
CREATE OR REPLACE FUNCTION get_artist_statistics(artist_id UUID)
RETURNS TABLE (
    total_artworks BIGINT,
    published_artworks BIGINT,
    total_orders BIGINT,
    completed_orders BIGINT,
    total_revenue DECIMAL,
    average_rating DECIMAL,
    total_reviews BIGINT
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.artworks WHERE artist_id = get_artist_statistics.artist_id) as total_artworks,
        (SELECT COUNT(*) FROM public.artworks WHERE artist_id = get_artist_statistics.artist_id AND status = 'published') as published_artworks,
        (SELECT COUNT(*) FROM public.orders WHERE artist_id = get_artist_statistics.artist_id) as total_orders,
        (SELECT COUNT(*) FROM public.orders WHERE artist_id = get_artist_statistics.artist_id AND status = 'completed') as completed_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE artist_id = get_artist_statistics.artist_id AND payment_status = 'paid') as total_revenue,
        (SELECT COALESCE(AVG(rating::DECIMAL), 0) FROM public.reviews WHERE artist_id = get_artist_statistics.artist_id AND is_public = true) as average_rating,
        (SELECT COUNT(*) FROM public.reviews WHERE artist_id = get_artist_statistics.artist_id AND is_public = true) as total_reviews;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;