"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function DocumentRedirectContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) throw new Error("ไม่พบเอกสารนี้ในระบบ");
        const doc = await res.json();
        const targetPath =
          doc.templateId === "quotation"
            ? `/create/quotation?id=${id}`
            : `/create/${doc.templateId || "nda"}?id=${id}`;
        router.replace(targetPath);
      } catch (err) {
        setErrorMsg(err.message || "เกิดข้อผิดพลาดในการโหลดเอกสาร");
      }
    }
    load();
  }, [id, router]);

  if (errorMsg) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold text-rose-600">{errorMsg}</p>
        <button
          onClick={() => router.push("/documents")}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
        >
          กลับไปหน้ารายการเอกสาร
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-gray-500">
      <Loader2 size={24} className="animate-spin text-purple-600" />
      <p className="text-xs font-medium">กำลังเปิดเอกสารเพื่อแก้ไข...</p>
    </div>
  );
}

export default function DocumentInspectorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-purple-600" />
        </div>
      }
    >
      <DocumentRedirectContent />
    </Suspense>
  );
}
