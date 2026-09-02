import React from "react";
import Field from "../Field";
import defaultContent from "@/lib/templates/nda/content.json";
import { ndaTemplate } from "@/lib/templates/nda/schema";
import { useDocumentFields } from "@/context/DocumentFieldsContext";

export default function NdaPage4({ content = defaultContent }) {
  const c = content || defaultContent;
  const sec9 = c.sections?.[8] || {};
  const sec10 = c.sections?.[9] || {};
  const { disclosingParty } = ndaTemplate;
  const { values } = useDocumentFields();

  const disclosingName = values.disclosing_signatory_name || disclosingParty.signatoryName;
  const disclosingPos = values.disclosing_signatory_position || disclosingParty.signatoryPosition;

  return (
    <div className="document-body pt-3">
      <h2>{sec9.title}</h2>
      <ul className="list-none space-y-1">
        {(sec9.subClauses || []).map((sub, idx) => (
          <li key={idx} className="pl-4">
            {sub}
          </li>
        ))}
      </ul>

      <h2>{sec10.title}</h2>
      <ul className="list-none space-y-1" style={{ marginBottom: "12px" }}>
        {(sec10.subClauses || []).map((sub, idx) => (
          <li key={idx} className="pl-4">
            {sub}
          </li>
        ))}
      </ul>

      <p className="indent-8" style={{ marginBottom: "28px" }}>
        {c.witnessStatement}
      </p>

      {/* Signature Block - Symmetrical 2 Columns */}
      <div className="grid grid-cols-2 gap-10" style={{ marginBottom: "50px" }}>
        {/* ฝั่งซ้าย: ผู้เปิดเผยข้อมูล (Disclosing Party) */}
        <div className="text-center flex flex-col items-center relative">
          <p className="font-bold mb-1">{c.signatures?.disclosingTitle}</p>
          <p className="font-bold mb-1">
            {values.disclosing_party_name || disclosingParty.name}
          </p>
          <div className="h-16 flex items-center justify-center relative w-full mb-0.5">
            {values.our_signature_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.our_signature_image}
                alt="ลายเซ็นฝ่ายเรา"
                className="max-h-14 max-w-[180px] object-contain select-none z-10"
              />
            ) : null}
          </div>
          <p className="mb-3">{c.signatures?.signPlaceholder}</p>
          <p className="mb-3">( {disclosingName} )</p>
          <p>{c.signatures?.positionPrefix} {disclosingPos}</p>
        </div>

        {/* ฝั่งขวา: ผู้รับข้อมูล (Receiving Party) */}
        <div className="text-center flex flex-col items-center">
          <p className="font-bold mb-1">{c.signatures?.receivingTitle}</p>
          <p className="font-bold mb-1">
            <Field id="receiving_party_name" placeholder="ระบุชื่อบริษัท ผู้รับข้อมูล" minWidth={20} />
          </p>
          <div className="h-16 flex items-center justify-center relative w-full mb-0.5">
            {values.counterparty_signature_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.counterparty_signature_image}
                alt="ลายเซ็นคู่สัญญา"
                className="max-h-14 max-w-[180px] object-contain select-none"
              />
            ) : null}
          </div>
          <p className="mb-3">{c.signatures?.signPlaceholder}</p>
          <p className="mb-3">
            (&nbsp;<Field id="receiving_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />&nbsp;)
          </p>
          <p>
            {c.signatures?.positionPrefix}{" "}
            <Field id="receiving_signatory_position" placeholder="เช่น กรรมการผู้จัดการ" minWidth={16} />
          </p>
        </div>
      </div>
    </div>
  );
}
