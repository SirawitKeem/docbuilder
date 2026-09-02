import React from "react";
import defaultContent from "@/lib/templates/nda/content.json";

export default function NdaPage2({ content = defaultContent }) {
  const c = content || defaultContent;
  const sec2 = c.sections?.[1] || {};
  const sec3 = c.sections?.[2] || {};
  const sec4 = c.sections?.[3] || {};

  return (
    <div className="document-body pt-3">
      <h2>{sec2.title}</h2>
      <p className="pl-4">
        {sec2.intro}
      </p>
      <ul className="list-none space-y-1 mb-4">
        {(sec2.subClauses || []).map((sub, idx) => (
          <li key={idx} className="pl-4">
            {sub}
          </li>
        ))}
      </ul>

      <h2>{sec3.title}</h2>
      <p className="pl-4">
        {sec3.intro}
      </p>
      <ul className="list-disc pl-10 space-y-1 mb-2 font-normal">
        {(sec3.bullets || []).map((b, idx) => (
          <li key={idx}>
            {b}
          </li>
        ))}
      </ul>
      {sec3.closing && (
        <p className="pl-4">
          {sec3.closing}
        </p>
      )}

      <h2>{sec4.title}</h2>
      <p className="pl-4 font-bold">
        {sec4.intro}
      </p>
      <ul className="list-none space-y-1 font-normal">
        {(sec4.subClauses || []).map((sub, idx) => (
          <li key={idx} className="pl-4">
            {sub}
          </li>
        ))}
      </ul>
    </div>
  );
}
