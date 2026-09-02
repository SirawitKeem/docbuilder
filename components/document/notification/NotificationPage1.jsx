"use client";

import React from "react";
import Field from "../Field";
import defaultContent from "@/lib/templates/notification/content.json";

export default function NotificationPage1({ content = defaultContent }) {
  const c = content || defaultContent;

  return (
    <div
      className="h-full flex flex-col justify-between text-[14.5px] leading-[1.7] text-left font-noto-looped text-gray-900"
      style={{ fontFamily: "'Noto Sans', var(--font-noto-sans), 'Noto Sans Thai Looped', var(--font-noto-thai-looped), sans-serif" }}
    >
      {/* ── TOP & MAIN CONTENT ── */}
      <div>
        {/* ── TOP FLUSH GRAPHIC STRIPE (Flush to top edge of paper) ── */}
        <div className="-mx-12 -mt-0 mb-4 overflow-hidden pointer-events-none">
          <svg viewBox="0 0 1000 48" className="w-full h-[36px] block" preserveAspectRatio="none">
            <defs>
              <linearGradient id="topHeaderRedRibbon1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="25%" stopColor="#b91c1c" />
                <stop offset="65%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="topHeaderRedShadow1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="1000" height="11" fill="#242b35" />
            <path d="M 620 11 C 645 11, 660 45, 685 45 L 1000 45 L 1000 11 Z" fill="url(#topHeaderRedShadow1)" opacity="0.45" />
            <path d="M 630 11 C 655 11, 670 45, 695 45 L 1000 45 L 1000 11 Z" fill="url(#topHeaderRedRibbon1)" />
          </svg>
        </div>

        {/* 1. COMPANY HEADER & LOGO */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.header?.logoUrl || "/header_logo.png"}
              alt="Company Logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="space-y-0.5 pt-0.5">
            <h1 className="text-[16.5px] font-bold text-gray-900 leading-tight">
              {c.header?.companyNameTh}
            </h1>
            <p className="text-[12.5px] text-gray-700 leading-tight">
              {c.header?.companyAddressTh}
            </p>
            <p className="text-[12px] text-gray-600 leading-tight">
              เลขประจำตัวผู้เสียภาษีอากร {c.header?.taxId} ({c.header?.branch}) &nbsp;|&nbsp; โทร: {c.header?.phone}
            </p>
          </div>
        </div>

        {/* 2. DOCUMENT TITLE */}
        <div className="text-center mt-7 mb-3">
          <h2 className="text-[18.5px] font-bold text-gray-900 tracking-tight">
            {c.title?.titleTh}
          </h2>
          <p className="text-[14.5px] font-semibold text-gray-900 tracking-normal mt-0.5">
            {c.title?.titleEn}
          </p>
        </div>

        {/* 3. DATE right-aligned */}
        <div className="flex justify-end text-[14.5px] text-gray-800 my-5">
          <div className="flex items-center gap-2">
            <span>{c.labels?.dateLabel}</span>
            <Field id="doc_date" placeholder="01 กันยายน 2569 / September 01, 2026" minWidth={35} />
          </div>
        </div>

        {/* 4. TO & SUBJECT (Unbolded) */}
        <div className="space-y-1.5 text-[14.5px] text-gray-900 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-gray-900 shrink-0">{c.labels?.toLabel}</span>
            <div className="flex-1">
              <Field id="recipient" placeholder="ท่านคู่ค้าและลูกค้าผู้มีอุปการคุณ / Valued Business Partners" minWidth={45} />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-900 shrink-0">{c.labels?.subjectLabel}</span>
            <div className="flex-1">
              <Field id="subject" placeholder="แจ้งเปลี่ยนแปลงที่อยู่สำนักงานใหญ่ / Change of Head Office Address" minWidth={45} />
            </div>
          </div>
        </div>

        {/* 5. FORMAL LETTER BODY */}
        <div className="space-y-2.5 text-[14.5px] leading-[1.7] text-gray-900 text-justify mb-4">
          <p className="indent-8">
            {c.body?.paragraphThPre} <span className="font-bold text-gray-950"><Field id="effective_date" placeholder="16 กันยายน 2569" minWidth={16} /></span> {c.body?.paragraphThPost}
          </p>
          <p className="indent-8 text-gray-900">
            {c.body?.paragraphEnPre} <span className="font-bold text-gray-900"><Field id="effective_date_en" placeholder="September 16, 2026" minWidth={16} /></span> {c.body?.paragraphEnPost}
          </p>
        </div>

        {/* 6. ADDRESS CARDS */}
        <div className="space-y-4 mb-4.5 pt-1.5">
          <div style={{ backgroundColor: "#f1f3f5" }} className="rounded-xs border-l-4 border-gray-500 p-4.5">
            <div className="text-[14.5px] font-bold text-gray-900 mb-0.5">
              {c.labels?.previousAddressLabel}
            </div>
            <div className="space-y-0.5 text-[14px] text-gray-900 leading-relaxed font-normal">
              <p><Field id="old_address_th" type="textarea" placeholder="45 ซอยโกสุมรวมใจ 37 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210" minWidth={45} /></p>
              <p><Field id="old_address_en" type="textarea" placeholder="45 Soi Kosum Ruam Chai 37, Don Mueang, Don Mueang, Bangkok 10210, Thailand" minWidth={45} /></p>
            </div>
          </div>
          <div style={{ backgroundColor: "#e2eefb" }} className="rounded-xs border-l-4 border-[#1d4ed8] p-4.5">
            <div className="text-[14.5px] font-bold text-gray-950 mb-0.5">
              {c.labels?.newAddressLabel} <span className="font-semibold text-gray-800"><Field id="effective_date_badge" placeholder="(มีผล 16 ก.ย. 2569 / Effective Sept 16, 2026):" minWidth={28} /></span>
            </div>
            <div className="space-y-0.5 text-[14px] text-gray-950 leading-relaxed font-normal">
              <p><Field id="new_address_th" type="textarea" placeholder="18 ซอยโกสุมรวมใจ 35 แยก 4 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210" minWidth={45} /></p>
              <p><Field id="new_address_en" type="textarea" placeholder="18 Soi Kosum Ruam Chai 35 Yaek 4, Don Mueang, Don Mueang, Bangkok 10210, Thailand" minWidth={45} /></p>
            </div>
          </div>
        </div>

        {/* 7. SIGNATORY BLOCK */}
        <div className="pt-13 pb-1 flex justify-end">
          <div className="w-80 text-center space-y-1.5 text-[14.5px]">
            <p className="text-gray-900">
              {c.labels?.sincerelyLabel}
            </p>
            <div className="pt-10 pb-2.5 flex items-center justify-center">
              <span className="text-gray-400 font-mono tracking-wider text-[12.5px] whitespace-nowrap">
                ( ................................. )
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-gray-900 text-[14.5px]">
                <Field id="signatory_name" placeholder="นายศรายุทธ  โกสิยารักษ์" minWidth={22} />
              </p>
              <p className="text-[13.5px] text-gray-700">
                <Field id="signatory_position" placeholder="กรรมการผู้จัดการ / CEO" minWidth={22} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM FLUSH GRAPHIC STRIPE (Flush to bottom edge of paper) ── */}
      <div className="-mx-12 -mb-0 mt-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1000 48" className="w-full h-[36px] block" preserveAspectRatio="none">
          <defs>
            <linearGradient id="btmHeaderRedRibbon1" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="25%" stopColor="#b91c1c" />
              <stop offset="65%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="btmHeaderRedShadow1" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
          <path d="M 380 0 C 355 0, 340 34, 315 34 L 0 34 L 0 0 Z" fill="url(#btmHeaderRedShadow1)" opacity="0.45" />
          <path d="M 370 0 C 345 0, 330 34, 305 34 L 0 34 L 0 0 Z" fill="url(#btmHeaderRedRibbon1)" />
          <rect x="0" y="34" width="1000" height="14" fill="#242b35" />
        </svg>
      </div>
    </div>
  );
}
