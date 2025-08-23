import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArtworkService } from "@/services/artworkService";
import { Upload, Image, Palette, Tag, DollarSign, CheckCircle, Loader2 } from "lucide-react";

interface UploadArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArtworkUploaded?: (artwork: any) => void;
}

export const UploadArtworkModal = ({ isOpen, onClose, onArtworkUploaded }: UploadArtworkModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artStyle: "",
    medium: "",
    dimensions: "",
    price: "",
    tags: "",
    status: "draft",
    imageFile: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please drop a valid image file (JPG, PNG, GIF).",
          variant: "destructive"
        });
      }
    }
  };

  const processImageFile = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      handleInputChange('imageFile', file);
    };
    reader.readAsDataURL(file);
    
    toast({
      title: "Image Uploaded",
      description: `${file.name} has been uploaded successfully.`
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file (JPG, PNG, GIF).",
          variant: "destructive"
        });
        return;
      }

      processImageFile(file);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.imageFile) {
      toast({
        title: "Missing Image",
        description: "Please upload an image of your artwork.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload artwork.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(20);

      // Show loading state
      toast({
        title: "Uploading Artwork",
        description: "Please wait while we process your artwork..."
      });

      setUploadProgress(40);

      // Prepare artwork data for Supabase
      const artworkData = {
        title: formData.title,
        description: formData.description,
        art_style: formData.artStyle || null,
        medium: formData.medium || null,
        dimensions: formData.dimensions || null,
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null,
        status: formData.status as 'draft' | 'published',
        artist_id: user.id,
        likes: 0,
        views: 0
      };

      setUploadProgress(60);

      // Create artwork in Supabase
      const createdArtwork = await ArtworkService.createArtwork(artworkData, formData.imageFile);

      setUploadProgress(90);

      if (!createdArtwork) {
        throw new Error('Failed to create artwork');
      }

      setUploadProgress(100);

      // Success message
      toast({
        title: "Artwork Uploaded Successfully!",
        description: `${formData.title} has been ${formData.status === 'published' ? 'published and is now live' : 'saved as draft'}!`
      });

      // Notify parent component
      if (onArtworkUploaded) {
        onArtworkUploaded(createdArtwork);
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        artStyle: "",
        medium: "",
        dimensions: "",
        price: "",
        tags: "",
        status: "draft",
        imageFile: null
      });
      setImagePreview(null);
      
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your artwork. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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
              <Card className={`border-2 border-dashed transition-colors ${
                isDragOver 
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-gray-300 hover:border-orange-400'
              }`}>
                <CardContent className="p-6">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setImagePreview(null);
                              handleInputChange('imageFile', null);
                            }}
                            className="text-white hover:text-red-400 h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          {formData.imageFile?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.imageFile && `Size: ${(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setImagePreview(null);
                            handleInputChange('imageFile', null);
                          }}
                          className="mt-2"
                          size="sm"
                        >
                          Change Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`text-center transition-colors ${
                        isDragOver ? 'bg-orange-50' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className={`w-12 h-12 mx-auto mb-4 ${
                        isDragOver ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <p className={`mb-4 ${
                        isDragOver ? 'text-orange-700' : 'text-gray-600'
                      }`}>
                        {isDragOver ? 'Drop your artwork here' : 'Click to upload or drag and drop your artwork'}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      <input
                        id="artwork-image"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById('artwork-image')?.click()}
                        type="button"
                        disabled={isUploading}
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

        {/* Upload Progress */}
        {isUploading && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Uploading artwork... {uploadProgress}%
                  </span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-blue-600">
                  Please don't close this window while uploading.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Cancel'}
          </Button>
          <Button 
            className="bg-gradient-cultural hover:shadow-warm"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                {formData.status === 'published' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish Artwork
                  </>
                ) : (
                  'Save Draft'
                )}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};