import Field from "../Field";
import { distributorTemplate } from "@/lib/templates/distributor/schema";

export default function DistributorPage5() {
  const { distributorParty } = distributorTemplate;

  return (
    <div className="text-[12px] leading-[1.85] text-gray-900 font-normal">
      <p className="mb-12 text-justify indent-8">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยละเอียดตลอดแล้ว
        จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* Signature Block - Symmetrical 2 Columns */}
      <div className="grid grid-cols-2 gap-10 mt-8">
        {/* Main Distributor (Crest Zendo) */}
        <div className="text-center space-y-3">
          <p className="font-bold">
            <Field id="distributor_company_name" placeholder={distributorParty.name} minWidth={20} />
          </p>

          <div className="my-4 text-center">
            <p className="text-gray-900 mb-1">ลงชื่อ...................................................</p>
            <p className="text-xs text-gray-500">(ผู้ลงนามฝั่งผู้จัดจำหน่ายหลัก)</p>
          </div>

          <p className="text-gray-900 font-normal">
            (&nbsp;<Field id="disclosing_signatory_name" placeholder={distributorParty.signatoryName} minWidth={16} />&nbsp;)
          </p>
          <p className="text-gray-900 font-normal">
            ตำแหน่ง{" "}
            <Field id="disclosing_signatory_position" placeholder={distributorParty.signatoryPosition} minWidth={12} />
          </p>
        </div>

        {/* Reseller */}
        <div className="text-center space-y-3">
          <p className="font-bold">
            (&nbsp;<Field id="reseller_name" placeholder="ชื่อบริษัท Reseller" minWidth={20} />&nbsp;)
          </p>

          <div className="my-4 text-center">
            <p className="text-gray-900 mb-1">ลงชื่อ...................................................</p>
            <p className="text-xs text-gray-500">(ผู้ลงนามฝั่ง Reseller)</p>
          </div>

          <p className="text-gray-900 font-normal">
            (&nbsp;<Field id="reseller_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />&nbsp;)
          </p>
          <p className="text-gray-900 font-normal">
            ตำแหน่ง{" "}
            <Field id="reseller_signatory_position" placeholder="เช่น กรรมการผู้จัดการ" minWidth={16} />
          </p>
        </div>
      </div>
    </div>
  );
}