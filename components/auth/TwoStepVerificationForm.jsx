"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TwoStepVerificationForm() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance focus to next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Form Center Box */}
      <div className="my-auto space-y-6">
        {/* Title & Subtitle */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Two-Factor Authentication
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            We've sent a 6-digit code to your registered mobile number. Please enter it below to continue.
          </p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-1">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* 3 - 3 OTP Box Group with Middle Hyphen */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {/* First 3 Digits */}
            {otp.slice(0, 3).map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-lg font-bold text-foreground border border-slate-200 rounded-lg bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            ))}

            {/* Middle Separator Hyphen */}
            <span className="text-muted-foreground font-bold text-lg px-0.5">-</span>

            {/* Last 3 Digits */}
            {otp.slice(3, 6).map((digit, idx) => {
              const actualIdx = idx + 3;
              return (
                <input
                  key={actualIdx}
                  ref={(el) => (inputRefs.current[actualIdx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(actualIdx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(actualIdx, e)}
                  className="w-11 h-12 text-center text-lg font-bold text-foreground border border-slate-200 rounded-lg bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
              );
            })}
          </div>

          {/* Confirm Verification Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 rounded-lg bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] hover:opacity-95 text-white px-4 text-sm font-semibold shadow-md transition focus:ring-4 focus:ring-primary/20 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Confirm Verification"}
          </button>
        </form>

        {/* Didn't receive the code? Tap to resend */}
        <div className="text-center text-xs text-muted-foreground pt-1">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => alert("A new 6-digit code has been sent.")}
            className="font-semibold text-primary hover:underline cursor-pointer"
          >
            Tap to resend
          </button>
        </div>
      </div>
    </div>
  );
}
