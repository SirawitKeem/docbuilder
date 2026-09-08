"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, CheckCircle2 } from "lucide-react";
import {
  SettingsPageHeader,
  SettingsSectionHeading,
  SettingsCard,
} from "@/components/settings/SettingsUI";
import { Button } from "@/components/ui/button";

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState("THB");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-[640px] pb-12 text-left">
      <SettingsPageHeader
        title="Preferences"
        description="Customize your interface appearance, display theme, and workspace defaults."
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Theme Section */}
        <div>
          <SettingsSectionHeading
            title="Appearance theme"
            description="Select how the DocBuilder workspace looks to you."
          />
          <SettingsCard className="p-6 space-y-4">
            {mounted ? (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-[10px] border text-xs font-medium transition-all cursor-pointer ${
                    theme === "light"
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                      : "border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <Sun size={20} />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-[10px] border text-xs font-medium transition-all cursor-pointer ${
                    theme === "dark"
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                      : "border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <Moon size={20} />
                  <span>Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-[10px] border text-xs font-medium transition-all cursor-pointer ${
                    theme === "system"
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                      : "border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <Monitor size={20} />
                  <span>System</span>
                </button>
              </div>
            ) : (
              <div className="h-16 rounded-[8px] bg-muted/60 animate-pulse" />
            )}
          </SettingsCard>
        </div>

        {/* Regional & Defaults Section */}
        <div>
          <SettingsSectionHeading
            title="Workspace defaults"
            description="Set default regional currency and language formats."
          />
          <SettingsCard className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Default currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                >
                  <option value="THB">THB (฿) - Thai Baht</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Display language
                </label>
                <input
                  type="text"
                  value="English (United States)"
                  disabled
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-muted/40 text-xs text-muted-foreground outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
              <Button
                type="submit"
                size="sm"
                className="text-xs h-8 primary-button"
              >
                Save preferences
              </Button>
            </div>

            {saved && (
              <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                Preferences updated successfully.
              </div>
            )}
          </SettingsCard>
        </div>
      </form>
    </div>
  );
}
