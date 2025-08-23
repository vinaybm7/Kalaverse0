import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ShoppingCart, Star, ArrowLeft, MapPin, Calendar } from "lucide-react";

const ArtworkDetail = () => {
  const { artworkId } = useParams();

  // Mock artwork data - in real app, fetch from API
  const artwork = {
    id: artworkId,
    title: "Royal Procession of Maharaja",
    artist: {
      id: "priya-sharma",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      location: "Jaipur, Rajasthan"
    },
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    price: "₹15,000",
    originalPrice: "₹18,000",
    description: "A magnificent miniature painting depicting the grand procession of a Maharaja through the royal gardens. This artwork showcases the traditional Rajasthani miniature painting style with intricate details, vibrant colors, and gold leaf work. The piece captures the essence of royal Indian culture with elaborate costumes, architectural elements, and natural motifs.",
    details: {
      medium: "Watercolor and Gold Leaf on Paper",
      dimensions: "12\" x 16\"",
      year: "2024",
      style: "Rajasthani Miniature",
      category: "Traditional Art"
    },
    stats: {
      likes: 89,
      views: 1234,
      saves: 45
    },
    tags: ["Miniature Painting", "Royal Art", "Traditional", "Rajasthani", "Gold Leaf"],
    availability: "Available",
    shipping: "Free shipping within India"
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                src={artwork.images[currentImageIndex]} 
                alt={artwork.title}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-3">
              {artwork.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative overflow-hidden rounded-lg ${
                    currentImageIndex === index ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${artwork.title} ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {artwork.title}
              </h1>
              
              {/* Artist Info */}
              <Link 
                to={`/artist/${artwork.artist.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow mb-6"
              >
                <img 
                  src={artwork.artist.avatar} 
                  alt={artwork.artist.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">{artwork.artist.name}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    {artwork.artist.location}
                  </div>
                </div>
              </Link>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-orange-600">{artwork.price}</span>
                {artwork.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">{artwork.originalPrice}</span>
                )}
                <Badge className="bg-green-100 text-green-800">
                  {artwork.availability}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-1 min-w-[200px]"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="border-orange-200 hover:bg-orange-50">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-orange-200 hover:bg-orange-50">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {artwork.stats.likes} likes
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {artwork.stats.views} views
                </div>
                <div>{artwork.stats.saves} saves</div>
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
                    <span className="text-gray-600">Medium:</span>
                    <div className="font-medium">{artwork.details.medium}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Dimensions:</span>
                    <div className="font-medium">{artwork.details.dimensions}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <div className="font-medium">{artwork.details.year}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Style:</span>
                    <div className="font-medium">{artwork.details.style}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-sm text-green-800">{artwork.shipping}</div>
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