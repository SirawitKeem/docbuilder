import React from "react";
import Field from "../Field";
import defaultContent from "@/lib/templates/nda/content.json";

export default function NdaPage1({ content = defaultContent }) {
  const c = content || defaultContent;
  const sec1 = c.sections?.[0] || {};

  return (
    <div className="document-body">
      <h1>{c.title?.titleTh}</h1>
      <p className="subtitle text-center text-[16px] mb-2">{c.title?.titleEn}</p>

      <p style={{ marginBottom: "5px" }}>
        {c.preamble?.locationPrefix}{" "}
        <Field id="contract_location" placeholder="กรุงเทพมหานคร" minWidth={14} />{" "}
        {c.preamble?.datePrefix} <Field id="contract_date_day" placeholder="17" minWidth={3} />{" "}
        {c.preamble?.monthPrefix} <Field id="contract_date_month" placeholder="สิงหาคม" minWidth={8} />{" "}
        {c.preamble?.yearPrefix} <Field id="contract_date_year" placeholder="2569" minWidth={5} />
      </p>

      <p className="font-normal" style={{ marginTop: "4px", marginBottom: "4px" }}>
        {c.preamble?.betweenLabel}
      </p>

      <p className="indent-8" style={{ marginBottom: "4px" }}>
        (1) <Field id="disclosing_party_name" placeholder="บริษัท เครสท์ เซนโด จำกัด" minWidth={24} /> {c.preamble?.disclosingPartyBoilerplate}{" "}
        <span className="font-bold">{c.preamble?.disclosingPartyRole}</span> ฝ่ายหนึ่ง
      </p>

      <p className="font-normal" style={{ marginTop: "4px", marginBottom: "4px" }}>
        {c.preamble?.andLabel}
      </p>

      <p className="indent-8" style={{ marginBottom: "4px" }}>
        (2) บริษัท/นิติบุคคล{" "}
        <Field id="receiving_party_name" placeholder="บริษัท ตัวอย่าง จำกัด" minWidth={24} />{" "}
        {c.preamble?.receivingPartyAddressPrefix}{" "}
        <Field
          id="receiving_party_address"
          type="textarea"
          placeholder="เลขที่ ... แขวง/ตำบล ... เขต/อำเภอ ... จังหวัด ... รหัสไปรษณีย์ ..."
        />
        <br />
        ซึ่งต่อไปในสัญญานี้จะเรียกว่า{" "}
        <span className="font-bold">{c.preamble?.receivingPartyRole}</span> อีกฝ่ายหนึ่ง
      </p>

      <p className="indent-8" style={{ marginTop: "4px", marginBottom: "4px" }}>
        {c.preamble?.partiesSummary}
      </p>

      <p className="indent-8" style={{ marginTop: "6px", marginBottom: "8px" }}>
        {c.preamble?.recital}
      </p>

      <h2>{sec1.title}</h2>
      <p className="pl-4">
        {sec1.intro}
      </p>

      <ul className="list-disc pl-10 space-y-0.5">
        {(sec1.bullets || []).map((bullet, idx) => (
          <li key={idx}>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
