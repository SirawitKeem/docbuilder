import Field from "../Field";
import { distributorTemplate } from "@/lib/templates/distributor/schema";

export default function DistributorPage5() {
  const { distributorParty } = distributorTemplate;

  return (
    <div className="text-[13px] leading-[1.9] text-gray-900 font-normal">
      <p className="mb-10 text-justify">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยละเอียด
        ตลอดแล้ว จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* Signature Block */}
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <p className="font-semibold mb-1">{distributorParty.name}</p>
          <div className="mb-10 h-6" />
          <div className="border-b border-gray-400 mb-2 h-8" />
          <p>{distributorParty.signatoryName}</p>
          <p>{distributorParty.signatoryPosition}</p>
        </div>

        <div className="text-center">
          <div className="mb-16 h-6" />
          <div className="border-b border-gray-400 mb-2 h-8" />
          <p>
            ( <Field id="reseller_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} /> )
          </p>
          <p className="mt-1">
            ตำแหน่ง{" "}
            <Field id="reseller_signatory_position" placeholder="เช่น กรรมการผู้จัดการ" minWidth={16} />
          </p>
        </div>
      </div>
    </div>
  );
}