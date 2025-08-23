import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Upload, Image, Palette, Tag, DollarSign } from "lucide-react";

interface UploadArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadArtworkModal = ({ isOpen, onClose }: UploadArtworkModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artStyle: "",
    medium: "",
    dimensions: "",
    price: "",
    tags: "",
    status: "draft"
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Artwork Uploaded",
      description: `${formData.title} has been ${formData.status === 'published' ? 'published' : 'saved as draft'}!`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Upload New Artwork
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="artwork-image" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Artwork Image *
              </Label>
              <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
                <CardContent className="p-6">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setImagePreview(null)}
                        className="w-full"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Click to upload or drag and drop your artwork
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      <input
                        id="artwork-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById('artwork-image')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Artwork Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter artwork title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your artwork, inspiration, and technique..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="artStyle">Art Style</Label>
                <Select value={formData.artStyle} onValueChange={(value) => handleInputChange('artStyle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Madhubani">Madhubani</SelectItem>
                    <SelectItem value="Warli">Warli</SelectItem>
                    <SelectItem value="Pattachitra">Pattachitra</SelectItem>
                    <SelectItem value="Rajasthani Folk Art">Rajasthani Folk Art</SelectItem>
                    <SelectItem value="Tanjore">Tanjore</SelectItem>
                    <SelectItem value="Kalamkari">Kalamkari</SelectItem>
                    <SelectItem value="Gond">Gond</SelectItem>
                    <SelectItem value="Contemporary">Contemporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Select value={formData.medium} onValueChange={(value) => handleInputChange('medium', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acrylic on Canvas">Acrylic on Canvas</SelectItem>
                    <SelectItem value="Oil on Canvas">Oil on Canvas</SelectItem>
                    <SelectItem value="Watercolor">Watercolor</SelectItem>
                    <SelectItem value="Natural Pigments">Natural Pigments</SelectItem>
                    <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                    <SelectItem value="Digital Art">Digital Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="e.g., 24 x 36 inches"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price (₹) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter price in rupees"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="traditional, folk art, colorful (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="published">Publish Now</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-gradient-cultural hover:shadow-warm"
            onClick={handleSubmit}
          >
            {formData.status === 'published' ? 'Publish Artwork' : 'Save Draft'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};