import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, signOut, loading } = useAuth();

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <h2 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  KalaVerse
                </h2>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#categories" className="text-foreground hover:text-primary transition-colors">
                Categories
              </a>
              <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
                Gallery
              </a>
              <a href="#artists" className="text-foreground hover:text-primary transition-colors">
                Artists
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
            </div>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Search",
                    description: "Search functionality coming soon!"
                  });
                }}
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Shopping Cart",
                    description: "Cart functionality coming soon!"
                  });
                }}
              >
                <ShoppingBag className="w-4 h-4" />
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
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="cultural" 
                    size="sm" 
                    onClick={() => openAuthModal('signup')}
                    className="shadow-warm"
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
    </>
  );
};