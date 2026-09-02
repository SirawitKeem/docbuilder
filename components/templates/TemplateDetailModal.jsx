"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Eye,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  FileSignature,
  Stamp,
  Building2,
  Tag,
  Clock,
  Edit3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ICON_MAP } from "./CategoryManagerModal";
import UniversalTemplateRenderer from "@/components/document/UniversalTemplateRenderer";
import { QuotationDataProvider } from "@/context/QuotationDataContext";
import QuotationDocument from "@/components/document/quotation/QuotationDocument";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";

import NdaPage1 from "@/components/document/nda/NdaPage1";
import NdaPage2 from "@/components/document/nda/NdaPage2";
import NdaPage3 from "@/components/document/nda/NdaPage3";
import NdaPage4 from "@/components/document/nda/NdaPage4";

import DistributorPage1 from "@/components/document/distributor/DistributorPage1";
import DistributorPage2 from "@/components/document/distributor/DistributorPage2";
import DistributorPage3 from "@/components/document/distributor/DistributorPage3";
import DistributorPage4 from "@/components/document/distributor/DistributorPage4";
import DistributorPage5 from "@/components/document/distributor/DistributorPage5";

import PartnerPage1 from "@/components/document/partner/PartnerPage1";
import PartnerPage2 from "@/components/document/partner/PartnerPage2";
import PartnerPage3 from "@/components/document/partner/PartnerPage3";
import PartnerPage4 from "@/components/document/partner/PartnerPage4";
import PartnerPage5 from "@/components/document/partner/PartnerPage5";
import NotificationPage1 from "@/components/document/notification/NotificationPage1";
import NotificationRelocationDocument from "@/components/document/notification/NotificationRelocationDocument";

const emptyQuotationPreviewData = {
  id: "preview",
  quotationNo: "QT-YYYYMM-XXXX",
  revision: "01",
  quotationDate: "",
  priceValidity: "",
  deliveryTerm: "",
  creditTerm: "",
  billTo: {
    companyName: "",
    attn: "",
    endUser: "",
    subject: "",
    am: "",
  },
  lineItems: [],
  vatRate: 7,
  specialDiscount: 0,
  remarks: "",
  remarksList: [],
  senderName: "",
  senderPosition: "",
  senderEmail: "",
  senderPhone: "",
};

function AuthenticDocumentPreview({ template, currentPage = 1, scale = 0.58 }) {
  const catId = (template.categoryId || "").toLowerCase();
  const tmplId = (template.id || "").toLowerCase();

  const isLandscape = template.orientation === "landscape";
  const effectiveScale = isLandscape ? 0.48 : scale;

  if (catId === "quotation" || tmplId.includes("quotation")) {
    return (
      <div
        className="origin-top rounded-sm shadow-xl border border-gray-300 overflow-hidden"
        style={{
          width: 794 * effectiveScale,
          minHeight: 1123 * effectiveScale,
        }}
      >
        <div
          style={{
            width: 794,
            height: 1123,
            transform: `scale(${effectiveScale})`,
            transformOrigin: "top left",
          }}
        >
          <QuotationDataProvider initialQuotation={emptyQuotationPreviewData} defaultReadOnly={true}>
            <div className="bg-white overflow-hidden text-left font-noto-looped w-[794px] h-[1123px]">
              <QuotationDocument currentPage={currentPage} />
            </div>
          </QuotationDataProvider>
        </div>
      </div>
    );
  }

  if (catId === "nda" || tmplId.includes("nda")) {
    const renderNdaPage = () => {
      switch (currentPage) {
        case 2: return <NdaPage2 />;
        case 3: return <NdaPage3 />;
        case 4: return <NdaPage4 />;
        case 1:
        default:
          return <NdaPage1 />;
      }
    };

    return (
      <div
        className="origin-top rounded-sm shadow-xl border border-gray-300 overflow-hidden"
        style={{
          width: 794 * effectiveScale,
          minHeight: 1123 * effectiveScale,
        }}
      >
        <div
          style={{
            width: 794,
            height: 1123,
            transform: `scale(${effectiveScale})`,
            transformOrigin: "top left",
          }}
        >
          <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
            <div className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden w-[794px] h-[1123px]">
              <DocumentHeader logo="/quotation.png" />
              <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
                {renderNdaPage()}
              </div>
              <DocumentFooter currentPage={currentPage} totalPages={4} />
            </div>
          </DocumentFieldsProvider>
        </div>
      </div>
    );
  }

  if (catId === "partner" || tmplId.includes("partner")) {
    const renderPartnerPage = () => {
      switch (currentPage) {
        case 2: return <PartnerPage2 />;
        case 3: return <PartnerPage3 />;
        case 4: return <PartnerPage4 />;
        case 5: return <PartnerPage5 />;
        case 1:
        default:
          return <PartnerPage1 />;
      }
    };

    return (
      <div
        className="origin-top rounded-sm shadow-xl border border-gray-300 overflow-hidden"
        style={{
          width: 794 * effectiveScale,
          minHeight: 1123 * effectiveScale,
        }}
      >
        <div
          style={{
            width: 794,
            height: 1123,
            transform: `scale(${effectiveScale})`,
            transformOrigin: "top left",
          }}
        >
          <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
            <div className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden w-[794px] h-[1123px]">
              <DocumentHeader logo="/quotation.png" />
              <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
                {renderPartnerPage()}
              </div>
              <DocumentFooter currentPage={currentPage} totalPages={5} />
            </div>
          </DocumentFieldsProvider>
        </div>
      </div>
    );
  }

  if (catId === "distributor" || tmplId.includes("distributor")) {
    const renderDistributorPage = () => {
      switch (currentPage) {
        case 2: return <DistributorPage2 />;
        case 3: return <DistributorPage3 />;
        case 4: return <DistributorPage4 />;
        case 5: return <DistributorPage5 />;
        case 1:
        default:
          return <DistributorPage1 />;
      }
    };

    return (
      <div
        className="origin-top rounded-sm shadow-xl border border-gray-300 overflow-hidden"
        style={{
          width: 794 * effectiveScale,
          minHeight: 1123 * effectiveScale,
        }}
      >
        <div
          style={{
            width: 794,
            height: 1123,
            transform: `scale(${effectiveScale})`,
            transformOrigin: "top left",
          }}
        >
          <DocumentFieldsProvider initialValues={{}} defaultReadOnly={true}>
            <div className="bg-white text-left font-noto-looped px-14 pt-10 pb-6 flex flex-col justify-between overflow-hidden w-[794px] h-[1123px]">
              <DocumentHeader logo="/quotation.png" />
              <div className="flex-1 min-h-0 overflow-hidden text-gray-900 text-sm">
                {renderDistributorPage()}
              </div>
              <DocumentFooter currentPage={currentPage} totalPages={5} />
            </div>
          </DocumentFieldsProvider>
        </div>
      </div>
    );
  }

  if (catId === "notification" || tmplId.includes("notification") || tmplId.includes("relocation")) {
    return (
      <div
        className="origin-top rounded-sm shadow-xl border border-gray-300 overflow-hidden"
        style={{
          width: 794 * effectiveScale,
          minHeight: 1123 * effectiveScale,
        }}
      >
        <div
          style={{
            width: 794,
            height: 1123,
            transform: `scale(${effectiveScale})`,
            transformOrigin: "top left",
          }}
        >
          <NotificationRelocationDocument />
        </div>
      </div>
    );
  }

  return (
    <UniversalTemplateRenderer
      template={template}
      scale={effectiveScale}
    />
  );
}

