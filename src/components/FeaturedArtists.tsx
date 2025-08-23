import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import { artists } from "@/data/artworks";

export const FeaturedArtists = () => {
  return (
    <section id="artists" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Artists
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the talented artists preserving India's cultural heritage through their masterful 
            traditional art forms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.slice(0, 3).map((artist, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={artist.avatar} 
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{artist.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {artist.location}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">{artist.specialty}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-accent fill-current mr-1" />
                      <span className="text-sm">{artist.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{artist.description}</p>
                  
                  <div className="text-xs text-muted-foreground">
                    {artist.artworks} artworks available
                  </div>
                </div>
                
                <Link to={`/artist/${artist.id}`}>
                  <Button variant="secondary" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};