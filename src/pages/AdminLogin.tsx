import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!pin) {
      setError("Please enter the admin PIN");
      return;
    }

    setIsLoading(true);

    // Simulate a brief check
    setTimeout(() => {
      if (pin === "32074319680") {
        localStorage.setItem("adminPin", pin);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid PIN code. Please try again.");
        setIsLoading(false);
      }
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="EquitySpring Group"
            className="h-16 w-16 object-contain mx-auto mb-4"
          />
          <h1 className="text-white font-bold text-2xl tracking-wide">
            EquitySpring Group
          </h1>
          <p className="text-gray-500 text-sm mt-2">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#c9a84c]/10 rounded-full mb-4">
              <Lock className="w-7 h-7 text-[#c9a84c]" />
            </div>
            <h2 className="text-white font-semibold text-lg">
              Administrator Access
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Enter your admin PIN to continue
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm mb-2 block">
                Admin PIN
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter admin PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#c9a84c] focus:ring-[#c9a84c] ${
                    error ? "border-red-500" : ""
                  }`}
                />
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#c9a84c] hover:bg-[#b8943d] text-[#0a0a0a] font-semibold py-5 text-base rounded-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Verifying..."
              ) : (
                <>
                  Access Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 text-sm hover:text-[#c9a84c] transition-colors"
            >
              Back to Prequalify Form
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
