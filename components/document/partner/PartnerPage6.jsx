import Field from "../Field";
import { partnerTemplate } from "@/lib/templates/partner/schema";
import { useDocumentFields } from "@/context/DocumentFieldsContext";

export default function PartnerPage6() {
  const { distributorParty } = partnerTemplate;
  const { values } = useDocumentFields();

  const disclosingName = values.disclosing_signatory_name || distributorParty.signatoryName;
  const disclosingPos = values.disclosing_signatory_position || distributorParty.signatoryPosition;

  return (
    <div className="text-[13px] leading-[1.9] text-gray-900 font-normal">
      <p className="mb-8 text-justify indent-8">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยละเอียดตลอดแล้ว
        จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* Main Signatories Block - 2 Columns */}
      <div className="grid grid-cols-2 gap-10 mt-6 mb-12">
        {/* Distributor (Crest Zendo) */}
        <div className="text-center flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="font-bold">
              {values.distributor_company_name || distributorParty.name}
            </p>
          </div>

          <div className="my-6 flex justify-center items-center text-center">
            <Field
              id="disclosing_signature_line"
              placeholder="ลายมือชื่อ / การลงนาม (ฝ่ายเรา)"
              minWidth={22}
            />
          </div>

          <div className="text-center">
            <p className="text-gray-900 font-normal mb-1">
              ( {disclosingName} )
            </p>
            <p className="text-gray-900 font-normal">
              ตำแหน่ง {disclosingPos}
            </p>
          </div>
        </div>

        {/* Reseller */}
        <div className="text-center flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="font-bold">
              (&nbsp;<Field id="reseller_name" placeholder="ระบุชื่อบริษัท Reseller" minWidth={20} />&nbsp;)
            </p>
          </div>

          <div className="my-6 flex justify-center items-center text-center">
            <Field
              id="reseller_signature_line"
              placeholder="ลายมือชื่อ / การลงนาม (คู่สัญญา)"
              minWidth={22}
            />
          </div>

          <div className="text-center">
            <p className="text-gray-900 font-normal mb-1">
              (&nbsp;<Field id="reseller_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />&nbsp;)
            </p>
            <p className="text-gray-900 font-normal">
              ตำแหน่ง&nbsp;<Field id="reseller_signatory_position" placeholder="เช่น กรรมการผู้จัดการ" minWidth={16} />
            </p>
          </div>
        </div>
      </div>

      {/* Witnesses Block - 2 Columns (Blank Handwritten Signature Lines) */}
      <div className="grid grid-cols-2 gap-10 mt-8 pt-6 border-t border-gray-200/60">
        {/* Witness 1 */}
        <div className="text-center space-y-4">
          <p className="text-xs text-gray-500 font-medium">พยาน</p>
          <div className="pt-6">
            <p className="text-gray-700">ลงชื่อ .................................................... พยาน</p>
            <p className="text-gray-500 mt-2">( .................................................... )</p>
          </div>
        </div>

        {/* Witness 2 */}
        <div className="text-center space-y-4">
          <p className="text-xs text-gray-500 font-medium">พยาน</p>
          <div className="pt-6">
            <p className="text-gray-700">ลงชื่อ .................................................... พยาน</p>
            <p className="text-gray-500 mt-2">( .................................................... )</p>
          </div>
        </div>
      </div>
    </div>
  );
}
