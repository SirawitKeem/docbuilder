import Field from "../Field";
import { ndaTemplate } from "@/lib/templates/nda/schema";
import { useDocumentFields } from "@/context/DocumentFieldsContext";

export default function NdaPage4() {
  const { disclosingParty } = ndaTemplate;
  const { values } = useDocumentFields();

  const disclosingName = values.disclosing_signatory_name || disclosingParty.signatoryName;
  const disclosingPos = values.disclosing_signatory_position || disclosingParty.signatoryPosition;

  return (
    <div className="document-body pt-3">
      <h2>9. กฎหมายที่ใช้บังคับและเขตอำนาจศาล (Governing Law and Jurisdiction)</h2>
      <ul className="list-none space-y-1">
        <li className="pl-4">9.1. สัญญาฉบับนี้ให้ตีความและบังคับใช้ตามกฎหมายแห่งราชอาณาจักรไทย</li>
        <li className="pl-4">
          9.2. หากเกิดข้อพิพาท ข้อขัดแย้ง หรือการเรียกร้องใดๆ ที่เกิดขึ้นจากหรือเกี่ยวเนื่องกับ
          สัญญานี้รวมทั้งการผิดสัญญา คู่สัญญาทั้งสองฝ่ายตกลงจะพยายามระงับข้อพิพาทโดยการ
          เจรจาด้วยความซื่อสัตย์สุจริตก่อน หากไม่สามารถตกลงกันได้ภายใน 30 วัน ให้ส่งเรื่องให้
          ศาลในประเทศไทยที่มีเขตอำนาจ เป็นผู้พิจารณาชี้ขาด
        </li>
      </ul>

      <h2>10. บททั่วไป (General Provisions)</h2>
      <ul className="list-none space-y-1" style={{ marginBottom: "12px" }}>
        <li className="pl-4">
          <span className="font-bold">10.1. ไม่มีการโอนสิทธิในทรัพย์สินทางปัญญา:</span>{" "}
          การเปิดเผยข้อมูลความลับตามสัญญานี้ไม่ถือเป็นการโอนสิทธิ์ มอบสิทธิ์ (License) หรือ
          ให้สิทธิใดๆ ในสิทธิบัตร ลิขสิทธิ์ เครื่องหมายการค้า หรือทรัพย์สินทางปัญญาของผู้เปิดเผย
          ข้อมูลแก่ผู้รับข้อมูล
        </li>
        <li className="pl-4">
          <span className="font-bold">10.2. การแก้ไขเพิ่มเติม:</span> การแก้ไขหรือเปลี่ยนแปลง
          สัญญานี้จะทำได้ต่อเมื่อทำเป็นหนังสือและลงนามโดยผู้มีอำนาจของทั้งสองฝ่ายเท่านั้น
        </li>
        <li className="pl-4">
          <span className="font-bold">10.3. การแยกออกจากกันได้ (Severability):</span>{" "}
          หากข้อกำหนดใดในสัญญานี้ตกเป็นโมฆะ หรือไม่สามารถบังคับใช้ได้ตามกฎหมาย
          ให้ข้อกำหนดส่วนที่เหลือยังคงมีผลบังคับใช้ได้โดยสมบูรณ์
        </li>
      </ul>

      <p className="indent-8" style={{ marginBottom: "28px" }}>
        เพื่อเป็นหลักฐานแห่งการนี้ คู่สัญญาโดยผู้มีอำนาจลงนามได้อ่านและเข้าใจข้อความในสัญญานี้
        โดยละเอียดตลอดแล้ว เห็นว่าถูกต้องตรงตามเจตนา จึงได้ลงลายมือชื่อและประทับตราสำคัญ
        (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน ณ วัน เดือน ปี ที่ระบุไว้ข้างต้น
      </p>

      {/* Signature Block - Symmetrical 2 Columns */}
      <div className="grid grid-cols-2 gap-10" style={{ marginBottom: "50px" }}>
        {/* ฝั่งซ้าย: ผู้เปิดเผยข้อมูล (Disclosing Party) */}
        <div className="text-center">
          <p className="font-bold mb-1">ผู้เปิดเผยข้อมูล (Disclosing Party)</p>
          <p className="font-bold" style={{ marginBottom: "65px" }}>
            {values.disclosing_party_name || disclosingParty.name}
          </p>
          <p className="mb-3">ลงชื่อ ......................................................</p>
          <p className="mb-3">( {disclosingName} )</p>
          <p>ตำแหน่ง: {disclosingPos}</p>
        </div>

        {/* ฝั่งขวา: ผู้รับข้อมูล (Receiving Party) */}
        <div className="text-center">
          <p className="font-bold mb-1">ผู้รับข้อมูล (Receiving Party)</p>
          <p className="font-bold" style={{ marginBottom: "65px" }}>
            <Field id="receiving_party_name" placeholder="ระบุชื่อบริษัท ผู้รับข้อมูล" minWidth={20} />
          </p>
          <p className="mb-3">ลงชื่อ ......................................................</p>
          <p className="mb-3">
            (&nbsp;<Field id="receiving_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />&nbsp;)
          </p>
          <p>
            ตำแหน่ง:{" "}
            <Field id="receiving_signatory_position" placeholder="เช่น กรรมการผู้จัดการ" minWidth={16} />
          </p>
        </div>
      </div>
    </div>
  );
}