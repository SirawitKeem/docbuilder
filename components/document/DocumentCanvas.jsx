"use client";

import DocumentHeader from "./DocumentHeader";
import DocumentFooter from "./DocumentFooter";

// A4 ratio 210 x 297mm — ใช้ px คงที่แล้วปรับด้วย CSS scale เพื่อรองรับ zoom
const A4_WIDTH = 794; // 210mm ที่ 96dpi
const A4_HEIGHT = 1123; // 297mm ที่ 96dpi

export default function DocumentCanvas({
  logo,
  footerTitle,
  currentPage,
  totalPages,
  zoom = 100,
  children,
}) {
  return (
    <div className="flex-1 overflow-auto bg-gray-100 flex justify-center py-10">
      <div
        style={{
          width: A4_WIDTH,
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top center",
        }}
      >
        <div
          className="bg-white shadow-document"
          style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}
        >
          <div className="px-16 pt-12 pb-8 flex flex-col font-noto-looped" style={{ minHeight: A4_HEIGHT }}>
            <DocumentHeader logo={logo} />
            <div className="flex-1">{children}</div>
            <DocumentFooter
              title={footerTitle}
              pageNumber={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}