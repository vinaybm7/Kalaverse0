import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const artworks = [
  {
    id: 1,
    title: "Village Life",
    artist: "Rajesh Baiga",
    category: "Warli Art",
    price: 2500,
    location: "Maharashtra",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    description: "Traditional Warli painting depicting daily village activities",
    likes: 24,
    views: 156
  },
  {
    id: 2,
    title: "Radha Krishna",
    artist: "Sunita Devi",
    category: "Madhubani Art", 
    price: 3200,
    location: "Bihar",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    description: "Vibrant Madhubani art showcasing divine love",
    likes: 38,
    views: 203
  },
  {
    id: 3,
    title: "Sacred Horses",
    artist: "Kishore Rathwa", 
    category: "Pithora Art",
    price: 2800,
    location: "Gujarat",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    description: "Colorful ritual painting featuring sacred horses",
    likes: 31,
    views: 178
  },
  {
    id: 4,
    title: "Harvest Festival",
    artist: "Rajesh Baiga",
    category: "Warli Art",
    price: 2200,
    location: "Maharashtra", 
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    description: "Celebration of harvest through traditional Warli motifs",
    likes: 19,
    views: 142
  },
  {
    id: 5,
    title: "Peacock Dance",
    artist: "Sunita Devi",
    category: "Madhubani Art",
    price: 3500,
    location: "Bihar",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop", 
    description: "Intricate peacock patterns in traditional Madhubani style",
    likes: 45,
    views: 267
  },
  {
    id: 6,
    title: "Tribal Stories",
    artist: "Kishore Rathwa",
    category: "Pithora Art", 
    price: 3100,
    location: "Gujarat",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    description: "Ancient tribal narratives painted with natural pigments",
    likes: 29,
    views: 189
  }
];

export const ArtGallery = () => {
  const [likedArtworks, setLikedArtworks] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Warli Art", "Madhubani Art", "Pithora Art"];

  const filteredArtworks = selectedCategory === "All" 
    ? artworks 
    : artworks.filter(artwork => artwork.category === selectedCategory);

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
    toast({
      title: "Added to Cart",
      description: `${artwork.title} by ${artwork.artist} has been added to your cart.`
    });
  };



  return (
    <section id="gallery" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Art Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover authentic traditional artworks from talented local artists across India.
            Each piece tells a unique story of cultural heritage.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "cultural" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Art Grid */}
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
      </div>
    </section>
  );
};