"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import AuthBackButton from "@/components/ui/AuthBackButton";

export default function AuthLayoutShell({ children, showBack = false, backHref = "/login" }) {
  return (
    <main className="h-screen w-full overflow-hidden bg-background text-foreground antialiased font-sans transition-colors">
      <div className="flex h-full w-full items-center justify-center">
        <div className="mx-auto h-full w-full p-2 sm:p-4 lg:p-6">
          
          {/* Outer Shell Card stretching 100% height and width with DocBuilder Deep Purple Gradient */}
          <div className="relative isolate flex h-full w-full flex-col items-center justify-between gap-12 overflow-hidden rounded-[20px] border border-border bg-gradient-to-l from-[#7C4DFF] via-[#9F1EF4]/50 to-[#F5F1FF] dark:from-[#4F03BC] dark:via-[#7C4DFF]/40 dark:to-[#1E1E24] p-2 md:p-3 shadow-xl lg:flex-row">
            
            {/* Left Side: White Inner Floating Form Card taking up 50% width (lg:w-1/2) */}
            <div className="relative flex h-full w-full flex-1 flex-col items-center justify-between rounded-xl border border-border bg-surface text-foreground px-6 sm:px-12 py-10 shadow-xs lg:w-1/2 lg:max-w-none">
              
              {/* Absolute Top-Left Back Button as a direct child of the white card */}
              {showBack && <AuthBackButton href={backHref} label="Back" />}

              <div className="flex w-full max-w-[460px] flex-col justify-center h-full my-auto space-y-6">
                {children}
              </div>
              
              <div className="mt-auto text-center text-xs text-muted-foreground pt-6 font-sans">
                © {new Date().getFullYear()} Ally DOC. All rights reserved.
              </div>
            </div>

            {/* Right Side: Text & Logo Content inside Outer Shell Gradient (50% width / lg:w-1/2) */}
            <div className="relative hidden w-full flex-1 shrink-0 flex-col items-start justify-center gap-6 overflow-hidden text-white lg:flex lg:w-1/2 pl-12 pr-8">
              
              {/* Logo Row */}
              <div className="flex items-center gap-4">
                <Image
                  src="/logo_ally.png"
                  alt="Ally DOC Logo"
                  width={72}
                  height={72}
                  className="w-16 h-16 object-contain drop-shadow-md shrink-0"
                />
                <div className="relative inline-flex items-center">
                  <span className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans pr-1">
                    Ally DOC
                  </span>
                  {/* White Sparkle Star placed above the letter 'C' */}
                  <Sparkles size={20} className="absolute -top-3.5 -right-3 text-white fill-white animate-pulse" />
                </div>
              </div>

              {/* Headline & Subtitle */}
              <div className="flex flex-col gap-1.5 max-w-lg">
                <p className="text-xs lg:text-sm font-normal tracking-tight text-white/85 leading-relaxed font-sans">
                  Built for Smart Automation, Designed for Efficiency
                </p>
                <h2 className="text-xl lg:text-2xl leading-snug font-medium tracking-tight text-white/95 font-sans">
                  DocBuilder System<br />Templates and Components
                </h2>
              </div>

            </div>

            {/* Right Side Repeating Stripe Background Patterns */}
            <div
              role="presentation"
              className="absolute top-0 right-0 -z-10 h-1/2 w-full bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] lg:h-60"
            />
            <div
              role="presentation"
              className="absolute right-0 bottom-0 -z-10 h-1/2 w-full bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] lg:h-60"
            />

          </div>

        </div>
      </div>
    </main>
  );
}
