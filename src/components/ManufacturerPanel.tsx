import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Package, Download, CheckCircle } from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AnimatedBackground from "./AnimatedBackground";

const ManufacturerPanel = () => {
  const [productName, setProductName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();
  const { authFetch } = useAuth();

  const handleRegisterProduct = async () => {
    if (!serialNumber || !productName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Serial Number and Name).",
        variant: "destructive",
      });
      return;
    }
    setIsRegistering(true);
    try {
      const res = await authFetch("/api/products/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: productName, serialNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Registration Failed",
          description: data.message || (data.errors && data.errors[0]?.msg) || "Unknown error",
          variant: "destructive",
        });
        setIsRegistering(false);
        return;
      }
      // Use backend product data for QR code
      const productData = {
        id: data.product._id,
        name: data.product.name,
        serialNumber: data.product.serialNumber,
        manufacturer: data.product.manufacturer,
        createdAt: data.product.createdAt,
        description: productDescription,
      };
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(productData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeData(qrCodeUrl);
      setIsRegistered(true);
      toast({
        title: "Product Registered Successfully!",
        description: `Product ${data.product.serialNumber} has been registered.`,
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `BlockAuth-${serialNumber}-QRCode.png`;
    link.href = qrCodeData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been saved to your downloads folder.",
    });
  };

  const resetForm = () => {
    setProductName("");
    setSerialNumber("");
    setProductDescription("");
    setQrCodeData("");
    setIsRegistered(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground type="shapes" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Package className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">Manufacturer Panel</h1>
            <p className="text-lg text-gray-600">Register new products and generate authentication QR codes</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Registration
                </CardTitle>
                <CardDescription>
                  Enter product details to register on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Enter unique serial number"
                  />
                </div>
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="productDescription">Description</Label>
                  <Textarea
                    id="productDescription"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Enter product description (optional)"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleRegisterProduct}
                    disabled={isRegistering}
                    className="flex-1"
                  >
                    {isRegistering ? "Registering..." : "Register & Generate QR"}
                  </Button>
                  {isRegistered && (
                    <Button variant="outline" onClick={resetForm}>
                      New Product
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {isRegistered ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  ) : (
                    <Package className="h-5 w-5 mr-2" />
                  )}
                  QR Code Generation
                </CardTitle>
                <CardDescription>
                  {isRegistered 
                    ? "Your product QR code is ready for download" 
                    : "QR code will appear here after registration"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {qrCodeData ? (
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                      <img
                        src={qrCodeData}
                        alt="Product QR Code"
                        className="mx-auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Serial Number: <span className="font-mono font-semibold">{serialNumber}</span>
                      </p>
                      <Button onClick={downloadQRCode} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Register a product to generate its QR code</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1. Fill Product Details</h4>
                  <p className="text-gray-600">Enter all required product information. Use the "Generate ID" button for automatic ID creation.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Register Product</h4>
                  <p className="text-gray-600">Click "Register & Generate QR" to save the product on the blockchain and create its QR code.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Download QR Code</h4>
                  <p className="text-gray-600">Download the QR code and attach it to your product packaging for authentication.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerPanel;
