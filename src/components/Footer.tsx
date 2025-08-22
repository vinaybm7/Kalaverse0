import { Heart, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent mb-4">
              KalaVerse
            </h3>
            <p className="text-muted-foreground mb-4">
              Preserving India's rich cultural heritage through digital innovation. 
              Supporting traditional artists and connecting them with the world.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Heart className="w-4 h-4 mr-2 text-destructive fill-current" />
              Made with love for Indian culture
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#gallery" className="hover:text-primary transition-colors">Art Gallery</a></li>
              <li><a href="#artists" className="hover:text-primary transition-colors">Featured Artists</a></li>
              <li><a href="#categories" className="hover:text-primary transition-colors">Art Categories</a></li>
              <li><a href="#workshops" className="hover:text-primary transition-colors">Workshops</a></li>
            </ul>
          </div>
          
          {/* For Artists */}
          <div>
            <h4 className="font-semibold mb-4">For Artists</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#join" className="hover:text-primary transition-colors">Join KalaVerse</a></li>
              <li><a href="#resources" className="hover:text-primary transition-colors">Artist Resources</a></li>
              <li><a href="#community" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="#support" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                hello@kalaverse.com
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Mumbai, India
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 KalaVerse. All rights reserved. Empowering traditional artists since 2024.</p>
        </div>
      </div>
    </footer>
  );
};