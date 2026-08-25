import { formatTHB, calcQuotationTotals } from "@/lib/format";
import { useQuotationData } from "@/context/QuotationDataContext";

export default function PriceSummaryBlock({ lineItems, vatRate }) {
  let quotationCtx = null;
  try {
    quotationCtx = useQuotationData();
  } catch (e) {}

  const readOnly = quotationCtx ? quotationCtx.readOnly : true;
  const updateField = quotationCtx ? quotationCtx.updateField : () => {};

  const currentVatRate = vatRate === undefined || vatRate === null ? 7 : Number(vatRate);
  const { subtotal, vat, grandTotal } = calcQuotationTotals(lineItems, currentVatRate);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-2xs">
      <p className="text-xs font-bold tracking-wide mb-3" style={{ color: "#0F4C35" }}>
        PRICE SUMMARY
      </p>

      {/* Subtotal Row */}
      <div className="flex justify-between text-xs py-1 text-gray-700 font-medium">
        <span>SUBTOTAL</span>
        <span className="font-semibold">{formatTHB(subtotal)}</span>
      </div>

      {/* VAT Row (Editable Rate) */}
      <div className="flex justify-between items-center text-xs py-1 text-gray-700 font-medium">
        <div className="flex items-center gap-1">
          <span>VAT</span>
          {readOnly ? (
            <span className="font-semibold">{currentVatRate}%</span>
          ) : (
            <div className="flex items-center gap-0.5">
              <input
                type="number"
                min="0"
                max="100"
                value={currentVatRate}
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : Number(e.target.value);
                  updateField("vatRate", val);
                }}
                className="w-11 text-center bg-[#F5F1FF] text-[#7C4DFF] font-bold rounded border border-[#E1D3FF] text-xs py-0.5 outline-none focus:ring-1 focus:ring-[#7C4DFF]"
                title="ปรับ % ภาษีมูลค่าเพิ่ม"
              />
              <span className="font-bold text-xs text-gray-700">%</span>
            </div>
          )}
        </div>
        <span className="font-semibold">{formatTHB(vat)}</span>
      </div>

      {/* Grand Total Row */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
        <span className="font-bold text-xs" style={{ color: "#0F4C35" }}>
          GRAND TOTAL
        </span>
        <span className="font-bold text-base" style={{ color: "#0F4C35" }}>
          {formatTHB(grandTotal)} THB
        </span>
      </div>
    </div>
  );
}