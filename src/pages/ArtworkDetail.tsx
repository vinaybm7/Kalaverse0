import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ShoppingCart, Star, ArrowLeft, MapPin, Eye } from "lucide-react";
import { getArtworkById, getArtistById } from "@/data/artworks";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const ArtworkDetail = () => {
  const { artworkId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  
  const artwork = artworkId ? getArtworkById(parseInt(artworkId)) : null;
  const artist = artwork ? getArtistById(artwork.artist.toLowerCase().replace(' ', '-')) : null;

  if (!artwork) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
          <p className="text-muted-foreground mb-6">The artwork you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="cultural">Back to Gallery</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: isLiked 
        ? `${artwork.title} removed from your favorites.`
        : `${artwork.title} added to your favorites!`
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      category: artwork.category,
      price: artwork.price,
      image: artwork.image
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Check out this beautiful ${artwork.category} by ${artwork.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Artwork link copied to clipboard!"
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white/95"
                onClick={handleLike}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`} 
                />
              </Button>
            </div>
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {artwork.title}
              </h1>
              
              {/* Artist Info */}
              {artist && (
                <Link 
                  to={`/artist/${artist.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow mb-6"
                >
                  <img 
                    src={artist.avatar} 
                    alt={artist.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{artist.name}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {artist.location}
                    </div>
                  </div>
                </Link>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-orange-600">₹{artwork.price.toLocaleString()}</span>
                <Badge className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-cultural hover:shadow-warm flex-1 min-w-[200px]"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 hover:bg-primary/5"
                  onClick={handleLike}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 hover:bg-primary/5"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {artwork.likes} likes
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {artwork.views} views
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {artwork.location}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
              </div>

              {/* Artwork Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Artwork Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium">{artwork.category}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Artist:</span>
                    <div className="font-medium">{artwork.artist}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <div className="font-medium">{artwork.location}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <div className="font-medium">₹{artwork.price.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {artwork.category}
                </Badge>
              </div>

              {/* Shipping Info */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-sm text-green-800">Free shipping within India • Secure packaging • 7-day return policy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ArtworkDetail;