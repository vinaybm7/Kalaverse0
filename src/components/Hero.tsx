import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Palette, Heart } from "lucide-react";
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
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/60 to-yellow-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Sparkles className="w-6 h-6 text-yellow-300/60" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <Palette className="w-8 h-8 text-orange-300/50" />
          </div>
          <div className="absolute bottom-40 left-20 animate-float">
            <Heart className="w-5 h-5 text-red-300/60" />
          </div>
          <div className="absolute top-60 left-1/3 animate-float-delayed">
            <Sparkles className="w-4 h-4 text-yellow-400/40" />
          </div>
          <div className="absolute bottom-60 right-1/3 animate-float">
            <Palette className="w-6 h-6 text-orange-400/50" />
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative Element */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium tracking-wide">Sacred Art • Divine Heritage</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
          </div>

          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-white leading-none tracking-tight">
              <span className="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 bg-clip-text text-transparent drop-shadow-2xl">
                KalaVerse
              </span>
            </h1>
            <div className="flex justify-center">
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full shadow-lg"></div>
            </div>
          </div>

          {/* Subtitle */}
          <div className="mb-8">
            <p className="text-2xl md:text-3xl lg:text-4xl mb-4 text-white/95 font-light tracking-wide leading-relaxed">
              <span className="italic">Where Sacred Traditions</span>
              <br />
              <span className="font-medium bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Meet Divine Artistry
              </span>
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl mb-12 text-white/85 max-w-4xl mx-auto leading-relaxed font-light">
            Immerse yourself in the sacred world of traditional Indian art. Discover authentic 
            <span className="font-medium text-yellow-200"> Warli</span>, 
            <span className="font-medium text-orange-200"> Madhubani</span>, and 
            <span className="font-medium text-red-200"> Pithora</span> masterpieces 
            crafted by devoted artisans who carry forward centuries of divine heritage.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              variant="hero" 
              size="lg" 
              className="min-w-56 h-14 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105" 
              onClick={handleExploreGallery}
            >
              <Palette className="w-5 h-5 mr-2" />
              Explore Sacred Gallery
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="min-w-56 h-14 text-lg font-semibold border-2 border-white/60 text-white hover:bg-white/20 hover:border-white/80 backdrop-blur-sm shadow-xl hover:shadow-white/30 transition-all duration-300 transform hover:scale-105" 
              onClick={handleBecomeArtist}
            >
              <Heart className="w-5 h-5 mr-2" />
              {user ? 'Artist Dashboard' : 'Join Our Artists'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-200 mb-2">500+</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Sacred Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-200 mb-2">2000+</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Divine Artworks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-200 mb-2">15+</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Countries Reached</div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
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