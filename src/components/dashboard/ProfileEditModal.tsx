import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { User, MapPin, Phone, Mail, Palette, Heart } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const { user } = useAuth();
  const isArtist = user?.user_metadata?.user_type === "artist";
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    location: isArtist ? "Jaipur, Rajasthan" : "Mumbai, India",
    bio: isArtist 
      ? "Traditional artist specializing in Rajasthani folk art and miniature paintings. Passionate about preserving our cultural heritage through art."
      : "Art enthusiast and collector with a deep appreciation for traditional Indian art forms. Love discovering new artists and supporting cultural preservation.",
    artStyle: isArtist ? "Rajasthani Folk Art" : "",
    experience: isArtist ? "8 years" : "",
    specialization: isArtist ? "Miniature Paintings, Folk Art" : "",
    favoriteArtForms: !isArtist ? "Madhubani, Warli, Pattachitra" : ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated!"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent flex items-center gap-2">
            {isArtist ? <Palette className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
            Edit {isArtist ? 'Artist' : 'Collector'} Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  disabled
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </div>

          {/* Artist-specific fields */}
          {isArtist && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Artist Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="artStyle">Primary Art Style</Label>
                  <Select value={formData.artStyle} onValueChange={(value) => handleInputChange('artStyle', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your art style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Madhubani">Madhubani</SelectItem>
                      <SelectItem value="Warli">Warli</SelectItem>
                      <SelectItem value="Pattachitra">Pattachitra</SelectItem>
                      <SelectItem value="Rajasthani Folk Art">Rajasthani Folk Art</SelectItem>
                      <SelectItem value="Tanjore">Tanjore</SelectItem>
                      <SelectItem value="Kalamkari">Kalamkari</SelectItem>
                      <SelectItem value="Gond">Gond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="6-10 years">6-10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="e.g., Miniature Paintings, Folk Art, Contemporary"
                />
              </div>
            </div>
          )}

          {/* Collector-specific fields */}
          {!isArtist && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Collector Preferences</h3>
              
              <div className="space-y-2">
                <Label htmlFor="favoriteArtForms">Favorite Art Forms</Label>
                <Input
                  id="favoriteArtForms"
                  value={formData.favoriteArtForms}
                  onChange={(e) => handleInputChange('favoriteArtForms', e.target.value)}
                  placeholder="e.g., Madhubani, Warli, Pattachitra"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-cultural hover:shadow-warm"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};