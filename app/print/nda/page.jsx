"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import { ndaTemplate } from "@/lib/templates/nda/schema";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";
import NdaPage1 from "@/components/document/nda/NdaPage1";
import NdaPage2 from "@/components/document/nda/NdaPage2";
import NdaPage3 from "@/components/document/nda/NdaPage3";
import NdaPage4 from "@/components/document/nda/NdaPage4";

const pageComponents = [NdaPage1, NdaPage2, NdaPage3, NdaPage4];

function decodeValues(encoded) {
  if (!encoded) return {};
  try {
    const json = decodeURIComponent(
      atob(encoded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function PrintContent() {
  const searchParams = useSearchParams();
  const values = decodeValues(searchParams.get("data"));

  return (
    <DocumentFieldsProvider initialValues={values} defaultReadOnly={true}>
      <div id="print-root">
        {pageComponents.map((PageContent, i) => (
          <div key={i} className="print-page font-noto-looped">
            <DocumentHeader logo={ndaTemplate.logo} />
            <div className="print-page-body">
              <PageContent />
            </div>
            <DocumentFooter
              title="NON-DISCLOSURE AGREEMENT"
              pageNumber={i + 1}
              totalPages={pageComponents.length}
            />
          </div>
        ))}
      </div>
    </DocumentFieldsProvider>
  );
}

export default function PrintNdaPage() {
  return (
    <Suspense fallback={null}>
      <PrintContent />
    </Suspense>
  );
}
