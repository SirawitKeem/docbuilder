"use client";

import { ArrowLeft, Send, Download, Loader2 } from "lucide-react";
import { useDocumentFields } from "@/context/DocumentFieldsContext";
import DocumentHeader from "./DocumentHeader";
import DocumentFooter from "./DocumentFooter";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export default function ReviewScreen({
  template,
  pages,
  status,
  onExport,
  onSendEmail,
  exporting,
  onBackToEdit,
  customRender = false,
}) {
  let docFieldsCtx = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    docFieldsCtx = useDocumentFields();
  } catch (e) {
    // Fallback if rendered outside of DocumentFieldsProvider
  }

  const handleBack = () => {
    if (onBackToEdit) {
      onBackToEdit();
    } else if (docFieldsCtx) {
      docFieldsCtx.setReadOnly(false);
    }
  };

  const isCustomDoc = customRender || template?.isCustomDoc;

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-noto-looped">
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <p className="text-sm font-semibold text-gray-900">ตรวจสอบเอกสารก่อนส่ง</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className={`rounded-[16px] px-5 py-4 mb-6 flex items-center gap-3 ${status.isComplete ? "bg-[#DDEEE2]" : "bg-[#F6F6FA] border border-[#E4E4E8]"}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${status.isComplete ? "bg-[#239742]" : "bg-[#B2AFBC]"}`} />
            <div>
              <p className={`text-sm font-semibold ${status.isComplete ? "text-[#17682F]" : "text-[#22162B]"}`}>
                {status.isComplete ? "✓ กรอกข้อมูลครบแล้ว" : `กรอกข้อมูลแล้ว ${status.filled}/${status.total} รายการ`}
              </p>
              <p className="text-xs text-[#646469]">
                {status.isComplete ? "พร้อมสำหรับการตรวจสอบเอกสาร" : "กรุณากลับไปกรอกข้อมูลให้ครบก่อนส่งออก"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={onSendEmail}
              disabled={!status.isComplete || exporting}
              className="flex items-center gap-2 h-11 px-5 rounded-[10px] border border-[#E4E4E8] bg-white text-[#22162B] text-sm font-medium hover:bg-[#F6F6FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
              ส่ง Email
            </button>
            <button
              onClick={onExport}
              disabled={!status.isComplete || exporting}
              className="flex items-center gap-2 h-11 px-5 rounded-[10px] bg-gradient-to-t from-[#4F03BC] to-[#9F1EF4] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Export PDF
            </button>
          </div>

          <div className="space-y-8 pb-12 flex flex-col items-center">
            {pages.map((PageContent, i) => {
              if (isCustomDoc) {
                return (
                  <div key={i} className="shrink-0">
                    <PageContent />
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className="bg-white shadow-document font-noto-looped shrink-0 text-gray-900 overflow-hidden"
                  style={{ width: A4_WIDTH, height: A4_HEIGHT, minHeight: A4_HEIGHT }}
                >
                  <div
                    className="px-14 pt-10 pb-6 flex flex-col overflow-hidden text-left"
                    style={{ height: A4_HEIGHT, boxSizing: "border-box" }}
                  >
                    <DocumentHeader logo={template.logo} />
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <PageContent />
                    </div>
                    <DocumentFooter title={template.fullName} pageNumber={i + 1} totalPages={pages.length} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}