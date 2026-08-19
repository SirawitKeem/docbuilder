import Field from "../Field";
import { partnerTemplate } from "@/lib/templates/partner/schema";

export default function PartnerPage6() {
  const { distributorParty } = partnerTemplate;

  return (
    <div className="text-[12px] leading-[1.85] text-gray-900 font-normal">
      <p className="mb-14 indent-8">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยรายละเอียดตลอดแล้ว จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* คู่สัญญาหลัก - จัดกึ่งกลางฝั่งตัวเอง พร้อมเพิ่มระยะเซ็นชื่อ */}
      <div className="grid grid-cols-2 gap-10 mb-20">
        <div className="text-center">
          <p className="font-bold mb-16">{distributorParty.name}</p>
          <p className="mb-3">ลงชื่อ ......................................................</p>
          <p className="mb-3">( {distributorParty.signatoryName} )</p>
          <p>ตำแหน่ง: {distributorParty.signatoryPosition}</p>
        </div>

        <div className="text-center">
          <p className="font-bold mb-16">
            <Field id="reseller_name" placeholder="ระบุชื่อบริษัท Reseller" minWidth={20} />
          </p>
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

      {/* พยาน — จัดกึ่งกลางฝั่งตัวเอง */}
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