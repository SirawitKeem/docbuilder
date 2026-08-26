"use client";

import Image from "next/image";
import { Plus, X, Trash2 } from "lucide-react";
import PriceSummaryBlock from "./PriceSummaryBlock";
import QuotationFooter from "./QuotationFooter";
import InlineTextField from "./InlineTextField";
import InlineDatePicker from "./InlineDatePicker";
import InlineTermSelect from "./InlineTermSelect";
import { useContext } from "react";
import { quotationTemplate } from "@/lib/templates/quotation/schema";
import { QuotationDataContext } from "@/context/QuotationDataContext";
import { paginateQuotationBlocks } from "@/lib/quotationHelpers";
import { formatTHB, calcLineItemAmount } from "@/lib/format";

function LineItemHeaderRow({ item }) {
  const quotationCtx = useContext(QuotationDataContext);

  const readOnly = quotationCtx ? quotationCtx.readOnly : true;
  const updateLineItem = quotationCtx ? quotationCtx.updateLineItem : () => {};
  const removeLineItem = quotationCtx ? quotationCtx.removeLineItem : () => {};
  const addGroup = quotationCtx ? quotationCtx.addGroup : () => {};
  const addBullet = quotationCtx ? quotationCtx.addBullet : () => {};
  const amount = calcLineItemAmount(item);

  const hasContent = item.title || item.code || item.unitPrice || item.qty > 1;
  if (readOnly && !hasContent) {
    return null;
  }

  // Find or create default group for direct bullets under this item
  const firstGroupId = item.groups && item.groups.length > 0 ? item.groups[0].id : null;

  return (
    <div className="line-item-header group/item relative py-0.5">
      {/* 5 Columns: PRODUCT CODE | DESCRIPTION | QTY | PRICE | AMOUNT */}
      <div className="grid grid-cols-[105px_1fr_40px_105px_105px] gap-2 py-0.5 items-center">
        <div className="text-xs text-gray-600">
          <InlineTextField
            value={item.code}
            onChange={(v) => updateLineItem(item.id, { ...item, code: v })}
            placeholder="Code..."
            readOnly={readOnly}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <InlineTextField
            value={item.title}
            onChange={(v) => updateLineItem(item.id, { ...item, title: v })}
            placeholder="ชื่อรายการหลัก / ชื่อเรื่อง..."
            readOnly={readOnly}
            className="font-bold text-xs text-gray-900 flex-1"
          />

          {!readOnly && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  if (firstGroupId) {
                    addBullet(item.id, firstGroupId);
                  } else {
                    addGroup(item.id);
                  }
                }}
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded transition-colors"
                title="เพิ่ม Bullet (•) ใต้ชื่อเรื่องนี้"
              >
                <Plus size={11} /> เพิ่ม bullet (•)
              </button>

              <button
                onClick={() => addGroup(item.id)}
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded transition-colors"
                title="เพิ่มหมวดหมู่ย่อย"
              >
                <Plus size={11} /> เพิ่มหมวดหมู่ย่อย
              </button>

              <button
                onClick={() => removeLineItem(item.id)}
                className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-gray-400 hover:text-red-500 transition-opacity"
                title="ลบรายการหลักนี้"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-xs font-semibold text-gray-900">
          <InlineTextField
            value={item.qty}
            numeric
            onChange={(v) => updateLineItem(item.id, { ...item, qty: v })}
            readOnly={readOnly}
            className="text-center text-xs font-semibold text-gray-900 w-10"
          />
        </div>

        <div className="text-right text-xs font-semibold text-gray-900">
          {readOnly ? (
            item.unitPrice ? formatTHB(item.unitPrice) : ""
          ) : (
            <InlineTextField
              value={item.unitPrice}
              numeric
              onChange={(v) => updateLineItem(item.id, { ...item, unitPrice: v })}
              readOnly={readOnly}
              className="text-right text-xs text-gray-900 w-20"
            />
          )}
        </div>

        <div className="text-right text-xs font-bold text-gray-900">
          {amount > 0 ? formatTHB(amount) : ""}
        </div>
      </div>
    </div>
  );
}

