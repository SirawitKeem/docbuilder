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
      <p className="mb-12 text-justify indent-8">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยละเอียดตลอดแล้ว
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
              placeholder="..................................................."
              minWidth={24}
            />
          </div>

          <div>
            <p className="text-gray-900 font-normal">
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
              placeholder="..................................................."
              minWidth={24}
            />
          </div>

          <div>
            <div className="flex justify-center items-center mb-1">
              <span className="mr-1">(</span>
              <Field id="reseller_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />
              <span className="ml-1">)</span>
            </div>
            <div className="flex justify-center items-center">
              <span className="mr-1 text-gray-900">ตำแหน่ง</span>
              <Field id="reseller_signatory_position" placeholder="..................................." minWidth={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}