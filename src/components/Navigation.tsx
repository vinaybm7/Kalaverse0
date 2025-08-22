import { Button } from "@/components/ui/button";
import { Search, Menu, ShoppingBag, User } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h2 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent">
              KalaVerse
            </h2>
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
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ShoppingBag className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};