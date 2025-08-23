import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-traditional-art.jpg";

export const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleExploreGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBecomeArtist = () => {
    if (user) {
      // If user is logged in, redirect to artist dashboard or profile
      // For now, just scroll to gallery
      handleExploreGallery();
    } else {
      // If not logged in, open signup modal
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Traditional Indian Art Heritage" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-hero-foreground leading-tight">
            KalaVerse
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-hero-foreground/90 font-light">
            Where Traditional Indian Art Meets the Digital World
          </p>
          <p className="text-lg md:text-xl mb-12 text-hero-foreground/80 max-w-3xl mx-auto">
            Discover authentic Warli, Madhubani, and Pithora art from local artists. 
            Connect with cultural heritage and support traditional artisans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="min-w-48" onClick={handleExploreGallery}>
              Explore Art Gallery
            </Button>
            <Button variant="cultural" size="lg" className="min-w-48" onClick={handleBecomeArtist}>
              {user ? 'Artist Dashboard' : 'Become an Artist'}
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-hero-foreground/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-hero-foreground/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Auth Modal for Become an Artist */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signup"
      />
    </>
  );
};