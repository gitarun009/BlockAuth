
import { useEffect, useRef, useState, useCallback } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanResult: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  description?: string;
}

const QRScanner = ({ onScanResult, onClose, isOpen, title = "QR Code Scanner", description = "Point your camera at a QR code to scan" }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const initScanner = async () => {
      try {
        setIsScanning(true);
        const scanner = new QrScanner(
          videoRef.current!,
          (result) => {
            onScanResult(result.data);
            handleClose();
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            overlay: null,
          }
        );
        await scanner.start();
        setQrScanner(scanner);
        setHasCamera(true);
      } catch (error) {
        console.error('Error starting QR scanner:', error);
        setHasCamera(false);
        toast({
          title: "Scanner Error",
          description: "Unable to start camera. Please check permissions and try again.",
          variant: "destructive",
        });
      } finally {
        setIsScanning(false);
      }
    };

    initScanner();

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [isOpen, onScanResult, onClose, toast]);

  const handleClose = useCallback(() => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
    }
    onClose();
  }, [qrScanner, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasCamera ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg"
                style={{ objectFit: 'cover' }}
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">Starting camera...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Camera Not Available</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please ensure your device has a camera and you've granted camera permissions.
              </p>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Position the QR code within the camera view to scan automatically.
            </p>
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
