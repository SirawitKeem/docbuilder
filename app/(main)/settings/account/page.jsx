"use client";

import React, { useState } from "react";
import { UserCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  SettingsPageHeader,
  SettingsSectionHeading,
  SettingsCard,
} from "@/components/settings/SettingsUI";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AccountSettingsPage() {
  const [name, setName] = useState("Crest Zendo Admin");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-[640px] pb-12 text-left">
      <SettingsPageHeader
        title="Account & Security"
        description="Manage your personal profile identity, workspace role, and security credentials."
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Profile Section */}
        <div>
          <SettingsSectionHeading
            title="Personal profile"
            description="Your name and identity displayed across documents and revisions."
          />
          <SettingsCard className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                  CZ
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground leading-none">{name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-primary text-[10px] font-bold border border-violet-100 dark:border-violet-900/40">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">admin@crestzendo.com</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Email address
                </label>
                <input
                  type="email"
                  defaultValue="admin@crestzendo.com"
                  disabled
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-muted/40 text-xs text-muted-foreground outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </SettingsCard>
        </div>

        {/* Security Credentials Section */}
        <div>
          <SettingsSectionHeading
            title="Sign-in credentials"
            description="Ensure your account is protected with a secure password."
          />
          <SettingsCard className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Current password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Confirm new password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Two-factor authentication is active
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setName("Crest Zendo Admin")}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 primary-button"
                >
                  Save changes
                </Button>
              </div>
            </div>

            {saved && (
              <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                Account settings saved successfully.
              </div>
            )}
          </SettingsCard>
        </div>
      </form>
    </div>
  );
}
