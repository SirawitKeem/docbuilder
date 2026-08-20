import Field from "../Field";
import { partnerTemplate } from "@/lib/templates/partner/schema";

export default function PartnerPage5() {
  const { distributorParty } = partnerTemplate;

  return (
    <div className="document-body">
      <div className="space-y-1.5 pl-4 pt-1">
        <div>
          <p className="font-bold mb-0.5">10.2 การบอกเลิกสัญญาแบบมีเหตุผล (Termination for Cause):</p>
          <p className="mb-0.5">คู่สัญญาฝ่ายใดฝ่ายหนึ่งมีสิทธิบอกเลิกสัญญาได้ทันที หากอีกฝ่าย:</p>
          <ul className="list-disc pl-8 space-y-0.5 font-normal">
            <li>ประพฤติผิดสัญญาข้อหนึ่งข้อใดและไม่แก้ไขภายใน 30 (สามสิบ) วัน นับแต่วันได้รับแจ้งเป็นลายลักษณ์อักษร</li>
            <li>ตกเป็นผู้มีหนี้สินล้นพ้นตัว ล้มละลาย เลิกบริษัท หรือเข้าสู่กระบวนการฟื้นฟูกิจการ</li>
            <li>กระทำผิดกฎหมายอย่างร้ายแรง เช่น กฎหมายต่อต้านการทุจริต กฎหมายคุ้มครองข้อมูลส่วนบุคคล หรือกฎหมายละเมิดลิขสิทธิ์</li>
          </ul>
        </div>
        <p>
          <span className="font-bold">10.3 การบอกเลิกสัญญาโดยไม่มีเหตุผล (Termination for Convenience):</span> คู่สัญญาฝ่ายใดฝ่ายหนึ่งสามารถบอกเลิกสัญญานี้ได้โดยแจ้งเป็นลายลักษณ์อักษรใหีกฝ่ายทราบล่วงหน้าไม่น้อยกว่า 60 (หกสิบ) วัน สำหรับการลงทะเบียนสิทธิ์ในข้อตกลงทางการค้า (Deal Registration) ไว้แล้วก่อนวันสิ้นสุดสัญญา จะยังคงได้รับการคุ้มครองสิทธิ์และส่วนลดตามเดิมจนกว่าข้อตกลงนั้นจะจบลง
        </p>
        <p>
          <span className="font-bold">10.4 ภาระผูกพันหลังสิ้นสุดสัญญา:</span> เมื่อสัญญาสินสุดลง &ldquo;ตัวแทนจำหน่าย&rdquo; ยังคงต้องชำระค่าสินค้าหรือบริการที่ค้างชำระทั้งหมด และ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ยังคงต้องดูแลจัดการ &ldquo;สิทธิ์การใช้งาน&rdquo; ของ &ldquo;ผู้ใช้ปลายทาง&rdquo; ที่สั่งซื้อไปก่อนวันสิ้นสุดสัญญา ให้ได้รับการให้บริการจนครบกำหนดอายุ &ldquo;สิทธิ์การใช้งาน&rdquo; นั้น ๆ
        </p>
      </div>

      <h2>ข้อ 11. กฎหมายที่ใช้บังคับและกระบวนการระงับข้อพิพาท (Governing Law & Dispute Resolution)</h2>
      <div className="space-y-1.5 pl-4" style={{ marginBottom: "12px" }}>
        <p>
          <span className="font-bold">11.1 กฎหมายที่ใช้บังคับ:</span> สัญญานี้อยู่ภายใต้การบังคับ และตีความตามกฎหมายแห่งราชอาณาจักรไทย
        </p>
        <p>
          <span className="font-bold">11.2 กระบวนการระงับข้อพิพาท:</span> หากเกิดข้อขัดแย้งหรือข้อพิพาทขึ้นจากสัญญานี้ คู่สัญญาตกลงจะหารือเพื่อประนอมข้อพิพาทด้วยมิตรภาพก่อน หากไม่สามารถหาข้อยุติได้ภายใน 30 (สามสิบ) วัน ให้ส่งเรื่องเข้าสู่การพิจารณาของ ศาลไทย
        </p>
      </div>

      <p className="indent-8" style={{ marginBottom: "55px" }}>
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยรายละเอียดตลอดแล้ว
        <br />
        จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
      </p>

      {/* คู่สัญญาหลัก */}
      <div className="grid grid-cols-2 gap-10" style={{ marginBottom: "65px" }}>
        <div className="text-center">
          <p className="font-bold" style={{ marginBottom: "65px" }}>
            {distributorParty.name}
          </p>
          <p className="mb-3">ลงชื่อ ......................................................</p>
          <p className="mb-3">( {distributorParty.signatoryName} )</p>
          <p>ตำแหน่ง: {distributorParty.signatoryPosition}</p>
        </div>

        <div className="text-center">
          <p className="font-bold" style={{ marginBottom: "65px" }}>
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