export default function TemplateDetailModal({ template, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!template) return null;

  const iconName = template.icon || "FileText";
  const IconComp = ICON_MAP[iconName] || ICON_MAP.FileText;

  const catId = (template.categoryId || "").toLowerCase();
  const tmplId = (template.id || "").toLowerCase();

  let totalPages = 1;
  if (catId === "nda" || tmplId.includes("nda")) totalPages = 4;
  else if (catId === "partner" || tmplId.includes("partner")) totalPages = 5;
  else if (catId === "distributor" || tmplId.includes("distributor")) totalPages = 5;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F1FF] text-[#5542F6] border border-[#EBE3FF] flex items-center justify-center">
              <IconComp size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5542F6] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  {template.badge || "เทมเพลต"}
                </span>
                <span className="text-xs text-gray-400 font-medium">รหัส: {template.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight mt-0.5">
                {template.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: 2-Column Split */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-slate-100/60">
          {/* Left Column: Authentic Document Renderer */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Eye size={13} className="text-[#5542F6]" />
                <span>ตัวอย่างโครงสร้างหน้าเอกสารจริง (Authentic Document UI)</span>
              </span>
              <span className="text-[10px] text-gray-400">
                {template.orientation === "landscape" ? "A4 แนวนอน" : "A4 แนวตั้ง"}
              </span>
            </div>

            {/* Multi-Page Navigation Toolbar (if totalPages > 1) */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl border border-gray-200/80 p-2 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="หน้าก่อนหน้า"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <span className="text-xs font-bold text-gray-800 px-2">
                    หน้า {currentPage} จาก {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="หน้าถัดไป"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pg
                          ? "bg-[#5542F6] text-white shadow-2xs"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Canvas */}
            <div className="p-4 rounded-2xl bg-gray-200/60 border border-gray-300/80 flex justify-center shadow-inner overflow-hidden">
              <AuthenticDocumentPreview template={template} currentPage={currentPage} scale={0.58} />
            </div>
          </div>

          {/* Right Column: Specification & Structure Details */}
          <div className="lg:col-span-5 space-y-4">
            {/* Description Card */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                วัตถุประสงค์และการใช้งาน
              </span>
              <p className="text-xs text-gray-700 leading-relaxed">
                {template.description || "เทมเพลตสำหรับใช้งานในองค์กร ปรับแต่งได้อิสระ 100%"}
              </p>
            </div>

            {/* Blocks / Elements Summary */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Layers size={13} className="text-[#5542F6]" />
                  <span>โครงสร้างบล็อกในเทมเพลต ({template.blocks?.length || 0})</span>
                </span>
                <span className="text-[10px] text-gray-400">ปรับแต่งได้แบบ Canva</span>
              </div>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {(template.blocks || []).map((b, i) => (
                  <div
                    key={b.id || i}
                    className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-gray-800">{b.title || b.type}</span>
                    <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {b.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Theme */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-2 text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                การตั้งค่าความปลอดภัยและสไตล์
              </span>
              <div className="space-y-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>การจัดวาง: {template.orientation === "landscape" ? "แนวนอน (Landscape)" : "แนวตั้ง (Portrait)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>จำนวนหน้าเอกสาร: {totalPages} หน้า A4</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>ระบบลงนามดิจิทัล (Digital Signatures)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/templates/new?edit=${template.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5542F6] hover:bg-[#4332D6] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>แก้ไขและปรับแต่งเทมเพลตนี้</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
