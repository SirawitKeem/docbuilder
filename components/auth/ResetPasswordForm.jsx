"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Form Center Box */}
      <div className="my-auto space-y-6">
        {/* Title & Subtitle */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Please enter your email address below to receive a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-5 text-center py-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-semibold leading-relaxed">
              ✓ We&apos;ve sent a password reset link to <strong className="font-bold">{email}</strong>. Please check your inbox.
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full h-11 sm:h-12 rounded-lg bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] hover:opacity-95 text-white px-4 text-sm font-semibold shadow-md transition text-center"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
                {error}
              </div>
            )}

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
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Submit Button (Send Password Reset Link) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 rounded-lg bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] hover:opacity-95 text-white px-4 text-sm font-semibold shadow-md transition focus:ring-4 focus:ring-primary/20 cursor-pointer disabled:opacity-60 mt-2"
            >
              {loading ? "Sending Link..." : "Send Password Reset Link"}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Remembered your password?{" "}
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
