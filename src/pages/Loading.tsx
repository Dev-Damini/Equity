import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, CheckCircle2, FileSearch } from "lucide-react";

export default function Loading() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Submitting your application...");

  useEffect(() => {
    const steps = [
      { at: 0, message: "Submitting your application...", progress: 10 },
      { at: 1500, message: "Verifying your information...", progress: 35 },
      { at: 3000, message: "Running eligibility check...", progress: 60 },
      { at: 4500, message: "Analyzing funding options...", progress: 80 },
      { at: 6000, message: "Finalizing your results...", progress: 95 },
    ];

    const timers = steps.map((step) =>
      setTimeout(() => {
        setStatus(step.message);
        setProgress(step.progress);
      }, step.at)
    );

    const redirectTimer = setTimeout(() => {
      navigate("/success");
    }, 7000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo.png"
            alt="EquitySpring Group"
            className="h-16 w-16 object-contain mx-auto mb-4"
          />
          <h2 className="text-white font-bold text-xl tracking-wide">
            EquitySpring Group
          </h2>
        </div>

        {/* Processing Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <div className="mb-6">
            <div className="relative inline-block">
              <Loader2 className="w-16 h-16 text-[#c9a84c] animate-spin" />
              <FileSearch className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <h3 className="text-white font-semibold text-lg mb-2">
            Processing Your Application
          </h3>
          <p className="text-gray-400 text-sm mb-6">{status}</p>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8d5a3] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-gray-500 text-xs">
            This may take a few moments. Please do not close this window.
          </p>

          {/* Steps */}
          <div className="mt-6 space-y-2 text-left">
            <StepItem
              label="Application Received"
              done={progress >= 10}
              active={progress >= 10 && progress < 35}
            />
            <StepItem
              label="Information Verified"
              done={progress >= 35}
              active={progress >= 35 && progress < 60}
            />
            <StepItem
              label="Eligibility Check"
              done={progress >= 60}
              active={progress >= 60 && progress < 80}
            />
            <StepItem
              label="Funding Options Analyzed"
              done={progress >= 80}
              active={progress >= 80}
            />
          </div>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          Your information is secured with 256-bit encryption
        </p>
      </div>
    </div>
  );
}

function StepItem({
  label,
  done,
  active,
}: {
  label: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            active
              ? "border-[#c9a84c] bg-[#c9a84c]/20"
              : "border-gray-600"
          }`}
        />
      )}
      <span
        className={`text-sm ${
          done
            ? "text-green-400"
            : active
            ? "text-[#c9a84c]"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
