"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { profileFieldDefs } from "@/lib/data/profileFields";
import { getFieldProfile, saveFieldProfile } from "@/lib/data/fieldProfile";

// จัดกลุ่มฟิลด์ตาม group ให้ฟอร์มอ่านง่ายขึ้น
function groupFields(defs) {
  const groups = {};
  for (const f of defs) {
    if (!groups[f.group]) groups[f.group] = [];
    groups[f.group].push(f);
  }
  return groups;
}

export default function ProfileDataPage() {
  const router = useRouter();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getFieldProfile().then((data) => {
      setValues(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    await saveFieldProfile(values);
    setSaved(true);
  };

  const groups = groupFields(profileFieldDefs);

  if (loading) {
    return (
      <div>
        <div className="h-64 rounded-card bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ตั้งค่าข้อมูล</h1>
      <p className="text-sm text-gray-500 mb-8">
        กรอกข้อมูลที่ใช้บ่อยไว้ที่นี่ครั้งเดียว ระบบจะดึงไปเติมให้อัตโนมัติทุกครั้งที่สร้างเอกสารใหม่
        จากเทมเพลตใดก็ได้ (แก้ไขเพิ่มเติมได้เสมอตอนกรอกเอกสารจริง)
      </p>

      {Object.entries(groups).map(([groupName, fields]) => (
        <section key={groupName} className="bg-white border border-gray-200 rounded-card p-6 mb-6 shadow-card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{groupName}</h2>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={values[f.id] || ""}
                    onChange={(e) => handleChange(f.id, e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
                  >
                    <option value="">-- {f.placeholder} --</option>
                    {f.options.map((opt) => (
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
          className="h-11 px-6 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-colors"
        >
          บันทึกข้อมูล
        </button>
        <button
          onClick={() => router.push("/create")}
          className="h-11 px-6 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          ไปเลือกเทมเพลต →
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
