import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { BlockchainLoader } from "./AnimatedBackground";

const validRoles = new Set(["customer", "retailer", "manufacturer"]);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get panel from query param
  const params = new URLSearchParams(location.search);
  const incomingPanel = params.get("panel");
  const panel = validRoles.has(incomingPanel || "") ? (incomingPanel as "customer"|"retailer"|"manufacturer") : "customer";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Login Failed",
          description: data.message || (data.errors && data.errors[0]?.msg) || "Unknown error",
          variant: "destructive",
        });
        setLoading(false);
      } else {
        // Store token and role in localStorage
        localStorage.setItem("blockauth_token", data.token);
        localStorage.setItem("blockauth_role", data.user?.role || panel);
        setShowLoader(true);
        setTimeout(() => {
          navigate(`/?panel=${panel}`);
        }, 2200);
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not connect to server.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (showLoader) return <BlockchainLoader text="Logging in securely..." />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div 
            className="flex flex-row items-center justify-center mb-2 gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">BlockAuth</span>
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm mt-2">
              Don't have an account? <a href={`/register?panel=${panel}`} className="text-blue-600 dark:text-blue-400 underline">Register</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 