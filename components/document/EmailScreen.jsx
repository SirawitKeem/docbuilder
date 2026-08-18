"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Loader2, Send } from "lucide-react";

export default function EmailScreen({
  defaultSubject,
  fileName,
  attachmentBase64,
  pdfBase64,
  templateId,
  templateName,
  values,
  onBack,
  onSent,
}) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [message, setMessage] = useState(
    "เรียนผู้รับ\n\nกรุณาตรวจสอบเอกสารแนบท้ายอีเมลนี้\n\nขอบคุณครับ"
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const activeAttachment = attachmentBase64 || pdfBase64;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);

  const handleSend = async () => {
    setError("");
    if (!isValidEmail) {
      setError("กรุณากรอกอีเมลผู้รับให้ถูกต้อง");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          message,
          attachmentBase64: activeAttachment,
          attachmentName: fileName,
          templateId,
          templateName,
          values,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ส่งไม่สำเร็จ");
      onSent?.({ to, fileName });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="h-16 border-b border-gray-200 bg-white flex items-center gap-4 px-6 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <p className="text-sm font-semibold text-gray-900">ส่งเอกสารทางอีเมล</p>
      </div>

      <div className="flex-1 overflow-auto flex justify-center py-10 px-4">
        <div className="w-full max-w-md space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ผู้รับ</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="client@example.com"
              className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">หัวข้อ</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ข้อความ</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ไฟล์แนบ</label>
            <div className="flex items-center gap-3 h-14 px-4 rounded-lg border border-gray-200 bg-white">
              <div className="w-8 h-8 rounded bg-error-100 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-error-600" />
              </div>
              <span className="text-sm text-gray-700 truncate">{fileName}</span>
            </div>
            {!activeAttachment && (
              <p className="text-xs text-warning-600 mt-1">ยังไม่มีไฟล์ PDF แนบ กำลังเตรียมไฟล์...</p>
            )}
          </div>

          {error && <p className="text-sm text-error-600">{error}</p>}

          <button
            onClick={handleSend}
            disabled={sending || !activeAttachment}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 disabled:opacity-50"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {sending ? "กำลังส่ง..." : "ส่งอีเมล"}
          </button>
        </div>
      </div>
    </div>
  );
}