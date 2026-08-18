"use client";

import { ArrowLeft, Send, Download, Loader2 } from "lucide-react";
import { useDocumentFields } from "@/context/DocumentFieldsContext";
import DocumentHeader from "./DocumentHeader";
import DocumentFooter from "./DocumentFooter";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export default function ReviewScreen({ template, pages, status, onExport, onSendEmail, exporting }) {
  const { setReadOnly } = useDocumentFields();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setReadOnly(false)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <p className="text-sm font-semibold text-gray-900">ตรวจสอบเอกสารก่อนส่ง</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className={`rounded-card px-5 py-4 mb-6 flex items-center gap-3 ${status.isComplete ? "bg-success-100" : "bg-gray-100"}`}>
            <span className={`w-2 h-2 rounded-full ${status.isComplete ? "bg-success-600" : "bg-gray-400"}`} />
            <div>
              <p className={`text-sm font-semibold ${status.isComplete ? "text-success-600" : "text-gray-700"}`}>
                {status.isComplete ? "✓ กรอกข้อมูลครบแล้ว" : `กรอกข้อมูลแล้ว ${status.filled}/${status.total} รายการ`}
              </p>
              <p className="text-xs text-gray-500">
                {status.isComplete ? "พร้อมสำหรับการตรวจสอบเอกสาร" : "กรุณากลับไปกรอกข้อมูลให้ครบก่อนส่งออก"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={onSendEmail}
              disabled={!status.isComplete || exporting}
              className="flex items-center gap-2 h-11 px-5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              ส่ง Email
            </button>
            <button
              onClick={onExport}
              disabled={!status.isComplete || exporting}
              className="flex items-center gap-2 h-11 px-5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Export PDF
            </button>
          </div>

          <div className="space-y-8 pb-12">
            {pages.map((PageContent, i) => (
              <div key={i} className="bg-white shadow-document mx-auto" style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}>
                <div className="px-16 pt-12 pb-8 flex flex-col" style={{ minHeight: A4_HEIGHT }}>
                  <DocumentHeader logo={template.logo} />
                  <div className="flex-1">
                    <PageContent />
                  </div>
                  <DocumentFooter title={template.fullName} pageNumber={i + 1} totalPages={pages.length} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}