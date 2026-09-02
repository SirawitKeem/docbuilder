import React from "react";
import defaultContent from "@/lib/templates/nda/content.json";

export default function NdaPage3({ content = defaultContent }) {
  const c = content || defaultContent;
  const sec5 = c.sections?.[4] || {};
  const sec6 = c.sections?.[5] || {};
  const sec7 = c.sections?.[6] || {};
  const sec8 = c.sections?.[7] || {};

  return (
    <div className="document-body pt-3">
      <h2>{sec5.title}</h2>
      <p className="pl-4">
        {sec5.content}
      </p>

      <h2>{sec6.title}</h2>
      <ul className="list-none space-y-1">
        {(sec6.subClauses || []).map((sub, idx) => (
          <li key={idx} className="pl-4">
            {sub}
          </li>
        ))}
      </ul>

      <h2>{sec7.title}</h2>
      <p className="pl-4">
        {sec7.intro}
      </p>
      <ul className="list-disc pl-10 space-y-1 mb-2 font-normal">
        {(sec7.bullets || []).map((b, idx) => (
          <li key={idx}>
            {b}
          </li>
        ))}
      </ul>
      {sec7.closing && (
        <p className="pl-4">
          {sec7.closing}
        </p>
      )}

      <h2>{sec8.title}</h2>
      <ul className="list-none space-y-1">
        {(sec8.subClauses || []).map((sub, idx) => (
          <li key={idx} className="pl-4">
            {sub}
          </li>
        ))}
      </ul>
    </div>
  );
}