function GroupBlockRow({ item, group }) {
  const quotationCtx = useContext(QuotationDataContext);

  const readOnly = quotationCtx ? quotationCtx.readOnly : true;
  const updateGroup = quotationCtx ? quotationCtx.updateGroup : () => {};
  const removeGroup = quotationCtx ? quotationCtx.removeGroup : () => {};
  const addBullet = quotationCtx ? quotationCtx.addBullet : () => {};
  const updateBullet = quotationCtx ? quotationCtx.updateBullet : () => {};
  const removeBullet = quotationCtx ? quotationCtx.removeBullet : () => {};
  const addSubBullet = quotationCtx ? quotationCtx.addSubBullet : () => {};

  const groupAmount = group.unitPrice ? (group.qty || 1) * group.unitPrice : null;
  const hasHeading = group.heading && group.heading.trim() !== "";
  const hasCodeOrPrice = group.code || group.unitPrice;
  const shouldRenderHeadingRow = !readOnly || hasHeading || hasCodeOrPrice;

  return (
    <div className="group-block group/group space-y-0.5 relative py-0.5 pl-1">
      {/* 5 Columns Group Header: Render ONLY if it has content or is in edit mode with a heading */}
      {shouldRenderHeadingRow && (hasHeading || hasCodeOrPrice || !readOnly) && (
        <div className="grid grid-cols-[105px_1fr_40px_105px_105px] gap-2 items-center">
          <div className="text-xs text-gray-500">
            <InlineTextField
              value={group.code}
              onChange={(v) => updateGroup(item.id, group.id, { ...group, code: v })}
              placeholder="Code..."
              readOnly={readOnly}
            />
          </div>

          <div className="flex items-center gap-1">
            <InlineTextField
              value={group.heading}
              onChange={(v) => updateGroup(item.id, group.id, { ...group, heading: v })}
              placeholder="ชื่อหมวดหมู่ย่อย (เว้นว่างได้ถ้าต้องการใส่ Bullet เลย)..."
              readOnly={readOnly}
              className="font-bold text-xs tracking-wide flex-1"
              style={{ color: "#0F4C35" }}
            />

            {!readOnly && (
              <button
                onClick={() => removeGroup(item.id, group.id)}
                className="opacity-0 group-hover/group:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-opacity shrink-0"
                title="ลบหมวดหมู่นี้"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="text-center text-xs font-semibold text-gray-900">
            <InlineTextField
              value={group.qty}
              numeric
              onChange={(v) => updateGroup(item.id, group.id, { ...group, qty: v })}
              readOnly={readOnly}
              className="text-center text-xs font-semibold text-gray-900 w-10"
            />
          </div>

          <div className="text-right text-xs font-semibold text-gray-900">
            {readOnly ? (
              group.unitPrice ? formatTHB(group.unitPrice) : ""
            ) : (
              <InlineTextField
                value={group.unitPrice}
                numeric
                onChange={(v) => updateGroup(item.id, group.id, { ...group, unitPrice: v })}
                readOnly={readOnly}
                className="text-right text-xs text-gray-900 w-20"
              />
            )}
          </div>

          <div className="text-right text-xs font-semibold text-gray-800">
            {groupAmount ? formatTHB(groupAmount) : ""}
          </div>
        </div>
      )}

      {/* Bullets List aligned across 5 Columns */}
      <div className="space-y-0.5">
        {(group.bullets || []).map((bullet) => {
          const bAmount = bullet.unitPrice ? (bullet.qty || 1) * bullet.unitPrice : null;

          return (
            <div key={bullet.id} className="space-y-0.5">
              {/* Bullet Row (5-Column Grid) */}
              <div className="grid grid-cols-[105px_1fr_40px_105px_105px] gap-2 items-center text-[10.5px] group/bullet py-0.5">
                <div className="text-[10.5px] text-gray-500">
                  <InlineTextField
                    value={bullet.code}
                    onChange={(v) => updateBullet(item.id, group.id, bullet.id, { ...bullet, code: v })}
                    placeholder=""
                    readOnly={readOnly}
                  />
                </div>

                <div className="flex items-start gap-1">
                  <span className="shrink-0 text-gray-400 font-bold mt-0.5">•</span>
                  <InlineTextField
                    value={bullet.text}
                    onChange={(v) => updateBullet(item.id, group.id, bullet.id, { ...bullet, text: v })}
                    placeholder="รายละเอียด..."
                    readOnly={readOnly}
                    className="flex-1 text-[10.5px]"
                  />

                  {!readOnly && (
                    <span className="opacity-0 group-hover/bullet:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
                      <button
                        onClick={() => addSubBullet(item.id, group.id, bullet.id)}
                        className="text-gray-400 hover:text-emerald-600 p-0.5"
                        title="เพิ่มข้อความย่อย (-)"
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        onClick={() => removeBullet(item.id, group.id, bullet.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5"
                        title="ลบรายการนี้"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}
                </div>

                <div className="text-center text-[10.5px] font-semibold text-gray-900">
                  {readOnly ? (
                    bullet.qty || ""
                  ) : (
                    <InlineTextField
                      value={bullet.qty}
                      numeric
                      onChange={(v) => updateBullet(item.id, group.id, bullet.id, { ...bullet, qty: v })}
                      placeholder=""
                      readOnly={readOnly}
                      className="text-center text-[10.5px] font-semibold text-gray-900 w-8"
                    />
                  )}
                </div>

                <div className="text-right text-[10.5px] font-semibold text-gray-900">
                  {readOnly ? (
                    bullet.unitPrice ? formatTHB(bullet.unitPrice) : ""
                  ) : (
                    <InlineTextField
                      value={bullet.unitPrice}
                      numeric
                      onChange={(v) => updateBullet(item.id, group.id, bullet.id, { ...bullet, unitPrice: v })}
                      placeholder=""
                      readOnly={readOnly}
                      className="text-right text-[10.5px] text-gray-900 w-20"
                    />
                  )}
                </div>

                <div className="text-right text-[10.5px] font-semibold text-gray-800">
                  {bAmount ? formatTHB(bAmount) : ""}
                </div>
              </div>

              {/* Sub-bullets List */}
              {bullet.subBullets?.length > 0 && (
                <div className="space-y-0.5">
                  {bullet.subBullets.map((sb) => {
                    const sbAmount = sb.unitPrice ? (sb.qty || 1) * sb.unitPrice : null;

                    return (
                      <div key={sb.id} className="grid grid-cols-[105px_1fr_40px_105px_105px] gap-2 items-center text-[10px] group/subbullet py-0.5">
                        <div />
                        <div className="flex items-start gap-1 pl-4">
                          <span className="shrink-0 text-gray-400 font-bold mt-0.5">-</span>
                          <InlineTextField
                            value={sb.text}
                            onChange={(v) => {
                              const updatedSub = bullet.subBullets.map((x) =>
                                x.id === sb.id ? { ...x, text: v } : x
                              );
                              updateBullet(item.id, group.id, bullet.id, { ...bullet, subBullets: updatedSub });
                            }}
                            placeholder="รายละเอียดย่อย..."
                            readOnly={readOnly}
                            className="flex-1 text-[10px] text-gray-600"
                          />

                          {!readOnly && (
                            <button
                              onClick={() => {
                                const updatedSub = bullet.subBullets.filter((x) => x.id !== sb.id);
                                updateBullet(item.id, group.id, bullet.id, { ...bullet, subBullets: updatedSub });
                              }}
                              className="opacity-0 group-hover/subbullet:opacity-100 text-gray-400 hover:text-red-500 p-0.5 transition-opacity"
                              title="ลบ"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>

                        <div className="text-center text-[10px] font-semibold text-gray-800">
                          {readOnly ? (
                            sb.qty || ""
                          ) : (
                            <InlineTextField
                              value={sb.qty}
                              numeric
                              onChange={(v) => {
                                const updatedSub = bullet.subBullets.map((x) =>
                                  x.id === sb.id ? { ...x, qty: v } : x
                                );
                                updateBullet(item.id, group.id, bullet.id, { ...bullet, subBullets: updatedSub });
                              }}
                              placeholder=""
                              readOnly={readOnly}
                              className="text-center text-[10px] w-8"
                            />
                          )}
                        </div>

                        <div className="text-right text-[10px] text-gray-800">
                          {readOnly ? (
                            sb.unitPrice ? formatTHB(sb.unitPrice) : ""
                          ) : (
                            <InlineTextField
                              value={sb.unitPrice}
                              numeric
                              onChange={(v) => {
                                const updatedSub = bullet.subBullets.map((x) =>
                                  x.id === sb.id ? { ...x, unitPrice: v } : x
                                );
                                updateBullet(item.id, group.id, bullet.id, { ...bullet, subBullets: updatedSub });
                              }}
                              placeholder=""
                              readOnly={readOnly}
                              className="text-right text-[10px] text-gray-800 w-20"
                            />
                          )}
                        </div>

                        <div className="text-right text-[10px] font-semibold text-gray-800">
                          {sbAmount ? formatTHB(sbAmount) : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!readOnly && hasHeading && (
        <button
          onClick={() => addBullet(item.id, group.id)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 pt-0.5 pl-[113px]"
        >
          <Plus size={12} /> เพิ่ม bullet (•)
        </button>
      )}
    </div>
  );
}

export default function QuotationDocument({ quotation: propQuotation, currentPage }) {
  const quotationCtx = useContext(QuotationDataContext);

  const quotation = quotationCtx?.quotation || propQuotation || {};
  const readOnly = quotationCtx ? quotationCtx.readOnly : true;
  const updateBillTo = quotationCtx ? quotationCtx.updateBillTo : () => {};
  const updateIssuer = quotationCtx ? quotationCtx.updateIssuer : () => {};
  const updateField = quotationCtx ? quotationCtx.updateField : () => {};
  const addLineItem = quotationCtx ? quotationCtx.addLineItem : () => {};

  const { logo } = quotationTemplate;
  const currentIssuer = { ...quotationTemplate.issuer, ...(quotation.issuer || {}) };
  const {
    quotationNo = "QT-202608063",
    quotationDate = "17 Aug 2026",
    priceValidity = "15 Sep 2026",
    deliveryTerm = "7 days",
    creditTerm = "30 days",
    billTo = {},
    lineItems: rawLineItems = [],
    vatRate = 7,
    remarks = "Payment: Annually",
    senderName = "Narin Rattanavajij (PoP)",
    senderPhone = "+6682-44-686-95",
  } = quotation;

  const lineItems = rawLineItems && rawLineItems.length > 0 ? rawLineItems : quotationTemplate.defaultLineItems;

  // Paginate line items and groups at the block level
  const pagesList = paginateQuotationBlocks(lineItems);
  const totalPages = pagesList.length;

  const displayedPages = currentPage
    ? pagesList.filter((_, idx) => idx === Math.min(Math.max(currentPage, 1), totalPages) - 1)
    : pagesList;

  return (
    <div className="quotation-document-wrapper block w-[794px] mx-auto space-y-8">
      {displayedPages.map((pageData) => {
        const pageIdx = pagesList.indexOf(pageData);
        const isFirstPage = pageIdx === 0;
        const pageNumber = pageIdx + 1;
        const { blocks, hasSummary } = pageData;

        return (
          <div
            key={pageIdx}
            className="bg-white shadow-xl rounded-sm text-gray-900 px-8 py-6 font-sans flex flex-col justify-between overflow-hidden"
            style={{ width: 794, height: 1122, minHeight: 1122, boxSizing: "border-box" }}
          >
            <div className="flex-1 flex flex-col justify-start space-y-2 overflow-hidden">
              {/* Header Section */}
              {isFirstPage ? (
                <>
                  <div className="flex items-start justify-between mb-0 pb-2" style={{ breakAfter: "avoid" }}>
                    <div className="flex items-center gap-3.5">
                      <Image src={logo} alt="logo" width={180} height={56} style={{ width: 180, height: "auto" }} className="object-contain shrink-0" />
                      <div className="flex flex-col justify-center -space-y-0.5 hidden">
                        <div className="block leading-none">
                          <InlineTextField
                            value={currentIssuer.name}
                            onChange={(v) => updateIssuer("name", v)}
                            readOnly={readOnly}
                            className="font-bold text-[11px] text-gray-900 block leading-none"
                          />
                        </div>
                        <div className="block leading-none">
                          <InlineTextField
                            value={currentIssuer.nameTh}
                            onChange={(v) => updateIssuer("nameTh", v)}
                            readOnly={readOnly}
                            className="font-bold text-[12px] text-gray-900 block leading-none"
                            style={{ letterSpacing: "0.05px" }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-700 flex items-center gap-2 leading-none">
                          <span className="shrink-0 font-medium text-gray-700">เลขประจำตัวผู้เสียภาษีอากร:</span>
                          <span
                            className="inline-flex items-center px-2 py-0.5 text-white font-bold text-[10px] tracking-wider rounded-full"
                            style={{
                              backgroundColor: "#0F4C35",
                            }}
                          >
                            <InlineTextField
                              value={currentIssuer.taxIdNumber || "0105558073755"}
                              onChange={(v) => updateIssuer("taxIdNumber", v)}
                              readOnly={readOnly}
                              className="font-bold text-[10px] text-white tracking-wider"
                            />
                          </span>
                          <span className="text-[10px] text-gray-700 font-normal">
                            <InlineTextField
                              value={currentIssuer.taxBranch || "(สำนักงานใหญ่)"}
                              onChange={(v) => updateIssuer("taxBranch", v)}
                              readOnly={readOnly}
                              className="text-[10px] text-gray-700 font-normal"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-extrabold tracking-wider pt-2 leading-none" style={{ color: "#0F4C35" }}>
                        <InlineTextField
                          value={quotation.docTitle || "QUOTATION"}
                          onChange={(v) => updateField("docTitle", v)}
                          readOnly={readOnly}
                          placeholder="QUOTATION"
                          className="text-3xl font-extrabold tracking-wider text-right leading-none"
                          style={{ color: "#0F4C35" }}
                        />
                      </h1>
                    </div>
                  </div>

                  {/* Compact 5 Symmetric Rows Grid with Top and Bottom Borders */}
                  <div className="grid grid-cols-2 gap-6 mb-0 mt-0 pt-1.5 pb-2.5" style={{ breakAfter: "avoid" }}>
                    {/* Left Table (5 Rows) */}
                    <div>
                      <table className="text-[10.5px] w-full">
                        <tbody>
                          <tr className="h-[20px]">
                            <td className="text-[#0F4C35] font-semibold w-16 py-0.5 align-middle">To</td>
                            <td className="py-0.5 align-middle">
                              <InlineTextField
                                value={billTo.companyName}
                                onChange={(v) => updateBillTo("companyName", v)}
                                readOnly={readOnly}
                                placeholder="ชื่อบริษัทลูกค้า..."
                                className="font-normal text-[10.5px] text-gray-800 w-full"
                              />
                            </td>
                          </tr>
                          <tr className="h-[20px]">
                            <td className="text-[#0F4C35] font-semibold w-16 py-0.5 align-middle">Attn.</td>
                            <td className="py-0.5 align-middle">
                              <InlineTextField
                                value={billTo.attn}
                                onChange={(v) => updateBillTo("attn", v)}
                                readOnly={readOnly}
                                placeholder="ชื่อผู้ติดต่อ..."
                                className="font-normal text-[10.5px] text-gray-800 w-full"
                              />
                            </td>
                          </tr>
                          <tr className="h-[20px]">
                            <td className="text-[#0F4C35] font-semibold w-16 py-0.5 align-middle">End User</td>
                            <td className="py-0.5 align-middle">
                              <InlineTextField
                                value={billTo.endUser}
                                onChange={(v) => updateBillTo("endUser", v)}
                                readOnly={readOnly}
                                placeholder="End User..."
                                className="font-normal text-[10.5px] text-gray-700 w-full"
                              />
                            </td>
                          </tr>
                          <tr className="h-[20px]">
                            <td className="text-[#0F4C35] font-semibold w-16 py-0.5 align-middle">Subject</td>
                            <td className="py-0.5 align-middle">
                              <InlineTextField
                                value={billTo.subject}
                                onChange={(v) => updateBillTo("subject", v)}
                                readOnly={readOnly}
                                placeholder="หัวข้อเรื่อง..."
                                className="font-normal text-[10.5px] text-gray-800 w-full"
                              />
                            </td>
                          </tr>
                          <tr className="h-[20px]">
                            <td className="text-[#0F4C35] font-semibold w-16 py-0.5 align-middle">AM</td>
                            <td className="py-0.5 align-middle">
                              <InlineTextField
                                value={billTo.am}
                                onChange={(v) => updateBillTo("am", v)}
                                readOnly={readOnly}
                                placeholder="ชื่อ AM..."
                                className="font-normal text-[10.5px] text-gray-700 w-full"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Right Table */}
                    <div className="-mt-[22px] pt-2">
                      <table className="text-[10.5px] w-[195px] border-collapse ml-auto">
                        <tbody>
                          <tr className="h-[25px]">
                            <td className="text-[#0F4C35] font-semibold py-0.5 align-middle">Quotation No.</td>
                            <td className="text-right py-0.5 align-middle flex items-center justify-end gap-1.5">
                              <span
                                className="inline-flex items-center px-2 py-0.5 text-white font-bold text-[9.5px] tracking-wider rounded-md"
                                style={{ backgroundColor: "#0F4C35" }}
                              >
                                <InlineTextField
                                  value={quotationNo}
                                  onChange={(v) => updateField("quotationNo", v)}
                                  readOnly={readOnly}
                                  className="font-bold text-[9.5px] text-white tracking-wider text-center"
                                />
                              </span>
                              <span
                                className="inline-flex items-center px-2 py-0.5 text-white font-bold text-[9.5px] tracking-wider rounded-md"
                                style={{ backgroundColor: "#0F4C35" }}
                              >
                                <InlineTextField
                                  value={quotation.revision || "01"}
                                  onChange={(v) => updateField("revision", v)}
                                  readOnly={readOnly}
                                  placeholder="01"
                                  className="font-bold text-[9.5px] text-white tracking-wider text-center"
                                />
                              </span>
                            </td>
                          </tr>
                          <tr className="h-[25px]">
                            <td className="text-[#0F4C35] font-semibold py-0.5 align-middle">Quotation Date</td>
                            <td className="text-right py-0.5 align-middle">
                              <InlineDatePicker
                                value={quotationDate}
                                onChange={(v) => updateField("quotationDate", v)}
                                readOnly={readOnly}
                                className="font-normal text-[10.5px] text-gray-800 text-right"
                              />
                            </td>
                          </tr>
                          <tr className="h-[25px]">
                            <td className="text-[#0F4C35] font-semibold py-0.5 align-middle">Price Validity</td>
                            <td className="text-right py-0.5 align-middle">
                              <InlineDatePicker
                                value={priceValidity}
                                onChange={(v) => updateField("priceValidity", v)}
                                readOnly={readOnly}
                                className="font-normal text-[10.5px] text-gray-800 text-right"
                              />
                            </td>
                          </tr>
                          <tr className="h-[25px]">
                            <td className="text-[#0F4C35] font-semibold py-0.5 align-middle">Delivery Term</td>
                            <td className="text-right py-0.5 align-middle">
                              <InlineTermSelect
                                value={deliveryTerm}
                                onChange={(v) => updateField("deliveryTerm", v)}
                                readOnly={readOnly}
                                options={["7 days", "14 days", "30 days", "60 days", "Immediate"]}
                                className="font-normal text-[10.5px] text-gray-800 text-right"
                              />
                            </td>
                          </tr>
                          <tr className="h-[25px]">
                            <td className="text-[#0F4C35] font-semibold py-0.5 align-middle">Credit Term</td>
                            <td className="text-right py-0.5 align-middle">
                              <InlineTermSelect
                                value={creditTerm}
                                onChange={(v) => updateField("creditTerm", v)}
                                readOnly={readOnly}
                                options={["30 days", "45 days", "60 days", "90 days", "Cash / 100% Advance"]}
                                className="font-normal text-[10.5px] text-gray-800 text-right"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                /* Page 2+ Continued Compact Header */
                <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Image src={logo} alt="logo" width={95} height={26} className="w-[95px] h-auto object-contain shrink-0" />
                    <span className="text-[11px] font-semibold text-gray-600">| ใบเสนอราคา (ต่อหน้า {pageNumber})</span>
                  </div>
                  <div className="text-right text-xs font-semibold text-gray-800">
                    {quotationNo}
                  </div>
                </div>
              )}

              {/* 5-Column Description Table Header (Refined lighter font size & weight) */}
              <div
                className="grid grid-cols-[105px_1fr_40px_105px_105px] gap-2 px-3 py-1.5 text-white text-[10px] font-semibold tracking-wider rounded-t-md mb-1 items-center"
                style={{ backgroundColor: "#0F4C35" }}
              >
                <span>PRODUCT CODE</span>
                <span>DESCRIPTION {pageNumber > 1 ? "(Continued)" : ""}</span>
                <span className="text-center">QTY</span>
                <span className="text-right">PRICE</span>
                <span className="text-right">AMOUNT</span>
              </div>

              {/* Description Table Flow Chunks */}
              <div className="border border-t-0 border-gray-200/90 px-3 py-1.5 rounded-b-md min-h-[160px]">
                {blocks.map((block, bIdx) => {
                  const nextBlock = blocks[bIdx + 1];
                  const isEndOfItemBlock = !nextBlock || nextBlock.type === "item-header";

                  if (block.type === "item-header") {
                    return (
                      <div
                        key={block.id}
                        className={isEndOfItemBlock ? "pb-1.5 mb-1.5" : ""}
                      >
                        <LineItemHeaderRow item={block.item} />
                      </div>
                    );
                  }
                  if (block.type === "group-block") {
                    return (
                      <div
                        key={block.id}
                        className={isEndOfItemBlock ? "pb-1.5 mb-1.5" : ""}
                      >
                        <GroupBlockRow item={block.item} group={block.group} />
                      </div>
                    );
                  }
                  return null;
                })}

                {/* Add Line Item Button (only on Page 1 if editable) */}
                {!readOnly && isFirstPage && (
                  <button
                    onClick={addLineItem}
                    className="w-full h-8 mt-2 rounded-lg border border-dashed border-gray-300 text-[11.5px] font-semibold text-gray-500 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus size={13} /> เพิ่มรายการสินค้า / บริการใหม่
                  </button>
                )}
              </div>

              {/* Summary Block (Remarks, NOTE, PRICE SUMMARY, Sign-off) */}
              {hasSummary && (
                <div className="mt-auto pt-0 mb-4" style={{ breakInside: "avoid" }}>
                  <div className="grid grid-cols-[1fr_1.3fr_1.5fr] gap-4 items-stretch mt-3">
                    {/* Column 1: Sign-off / Best regards */}
                    <div className="text-[11.5px] text-gray-800 space-y-0.5 flex flex-col justify-end h-full pb-0.5">
                      <p className="font-medium text-gray-500">Best regards,</p>
                      <div className="block">
                        <InlineTextField
                          value={senderName}
                          onChange={(v) => updateField("senderName", v)}
                          readOnly={readOnly}
                          className="font-bold text-xs text-gray-900 block"
                        />
                      </div>
                      <div className="block">
                        <InlineTextField
                          value={senderPhone}
                          onChange={(v) => updateField("senderPhone", v)}
                          readOnly={readOnly}
                          className="text-gray-500 block text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Column 2: Note Box (ลดสัดส่วนกล่อง) */}
                    <div className="border border-gray-200 rounded-lg p-2.5 bg-gray-50/40 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="w-1.5 h-1.5 rounded-xs" style={{ backgroundColor: "#0F4C35" }} />
                          <p className="text-[10px] font-bold tracking-wider" style={{ color: "#0F4C35" }}>NOTE</p>
                        </div>
                        <ul className="text-[9.5px] text-gray-600 space-y-1.5 list-disc pl-3.5 leading-snug">
                          <li>ราคานี้ยังไม่รวมภาษีมูลค่าเพิ่ม 7%</li>
                          <li>การชำระเงิน : ภายในเงื่อนไขที่กำหนด</li>
                          <li>ใบเสนอราคานี้มีผลบังคับใช้ตามวันที่ระบุเท่านั้น</li>
                          {(!readOnly || remarks) && (
                            <li>
                              <div className="inline-flex items-baseline gap-1 w-[calc(100%-10px)]">
                                <span className="font-semibold text-gray-700 shrink-0">Remarks : </span>
                                <InlineTextField
                                  value={remarks}
                                  onChange={(v) => updateField("remarks", v)}
                                  readOnly={readOnly}
                                  className="text-red-600 font-medium w-full"
                                />
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Column 3: Price Summary Box */}
                    <PriceSummaryBlock lineItems={lineItems} vatRate={vatRate} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer on EVERY Page */}
            <QuotationFooter pageNumber={pageNumber} totalPages={totalPages} issuerData={quotation.issuer} />
          </div>
        );
      })}
    </div>
  );
}