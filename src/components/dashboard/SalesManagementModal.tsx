import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye, 
  MessageSquare,
  TrendingUp,
  Calendar
} from "lucide-react";

interface Sale {
  id: string;
  artwork: string;
  buyer: string;
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed';
  date: string;
  image: string;
  buyerEmail: string;
  shippingAddress: string;
}

interface SalesManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesManagementModal = ({ isOpen, onClose }: SalesManagementModalProps) => {
  const [sales] = useState<Sale[]>([
    {
      id: "SALE001",
      artwork: "Sunset Mandala",
      buyer: "Priya Sharma",
      amount: "₹8,000",
      status: "completed",
      date: "2024-01-18",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      buyerEmail: "priya@example.com",
      shippingAddress: "Mumbai, Maharashtra"
    },
    {
      id: "SALE002",
      artwork: "Peacock Feathers",
      buyer: "Raj Kumar",
      amount: "₹15,000",
      status: "shipped",
      date: "2024-01-22",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
      buyerEmail: "raj@example.com",
      shippingAddress: "Delhi, India"
    },
    {
      id: "SALE003",
      artwork: "Traditional Dance",
      buyer: "Meera Patel",
      amount: "₹12,000",
      status: "processing",
      date: "2024-01-25",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop",
      buyerEmail: "meera@example.com",
      shippingAddress: "Bangalore, Karnataka"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateSaleStatus = (saleId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Sale #${saleId} status updated to ${newStatus}`
    });
  };

  const contactBuyer = (sale: Sale) => {
    toast({
      title: "Contact Buyer",
      description: `Opening message to ${sale.buyer} (${sale.buyerEmail})`
    });
  };

  const totalSales = sales.reduce((sum, sale) => sum + parseInt(sale.amount.replace('₹', '').replace(',', '')), 0);
  const completedSales = sales.filter(sale => sale.status === 'completed').length;
  const pendingSales = sales.filter(sale => sale.status === 'pending' || sale.status === 'processing').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Sales Management
          </DialogTitle>
        </DialogHeader>
        
        {/* Sales Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Total Sales</p>
                  <p className="text-2xl font-bold text-green-800">₹{totalSales.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-800">{completedSales}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-800">{pendingSales}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Sales</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {sales.map((sale) => (
              <Card key={sale.id} className="hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src={sale.image} 
                      alt={sale.artwork}
                      className="w-full md:w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{sale.artwork}</h3>
                          <p className="text-sm text-gray-600">Sale #{sale.id}</p>
                          <p className="text-sm text-gray-600">Buyer: {sale.buyer}</p>
                          <p className="text-xs text-gray-500">Shipping to: {sale.shippingAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{sale.amount}</p>
                          <Badge className={`${getStatusColor(sale.status)} flex items-center gap-1`}>
                            {getStatusIcon(sale.status)}
                            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Sold on {sale.date}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Sale Details",
                              description: `Viewing details for sale #${sale.id}`
                            });
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => contactBuyer(sale)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Contact Buyer
                        </Button>
                        
                        {sale.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-cultural hover:shadow-warm"
                            onClick={() => {
                              const nextStatus = sale.status === 'pending' ? 'processing' : 
                                               sale.status === 'processing' ? 'shipped' : 
                                               sale.status === 'shipped' ? 'delivered' : 'completed';
                              updateSaleStatus(sale.id, nextStatus);
                            }}
                          >
                            Update Status
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending">
            {sales.filter(sale => sale.status === 'pending').map((sale) => (
              <Card key={sale.id} className="hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={sale.image} 
                      alt={sale.artwork}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{sale.artwork}</h3>
                      <p className="text-sm text-gray-600">Buyer: {sale.buyer}</p>
                      <p className="text-lg font-bold text-green-600">{sale.amount}</p>
                    </div>
                    <Button 
                      className="bg-gradient-cultural hover:shadow-warm"
                      onClick={() => updateSaleStatus(sale.id, 'processing')}
                    >
                      Process Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active">
            {sales.filter(sale => sale.status === 'processing' || sale.status === 'shipped').map((sale) => (
              <Card key={sale.id} className="hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={sale.image} 
                      alt={sale.artwork}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{sale.artwork}</h3>
                      <p className="text-sm text-gray-600">Buyer: {sale.buyer}</p>
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{sale.amount}</p>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => contactBuyer(sale)}
                      >
                        Contact Buyer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            {sales.filter(sale => sale.status === 'completed' || sale.status === 'delivered').map((sale) => (
              <Card key={sale.id} className="hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={sale.image} 
                      alt={sale.artwork}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{sale.artwork}</h3>
                      <p className="text-sm text-gray-600">Buyer: {sale.buyer}</p>
                      <p className="text-xs text-gray-500">Completed on {sale.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{sale.amount}</p>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};