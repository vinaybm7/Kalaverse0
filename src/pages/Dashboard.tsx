import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Heart, 
  ShoppingCart, 
  Upload, 
  Settings, 
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data - in real app, fetch from API
  const userData = {
    profile: {
      name: user?.user_metadata?.full_name || "Art Enthusiast",
      email: user?.email || "",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      userType: user?.user_metadata?.user_type || "Art Enthusiast",
      joinedDate: "2024",
      location: "Mumbai, India"
    },
    stats: {
      artworks: 12,
      likes: 234,
      views: 1567,
      followers: 89
    },
    myArtworks: [
      {
        id: 1,
        title: "Sunset Mandala",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
        status: "Published",
        likes: 45,
        views: 234,
        price: "₹8,000"
      },
      {
        id: 2,
        title: "Traditional Dance",
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop",
        status: "Draft",
        likes: 0,
        views: 0,
        price: "₹12,000"
      }
    ],
    favorites: [
      {
        id: 1,
        title: "Royal Procession",
        artist: "Priya Sharma",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
        price: "₹15,000"
      },
      {
        id: 2,
        title: "Peacock Dance",
        artist: "Raj Kumar",
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop",
        price: "₹10,000"
      }
    ],
    orders: [
      {
        id: "ORD001",
        artwork: "Lotus Bloom",
        artist: "Meera Patel",
        amount: "₹7,500",
        status: "Delivered",
        date: "2024-01-15"
      },
      {
        id: "ORD002",
        artwork: "Mountain Landscape",
        artist: "Arjun Singh",
        amount: "₹12,000",
        status: "In Transit",
        date: "2024-01-20"
      }
    ]
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to access your dashboard.</p>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            Sign In
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* Cultural Header with Traditional Pattern */}
        <div className="relative bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Traditional Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-cultural rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-terracotta rounded-full blur-3xl"></div>
          </div>
          
          {/* Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-cultural"></div>
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img 
                  src={userData.profile.avatar} 
                  alt={userData.profile.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gradient-cultural shadow-warm"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-cultural rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl font-bold bg-gradient-cultural bg-clip-text text-transparent mb-1">
                    Namaste, {userData.profile.name}! 🙏
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {userData.profile.userType === 'artist' 
                      ? 'Continue creating beautiful traditional art' 
                      : 'Discover the beauty of Indian heritage art'
                    }
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <Badge className="bg-gradient-cultural text-white shadow-sm">
                    {userData.profile.userType === 'artist' ? '🎨 Traditional Artist' : '❤️ Art Enthusiast'}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {userData.profile.location}
                  </span>
                  <span>Member since {userData.profile.joinedDate}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-orange-600">{userData.stats.artworks}</div>
                    <div className="text-sm text-gray-600">
                      {userData.profile.userType === 'artist' ? 'Artworks' : 'Favorites'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-red-600">{userData.stats.likes}</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-yellow-600">{userData.stats.views}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-purple-600">{userData.stats.followers}</div>
                    <div className="text-sm text-gray-600">
                      {userData.profile.userType === 'artist' ? 'Followers' : 'Following'}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-cultural hover:shadow-warm transition-all duration-300">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Cultural Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gradient-to-r from-white via-orange-50/50 to-red-50/50 rounded-xl shadow-warm border border-orange-100">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-cultural data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="artworks" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-cultural data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">
                {userData.profile.userType === 'artist' ? 'My Art' : 'Collection'}
              </span>
              <span className="sm:hidden">Art</span>
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-cultural data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
              <span className="sm:hidden">❤️</span>
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-cultural data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
              <span className="sm:hidden">Cart</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-white to-orange-50/30 border-orange-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-cultural rounded-full"></div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Someone liked your "Sunset Mandala"</span>
                      <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">New follower: Raj Kumar</span>
                      <span className="text-xs text-gray-500 ml-auto">5h ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Your art was viewed 50 times today</span>
                      <span className="text-xs text-gray-500 ml-auto">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-red-50/30 border-red-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-terracotta rounded-full"></div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-gradient-cultural hover:shadow-warm text-white" 
                    onClick={() => {
                      toast({
                        title: "Upload Artwork",
                        description: "Upload feature coming soon! Share your traditional art with the world."
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Artwork
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Edit Profile",
                        description: "Profile editing feature coming soon!"
                      })
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Account Settings",
                        description: "Settings panel coming soon!"
                      })
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-yellow-50/30 border-yellow-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/50">
                      <span className="text-sm text-gray-600">Profile Views</span>
                      <div className="text-right">
                        <span className="font-semibold text-blue-600">234</span>
                        <div className="text-xs text-gray-500">this week</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/50">
                      <span className="text-sm text-gray-600">Art Engagement</span>
                      <div className="text-right">
                        <span className="font-semibold text-green-600">89%</span>
                        <div className="text-xs text-gray-500">positive</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/50">
                      <span className="text-sm text-gray-600">
                        {userData.profile.userType === 'artist' ? 'Sales' : 'Purchases'}
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-orange-600">₹25,000</span>
                        <div className="text-xs text-gray-500">this month</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="artworks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent">
                {userData.profile.userType === 'artist' ? 'My Artworks' : 'My Collection'}
              </h2>
              <Button 
                className="bg-gradient-cultural hover:shadow-warm transition-all duration-300"
                onClick={() => {
                  toast({
                    title: userData.profile.userType === 'artist' ? "Upload Artwork" : "Browse Gallery",
                    description: userData.profile.userType === 'artist' 
                      ? "Upload feature coming soon! Share your traditional art with the world."
                      : "Discover beautiful traditional artworks in our gallery."
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {userData.profile.userType === 'artist' ? 'Upload New Art' : 'Add to Collection'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.myArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden hover:shadow-warm transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 ${
                        artwork.status === 'Published' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {artwork.status}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4 bg-gradient-to-br from-white to-orange-50/30">
                    <h3 className="font-semibold text-gray-900 mb-2">{artwork.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                          <Heart className="w-3 h-3 text-red-500" />
                          {artwork.likes}
                        </span>
                        <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                          <Eye className="w-3 h-3 text-blue-500" />
                          {artwork.views}
                        </span>
                      </div>
                      <span className="font-semibold text-orange-600 bg-white/50 px-2 py-1 rounded-full">{artwork.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-orange-200 hover:bg-orange-50"
                        onClick={() => {
                          toast({
                            title: "Edit Artwork",
                            description: `Editing ${artwork.title}...`
                          })
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          toast({
                            title: "Delete Artwork",
                            description: `Are you sure you want to delete ${artwork.title}?`,
                            variant: "destructive"
                          })
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent">
                Favorite Artworks ❤️
              </h2>
              <Button 
                variant="outline" 
                className="border-orange-200 hover:bg-orange-50"
                onClick={() => {
                  toast({
                    title: "Browse Gallery",
                    description: "Discover more beautiful traditional artworks!"
                  })
                }}
              >
                Discover More Art
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.favorites.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden hover:shadow-warm transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4 bg-gradient-to-br from-white to-red-50/30">
                    <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      by {artwork.artist}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-orange-600 bg-white/50 px-2 py-1 rounded-full">{artwork.price}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-cultural hover:shadow-warm transition-all duration-300"
                          onClick={() => {
                            toast({
                              title: "View Artwork",
                              description: `Opening ${artwork.title} by ${artwork.artist}`
                            })
                          }}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-orange-200 hover:bg-orange-50"
                          onClick={() => {
                            toast({
                              title: "Add to Cart",
                              description: `${artwork.title} added to your cart!`
                            })
                          }}
                        >
                          <ShoppingCart className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent">
                Order History 🛒
              </h2>
              <Button 
                variant="outline" 
                className="border-orange-200 hover:bg-orange-50"
                onClick={() => {
                  toast({
                    title: "Browse Gallery",
                    description: "Discover more artworks to add to your collection!"
                  })
                }}
              >
                Shop More Art
              </Button>
            </div>
            
            <div className="space-y-4">
              {userData.orders.map((order) => (
                <Card key={order.id} className="hover:shadow-warm transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingCart className="w-4 h-4 text-blue-500" />
                          <h3 className="font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-1 font-medium">
                          {order.artwork}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          by {order.artist}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Ordered on {order.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-orange-600 text-lg">{order.amount}</div>
                          <Badge 
                            className={`${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            } shadow-sm`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-orange-200 hover:bg-orange-50"
                            onClick={() => {
                              toast({
                                title: "Order Details",
                                description: `Viewing details for order #${order.id}`
                              })
                            }}
                          >
                            View Details
                          </Button>
                          {order.status === 'Delivered' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-200 hover:bg-green-50 text-green-700"
                              onClick={() => {
                                toast({
                                  title: "Rate Artwork",
                                  description: "Share your experience with this artwork!"
                                })
                              }}
                            >
                              Rate & Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  );
};

export default Dashboard;