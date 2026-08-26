"use client";

import { Suspense, useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DocumentFieldsProvider } from "@/context/DocumentFieldsContext";
import { templateRegistry } from "@/lib/templates/registry";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentFooter from "@/components/document/DocumentFooter";

function decodeValues(encoded) {
  if (!encoded) return null;
  try {
    const binaryString = atob(encoded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const json = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(json);
  } catch {
    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    } catch (e2) {
      console.error("decodeValues error:", e2);
      return null;
    }
  }
}

function PrintContent() {
  const { templateId } = useParams();
  const searchParams = useSearchParams();

  const [injectedData, setInjectedData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.__PRINT_DATA__) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInjectedData(window.__PRINT_DATA__);
    }
  }, []);

  const values = injectedData || decodeValues(searchParams.get("data")) || {};
  const entry = templateRegistry[templateId];

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        setIsReady(true);
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true);
    }
  }, []);

  if (!entry) return <p>ไม่พบเทมเพลต: {templateId}</p>;
  const { schema, pages, DocumentComponent } = entry;

  if (schema?.type === "quotation" || DocumentComponent) {
    const QuotationComp = DocumentComponent;
    return (
      <div
        id="print-root"
        className="print-page border-0 p-0 m-0 w-[794px] bg-white"
        data-ready={isReady ? "true" : "false"}
      >
        <style>{`
          @page {
            size: 210mm 297mm;
            margin: 0;
          }
          @media print, all {
            html, body {
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 794px !important;
              min-width: 794px !important;
              max-width: 794px !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
            }
            #print-root {
              margin: 0 !important;
              padding: 0 !important;
              width: 794px !important;
              height: auto !important;
              overflow: visible !important;
            }
            .quotation-document-wrapper {
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 794px !important;
              height: auto !important;
              overflow: visible !important;
            }
            .quotation-document-wrapper > div {
              display: flex !important;
              box-shadow: none !important;
              margin: 0 !important;
              width: 794px !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-sizing: border-box !important;
            }
            /* Page break BEFORE page 2, 3, ... only — never AFTER the last page */
            .quotation-document-wrapper > div + div {
              page-break-before: always !important;
              break-before: page !important;
            }
            /* Remove Tailwind space-y-8 margin gaps between page cards in print/Puppeteer */
            .quotation-document-wrapper > :not([hidden]) ~ :not([hidden]) {
              --tw-space-y-reverse: 0 !important;
              margin-top: 0 !important;
              margin-bottom: 0 !important;
            }
          }
        `}</style>
        <QuotationComp quotation={values} />
      </div>
    );
  }

  return (
    <DocumentFieldsProvider initialValues={values} defaultReadOnly>
      <div id="print-root">
        {(pages || []).map((PageContent, i) => (
          <div
            key={i}
            className="print-page font-noto-looped"
            data-ready={isReady ? "true" : "false"}
          >
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
