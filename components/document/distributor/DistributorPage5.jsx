import Field from "../Field";
import { distributorTemplate } from "@/lib/templates/distributor/schema";
import { useDocumentFields } from "@/context/DocumentFieldsContext";

export default function DistributorPage5() {
  const { distributorParty } = distributorTemplate;
  const { values } = useDocumentFields();

  const disclosingName = values.disclosing_signatory_name || distributorParty.signatoryName;
  const disclosingPos = values.disclosing_signatory_position || distributorParty.signatoryPosition;

  return (
    <div className="document-body pt-3">
      <p className="indent-8" style={{ marginBottom: "28px" }}>
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยรายละเอียดตลอดแล้ว
        <br />
        จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* Signature Block - Symmetrical 2 Columns */}
      <div className="grid grid-cols-2 gap-10" style={{ marginBottom: "50px" }}>
        {/* Main Distributor (Crest Zendo) */}
        <div className="text-center flex flex-col items-center relative">
          <p className="font-bold mb-1">ผู้จัดจำหน่ายหลัก (Distributor)</p>
          <p className="font-bold mb-1">
            {values.distributor_company_name || distributorParty.name}
          </p>
          <div className="h-16 flex items-center justify-center relative w-full mb-0.5">
            {values.our_signature_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.our_signature_image}
                alt="ลายเซ็นฝ่ายเรา"
                className="max-h-14 max-w-[180px] object-contain select-none z-10"
              />
            ) : null}
          </div>
          <p className="mb-3">ลงชื่อ ......................................................</p>
          <p className="mb-3">( {disclosingName} )</p>
          <p>ตำแหน่ง: {disclosingPos}</p>
        </div>

        {/* Reseller */}
        <div className="text-center flex flex-col items-center">
          <p className="font-bold mb-1">ตัวแทนจำหน่ายต่อ (Reseller)</p>
          <p className="font-bold mb-1">
            <Field id="reseller_name" placeholder="ระบุชื่อบริษัท Reseller" minWidth={20} />
          </p>
          <div className="h-16 flex items-center justify-center relative w-full mb-0.5">
            {values.counterparty_signature_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.counterparty_signature_image}
                alt="ลายเซ็นคู่สัญญา"
                className="max-h-14 max-w-[180px] object-contain select-none"
              />
            ) : null}
          </div>
          <p className="mb-3">ลงชื่อ ......................................................</p>
          <p className="mb-3">
            (&nbsp;<Field id="reseller_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />&nbsp;)
          </p>
          <p>
            ตำแหน่ง:{" "}
            <Field id="reseller_signatory_position" placeholder="เช่น กรรมการผู้จัดการ" minWidth={16} />
          </p>
        </div>
      </div>

      {/* พยาน */}
      <div className="grid grid-cols-2 gap-10">
        <div className="text-center">
          <p className="mb-3">ลงชื่อ ...................................................... พยาน</p>
          <p className="mb-3">( ...................................................... )</p>
          <p>ตำแหน่ง: ........................................</p>
        </div>
        <div className="text-center">
          <p className="mb-3">ลงชื่อ ...................................................... พยาน</p>
          <p className="mb-3">( ...................................................... )</p>
          <p>ตำแหน่ง: ........................................</p>
        </div>
      </div>
    </div>
  );
}