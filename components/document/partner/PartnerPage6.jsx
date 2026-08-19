import Field from "../Field";
import { partnerTemplate } from "@/lib/templates/partner/schema";

export default function PartnerPage6() {
  const { distributorParty } = partnerTemplate;

  return (
    <div className="text-[13px] leading-[1.9] text-gray-900 font-normal">
      <p className="mb-12 text-justify">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยละเอียดตลอดแล้ว จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* คู่สัญญาหลัก - จัดกึ่งกลางฝั่งตัวเอง */}
      <div className="grid grid-cols-2 gap-10 mb-14">
        <div className="text-center">
          <p className="font-bold mb-10">{distributorParty.name}</p>
          <p className="mb-2">ลงชื่อ ......................................................</p>
          <p className="mb-2">( {distributorParty.signatoryName} )</p>
          <p>ตำแหน่ง: {distributorParty.signatoryPosition}</p>
        </div>

        <div className="text-center">
          <p className="font-bold mb-10">
            <Field id="reseller_name" placeholder="ระบุชื่อบริษัท Reseller" minWidth={20} />
          </p>
          <p className="mb-2">ลงชื่อ ......................................................</p>
          <p className="mb-2">
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
          <p className="mb-2">ลงชื่อ ...................................................... พยาน</p>
          <p className="mb-2">( ...................................................... )</p>
          <p>ตำแหน่ง: ........................................</p>
        </div>
        <div className="text-center">
          <p className="mb-2">ลงชื่อ ...................................................... พยาน</p>
          <p className="mb-2">( ...................................................... )</p>
          <p>ตำแหน่ง: ........................................</p>
        </div>
      </div>
    </div>
  );
}