"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Check, Sparkles } from "lucide-react";
import { fieldRegistry, categoryLabels } from "@/lib/profiles/fieldRegistry";
import { getAllTemplateSchemas, getTemplateAllKeys, getRelevantTemplates } from "@/lib/profiles/compatibility";
import { createFieldProfile, updateFieldProfile } from "@/lib/data/fieldProfiles";

function ProfileFormContent({ profile }) {
  const router = useRouter();

  const [name, setName] = useState(profile?.name || "");
  const [values, setValues] = useState(profile?.values || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const allTemplates = getAllTemplateSchemas();

  // เลือกเทมเพลตที่จะใช้ชุดข้อมูลนี้ (เริ่มต้นเป็น [] ให้ User เลือกเองทั้งหมด)
  const [selectedTemplateIds, setSelectedTemplateIds] = useState(() => {
    if (profile?.values) {
      const relevant = getRelevantTemplates(profile.values).map((r) => r.templateId);
      return relevant.length > 0 ? relevant : [];
    }
    return [];
  });

  const toggleTemplateSelect = (id) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllTemplates = () => {
    setSelectedTemplateIds(allTemplates.map((t) => t.id));
  };

  const clearAllTemplates = () => {
    setSelectedTemplateIds([]);
  };

  // แสดงเฉพาะ field ที่เทมเพลตที่เลือกใช้งานจริงเท่านั้น
  const visibleKeys = useMemo(() => {
    if (selectedTemplateIds.length === 0) return [];
    const keys = new Set();

    selectedTemplateIds.forEach((id) => {
      const templateKeys = getTemplateAllKeys(id);
      templateKeys.forEach((k) => keys.add(k));
    });

    // รักษาฟิลด์ที่มีค่าบันทึกอยู่แล้วในโปรไฟล์เดิม
    Object.entries(values).forEach(([k, v]) => {
      if (v) keys.add(k);
    });

    return [...keys].filter((k) => fieldRegistry[k]);
  }, [selectedTemplateIds, values]);

  // Group fields by category
  const grouped = useMemo(() => {
    const groups = {};
    visibleKeys.forEach((key) => {
      const cat = fieldRegistry[key]?.category || "company";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(key);
    });
    return groups;
  }, [visibleKeys]);

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a preset name for easy identification.");
      return;
    }
    if (selectedTemplateIds.length === 0 && Object.keys(values).length === 0) {
      alert("Please select at least 1 template to configure fields.");
      return;
    }
    setSaving(true);
    try {
      if (profile) await updateFieldProfile(profile.id, { name, values });
      else await createFieldProfile({ name, values });
      setSaved(true);
      setTimeout(() => router.push("/profile-data"), 600);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Navigation Back */}
      <div>
        <Link
          href="/profile-data"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-surface px-3.5 py-2 rounded-xl border border-border shadow-2xs"
        >
          <ArrowLeft size={15} />
          Back to Data Presets
        </Link>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* 1. Profile Name Input Field */}
        <div className="space-y-1.5 pb-5 border-b border-border">
          <label className="block text-sm font-semibold text-foreground">Preset Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Crest Zendo Co., Ltd., Partner Profile A"
            className="w-full h-10 px-3.5 rounded-xl border border-border bg-muted/20 text-sm text-foreground outline-none focus:border-primary focus:bg-surface font-medium transition-all placeholder:text-muted-foreground/70"
          />
          <p className="text-xs text-muted-foreground">Used to identify this preset during document generation. Does not appear on final documents.</p>
        </div>

        {/* 2. Template Selector Chips */}
        <div className="space-y-2.5 pb-5 border-b border-border">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-foreground flex items-center gap-1.5">
              <span>Compatible Templates</span>
              <Sparkles size={14} className="text-primary" />
            </label>
            <div className="flex items-center gap-3">
              {selectedTemplateIds.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllTemplates}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Deselect all
                </button>
              )}
              <button
                type="button"
                onClick={selectAllTemplates}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Select all
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Choose which document templates will use this preset — the form will adapt and display relevant fields below.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {allTemplates.map((t) => {
              const isSelected = selectedTemplateIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTemplateSelect(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 text-primary border-primary/30 shadow-2xs"
                      : "bg-surface text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {isSelected && <Check size={13} className="text-primary" />}
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Dynamic Form Fields grouped by Category */}
        {visibleKeys.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-border rounded-xl bg-muted/20 text-muted-foreground text-xs space-y-1">
            <p className="font-semibold text-foreground">💡 No templates selected</p>
            <p>Select one or more templates above to show the required fields to fill.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, keys]) => (
            <div key={category} className="space-y-4 pt-1">
              <h2 className="text-xs font-bold text-muted-foreground pb-2 border-b border-border uppercase tracking-wider">
                {categoryLabels[category] || category}
              </h2>
              <div className="space-y-4">
                {keys.map((key) => {
                  const def = fieldRegistry[key];
                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        {def.label}
                      </label>
                      {def.type === "textarea" ? (
                        <textarea
                          value={values[key] || ""}
                          placeholder={def.placeholder}
                          onChange={(e) => handleChange(key, e.target.value)}
                          rows={2}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/20 text-xs text-foreground outline-none focus:border-primary focus:bg-surface resize-none transition-all placeholder:text-muted-foreground/70"
                        />
                      ) : (
                        <input
                          type="text"
                          value={values[key] || ""}
                          placeholder={def.placeholder}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl border border-border bg-muted/20 text-xs text-foreground outline-none focus:border-primary focus:bg-surface transition-all placeholder:text-muted-foreground/70"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="primary-button h-10 px-6 rounded-xl text-white text-xs font-semibold hover:opacity-95 disabled:opacity-60 transition-opacity shadow-sm cursor-pointer"
        >
          {saving ? "Saving..." : "Save Preset"}
        </button>
        <button
          onClick={() => router.push("/profile-data")}
          className="h-10 px-5 rounded-xl border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors bg-surface cursor-pointer"
        >
          Cancel
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
            <CheckCircle2 size={15} />
            Saved successfully
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProfileForm(props) {
  return (
    <Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground text-xs">Loading...</div>}>
      <ProfileFormContent {...props} />
    </Suspense>
  );
}
