import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/providers/trpc";
import { Mail, Phone, CheckCircle2, ArrowRight, Shield } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const submitMutation = trpc.application.submit.useMutation();

  const [formData, setFormData] = useState({
    amount: "",
    email: "",
    phone: "",
    occupation: "",
    idNumber: "",
    ssn: "",
    hasHouse: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount) newErrors.amount = "Please select a funding amount";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.phone || formData.phone.length < 10)
      newErrors.phone = "Please enter a valid phone number";
    if (!formData.occupation)
      newErrors.occupation = "Please enter your occupation";
    if (!formData.idNumber) newErrors.idNumber = "Please enter your ID number";
    if (!formData.ssn || formData.ssn.length < 4)
      newErrors.ssn = "Please enter a valid SSN";
    if (!formData.hasHouse)
      newErrors.hasHouse = "Please select an option";
    if (!formData.reason)
      newErrors.reason = "Please provide a reason";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const result = await submitMutation.mutateAsync({
        amount: formData.amount,
        email: formData.email,
        phone: formData.phone,
        occupation: formData.occupation,
        idNumber: formData.idNumber,
        ssn: formData.ssn,
        hasHouse: formData.hasHouse === "yes",
        reason: formData.reason,
      });

      // Store the application ID and data for the success page
      localStorage.setItem("applicationId", String(result.id));
      localStorage.setItem("applicationEmail", formData.email);
      localStorage.setItem("applicationAmount", formData.amount);

      navigate("/loading");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0a0a0a] py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="EquitySpring Group"
              className="h-10 w-10 object-contain flex-shrink-0"
            />
            <span className="text-white font-bold text-lg tracking-wide whitespace-nowrap">
              EquitySpring Group
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/80 md:pl-6">
            <Mail className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
            <span className="text-sm font-medium truncate">
              support@equityspringgroup.com
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 md:py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              Secure
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-4">
            Secure{" "}
            <span className="text-[#c9a84c]">$50k to 250k</span> In 0% APR
            Funding For Your Business In{" "}
            <span className="text-[#c9a84c]">30 Days or Less</span>
          </h1>

          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-[#c9a84c] flex-shrink-0" />
            <p className="text-gray-700 text-base md:text-lg">
              With our proven Fund Flow Formula that allows effortless access to
              capital, whether you have an existing business or starting a new one
            </p>
          </div>

          <p className="text-gray-900 font-medium text-lg">
            *To get started fill out this quick form
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 pb-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Form Fields */}
            <div className="p-6 md:p-8 space-y-5">
              {/* Funding Amount */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  How much funding are you seeking? <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.amount}
                  onValueChange={(value) => handleChange("amount", value)}
                >
                  <SelectTrigger
                    className={`w-full ${errors.amount ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select funding amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$50,000 - $75,000">$50,000 - $75,000</SelectItem>
                    <SelectItem value="$75,000 - $100,000">$75,000 - $100,000</SelectItem>
                    <SelectItem value="$100,000 - $150,000">$100,000 - $150,000</SelectItem>
                    <SelectItem value="$150,000 - $200,000">$150,000 - $200,000</SelectItem>
                    <SelectItem value="$200,000 - $250,000">$200,000 - $250,000</SelectItem>
                  </SelectContent>
                </Select>
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Occupation */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  Occupation <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Business Owner, Engineer, etc."
                  value={formData.occupation}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                  className={errors.occupation ? "border-red-500" : ""}
                />
                {errors.occupation && (
                  <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
                )}
              </div>

              {/* ID Number */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  ID Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter your government ID number"
                  value={formData.idNumber}
                  onChange={(e) => handleChange("idNumber", e.target.value)}
                  className={errors.idNumber ? "border-red-500" : ""}
                />
                {errors.idNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>
                )}
              </div>

              {/* SSN */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  Social Security Number (SSN) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="XXX-XX-XXXX"
                  value={formData.ssn}
                  onChange={(e) => handleChange("ssn", e.target.value)}
                  className={errors.ssn ? "border-red-500" : ""}
                  maxLength={11}
                />
                {errors.ssn && (
                  <p className="text-red-500 text-xs mt-1">{errors.ssn}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  Your information is encrypted and secure.
                </p>
              </div>

              {/* Has House */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  Do you currently own a house? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.hasHouse}
                  onValueChange={(value) => handleChange("hasHouse", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="house-yes" />
                    <Label htmlFor="house-yes" className="text-gray-700 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="house-no" />
                    <Label htmlFor="house-no" className="text-gray-700 cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.hasHouse && (
                  <p className="text-red-500 text-xs mt-1">{errors.hasHouse}</p>
                )}
              </div>

              {/* Reason */}
              <div>
                <Label className="text-gray-800 font-medium text-sm mb-2 block">
                  Reason for needing the funds <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Please describe why you need this funding..."
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  className={`min-h-[100px] ${errors.reason ? "border-red-500" : ""}`}
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold py-6 text-base rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitMutation.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    NEXT <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EquitySpring Group. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Your information is protected with 256-bit SSL encryption.
          </p>
        </div>
      </footer>
    </div>
  );
}
