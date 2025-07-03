import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Shield, Package, Store, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ManufacturerPanel from "@/components/ManufacturerPanel";
import RetailerPanel from "@/components/RetailerPanel";
import CustomerPanel from "@/components/CustomerPanel";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AnimatedBackground, { BlockchainLoader } from "../components/AnimatedBackground";

const Index = () => {
  const [activePanel, setActivePanel] = useState<'home' | 'manufacturer' | 'retailer' | 'customer'>('home');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, getRole, logout } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setRole(getRole());
    } else {
      setRole(null);
    }
  }, [isAuthenticated, getRole]);

  // Set activePanel based on ?panel= query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const panel = params.get("panel");
    if (panel === "manufacturer" || panel === "retailer" || panel === "customer") {
      setActivePanel(panel);
    } else {
      setActivePanel('home');
    }
  }, [location.search]);

  useEffect(() => {
    // Only show loading animation for unauthenticated users
    if (!isAuthenticated) {
      const timer = setTimeout(() => setLoading(false), 2500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const renderActivePanel = () => {
    if (loading) return <BlockchainLoader />;
    switch (activePanel) {
      case 'manufacturer':
        return <ManufacturerPanel />;
      case 'retailer':
        return <RetailerPanel />;
      case 'customer':
        return <CustomerPanel />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Technical Animated Backgrounds */}
            <AnimatedBackground type="lines" />
            <AnimatedBackground type="shapes" className="top-2/3" />
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 relative z-10">
              <div className="text-center mb-24">
                <div className="flex justify-center items-center mb-6">
                  <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400 mr-4" />
                  <h1 className="text-5xl font-bold text-gray-900 dark:text-white">BlockAuth</h1>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Secure product authentication system powered by blockchain technology. 
                  Verify authenticity, track ownership, and prevent counterfeiting.
                </p>
              </div>

              {/* How It Works */}
              <div className="text-center mb-24">
                <div className="max-w-5xl mx-auto rounded-3xl shadow-xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md py-12 px-4 md:px-12 border border-gray-200 dark:border-gray-700 relative">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 relative z-10">How BlockAuth Works</h2>
                  <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto relative z-10">
                    <div className="text-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                      </div>
                      <h3 className="font-semibold mb-2 dark:text-white">Register</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Manufacturer registers product on blockchain</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">2</span>
                      </div>
                      <h3 className="font-semibold mb-2 dark:text-white">Generate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Unique QR code created for product</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">3</span>
                      </div>
                      <h3 className="font-semibold mb-2 dark:text-white">Record</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Retailer records sale to buyer</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">4</span>
                      </div>
                      <h3 className="font-semibold mb-2 dark:text-white">Verify</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Customer verifies authenticity</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8 mb-24">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <Package className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                    <CardTitle className="text-xl">Manufacturer Panel</CardTitle>
                    <CardDescription>
                      Register new products on the blockchain and generate unique QR codes for authentication.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• Product registration</li>
                      <li>• QR code generation</li>
                      <li>• Blockchain integration</li>
                    </ul>
                    <Button className="w-full mt-4" onClick={() => navigate('/login?panel=manufacturer')}>
                      Access Panel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <Store className="h-12 w-12 text-orange-600 dark:text-orange-400 mb-4" />
                    <CardTitle className="text-xl">Retailer Panel</CardTitle>
                    <CardDescription>
                      Record product sales and associate them with buyers for complete traceability.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• Sale recording</li>
                      <li>• Buyer association</li>
                      <li>• Transaction logging</li>
                    </ul>
                    <Button className="w-full mt-4" onClick={() => navigate('/login?panel=retailer')}>
                      Access Panel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <Users className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                    <CardTitle className="text-xl">Customer Panel</CardTitle>
                    <CardDescription>
                      Verify product authenticity and view complete ownership history and details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• Product verification</li>
                      <li>• Authenticity check</li>
                      <li>• Ownership history</li>
                    </ul>
                    <Button className="w-full mt-4" onClick={() => navigate('/login?panel=customer')}>
                      Access Panel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">BlockAuth</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && role && (
                <>
                  <Button variant="outline" onClick={() => navigate(`/?panel=${role}`)}>
                    {role.charAt(0).toUpperCase() + role.slice(1)} Panel
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      {renderActivePanel()}
    </div>
  );
};

export default Index;