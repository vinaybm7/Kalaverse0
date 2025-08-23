import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";

const artworks = [
  {
    id: 1,
    title: "Dancing Celebration",
    artist: "Rajesh Baiga",
    category: "Warli Art",
    price: 2500,
    location: "Maharashtra",
    image: "/Indian-tribal-Art-Warli-Painting-of-people-dancing-Painting-home-decor-white.webp",
    description: "Traditional Warli painting depicting people dancing in celebration",
    likes: 24,
    views: 156
  },
  {
    id: 2,
    title: "Warli Village Life",
    artist: "Meera Patel",
    category: "Warli Art",
    price: 2200,
    location: "Maharashtra",
    image: "/Warli_art.jpeg",
    description: "Authentic Warli art showcasing traditional village life and customs",
    likes: 19,
    views: 142
  },
  {
    id: 3,
    title: "Madhubani Mahavidyas",
    artist: "Kishore Rathwa",
    category: "Madhubani Art", 
    price: 3200,
    location: "Bihar",
    image: "/Madhubani_Mahavidyas.jpg",
    description: "Sacred Madhubani art depicting the divine Mahavidyas",
    likes: 38,
    views: 203
  },
  {
    id: 4,
    title: "Women in Madhubani",
    artist: "Kamala Devi",
    category: "Madhubani Art",
    price: 3500,
    location: "Bihar",
    image: "/Women_madhubani-art.png", 
    description: "Beautiful Madhubani artwork celebrating women and nature",
    likes: 45,
    views: 267
  },
  {
    id: 5,
    title: "Sacred Horses",
    artist: "Sunita Devi", 
    category: "Pithora Art",
    price: 2800,
    location: "Gujarat",
    image: "/Horses-pethora-art.jpg",
    description: "Traditional Pithora art featuring sacred horses in vibrant colors",
    likes: 31,
    views: 178
  },
  {
    id: 6,
    title: "Elephant Ride",
    artist: "Chanchal Soni",
    category: "Pithora Art", 
    price: 3100,
    location: "Gujarat",
    image: "/Elephant_Ride_In_Pithora_Art_by_Chanchal_Soni_1024x.jpg.webp",
    description: "Magnificent Pithora painting depicting an elephant ride by Chanchal Soni",
    likes: 29,
    views: 189
  }
];

interface ArtGalleryProps {
  initialSearchQuery?: string;
}

export const ArtGallery = ({ initialSearchQuery = '' }: ArtGalleryProps) => {
  const [likedArtworks, setLikedArtworks] = useState<number[]>([]);
  const { addToCart } = useCart();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredItems: filteredArtworks,
    categories,
    hasResults,
    totalResults
  } = useSearch(artworks);

  // Set initial search query if provided
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery !== searchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery, searchQuery, setSearchQuery]);

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
    });
  };



  return (
    <section id="gallery" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Art Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover authentic traditional artworks from talented local artists across India.
            Each piece tells a unique story of cultural heritage.
          </p>
          
          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            totalResults={totalResults}
          />
        </div>

        {/* Results */}
        {!hasResults ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Eye className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No artworks found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or browse all categories
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              variant="cultural"
            >
              View All Artworks
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork) => (
            <Card key={artwork.id} className="group hover:shadow-warm transition-all duration-300 overflow-hidden">
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
    </section>
  );
};