"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
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
      {/* Title & Subtitle */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sign In
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Please sign in to access your account.
        </p>
      </div>

      {/* Form Elements */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
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
            className="mt-1 block w-full rounded-lg border border-border bg-muted/20 px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/60 font-medium"
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
              placeholder="Type your password"
              required
              className="block w-full rounded-lg border border-border bg-muted/20 px-3.5 py-2.5 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/60 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-muted-foreground select-none cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <span>Keep me logged in</span>
          </label>
          <Link
            href="/reset-password"
            className="font-medium text-primary hover:underline"
          >
            Forget Password?
          </Link>
        </div>

        {/* Primary CTA Submit Button with DocBuilder Purple Gradient */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] hover:opacity-95 text-white px-4 py-2.5 text-sm font-semibold shadow-md transition focus:ring-4 focus:ring-primary/20 cursor-pointer disabled:opacity-60 mt-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Footer Link */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        New here?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
