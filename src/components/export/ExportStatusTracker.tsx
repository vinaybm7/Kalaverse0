import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Package, 
  Truck, 
  Globe,
  Download,
  Eye,
  MessageSquare,
  Calendar
} from "lucide-react";

interface ExportStatusTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExportApplication {
  id: string;
  artworkName: string;
  targetCountry: string;
  submissionDate: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'shipped' | 'delivered';
  progress: number;
  estimatedCompletion: string;
  documents: { name: string; status: 'pending' | 'approved' | 'rejected' }[];
  timeline: { date: string; event: string; status: 'completed' | 'current' | 'pending' }[];
  notes: string[];
}

export const ExportStatusTracker = ({ isOpen, onClose }: ExportStatusTrackerProps) => {
  const [applications] = useState<ExportApplication[]>([
    {
      id: "EXP001",
      artworkName: "Traditional Madhubani Painting",
      targetCountry: "United States",
      submissionDate: "2024-01-15",
      status: "under-review",
      progress: 65,
      estimatedCompletion: "2024-02-15",
      documents: [
        { name: "Export License", status: "approved" },
        { name: "Quality Certificate", status: "approved" },
        { name: "Cultural Authenticity", status: "pending" },
        { name: "Packaging Compliance", status: "approved" }
      ],
      timeline: [
        { date: "2024-01-15", event: "Application Submitted", status: "completed" },
        { date: "2024-01-18", event: "Initial Review Completed", status: "completed" },
        { date: "2024-01-22", event: "Document Verification", status: "current" },
        { date: "2024-01-28", event: "Quality Inspection", status: "pending" },
        { date: "2024-02-05", event: "Final Approval", status: "pending" },
        { date: "2024-02-15", event: "Export Ready", status: "pending" }
      ],
      notes: [
        "Cultural authenticity certificate pending from Heritage Board",
        "Quality inspection scheduled for next week",
        "All other documents approved successfully"
      ]
    },
    {
      id: "EXP002",
      artworkName: "Handwoven Silk Saree",
      targetCountry: "Germany",
      submissionDate: "2024-01-10",
      status: "approved",
      progress: 100,
      estimatedCompletion: "2024-02-01",
      documents: [
        { name: "Export License", status: "approved" },
        { name: "Quality Certificate", status: "approved" },
        { name: "Cultural Authenticity", status: "approved" },
        { name: "Packaging Compliance", status: "approved" }
      ],
      timeline: [
        { date: "2024-01-10", event: "Application Submitted", status: "completed" },
        { date: "2024-01-12", event: "Initial Review Completed", status: "completed" },
        { date: "2024-01-15", event: "Document Verification", status: "completed" },
        { date: "2024-01-20", event: "Quality Inspection", status: "completed" },
        { date: "2024-01-25", event: "Final Approval", status: "completed" },
        { date: "2024-02-01", event: "Export Ready", status: "completed" }
      ],
      notes: [
        "All requirements met successfully",
        "Ready for international export",
        "Certificate of compliance issued"
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'under-review': return <FileText className="w-4 h-4 text-yellow-600" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-600" />;
      case 'delivered': return <Package className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (applicationId: string) => {
    toast({
      title: "Application Details",
      description: `Viewing detailed information for ${applicationId}`
    });
  };

  const handleDownloadCertificate = (applicationId: string) => {
    toast({
      title: "Downloading Certificate",
      description: "Export compliance certificate is being downloaded..."
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Contact Support",
      description: "Opening support chat for export compliance assistance"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Export Status Tracker
          </DialogTitle>
          <p className="text-gray-600">
            Track the progress of your export compliance applications
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{app.artworkName}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Export to {app.targetCountry} • Application #{app.id}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Submitted on {app.submissionDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(app.status)} flex items-center gap-1 mb-2`}>
                      {getStatusIcon(app.status)}
                      {app.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Est. completion: {app.estimatedCompletion}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-gray-600">{app.progress}%</span>
                  </div>
                  <Progress value={app.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Document Status */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Document Status
                    </h4>
                    <div className="space-y-2">
                      {app.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{doc.name}</span>
                          <Badge className={getDocumentStatusColor(doc.status)} variant="outline">
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Progress Timeline
                    </h4>
                    <div className="space-y-3">
                      {app.timeline.map((event, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            event.status === 'completed' ? 'bg-green-500' :
                            event.status === 'current' ? 'bg-orange-500' :
                            'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <p className={`text-sm ${
                              event.status === 'completed' ? 'text-green-700' :
                              event.status === 'current' ? 'text-orange-700' :
                              'text-gray-500'
                            }`}>
                              {event.event}
                            </p>
                            <p className="text-xs text-gray-500">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {app.notes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent Updates</h4>
                    <div className="space-y-1">
                      {app.notes.map((note, index) => (
                        <p key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(app.id)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  
                  {app.status === 'approved' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadCertificate(app.id)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download Certificate
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleContactSupport}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact Support
                  </Button>
                  
                  {app.status === 'under-review' && (
                    <Button 
                      size="sm"
                      className="bg-gradient-cultural hover:shadow-warm"
                      onClick={() => {
                        toast({
                          title: "Upload Additional Documents",
                          description: "Opening document upload interface..."
                        });
                      }}
                    >
                      Upload Documents
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {applications.filter(app => app.status === 'approved').length}
                </div>
                <div className="text-sm text-blue-700">Export Ready</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'under-review').length}
                </div>
                <div className="text-sm text-yellow-700">Under Review</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {applications.length}
                </div>
                <div className="text-sm text-green-700">Total Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-800">Need Help with Export Compliance?</h3>
                <p className="text-sm text-purple-600">
                  Our experts are here to guide you through the process
                </p>
              </div>
              <Button 
                className="bg-gradient-cultural hover:shadow-warm"
                onClick={handleContactSupport}
              >
                Get Expert Help
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};