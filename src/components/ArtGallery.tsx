import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { artworks } from "@/data/artworks";

interface ArtGalleryProps {
  initialSearchQuery?: string;
}

export const ArtGallery = ({ initialSearchQuery = '' }: ArtGalleryProps) => {
  const [likedArtworks, setLikedArtworks] = useState<number[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { addToCart } = useCart();
  
  const categories = ["All", "Warli Art", "Madhubani Art", "Pithora Art"];
  
  // Filter artworks based on search query and category
  const filteredArtworks = artworks.filter(artwork => {
    const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
    const matchesSearch = !initialSearchQuery || 
      artwork.title.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
      artwork.category.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
      artwork.description.toLowerCase().includes(initialSearchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleLike = (artworkId: number) => {
    setLikedArtworks(prev => {
      const isLiked = prev.includes(artworkId);
      const artwork = artworks.find(art => art.id === artworkId);
      
      toast({
        title: isLiked ? "Removed from Favorites" : "Added to Favorites",
        description: isLiked 
          ? `${artwork?.title} removed from your favorites.`
          : `${artwork?.title} added to your favorites!`
      });
      
      return isLiked 
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId];
    });
  };

  const handleAddToCart = (artwork: typeof artworks[0]) => {
    addToCart({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      category: artwork.category,
      price: artwork.price,
      image: artwork.image
    }, () => {
      // Open auth modal if user is not authenticated
      setIsAuthModalOpen(true);
    });
  };



  return (
    <section id="gallery" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Explore Art Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            Discover authentic traditional artworks from talented local artists across India.
            Each piece tells a unique story of cultural heritage.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-400">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "cultural" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedCategory === category ? 'animate-pulse-subtle' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results */}
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-muted-foreground mb-4">
              <Eye className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No artworks found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try selecting a different category or browse all artworks
            </p>
            <Button 
              onClick={() => setSelectedCategory('All')}
              variant="cultural"
              className="hover:scale-105 transition-transform duration-200"
            >
              View All Artworks
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork, index) => (
            <Card 
              key={artwork.id} 
              className="group hover:shadow-warm transition-all duration-500 overflow-hidden animate-fade-in-up hover:scale-105 hover:-translate-y-2 hover-glow"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Link to={`/artwork/${artwork.id}`}>
                <div className="relative cursor-pointer">
                  <img 
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {artwork.category}
                  </Badge>
                </div>
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(artwork.id);
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        likedArtworks.includes(artwork.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </div>
              </Link>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">{artwork.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {artwork.likes}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {artwork.views}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {artwork.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">by {artwork.artist}</p>
                      <p className="text-lg font-bold text-primary">₹{artwork.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="cultural" 
                      className="flex-1"
                      onClick={() => handleAddToCart(artwork)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link to={`/artwork/${artwork.id}`}>
                      <Button 
                        variant="outline" 
                        size="icon"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="login"
      />
    </section>
  );
};