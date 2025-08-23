import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartModal } from "@/components/cart/CartModal";
import { toast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, signOut, loading } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleNavigation = (section: string) => {
    // If we're on the dashboard, navigate to home first then scroll to section
    if (location.pathname === '/dashboard') {
      navigate('/');
      // Small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll to section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border relative overflow-hidden">
        {/* Traditional Art Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="traditional-pattern-bg h-full w-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="KalaVerse Logo" 
                  className="h-8 w-auto hover:opacity-80 transition-opacity"
                />
                <h2 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  KalaVerse
                </h2>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigation('categories')} 
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Categories
              </button>
              <button 
                onClick={() => handleNavigation('gallery')} 
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Gallery
              </button>
              <button 
                onClick={() => handleNavigation('artists')} 
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Artists
              </button>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
            </div>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search artworks..."
                    className="w-64 pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const searchQuery = (e.target as HTMLInputElement).value;
                        if (searchQuery.trim()) {
                          navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="md:hidden hover:scale-110 transition-transform duration-200"
                onClick={() => {
                  const searchQuery = prompt("Search artworks:");
                  if (searchQuery?.trim()) {
                    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCartModalOpen(true)}
                className="relative hover:scale-110 transition-transform duration-200 hover-glow"
              >
                <ShoppingBag className="w-4 h-4" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              
              {/* Auth Section */}
              {loading ? (
                <Button variant="secondary" size="sm" disabled className="bg-muted/50">
                  Loading...
                </Button>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-cultural flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user.user_metadata?.full_name?.split(' ')[0] || 'Artist'}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openAuthModal('login')}
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="cultural" 
                    size="sm" 
                    onClick={() => openAuthModal('signup')}
                    className="shadow-warm hover:scale-105 transition-transform duration-200 hover-glow"
                  >
                    Join Now
                  </Button>
                </div>
              )}
              
              {/* Mobile menu button */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)}
      />
    </>
  );
};