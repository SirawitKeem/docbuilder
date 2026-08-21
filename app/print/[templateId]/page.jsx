"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import { templateRegistry } from "@/lib/templates/registry";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";

function decodeValues(encoded) {
  if (!encoded) return {};
  try {
    const json = decodeURIComponent(
      atob(encoded).split("").map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function PrintContent() {
  const { templateId } = useParams();
  const searchParams = useSearchParams();
  const values = decodeValues(searchParams.get("data"));
  const entry = templateRegistry[templateId];

  if (!entry) return <p>ไม่พบเทมเพลต: {templateId}</p>;
  const { schema, pages, DocumentComponent } = entry;

  if (schema?.type === "quotation" || DocumentComponent) {
    const QuotationComp = DocumentComponent;
    return (
      <div id="print-root" className="print-page border-0 p-0 m-0 w-[794px] min-h-[1123px] bg-white">
        <QuotationComp quotation={values} />
      </div>
    );
  }

  return (
    <DocumentFieldsProvider initialValues={values} defaultReadOnly>
      <div id="print-root">
        {(pages || []).map((PageContent, i) => (
          <div key={i} className="print-page font-noto-looped">
            <DocumentHeader logo={schema.logo} />
            <div className="print-page-body">
              <PageContent />
            </div>
            <DocumentFooter title={schema.fullName} pageNumber={i + 1} totalPages={pages.length} />
          </div>
        ))}
      </div>
    </DocumentFieldsProvider>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={null}>
      <PrintContent />
    </Suspense>
  );
}
