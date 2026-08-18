import Field from "../Field";
import { ndaTemplate } from "@/lib/templates/nda/schema";
import { useDocumentFields } from "@/context/DocumentFieldsContext";

export default function NdaPage4() {
  const { disclosingParty } = ndaTemplate;
  const { values } = useDocumentFields();

  const disclosingName = values.disclosing_signatory_name || disclosingParty.signatoryName;
  const disclosingPos = values.disclosing_signatory_position || disclosingParty.signatoryPosition;

  return (
    <div className="text-[13px] leading-[1.9] text-gray-900 font-normal">
      <h2 className="font-bold mb-2">
        9. กฎหมายที่ใช้บังคับและเขตอำนาจศาล (Governing Law and Jurisdiction)
      </h2>
      <ul className="list-none space-y-1.5 mb-6 text-justify">
        <li className="pl-4">9.1. สัญญาฉบับนี้ให้ตีความและบังคับใช้ตามกฎหมายแห่งราชอาณาจักรไทย</li>
        <li className="pl-4">
          9.2. หากเกิดข้อพิพาท ข้อขัดแย้ง หรือการเรียกร้องใดๆ ที่เกิดขึ้นจากหรือเกี่ยวเนื่องกับ
          สัญญานี้รวมทั้งการผิดสัญญา คู่สัญญาทั้งสองฝ่ายตกลงจะพยายามระงับข้อพิพาทโดยการ
          เจรจาด้วยความซื่อสัตย์สุจริตก่อน หากไม่สามารถตกลงกันได้ภายใน 30 วัน ให้ส่งเรื่องให้
          ศาลในประเทศไทยที่มีเขตอำนาจ เป็นผู้พิจารณาชี้ขาด
        </li>
      </ul>

      <h2 className="font-bold mb-2">10. บททั่วไป (General Provisions)</h2>
      <ul className="list-none space-y-1.5 mb-6 text-justify">
        <li className="pl-4">
          <span className="font-medium">10.1. ไม่มีการโอนสิทธิในทรัพย์สินทางปัญญา:</span>{" "}
          การเปิดเผยข้อมูลความลับตามสัญญานี้ไม่ถือเป็นการโอนสิทธิ์ มอบสิทธิ์ (License) หรือ
          ให้สิทธิใดๆ ในสิทธิบัตร ลิขสิทธิ์ เครื่องหมายการค้า หรือทรัพย์สินทางปัญญาของผู้เปิดเผย
          ข้อมูลแก่ผู้รับข้อมูล
        </li>
        <li className="pl-4">
          <span className="font-medium">10.2. การแก้ไขเพิ่มเติม:</span> การแก้ไขหรือเปลี่ยนแปลง
          สัญญานี้จะทำได้ต่อเมื่อทำเป็นหนังสือและลงนามโดยผู้มีอำนาจของทั้งสองฝ่ายเท่านั้น
        </li>
        <li className="pl-4">
          <span className="font-medium">10.3. การแยกออกจากกันได้ (Severability):</span>{" "}
          หากข้อกำหนดใดในสัญญานี้ตกเป็นโมฆะ หรือไม่สามารถบังคับใช้ได้ตามกฎหมาย
          ให้ข้อกำหนดส่วนที่เหลือยังคงมีผลบังคับใช้ได้โดยสมบูรณ์
        </li>
      </ul>

      <p className="mb-10 text-justify">
        เพื่อเป็นหลักฐานแห่งการนี้ คู่สัญญาโดยผู้มีอำนาจลงนามได้อ่านและเข้าใจข้อความในสัญญานี้
        โดยละเอียดตลอดแล้ว เห็นว่าถูกต้องตรงตามเจตนา จึงได้ลงลายมือชื่อและประทับตราสำคัญ
        (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน ณ วัน เดือน ปี ที่ระบุไว้ข้างต้น
      </p>

      {/* Signature Block */}
      <div className="grid grid-cols-2 gap-8 mt-6">
        {/* ฝั่งซ้าย: ผู้เปิดเผยข้อมูล (Disclosing Party) */}
        <div className="text-center flex flex-col justify-between">
          <div>
            <p className="font-bold mb-1">ผู้เปิดเผยข้อมูล (Disclosing Party)</p>
            <p className="font-bold">
              {values.disclosing_party_name || disclosingParty.name}
            </p>
          </div>

          <div className="my-8 text-center text-gray-400 select-none">
            ...................................................
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-0.5">{disclosingName}</p>
            <p className="text-gray-700 font-normal">{disclosingPos}</p>
          </div>
        </div>

        {/* ฝั่งขวา: ผู้รับข้อมูล (Receiving Party) */}
        <div className="text-center flex flex-col justify-between">
          <div>
            <p className="font-bold mb-1">ผู้รับข้อมูล (Receiving Party)</p>
            <div className="flex justify-center mt-1">
              <Field id="receiving_party_name" placeholder="..................................." minWidth={20} />
            </div>
          </div>

          <div className="my-8 text-center text-gray-400 select-none">
            ...................................................
          </div>

          <div>
            <div className="flex justify-center items-center mb-1">
              <span className="mr-1">(</span>
              <Field id="receiving_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={14} />
              <span className="ml-1">)</span>
            </div>
            <div className="flex justify-center items-center">
              <span className="mr-1 text-gray-900">ตำแหน่ง</span>
              <Field id="receiving_signatory_position" placeholder="..................................." minWidth={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}