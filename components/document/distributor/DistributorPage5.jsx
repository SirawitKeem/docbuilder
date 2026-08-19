import Field from "../Field";
import { distributorTemplate } from "@/lib/templates/distributor/schema";
import { useDocumentFields } from "@/context/DocumentFieldsContext";

export default function DistributorPage5() {
  const { distributorParty } = distributorTemplate;
  const { values } = useDocumentFields();

  const disclosingName = values.disclosing_signatory_name || distributorParty.signatoryName;
  const disclosingPos = values.disclosing_signatory_position || distributorParty.signatoryPosition;

  return (
    <div className="text-[12px] leading-[1.85] text-gray-900 font-normal">
      <p className="mb-12 indent-8">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยรายละเอียดตลอดแล้ว
        จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* Signature Block - Symmetrical 2 Columns */}
      <div className="grid grid-cols-2 gap-10 mt-8">
        {/* Main Distributor (Crest Zendo) */}
        <div className="text-center flex flex-col justify-between">
          <div>
            <p className="font-bold">
              {values.distributor_company_name || distributorParty.name}
            </p>
          </div>

          <div className="my-8 flex justify-center items-center text-center">
            <Field
              id="disclosing_signature_line"
              placeholder="ลายมือชื่อ / การลงนาม (ฝ่ายเรา)"
              minWidth={24}
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
        <div className="text-center flex flex-col justify-between">
          <div>
            <p className="font-bold">
              (&nbsp;<Field id="reseller_name" placeholder="ชื่อบริษัท Reseller" minWidth={20} />&nbsp;)
            </p>
          </div>

          <div className="my-8 flex justify-center items-center text-center">
            <Field
              id="reseller_signature_line"
              placeholder="ลายมือชื่อ / การลงนาม (คู่สัญญา)"
              minWidth={24}
            />
          </div>

          <div className="text-center">
            <p className="text-gray-900 font-normal mb-1">
              (&nbsp;<Field id="reseller_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />&nbsp;)
            </p>
            <p className="text-gray-900 font-normal">
              ตำแหน่ง&nbsp;<Field id="reseller_signatory_position" placeholder="..................................." minWidth={16} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}