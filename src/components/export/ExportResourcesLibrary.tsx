import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Search,
  Download,
  ExternalLink,
  FileText,
  Video,
  BookOpen,
  Globe,
  Phone,
  Mail,
  MapPin,
  Star,
  Filter
} from "lucide-react";

interface ExportResourcesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'guide' | 'template' | 'contact';
  category: 'documentation' | 'quality' | 'packaging' | 'certification' | 'legal' | 'logistics';
  country?: string;
  rating: number;
  downloads: number;
  url: string;
  tags: string[];
}

export const ExportResourcesLibrary = ({ isOpen, onClose }: ExportResourcesLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const resources: Resource[] = [
    {
      id: "doc-001",
      title: "Complete Export Documentation Guide",
      description: "Comprehensive guide covering all required documents for handicraft exports",
      type: "document",
      category: "documentation",
      rating: 4.8,
      downloads: 1250,
      url: "#",
      tags: ["export", "documentation", "guide", "comprehensive"]
    },
    {
      id: "temp-001",
      title: "Commercial Invoice Template",
      description: "Ready-to-use commercial invoice template compliant with international standards",
      type: "template",
      category: "documentation",
      rating: 4.9,
      downloads: 2100,
      url: "#",
      tags: ["template", "invoice", "commercial", "international"]
    },
    {
      id: "guide-001",
      title: "Quality Standards for Traditional Crafts",
      description: "Detailed quality requirements and testing procedures for traditional handicrafts",
      type: "guide",
      category: "quality",
      rating: 4.7,
      downloads: 890,
      url: "#",
      tags: ["quality", "standards", "traditional", "crafts"]
    },
    {
      id: "video-001",
      title: "Packaging Best Practices for Export",
      description: "Video tutorial on proper packaging techniques for international shipping",
      type: "video",
      category: "packaging",
      rating: 4.6,
      downloads: 1500,
      url: "#",
      tags: ["packaging", "tutorial", "shipping", "international"]
    },
    {
      id: "doc-002",
      title: "USA Export Requirements Checklist",
      description: "Specific requirements and regulations for exporting handicrafts to the United States",
      type: "document",
      category: "legal",
      country: "USA",
      rating: 4.8,
      downloads: 950,
      url: "#",
      tags: ["usa", "requirements", "checklist", "regulations"]
    },
    {
      id: "temp-002",
      title: "Certificate of Origin Form",
      description: "Official certificate of origin template for various countries",
      type: "template",
      category: "certification",
      rating: 4.9,
      downloads: 1800,
      url: "#",
      tags: ["certificate", "origin", "template", "official"]
    },
    {
      id: "guide-002",
      title: "Cultural Authenticity Documentation",
      description: "Guide to obtaining and maintaining cultural authenticity certificates",
      type: "guide",
      category: "certification",
      rating: 4.5,
      downloads: 720,
      url: "#",
      tags: ["cultural", "authenticity", "documentation", "certificates"]
    },
    {
      id: "contact-001",
      title: "Export Promotion Council - Handicrafts",
      description: "Official contact information and services for handicraft export promotion",
      type: "contact",
      category: "legal",
      rating: 4.7,
      downloads: 0,
      url: "#",
      tags: ["contact", "promotion", "council", "official"]
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "documentation", label: "Documentation" },
    { value: "quality", label: "Quality Standards" },
    { value: "packaging", label: "Packaging" },
    { value: "certification", label: "Certification" },
    { value: "legal", label: "Legal & Compliance" },
    { value: "logistics", label: "Logistics" }
  ];

  const types = [
    { value: "all", label: "All Types" },
    { value: "document", label: "Documents" },
    { value: "template", label: "Templates" },
    { value: "guide", label: "Guides" },
    { value: "video", label: "Videos" },
    { value: "contact", label: "Contacts" }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesType = selectedType === "all" || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      case 'contact': return <Phone className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'guide': return 'bg-green-100 text-green-800';
      case 'template': return 'bg-orange-100 text-orange-800';
      case 'contact': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (resource: Resource) => {
    toast({
      title: "Downloading Resource",
      description: `Downloading ${resource.title}...`
    });
  };

  const handleContact = (resource: Resource) => {
    toast({
      title: "Contact Information",
      description: `Opening contact details for ${resource.title}`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Export Resources Library
          </DialogTitle>
          <p className="text-gray-600">
            Comprehensive collection of export compliance resources and tools
          </p>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources, guides, templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-warm transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      {resource.country && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {resource.country}
                        </span>
                      )}
                      {resource.downloads > 0 && (
                        <span>{resource.downloads} downloads</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {resource.type === 'contact' ? (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-cultural hover:shadow-warm"
                          onClick={() => handleContact(resource)}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-cultural hover:shadow-warm"
                          onClick={() => handleDownload(resource)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Resource Preview",
                            description: `Opening preview for ${resource.title}`
                          });
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-warm transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {resource.rating}
                          </div>
                          {resource.downloads > 0 && (
                            <span>{resource.downloads} downloads</span>
                          )}
                          {resource.country && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {resource.country}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {resource.type === 'contact' ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleContact(resource)}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleDownload(resource)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Resources */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Featured Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-medium">Export Starter Kit</h4>
                  <p className="text-sm text-gray-600">Complete package for first-time exporters</p>
                </div>
                <Button size="sm" variant="outline">
                  Get Kit
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <Video className="w-8 h-8 text-purple-600" />
                <div>
                  <h4 className="font-medium">Video Training Series</h4>
                  <p className="text-sm text-gray-600">Step-by-step export compliance training</p>
                </div>
                <Button size="sm" variant="outline">
                  Watch Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};