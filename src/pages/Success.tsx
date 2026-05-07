import { useEffect } from "react";
import { trpc } from "@/providers/trpc";
import {
  CheckCircle2,
  Clock,
  Mail,
  Shield,
  Award,
  TrendingUp,
  Zap,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Success() {
  const emailMutation = trpc.email.sendApproval.useMutation();
  const amount = localStorage.getItem("applicationAmount") || "$50,000 - $250,000";
  const email = localStorage.getItem("applicationEmail") || "";

  useEffect(() => {
    if (email) {
      emailMutation.mutate({
        to: email,
        subject: "Congratulations! Your Funding Application Has Been Approved - EquitySpring Group",
        body: `Dear Applicant,

Congratulations! We are pleased to inform you that your funding application with EquitySpring Group has been PRE-QUALIFIED for ${amount}.

Our team has reviewed your information and you meet the initial eligibility criteria for our 0% APR funding program.

WHAT HAPPENS NEXT:
- One of our funding specialists will contact you within 24-48 hours
- We will guide you through the final verification process
- Funds can be available in as little as 30 days

Your Application Details:
- Pre-qualified Amount: ${amount}
- Program: 0% APR Business Funding
- Estimated Funding Timeline: 30 days or less

If you have any questions, please contact us at support@equityspringgroup.com

Best regards,
The EquitySpring Group Team`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const features = [
    {
      icon: <Award className="w-6 h-6 text-[#c9a84c]" />,
      title: "0% APR",
      description: "No interest on your funding",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#c9a84c]" />,
      title: "30 Days or Less",
      description: "Quick funding turnaround",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#c9a84c]" />,
      title: "$50K - $250K",
      description: "Flexible funding amounts",
    },
    {
      icon: <Zap className="w-6 h-6 text-[#c9a84c]" />,
      title: "No Collateral",
      description: "Unsecured funding options",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0a0a0a] py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="EquitySpring Group"
              className="h-10 w-10 object-contain"
            />
            <span className="text-white font-bold text-lg tracking-wide">
              EquitySpring Group
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-sm font-medium">Secure</span>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Application Submitted Successfully
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
            Congratulations!
          </h1>

          <h2 className="text-xl md:text-2xl text-[#c9a84c] font-semibold mb-4">
            You Qualify for {amount} in 0% APR Funding
          </h2>

          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
            Our team has reviewed your application and you have been
            <span className="text-green-600 font-semibold"> pre-qualified</span>.
            Our support team will contact you shortly to discuss the next steps.
          </p>

          {/* Notification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-5 text-left flex items-start gap-3">
              <div className="w-10 h-10 bg-[#c9a84c]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Email Confirmation Sent
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  A confirmation has been sent to {email || "your email address"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 text-left flex items-start gap-3">
              <div className="w-10 h-10 bg-[#c9a84c]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Send className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Confirmation Approval Mail
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  You will receive a confirmation approval mail on the email address you provided
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-[#0a0a0a] rounded-xl p-6 md:p-8 mb-8">
            <h3 className="text-white font-semibold text-lg mb-6">
              Your Funding Benefits
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-3">
                    {feature.icon}
                  </div>
                  <h4 className="text-white font-semibold text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              What Happens Next?
            </h3>
            <ol className="space-y-3">
              {[
                "Our funding specialist will review your application in detail",
                "You will receive a phone call within 24-48 hours",
                "We'll guide you through the final documentation process",
                "Funds will be disbursed to your account within 30 days",
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">
              Have questions? Our support team is here to help.
            </p>
            <Button
              variant="outline"
              className="border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white transition-all"
              onClick={() =>
                (window.location.href = "mailto:support@equityspringgroup.com")
              }
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
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
            support@equityspringgroup.com
          </p>
        </div>
      </footer>
    </div>
  );
}
