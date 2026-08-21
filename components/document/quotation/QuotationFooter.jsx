import { Globe, MapPin, Phone, Mail } from "lucide-react";
import { quotationTemplate } from "@/lib/templates/quotation/schema";
import { useQuotationData } from "@/context/QuotationDataContext";
import InlineTextField from "./InlineTextField";

export default function QuotationFooter({ pageNumber = 1, totalPages = 1, issuerData }) {
  let quotationCtx = null;
  try {
    quotationCtx = useQuotationData();
  } catch (e) {}

  const readOnly = quotationCtx ? quotationCtx.readOnly : true;
  const updateIssuer = quotationCtx ? quotationCtx.updateIssuer : () => {};

  const defaultIssuer = quotationTemplate.issuer;
  const issuer = { ...defaultIssuer, ...(issuerData || {}) };

  return (
    <div className="w-full text-sans shrink-0 pt-1" style={{ breakInside: "avoid" }}>
      {/* Top 3-Column Address & Contacts Section */}
      <div className="border-t border-gray-300 pt-1.5 pb-1.5 grid grid-cols-12 gap-1 items-center text-[10px] text-gray-800">
        
        {/* Column 1: Website */}
        <div className="col-span-3 flex items-center gap-2 pr-2 border-r border-gray-300">
          <div className="w-5 h-5 rounded-full bg-[#0B5D39] text-white flex items-center justify-center shrink-0">
            <Globe size={11} />
          </div>
          <InlineTextField
            value={issuer.website}
            onChange={(v) => updateIssuer("website", v)}
            readOnly={readOnly}
            className="font-semibold text-gray-900 tracking-tight text-[10px]"
          />
        </div>

        {/* Column 2: Address (Expanded width to col-span-6) */}
        <div className="col-span-6 flex items-start gap-2 px-3 border-r border-gray-300">
          <div className="w-5 h-5 rounded-full bg-[#0B5D39] text-white flex items-center justify-center shrink-0 mt-0.5">
            <MapPin size={11} />
          </div>
          <div className="leading-tight text-[9px] w-full">
            <InlineTextField
              value={issuer.nameEn || "Crest Zendo Company Limited"}
              onChange={(v) => updateIssuer("nameEn", v)}
              readOnly={readOnly}
              className="font-bold text-gray-900 block"
            />
            <InlineTextField
              value={issuer.address}
              onChange={(v) => updateIssuer("address", v)}
              readOnly={readOnly}
              multiline
              className="text-gray-700 text-[9px] leading-tight block w-full"
            />
          </div>
        </div>

        {/* Column 3: Phone & Email */}
        <div className="col-span-3 flex flex-col justify-center space-y-0.5 pl-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#0B5D39] text-white flex items-center justify-center shrink-0">
              <Phone size={10} />
            </div>
            <InlineTextField
              value={issuer.phone}
              onChange={(v) => updateIssuer("phone", v)}
              readOnly={readOnly}
              className="font-bold text-gray-900 text-[9.5px]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#0B5D39] text-white flex items-center justify-center shrink-0">
              <Mail size={10} />
            </div>
            <InlineTextField
              value={issuer.email}
              onChange={(v) => updateIssuer("email", v)}
              readOnly={readOnly}
              className="font-semibold text-gray-800 text-[9.5px]"
            />
          </div>
        </div>

      </div>

      {/* Bottom Dark Green Bar with Slanted White Page Number Badge */}
      <div className="bg-[#0B5D39] h-6 text-white flex items-center justify-between pl-3 overflow-hidden relative font-sans rounded-2xs">
        <span className="font-extrabold text-[9.5px] tracking-wider uppercase">
          PARTNER IN PERFORMANCE, COMMITTED TO YOUR SUCCESS
        </span>

        {/* Slanted White Page Counter Tab */}
        <div className="h-full flex items-center pl-5 pr-4 bg-white text-gray-900 relative clip-slanted shadow-2xs">
          <span className="font-bold text-[10px] tracking-wide text-gray-900 font-sans">
            Page {pageNumber} of {totalPages}
          </span>
        </div>
      </div>

      <style jsx>{`
        .clip-slanted {
          clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
}