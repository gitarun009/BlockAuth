import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Search, History, AlertCircle, CheckCircle, Camera, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "./QRScanner";
import AnimatedBackground from "./AnimatedBackground";

const CustomerPanel = () => {
  const [productId, setProductId] = useState("");
  const [productInfo, setProductInfo] = useState<any>(null);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();

  const handleVerifyProduct = async () => {
    if (!productId) {
      toast({
        title: "No Product ID",
        description: "Please enter a product ID to verify.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Product Not Found",
          description: data.message || "This product is not registered.",
          variant: "destructive",
        });
        setProductInfo(null);
        setSalesHistory([]);
        return;
      }
      setProductInfo({
        id: data._id,
        name: data.name,
        manufacturer: data.manufacturer?.name || data.manufacturer,
        serialNumber: data.serialNumber,
        isValid: true,
      });
      toast({
        title: "Product Verified",
        description: "Product found. Fetching sales history...",
      });
      // Fetch sales history
      const salesRes = await fetch(`/api/sales/history/${data._id}`);
      const salesData = await salesRes.json();
      if (salesRes.ok) {
        setSalesHistory(salesData);
      } else {
        setSalesHistory([]);
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to verify product. Please try again.",
        variant: "destructive",
      });
      setProductInfo(null);
      setSalesHistory([]);
    }
  };

  const handleQRScanResult = (scannedData: string) => {
    try {
      const parsed = JSON.parse(scannedData);
      if (parsed.id) {
        setProductId(parsed.id);
        toast({
          title: "QR Code Scanned",
          description: "Product ID extracted from QR code.",
        });
      } else {
        setProductId(scannedData);
      }
    } catch (error) {
      setProductId(scannedData);
      toast({
        title: "QR Code Scanned",
        description: "Data extracted from QR code.",
      });
    }
  };

  const resetForm = () => {
    setProductId("");
    setProductInfo(null);
    setSalesHistory([]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground type="shapes" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <BadgeCheck className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">Customer Panel</h1>
            <p className="text-lg text-gray-600">Verify product authenticity and view sales history</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Product Verification
                </CardTitle>
                <CardDescription>
                  Scan QR code or enter Product ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                    placeholder="Scan QR or enter Product ID"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowScanner(true)}
                    className="px-3"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleVerifyProduct} className="mt-4 w-full">
                  Verify Product
                </Button>
              </CardContent>
            </Card>

            {/* Product Details & Sales History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Details
                </CardTitle>
                <CardDescription>
                  Product details will appear after verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productInfo ? (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center mb-2">
                        {productInfo.isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        )}
                        <span className="font-semibold">
                          {productInfo.isValid ? "Product Verified" : "Invalid Product"}
                        </span>
                      </div>
                      {productInfo.isValid && (
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Name:</span> {productInfo.name}</p>
                          <p><span className="font-medium">Serial Number:</span> {productInfo.serialNumber}</p>
                          <p><span className="font-medium">Manufacturer:</span> {productInfo.manufacturer}</p>
                        </div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center mb-2">
                        <History className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Sales History</span>
                      </div>
                      {salesHistory.length === 0 ? (
                        <p className="text-gray-500">No sales history found for this product.</p>
                      ) : (
                        <div className="space-y-2">
                          {salesHistory.map((sale, idx) => (
                            <div key={sale._id || idx} className="p-2 border rounded bg-gray-50 dark:bg-gray-800">
                              <div className="flex justify-between text-sm">
                                <span><span className="font-medium">Customer:</span> {sale.customer}</span>
                                <span><span className="font-medium">Date:</span> {new Date(sale.date).toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="font-medium">Retailer:</span> {sale.retailer?.name || sale.retailer}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" className="w-full" onClick={resetForm}>
                      New Verification
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600" style={{minHeight: '200px'}}>
                    <Package className="h-16 w-16 mb-4" />
                    <span>Enter a Product ID to view details</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions Card */}
          <Card className="mt-8 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>How to Verify Your Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1. Find the QR Code</h4>
                  <p className="text-gray-600">Look for the BlockAuth QR code on your product packaging or authentication label.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Scan or Enter ID</h4>
                  <p className="text-gray-600">Scan the QR code with your camera or manually enter the Product ID shown on the label.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. View Results</h4>
                  <p className="text-gray-600">See the verification status, product details, and complete ownership history from the blockchain.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showScanner && (
        <QRScanner
          isOpen={showScanner}
          onScanResult={handleQRScanResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default CustomerPanel;
