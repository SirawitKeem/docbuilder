"use client";

import React, { useState } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import {
  SettingsPageHeader,
  SettingsSectionHeading,
  SettingsCard,
} from "@/components/settings/SettingsUI";
import { Button } from "@/components/ui/button";

export default function GeneralSettingsPage() {
  const [companyName, setCompanyName] = useState("Crest Zendo Co., Ltd.");
  const [taxId, setTaxId] = useState("0105558073755");
  const [address, setAddress] = useState(
    "8/40 The Connect 37, Soi Chang Akat Uthit 10 Yaek 1-2, Don Mueang, Don Mueang, Bangkok 10210, Thailand"
  );
  const [signerName, setSignerName] = useState("Sarayut Kosiyarak");
  const [signerPosition, setSignerPosition] = useState("CEO / Founder");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-[640px] pb-12 text-left">
      <SettingsPageHeader
        title="General"
        description="Manage organization identity, head office legal address, and default signatories."
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Organization Details Section */}
        <div>
          <SettingsSectionHeading
            title="Organization identity"
            description="Official corporate registration information used across all issued documents."
          />
          <SettingsCard className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30">
                <Building2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-none">Crest Zendo Co., Ltd.</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Headquarters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Company name (English / Thai)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Tax Registration Number (13 Digits)
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-foreground">
                Head office address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs resize-none leading-relaxed"
              />
            </div>
          </SettingsCard>
        </div>

        {/* Authorized Signatory Section */}
        <div>
          <SettingsSectionHeading
            title="Default contract signatory"
            description="The authorized representative who signs official quotations and agreements."
          />
          <SettingsCard className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Signatory full name
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Designation / Position
                </label>
                <input
                  type="text"
                  value={signerPosition}
                  onChange={(e) => setSignerPosition(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setCompanyName("Crest Zendo Co., Ltd.");
                  setTaxId("0105558073755");
                  setAddress("8/40 The Connect 37, Soi Chang Akat Uthit 10 Yaek 1-2, Don Mueang, Don Mueang, Bangkok 10210, Thailand");
                  setSignerName("Sarayut Kosiyarak");
                  setSignerPosition("CEO / Founder");
                }}
                className="text-xs h-8"
              >
                Reset
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs h-8 primary-button"
              >
                Save changes
              </Button>
            </div>

            {saved && (
              <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                Organization details saved successfully.
              </div>
            )}
          </SettingsCard>
        </div>
      </form>
    </div>
  );
}
