import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, X, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WishlistItem {
  id: number;
  title: string;
  artist: string;
  image: string;
  price: string;
}

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal = ({ isOpen, onClose }: WishlistModalProps) => {
  const [wishlistItems] = useState<WishlistItem[]>([
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
    },
    {
      id: 3,
      title: "Temple Bells",
      artist: "Meera Patel",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
      price: "₹8,500"
    }
  ]);

  const removeFromWishlist = (id: number) => {
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist."
    });
  };

  const addToCart = (item: WishlistItem) => {
    toast({
      title: "Added to Cart",
      description: `${item.title} has been added to your cart!`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent">
            My Wishlist ❤️
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-warm transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {item.artist}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600">{item.price}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "View Artwork",
                              description: `Opening ${item.title} by ${item.artist}`
                            });
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-cultural hover:shadow-warm"
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Start adding artworks you love to your wishlist!
              </p>
              <Button 
                className="bg-gradient-cultural hover:shadow-warm"
                onClick={onClose}
              >
                Browse Gallery
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};