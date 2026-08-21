import { CheckCircle2, FilePlus2, Clock } from "lucide-react";
import Link from "next/link";

export default function SuccessScreen({ fileName, sentTo, onCreateNew }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mb-6">
        <CheckCircle2 size={32} className="text-success-600" />
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-1">ส่งเอกสารเรียบร้อยแล้ว</h1>
      <p className="text-sm text-gray-500 mb-8">{fileName}</p>

      <div className="bg-white border border-gray-200 rounded-card px-6 py-4 mb-8 text-center">
        <p className="text-xs text-gray-500 mb-1">ส่งไปยัง</p>
        <p className="text-sm font-medium text-gray-900">{sentTo}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 h-11 px-5 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
        >
          <FilePlus2 size={16} />
          สร้างเอกสารใหม่
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 h-11 px-5 rounded-[10px] border border-[#E4E4E8] text-[#22162B] text-sm font-medium hover:bg-[#F6F6FA] transition-colors bg-white"
        >
          <Clock size={16} />
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
