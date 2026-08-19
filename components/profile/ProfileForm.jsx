"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { profileFieldDefs } from "@/lib/data/profileFields";
import { createFieldProfile, updateFieldProfile } from "@/lib/data/fieldProfiles";

function groupFields(defs) {
  const groups = {};
  for (const f of defs) {
    if (!groups[f.group]) groups[f.group] = [];
    groups[f.group].push(f);
  }
  return groups;
}

export default function ProfileForm({ profile }) {
  // profile = undefined → โหมดสร้างใหม่ / profile = object → โหมดแก้ไข
  const router = useRouter();
  const [name, setName] = useState(profile?.name || "");
  const [values, setValues] = useState(profile?.values || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const groups = groupFields(profileFieldDefs);

  const handleChange = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("กรุณาตั้งชื่อชุดข้อมูล เช่น ชื่อคู่ค้า เพื่อให้จำง่ายตอนเลือกใช้");
      return;
    }
    setSaving(true);
    try {
      if (profile) {
        await updateFieldProfile(profile.id, { name, values });
      } else {
        await createFieldProfile({ name, values });
      }
      setSaved(true);
      setTimeout(() => router.push("/profile-data"), 600);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-gray-200 rounded-card p-6 mb-6 shadow-card">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อชุดข้อมูล</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น บริษัท ตัวอย่าง จำกัด, ลูกค้าประจำ A"
          className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
        <p className="text-xs text-gray-400 mt-1.5">ใช้เป็นชื่อสำหรับเลือกตอนสร้างเอกสาร ไม่ปรากฏในเอกสารจริง</p>
      </div>

      {Object.entries(groups).map(([groupName, fields]) => (
        <section key={groupName} className="bg-white border border-gray-200 rounded-card p-6 mb-6 shadow-card">
          <h2 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">{groupName}</h2>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={values[f.id] || f.options?.[0] || ""}
                    onChange={(e) => handleChange(f.id, e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
                  >
                    {f.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    value={values[f.id] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => handleChange(f.id, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[f.id] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => handleChange(f.id, e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-6 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 disabled:opacity-60 transition-colors shadow-2xs"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
        <button
          onClick={() => router.push("/profile-data")}
          className="h-11 px-6 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success-600 font-medium">
            <CheckCircle2 size={16} />
            บันทึกแล้ว
          </span>
        )}
      </div>
    </div>
  );
}
