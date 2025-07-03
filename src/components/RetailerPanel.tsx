import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Scan, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "./QRScanner";
import { useAuth } from "@/hooks/useAuth";
import AnimatedBackground from "./AnimatedBackground";

const RetailerPanel = () => {
  const [productId, setProductId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [saleRecorded, setSaleRecorded] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();
  const { authFetch } = useAuth();

  const handleScanProduct = async () => {
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
        description: "Product found and ready for sale recording.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to verify product. Please try again.",
        variant: "destructive",
      });
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

  const handleRecordSale = async () => {
    if (!productId || !buyerName || !buyerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Product ID, Buyer Name, and Buyer Email).",
        variant: "destructive",
      });
      return;
    }
    if (!productInfo || !productInfo.isValid) {
      toast({
        title: "Product Not Verified",
        description: "Please verify the product before recording the sale.",
        variant: "destructive",
      });
      return;
    }
    setIsRecording(true);
    try {
      const res = await authFetch("/api/sales/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, customer: buyerName, email: buyerEmail, phone: buyerPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Recording Failed",
          description: data.message || "There was an error recording the sale.",
          variant: "destructive",
        });
        setIsRecording(false);
        return;
      }
      setSaleRecorded(true);
      toast({
        title: "Sale Recorded Successfully!",
        description: `Sale of product ${productId} has been recorded.`,
      });
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "There was an error recording the sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };

  const resetForm = () => {
    setProductId("");
    setBuyerName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setProductInfo(null);
    setSaleRecorded(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground type="shapes" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Store className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">Retailer Panel</h1>
            <p className="text-lg text-gray-600">Record product sales and associate with buyers</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scan className="h-5 w-5 mr-2" />
                  Product Verification
                </CardTitle>
                <CardDescription>
                  Scan or enter product ID to verify authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                    placeholder="Enter or scan product ID"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowScanner(true)}
                    className="px-3"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleScanProduct} className="mt-4 w-full">
                  Verify Product
                </Button>
                {productInfo && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
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
                )}
              </CardContent>
            </Card>

            {/* Sale Recording Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Sale Recording
                </CardTitle>
                <CardDescription>
                  Enter buyer information to record the sale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buyerName">Buyer Name *</Label>
                    <Input
                      id="buyerName"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      placeholder="Enter buyer's full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerEmail">Buyer Email *</Label>
                    <Input
                      id="buyerEmail"
                      type="email"
                      value={buyerEmail}
                      onChange={e => setBuyerEmail(e.target.value)}
                      placeholder="Enter buyer's email address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerPhone">Buyer Phone</Label>
                    <Input
                      id="buyerPhone"
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      placeholder="Enter buyer's phone number (optional)"
                    />
                  </div>
                  <Button
                    onClick={handleRecordSale}
                    disabled={isRecording || !buyerName || !buyerEmail || !productInfo?.isValid}
                    className="w-full mt-2"
                  >
                    {isRecording ? "Recording Sale..." : "Record Sale"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* End of main grid */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Verify Product</h4>
                <p className="text-gray-600">Scan the QR code or manually enter the Product ID to verify the product exists on the blockchain.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Enter Buyer Info</h4>
                <p className="text-gray-600">Fill in the buyer's information including name and email address for the sale record.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Record Sale</h4>
                <p className="text-gray-600">Click "Record Sale" to permanently log the transaction on the blockchain with buyer details.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanResult={handleQRScanResult}
        title="Scan Product QR Code"
        description="Point your camera at the product's QR code"
      />
    </div>
  );
};

export default RetailerPanel;
