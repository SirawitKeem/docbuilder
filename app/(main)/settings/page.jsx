"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Mail, User } from "lucide-react";
import { currentUser } from "@/lib/mock-data/user";

export default function SettingsPage() {
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    fetch("/api/email-status")
      .then((res) => res.json())
      .then(setEmailStatus)
      .catch(() => setEmailStatus({ configured: false }));
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ตั้งค่า</h1>
      <p className="text-sm text-gray-500 mb-8">จัดการโปรไฟล์และการเชื่อมต่อของระบบ</p>

      {/* โปรไฟล์ */}
      <section className="bg-white border border-gray-200 rounded-card p-6 mb-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-gray-700" />
          <h2 className="text-base font-semibold text-gray-900">โปรไฟล์</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ</label>
            <input
              type="text"
              defaultValue={currentUser.name}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
            <input
              type="email"
              defaultValue={currentUser.email}
              disabled
              className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* การเชื่อมต่ออีเมล */}
      <section className="bg-white border border-gray-200 rounded-card p-6 mb-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={18} className="text-gray-700" />
          <h2 className="text-base font-semibold text-gray-900">การเชื่อมต่ออีเมล</h2>
        </div>

        {emailStatus === null ? (
          <div className="h-12 rounded-lg bg-gray-100 animate-pulse" />
        ) : emailStatus.configured ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success-100">
            <CheckCircle2 size={18} className="text-success-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-success-600">เชื่อมต่อแล้ว ({emailStatus.provider})</p>
              <p className="text-xs text-gray-600">ส่งอีเมลผ่านบัญชี {emailStatus.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-error-100">
            <XCircle size={18} className="text-error-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-error-600">ยังไม่ได้เชื่อมต่อ</p>
              <p className="text-xs text-gray-600">
                กำหนดค่า CLIENT_ID / GMAIL_USER ใน .env
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">
          ด้วยเหตุผลด้านความปลอดภัย API / App Password จะไม่ถูกแสดงหรือแก้ไขผ่านหน้านี้ —
          ตั้งค่าได้จากไฟล์ .env บนเซิร์ฟเวอร์เท่านั้น
        </p>
      </section>

      <button className="h-11 px-6 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-sm font-semibold hover:opacity-95 transition-opacity">
        บันทึกการเปลี่ยนแปลง
      </button>
    </div>
  );
}
