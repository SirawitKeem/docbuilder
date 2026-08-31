"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Mail,
  User,
  Building2,
  ShieldCheck,
  Settings,
  Sparkles,
  Save,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data/user";

export default function SettingsPage() {
  const [emailStatus, setEmailStatus] = useState(null);
  const [userName, setUserName] = useState(currentUser.name || "ศรายุทธ โกสิยารักษ์");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch("/api/email-status")
      .then((res) => res.json())
      .then(setEmailStatus)
      .catch(() => setEmailStatus({ configured: false }));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 text-left">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center">
            <Settings size={18} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">ตั้งค่าระบบ</h1>
        </div>
        <p className="text-sm text-gray-500">
          จัดการข้อมูลโปรไฟล์ผู้ใช้ ข้อมูลนิติบุคคลหลักขององค์กร และสถานะการเชื่อมต่อบริการ
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: โปรไฟล์ผู้ใช้งาน */}
        <section className="bg-white border border-[#EAEAEF] rounded-[22px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F5F1FF] text-[#5542F6] flex items-center justify-center">
                <User size={16} />
              </div>
              <h2 className="text-sm font-bold text-gray-900">โปรไฟล์ผู้ใช้งาน</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5542F6] text-[11px] font-semibold border border-purple-100">
              ผู้ดูแลระบบ (Admin)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">ชื่อ-นามสกุล</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-[#5542F6] focus:ring-2 focus:ring-[#F5F1FF] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">อีเมลผู้ใช้งาน</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                disabled
                className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/80 text-xs text-gray-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Section 2: ข้อมูลนิติบุคคลหลักขององค์กร (Crest Zendo) */}
        <section className="bg-white border border-[#EAEAEF] rounded-[22px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 size={16} />
              </div>
              <h2 className="text-sm font-bold text-gray-900">ข้อมูลองค์กร (ฝ่ายเรา)</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
              สำนักงานใหญ่
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-semibold text-gray-700">ชื่อบริษัท</label>
                <input
                  type="text"
                  defaultValue="บริษัท เครสท์ เซนโด จำกัด"
                  disabled
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-700 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-gray-700">เลขทะเบียนนิติบุคคล (13 หลัก)</label>
                <input
                  type="text"
                  defaultValue="0105558073755"
                  disabled
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-700 outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-gray-700">ที่อยู่สำนักงานใหญ่</label>
              <textarea
                rows={2}
                defaultValue="8/40 เดอะ คอนเนค 37 ซอยช่างอากาศอุทิศ 10 แยก 1-2 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210 ประเทศไทย"
                disabled
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-700 outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-semibold text-gray-700">ผู้มีอำนาจลงนามเริ่มต้น</label>
                <input
                  type="text"
                  defaultValue="นายศรายุทธ โกสิยารักษ์"
                  disabled
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-700 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-gray-700">ตำแหน่ง</label>
                <input
                  type="text"
                  defaultValue="CEO/Founder"
                  disabled
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-700 outline-none font-medium"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: การเชื่อมต่อระบบส่งอีเมล */}
        <section className="bg-white border border-[#EAEAEF] rounded-[22px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail size={16} />
            </div>
            <h2 className="text-sm font-bold text-gray-900">การเชื่อมต่อระบบส่งอีเมล</h2>
          </div>

          {emailStatus === null ? (
            <div className="h-14 rounded-xl bg-gray-100 animate-pulse" />
          ) : emailStatus.configured ? (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-800">
                  เชื่อมต่อระบบอีเมลสำเร็จ ({emailStatus.provider || "SMTP"})
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  พร้อมส่งไฟล์เอกสารสัญญาผ่าน {emailStatus.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <XCircle size={20} className="text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800">ยังไม่ได้กำหนดค่า SMTP</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  ระบบจะใช้การจำลองการส่ง (Mock Mode) จนกว่าจะระบุในไฟล์ .env
                </p>
              </div>
            </div>
          )}

          <p className="text-[11px] text-gray-400 leading-relaxed">
            * เพื่อความปลอดภัยของข้อมูล กุญแจ API Key และรหัสผ่านการส่งอีเมลจะถูกจัดเก็บเฉพาะบนเซิร์ฟเวอร์ (.env) เท่านั้น
          </p>
        </section>

        {/* Action Button & Status Toast */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Save size={15} />
            <span>บันทึกการเปลี่ยนแปลง</span>
          </button>

          {isSaved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in duration-200">
              <CheckCircle2 size={16} />
              บันทึกการตั้งค่าเรียบร้อยแล้ว
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
