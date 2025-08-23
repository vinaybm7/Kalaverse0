import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Globe, 
  Shield, 
  Package, 
  Truck,
  Award,
  Download,
  ExternalLink,
  Info,
  Plus,
  Eye,
  MessageSquare
} from "lucide-react";

interface ExportComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWizard?: (type: string) => void;
  onOpenTracker?: () => void;
}

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'not-started';
  priority: 'high' | 'medium' | 'low';
  category: 'documentation' | 'quality' | 'packaging' | 'certification';
  requirements: string[];
  resources: { title: string; url: string; type: 'pdf' | 'link' | 'form' }[];
}

export const ExportComplianceModal = ({ isOpen, onClose, onOpenWizard, onOpenTracker }: ExportComplianceModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCountry, setSelectedCountry] = useState("usa");

  const complianceItems: ComplianceItem[] = [
    {
      id: "export-license",
      title: "Export License & Registration",
      description: "Obtain necessary export licenses and register with DGFT (Directorate General of Foreign Trade)",
      status: "pending",
      priority: "high",
      category: "documentation",
      requirements: [
        "IEC (Import Export Code) registration",
        "RCMC (Registration cum Membership Certificate)",
        "GST registration",
        "Bank account for export transactions"
      ],
      resources: [
        { title: "DGFT Export License Application", url: "#", type: "form" },
        { title: "IEC Registration Guide", url: "#", type: "pdf" },
        { title: "RCMC Application Process", url: "#", type: "link" }
      ]
    },
    {
      id: "product-certification",
      title: "Product Quality Certification",
      description: "Ensure products meet international quality standards and safety requirements",
      status: "not-started",
      priority: "high",
      category: "certification",
      requirements: [
        "ISO 9001:2015 Quality Management certification",
        "Product safety testing certificates",
        "Material composition certificates",
        "Eco-friendly compliance certificates"
      ],
      resources: [
        { title: "ISO Certification Guide", url: "#", type: "pdf" },
        { title: "Product Testing Labs Directory", url: "#", type: "link" },
        { title: "Safety Standards Checklist", url: "#", type: "pdf" }
      ]
    },
    {
      id: "packaging-standards",
      title: "Export Packaging Standards",
      description: "Meet international packaging and labeling requirements for safe transit",
      status: "completed",
      priority: "medium",
      category: "packaging",
      requirements: [
        "Moisture-resistant packaging materials",
        "Proper cushioning and protection",
        "Clear product labeling in English",
        "Country of origin marking",
        "Care instructions and handling guidelines"
      ],
      resources: [
        { title: "Export Packaging Guidelines", url: "#", type: "pdf" },
        { title: "Labeling Requirements by Country", url: "#", type: "link" },
        { title: "Packaging Material Suppliers", url: "#", type: "link" }
      ]
    },
    {
      id: "documentation",
      title: "Export Documentation",
      description: "Prepare all required shipping and customs documentation",
      status: "pending",
      priority: "high",
      category: "documentation",
      requirements: [
        "Commercial Invoice",
        "Packing List",
        "Certificate of Origin",
        "Export Declaration",
        "Insurance Certificate",
        "Bill of Lading/Airway Bill"
      ],
      resources: [
        { title: "Export Documentation Templates", url: "#", type: "pdf" },
        { title: "Certificate of Origin Application", url: "#", type: "form" },
        { title: "Customs Declaration Guide", url: "#", type: "pdf" }
      ]
    },
    {
      id: "quality-control",
      title: "Quality Control & Inspection",
      description: "Implement quality control measures and pre-shipment inspection",
      status: "not-started",
      priority: "medium",
      category: "quality",
      requirements: [
        "Quality control checklist implementation",
        "Pre-shipment inspection by certified agency",
        "Product photography for documentation",
        "Quality assurance certificates"
      ],
      resources: [
        { title: "QC Checklist Template", url: "#", type: "pdf" },
        { title: "Inspection Agencies Directory", url: "#", type: "link" },
        { title: "Quality Standards Guide", url: "#", type: "pdf" }
      ]
    },
    {
      id: "cultural-authenticity",
      title: "Cultural Authenticity Certificate",
      description: "Obtain certificates proving the traditional and authentic nature of handicrafts",
      status: "completed",
      priority: "medium",
      category: "certification",
      requirements: [
        "Handicraft authenticity certificate",
        "Traditional craft documentation",
        "Artisan skill certificates",
        "Cultural heritage compliance"
      ],
      resources: [
        { title: "Authenticity Certificate Application", url: "#", type: "form" },
        { title: "Traditional Craft Guidelines", url: "#", type: "pdf" },
        { title: "Cultural Heritage Board Contact", url: "#", type: "link" }
      ]
    }
  ];

  const countries = [
    { code: "usa", name: "United States", flag: "🇺🇸", requirements: "FDA, CPSC compliance required" },
    { code: "eu", name: "European Union", flag: "🇪🇺", requirements: "CE marking, REACH compliance" },
    { code: "uk", name: "United Kingdom", flag: "🇬🇧", requirements: "UKCA marking, Brexit compliance" },
    { code: "canada", name: "Canada", flag: "🇨🇦", requirements: "Health Canada, CFIA compliance" },
    { code: "australia", name: "Australia", flag: "🇦🇺", requirements: "ACCC, quarantine requirements" },
    { code: "japan", name: "Japan", flag: "🇯🇵", requirements: "JIS standards, customs compliance" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'not-started': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-started': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="w-5 h-5" />;
      case 'quality': return <Shield className="w-5 h-5" />;
      case 'packaging': return <Package className="w-5 h-5" />;
      case 'certification': return <Award className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const completedItems = complianceItems.filter(item => item.status === 'completed').length;
  const totalItems = complianceItems.length;
  const completionPercentage = (completedItems / totalItems) * 100;

  const handleStartCompliance = (itemId: string) => {
    if (onOpenWizard) {
      onOpenWizard(itemId);
      onClose();
    } else {
      toast({
        title: "Compliance Process Started",
        description: "You'll be guided through the requirements step by step."
      });
    }
  };

  const handleDownloadResource = (resource: any) => {
    toast({
      title: "Downloading Resource",
      description: `Downloading ${resource.title}...`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Export Compliance Center
          </DialogTitle>
          <p className="text-gray-600">
            Ensure your traditional handicrafts meet international export standards
          </p>
        </DialogHeader>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button 
            className="bg-gradient-cultural hover:shadow-warm h-12"
            onClick={() => handleStartCompliance("new-application")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Start New Application
          </Button>
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => {
              if (onOpenTracker) {
                onOpenTracker();
                onClose();
              }
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Track Applications
          </Button>
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => {
              toast({
                title: "Expert Consultation",
                description: "Scheduling consultation with export compliance expert..."
              });
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Get Expert Help
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
            <TabsTrigger value="countries">Country Requirements</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Export Readiness Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-2xl font-bold text-blue-600">{Math.round(completionPercentage)}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{completedItems}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {complianceItems.filter(item => item.status === 'pending').length}
                      </div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {complianceItems.filter(item => item.status === 'not-started').length}
                      </div>
                      <div className="text-sm text-gray-600">Not Started</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">Global Market Access</h3>
                      <p className="text-sm text-green-600">Reach international customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">Quality Assurance</h3>
                      <p className="text-sm text-blue-600">Meet international standards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-purple-800">Premium Pricing</h3>
                      <p className="text-sm text-purple-600">Command higher prices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceItems
                    .filter(item => item.status !== 'completed')
                    .sort((a, b) => a.priority === 'high' ? -1 : 1)
                    .slice(0, 3)
                    .map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <Badge className={`${item.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.priority} priority
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4">
            {complianceItems.map((item) => (
              <Card key={item.id} className="hover:shadow-warm transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(item.category)}
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        {item.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className={`${
                        item.priority === 'high' ? 'border-red-200 text-red-700' :
                        item.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                        'border-green-200 text-green-700'
                      }`}>
                        {item.priority} priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {item.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.resources.map((resource, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadResource(resource)}
                            className="text-xs"
                          >
                            {resource.type === 'pdf' ? <Download className="w-3 h-3 mr-1" /> :
                             resource.type === 'form' ? <FileText className="w-3 h-3 mr-1" /> :
                             <ExternalLink className="w-3 h-3 mr-1" />}
                            {resource.title}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {item.status === 'not-started' && (
                        <Button 
                          className="bg-gradient-cultural hover:shadow-warm"
                          onClick={() => handleStartCompliance(item.id)}
                        >
                          Start Process
                        </Button>
                      )}
                      {item.status === 'pending' && (
                        <Button variant="outline">
                          Continue Process
                        </Button>
                      )}
                      {item.status === 'completed' && (
                        <Button variant="outline" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="countries" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country) => (
                <Card 
                  key={country.code} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-warm ${
                    selectedCountry === country.code ? 'ring-2 ring-orange-400 bg-orange-50' : ''
                  }`}
                  onClick={() => setSelectedCountry(country.code)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <h3 className="font-semibold">{country.name}</h3>
                        <p className="text-xs text-gray-600">{country.requirements}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: `${country.name} Requirements`,
                          description: "Loading detailed export requirements..."
                        });
                      }}
                    >
                      View Requirements
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Country Details */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {countries.find(c => c.code === selectedCountry)?.name} Export Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Documentation Required:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Commercial Invoice</li>
                        <li>• Certificate of Origin</li>
                        <li>• Packing List</li>
                        <li>• Export Declaration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Compliance Standards:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Product Safety Standards</li>
                        <li>• Labeling Requirements</li>
                        <li>• Material Restrictions</li>
                        <li>• Cultural Sensitivity</li>
                      </ul>
                    </div>
                  </div>
                  <Button className="bg-gradient-cultural hover:shadow-warm">
                    Download Complete Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentation Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Commercial Invoice Template",
                    "Packing List Format",
                    "Certificate of Origin Form",
                    "Export Declaration Template",
                    "Quality Certificate Format"
                  ].map((template, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{template}</span>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Government Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "DGFT Export Guidelines",
                    "Handicraft Export Promotion Council",
                    "Export Credit Guarantee Corporation",
                    "Indian Trade Portal",
                    "Customs Department Resources"
                  ].map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{resource}</span>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Expert Consultation */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Expert Consultation Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get personalized guidance from export compliance experts who specialize in traditional handicrafts.
                </p>
                <div className="flex gap-3">
                  <Button className="bg-gradient-cultural hover:shadow-warm">
                    Schedule Consultation
                  </Button>
                  <Button variant="outline">
                    View Expert Profiles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};