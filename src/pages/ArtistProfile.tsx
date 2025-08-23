import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Heart, Share2 } from "lucide-react";

const ArtistProfile = () => {
  const { artistId } = useParams();

  // Mock artist data - in real app, fetch from API
  const artist = {
    id: artistId,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop",
    location: "Jaipur, Rajasthan",
    joinedDate: "2023",
    bio: "Traditional Rajasthani miniature painter with 15+ years of experience. Specializing in Mughal and Pahari painting styles, bringing ancient techniques to contemporary themes.",
    specialties: ["Miniature Painting", "Mughal Art", "Traditional Portraits"],
    stats: {
      artworks: 47,
      followers: 1234,
      likes: 5678
    },
    artworks: [
      {
        id: 1,
        title: "Royal Procession",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
        price: "₹15,000",
        likes: 89
      },
      {
        id: 2,
        title: "Peacock Dance",
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop",
        price: "₹12,000",
        likes: 67
      },
      {
        id: 3,
        title: "Garden of Paradise",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
        price: "₹18,000",
        likes: 123
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={artist.coverImage} 
          alt="Artist cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Artist Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img 
              src={artist.avatar} 
              alt={artist.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
            />
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {artist.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{artist.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {artist.joinedDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {artist.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="bg-orange-100 text-orange-800">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 mb-6 max-w-2xl">
                {artist.bio}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{artist.stats.artworks}</div>
                  <div className="text-sm text-gray-600">Artworks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{artist.stats.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{artist.stats.likes}</div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Follow Artist
                </Button>
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artworks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artist.artworks.map((artwork) => (
              <div key={artwork.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-3">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">{artwork.price}</span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm">{artwork.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ArtistProfile;