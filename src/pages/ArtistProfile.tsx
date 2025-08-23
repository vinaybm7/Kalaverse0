import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Award, Calendar, Heart, ShoppingCart, Eye } from "lucide-react";
import { getArtistById, getArtworksByArtist } from "@/data/artworks";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

export const ArtistProfile = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [likedArtworks, setLikedArtworks] = useState<number[]>([]);
  const { addToCart } = useCart();
  
  const artist = artistId ? getArtistById(artistId) : null;
  const artistArtworks = artist ? getArtworksByArtist(artist.name) : [];

  if (!artist) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
          <p className="text-muted-foreground mb-6">The artist you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="cultural">Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleLike = (artworkId: number) => {
    setLikedArtworks(prev => {
      const isLiked = prev.includes(artworkId);
      const artwork = artistArtworks.find(art => art.id === artworkId);
      
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

  const handleAddToCart = (artwork: typeof artistArtworks[0]) => {
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
    <div className="min-h-screen">
      <Navigation />
      
      {/* Artist Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Artist Image & Basic Info */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <img 
                      src={artist.avatar} 
                      alt={artist.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                    />
                    <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
                    <div className="flex items-center justify-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {artist.location}
                    </div>
                    <Badge variant="secondary" className="mb-4">
                      {artist.specialty}
                    </Badge>
                    <div className="flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent fill-current mr-1" />
                      <span className="text-lg font-semibold">{artist.rating}</span>
                      <span className="text-muted-foreground ml-1">rating</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm">Experience</span>
                      </div>
                      <span className="font-semibold">{artist.experience}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm">Artworks</span>
                      </div>
                      <span className="font-semibold">{artistArtworks.length} available</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Artist Bio & Achievements */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About the Artist</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {artist.bio}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {artist.description}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Achievements & Recognition</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {artist.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Artist's Artworks */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Artworks by {artist.name}</h2>
            <p className="text-lg text-muted-foreground">
              Explore the beautiful collection of {artist.specialty.toLowerCase()} by this talented artist
            </p>
          </div>
          
          {artistArtworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No artworks available at the moment.</p>
              <Link to="/#gallery">
                <Button variant="cultural">Browse All Artworks</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artistArtworks.map((artwork) => (
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
      
      <Footer />
    </div>
  );
};