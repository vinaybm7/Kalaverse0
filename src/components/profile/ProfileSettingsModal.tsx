import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileService } from "@/services/profileService";
import { Profile, ProfileUpdate } from "@/types/database";
import { 
  User, 
  Camera, 
  MapPin, 
  Phone, 
  Globe, 
  Palette, 
  Award, 
  Calendar,
  Loader2,
  Save,
  X
} from "lucide-react";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: Profile) => void;
}

export const ProfileSettingsModal = ({ isOpen, onClose, onProfileUpdated }: ProfileSettingsModalProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    location: "",
    phone: "",
    website_url: "",
    artist_name: "",
    specialization: [] as string[],
    experience_years: 0,
    preferred_art_styles: [] as string[],
    budget_range: "",
    social_links: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: ""
    }
  });

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadProfile();
    }
  }, [isOpen, user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userProfile = await ProfileService.getCurrentProfile();
      
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          full_name: userProfile.full_name || "",
          username: userProfile.username || "",
          bio: userProfile.bio || "",
          location: userProfile.location || "",
          phone: userProfile.phone || "",
          website_url: userProfile.website_url || "",
          artist_name: userProfile.artist_name || "",
          specialization: userProfile.specialization || [],
          experience_years: userProfile.experience_years || 0,
          preferred_art_styles: userProfile.preferred_art_styles || [],
          budget_range: userProfile.budget_range || "",
          social_links: {
            instagram: userProfile.social_links?.instagram || "",
            facebook: userProfile.social_links?.facebook || "",
            twitter: userProfile.social_links?.twitter || "",
            linkedin: userProfile.social_links?.linkedin || ""
          }
        });
        setAvatarPreview(userProfile.avatar_url);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error Loading Profile",
        description: "Failed to load your profile data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleSpecializationChange = (specializations: string[]) => {
    setFormData(prev => ({
      ...prev,
      specialization: specializations
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a JPG, PNG, or WebP image file.",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Image Selected",
        description: "Your new profile picture will be uploaded when you save changes."
      });
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      setIsSaving(true);

      let avatarUrl = profile.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        setIsUploadingAvatar(true);
        try {
          avatarUrl = await ProfileService.uploadAvatar(avatarFile, user.id);
          toast({
            title: "Avatar Uploaded",
            description: "Your profile picture has been updated successfully!"
          });
        } catch (error) {
          console.error('Avatar upload error:', error);
          toast({
            title: "Avatar Upload Failed",
            description: "Failed to upload your profile picture. Continuing with other changes.",
            variant: "destructive"
          });
          // Continue with profile update even if avatar upload fails
          avatarUrl = profile.avatar_url;
        } finally {
          setIsUploadingAvatar(false);
        }
      }

      // Prepare update data
      const updateData: ProfileUpdate = {
        full_name: formData.full_name,
        username: formData.username || null,
        bio: formData.bio || null,
        location: formData.location || null,
        phone: formData.phone || null,
        website_url: formData.website_url || null,
        avatar_url: avatarUrl,
        social_links: formData.social_links
      };

      // Add user-type specific fields
      if (profile.user_type === 'artist') {
        updateData.artist_name = formData.artist_name || null;
        updateData.specialization = formData.specialization.length > 0 ? formData.specialization : null;
        updateData.experience_years = formData.experience_years || null;
      } else {
        updateData.preferred_art_styles = formData.preferred_art_styles.length > 0 ? formData.preferred_art_styles : null;
        updateData.budget_range = formData.budget_range || null;
      }

      const updatedProfile = await ProfileService.updateProfile(user.id, updateData);

      if (updatedProfile) {
        setProfile(updatedProfile);

        if (onProfileUpdated) {
          onProfileUpdated(updatedProfile);
        }

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!"
        });

        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isArtist = profile?.user_type === 'artist';

  const artStyles = [
    "Traditional Painting", "Digital Art", "Sculpture", "Photography", 
    "Handicrafts", "Textiles", "Jewelry", "Pottery", "Wood Carving", "Metal Work"
  ];

  const specializations = [
    "Traditional Indian Art", "Contemporary Art", "Folk Art", "Religious Art",
    "Portrait Art", "Landscape Art", "Abstract Art", "Miniature Art",
    "Handicrafts", "Textiles", "Jewelry Making", "Pottery", "Wood Carving"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        ) : (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">
                {isArtist ? "Artist Details" : "Preferences"}
              </TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={avatarPreview || undefined} />
                        <AvatarFallback>
                          {formData.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Hover overlay for avatar */}
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <Label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Camera className="w-4 h-4 mr-2" />
                            {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Max 5MB. JPG, PNG, WebP supported.
                      </p>
                      {avatarFile && (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-green-600">
                            ✓ New image selected: {avatarFile.name}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAvatarFile(null);
                              setAvatarPreview(profile?.avatar_url || null);
                              // Reset the file input
                              const input = document.getElementById('avatar-upload') as HTMLInputElement;
                              if (input) input.value = '';
                            }}
                            className="text-red-600 hover:text-red-700 h-auto p-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Choose a unique username"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, State, Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website_url">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Website
                    </Label>
                    <Input
                      id="website_url"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isArtist ? "Artist Details" : "Art Preferences"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isArtist ? (
                    <>
                      <div>
                        <Label htmlFor="artist_name">
                          <Palette className="w-4 h-4 inline mr-1" />
                          Artist Name
                        </Label>
                        <Input
                          id="artist_name"
                          value={formData.artist_name}
                          onChange={(e) => handleInputChange('artist_name', e.target.value)}
                          placeholder="Your professional artist name"
                        />
                      </div>

                      <div>
                        <Label>
                          <Award className="w-4 h-4 inline mr-1" />
                          Specializations
                        </Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {specializations.map((spec) => (
                            <label key={spec} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.specialization.includes(spec)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleSpecializationChange([...formData.specialization, spec]);
                                  } else {
                                    handleSpecializationChange(
                                      formData.specialization.filter(s => s !== spec)
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">{spec}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="experience_years">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Years of Experience
                        </Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          max="50"
                          value={formData.experience_years}
                          onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label>Preferred Art Styles</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {artStyles.map((style) => (
                            <label key={style} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.preferred_art_styles.includes(style)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleInputChange('preferred_art_styles', [...formData.preferred_art_styles, style]);
                                  } else {
                                    handleInputChange('preferred_art_styles', 
                                      formData.preferred_art_styles.filter(s => s !== style)
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">{style}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="budget_range">Budget Range</Label>
                        <Select
                          value={formData.budget_range}
                          onValueChange={(value) => handleInputChange('budget_range', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5000">Under ₹5,000</SelectItem>
                            <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                            <SelectItem value="15000-50000">₹15,000 - ₹50,000</SelectItem>
                            <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                            <SelectItem value="above-100000">Above ₹1,00,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.social_links.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={formData.social_links.facebook}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={formData.social_links.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.social_links.linkedin}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isUploadingAvatar}>
            {isSaving || isUploadingAvatar ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isUploadingAvatar ? 'Uploading Avatar...' : 'Saving Changes...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};