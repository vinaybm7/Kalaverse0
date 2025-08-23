import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  Package, 
  Globe, 
  Shield,
  Upload,
  AlertTriangle
} from "lucide-react";

interface ExportComplianceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  complianceType: string;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: any[];
}

export const ExportComplianceWizard = ({ isOpen, onClose, complianceType }: ExportComplianceWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const wizardSteps: WizardStep[] = [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Tell us about your artwork and export plans",
      icon: <FileText className="w-6 h-6" />,
      fields: [
        { name: "artworkName", label: "Artwork Name", type: "text", required: true },
        { name: "artworkType", label: "Artwork Type", type: "select", options: ["Painting", "Sculpture", "Textile", "Pottery", "Jewelry", "Other"], required: true },
        { name: "targetCountry", label: "Target Export Country", type: "select", options: ["USA", "UK", "Germany", "France", "Canada", "Australia", "Japan"], required: true },
        { name: "estimatedValue", label: "Estimated Value (₹)", type: "number", required: true },
        { name: "quantity", label: "Quantity", type: "number", required: true }
      ]
    },
    {
      id: "materials",
      title: "Materials & Composition",
      description: "Provide details about materials used in your artwork",
      icon: <Package className="w-6 h-6" />,
      fields: [
        { name: "primaryMaterial", label: "Primary Material", type: "select", options: ["Cotton", "Silk", "Wood", "Metal", "Clay", "Stone", "Paper", "Canvas"], required: true },
        { name: "secondaryMaterials", label: "Secondary Materials", type: "textarea", placeholder: "List all other materials used..." },
        { name: "naturalDyes", label: "Uses Natural Dyes", type: "checkbox" },
        { name: "chemicalTreatments", label: "Any Chemical Treatments", type: "textarea", placeholder: "Describe any chemical treatments or finishes..." },
        { name: "dimensions", label: "Dimensions (L x W x H)", type: "text", placeholder: "e.g., 30cm x 40cm x 2cm", required: true },
        { name: "weight", label: "Weight (grams)", type: "number", required: true }
      ]
    },
    {
      id: "documentation",
      title: "Documentation Requirements",
      description: "Upload and verify required documents",
      icon: <Shield className="w-6 h-6" />,
      fields: [
        { name: "artisanCertificate", label: "Artisan Certificate", type: "file", required: true },
        { name: "materialCertificates", label: "Material Certificates", type: "file", multiple: true },
        { name: "qualityTestReports", label: "Quality Test Reports", type: "file", multiple: true },
        { name: "photographicEvidence", label: "High-Quality Photos", type: "file", multiple: true, required: true },
        { name: "culturalAuthenticity", label: "Cultural Authenticity Certificate", type: "file" }
      ]
    },
    {
      id: "packaging",
      title: "Packaging & Shipping",
      description: "Define packaging and shipping requirements",
      icon: <Package className="w-6 h-6" />,
      fields: [
        { name: "packagingType", label: "Packaging Type", type: "select", options: ["Cardboard Box", "Wooden Crate", "Bubble Wrap", "Custom Packaging"], required: true },
        { name: "fragileHandling", label: "Requires Fragile Handling", type: "checkbox" },
        { name: "moistureProtection", label: "Needs Moisture Protection", type: "checkbox" },
        { name: "temperatureControl", label: "Temperature Controlled Shipping", type: "checkbox" },
        { name: "insuranceValue", label: "Insurance Value (₹)", type: "number", required: true },
        { name: "shippingMethod", label: "Preferred Shipping Method", type: "select", options: ["Air Freight", "Sea Freight", "Express Courier"], required: true }
      ]
    },
    {
      id: "compliance-check",
      title: "Compliance Verification",
      description: "Final compliance check and certification",
      icon: <CheckCircle className="w-6 h-6" />,
      fields: [
        { name: "exportLicense", label: "Export License Number", type: "text", required: true },
        { name: "iecCode", label: "IEC Code", type: "text", required: true },
        { name: "gstNumber", label: "GST Registration Number", type: "text", required: true },
        { name: "bankAccount", label: "Export Bank Account Details", type: "textarea", required: true },
        { name: "complianceDeclaration", label: "I declare that all information provided is accurate and complete", type: "checkbox", required: true }
      ]
    }
  ];

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNext = () => {
    const currentStepData = wizardSteps[currentStep];
    const requiredFields = currentStepData.fields.filter(field => field.required);
    
    // Validate required fields
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Export Compliance Application Submitted",
      description: "Your application has been submitted for review. You'll receive updates via email."
    });
    onClose();
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={formData[field.name] || ''} onValueChange={(value) => handleInputChange(field.name, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleInputChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {field.multiple ? 'Multiple files allowed' : 'Single file only'} • PDF, JPG, PNG up to 10MB
              </p>
              <input
                type="file"
                multiple={field.multiple}
                className="hidden"
                onChange={(e) => handleInputChange(field.name, e.target.files)}
              />
              <Button variant="outline" size="sm" className="mt-2">
                Choose Files
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Export Compliance Wizard
          </DialogTitle>
          <p className="text-gray-600">
            Step {currentStep + 1} of {wizardSteps.length}: {wizardSteps[currentStep].title}
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center space-x-2 py-4">
          {wizardSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep ? 'bg-green-500 text-white' :
                index === currentStep ? 'bg-orange-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              {index < wizardSteps.length - 1 && (
                <div className={`w-8 h-0.5 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {wizardSteps[currentStep].icon}
              {wizardSteps[currentStep].title}
            </CardTitle>
            <p className="text-gray-600">{wizardSteps[currentStep].description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wizardSteps[currentStep].fields.map(renderField)}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Save & Exit
            </Button>
            <Button 
              className="bg-gradient-cultural hover:shadow-warm"
              onClick={handleNext}
            >
              {currentStep === wizardSteps.length - 1 ? 'Submit Application' : 'Next'}
              {currentStep < wizardSteps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};