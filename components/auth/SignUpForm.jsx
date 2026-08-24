"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      router.push("/two-step-verification");
    }, 600);
  };

  return (
    <div className="w-full space-y-5">
      {/* Form Center Box */}
      <div className="my-auto space-y-5">
        {/* Title & Subtitle */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your details below to register for DocBuilder
          </p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 pr-10 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Confirm Password <span className="text-destructive">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="pt-0.5">
            <label className="flex items-start gap-2 text-xs text-muted-foreground select-none cursor-pointer hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer mt-0.5"
              />
              <span>
                I agree to the <span className="font-semibold text-primary hover:underline">Terms & Conditions</span> and <span className="font-semibold text-primary hover:underline">Privacy Policy</span>
              </span>
            </label>
          </div>

          {/* Primary CTA Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 rounded-lg bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] hover:opacity-95 text-white px-4 text-sm font-semibold shadow-md transition focus:ring-4 focus:ring-primary/20 cursor-pointer disabled:opacity-60 mt-1"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
