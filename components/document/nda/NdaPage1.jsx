import Field from "../Field";

export default function NdaPage1() {
  return (
    <div className="text-[12px] leading-[1.85] text-gray-900 font-normal">
      <h1 className="text-center text-[16px] font-bold mb-1 tracking-tight">
        หนังสือสัญญาไม่เปิดเผยข้อมูล
      </h1>
      <p className="text-center text-[12px] font-bold mb-6">
        (NON-DISCLOSURE AGREEMENT - NDA)
      </p>

      <p className="text-center mb-5">
        สัญญาฉบับนี้ทำขึ้น ณ{" "}
        <Field id="contract_location" placeholder="กรุงเทพมหานคร" minWidth={14} />{" "}
        เมื่อวันที่ <Field id="contract_date_day" placeholder="17" minWidth={3} />{" "}
        เดือน <Field id="contract_date_month" placeholder="สิงหาคม" minWidth={8} />{" "}
        พ.ศ. <Field id="contract_date_year" placeholder="2569" minWidth={5} />
      </p>

      <p className="mb-2 font-normal">ระหว่าง:</p>

      <p className="mb-3 text-justify">
        (1) บริษัท เครสท์ เซนโด จำกัด สำนักงานใหญ่ ตั้งอยู่เลขที่ 8/40 เดอะ
        คอนเนค 37 ซอยช่างอากาศอุทิศ 10 แยก 1-2 แขวงดอนเมือง เขตดอนเมือง
        กรุงเทพมหานคร 10210 ประเทศไทย ซึ่งต่อไปในสัญญานี้จะเรียกว่า{" "}
        <span className="font-bold">&ldquo;ผู้เปิดเผยข้อมูล&rdquo; (Disclosing Party)</span>{" "}
        ฝ่ายหนึ่ง และ
      </p>

      <div className="mb-4 text-justify">
        <p className="mb-1">
          (2) บริษัท/นิติบุคคล{" "}
          <Field id="receiving_party_name" placeholder="บริษัท ตัวอย่าง จำกัด" minWidth={24} />
        </p>
        <p className="mb-1">สำนักงานตั้งอยู่เลขที่</p>
        <Field
          id="receiving_party_address"
          type="textarea"
          placeholder="เลขที่ ... แขวง/ตำบล ... เขต/อำเภอ ... จังหวัด ... รหัสไปรษณีย์ ..."
        />
        <p className="mt-1">
          ซึ่งต่อไปในสัญญานี้จะเรียกว่า{" "}
          <span className="font-bold">&ldquo;ผู้รับข้อมูล&rdquo; (Receiving Party)</span>{" "}
          อีกฝ่ายหนึ่ง
        </p>
      </div>

      <p className="mb-4 font-normal">
        (รวมเรียกว่า &ldquo;คู่สัญญาทั้งสองฝ่าย&rdquo; หรือเรียกว่า &ldquo;ฝ่าย&rdquo;
        หากหมายถึงฝ่ายใดฝ่ายหนึ่ง)
      </p>

      <p className="mb-5 text-justify font-normal">
        โดยที่ ผู้เปิดเผยข้อมูล เป็นผู้ประกอบธุรกิจจัดจำหน่ายและให้บริการด้านซอฟต์แวร์
        ไอทีโซลูชัน และเทคโนโลยีดิจิทัล และมีความประสงค์จะเปิดเผยข้อมูลที่มีลักษณะเป็นความลับ
        ของตนให้แก่ ผู้รับข้อมูล เพื่อวัตถุประสงค์ในการประเมิน ความร่วมมือ หรือการทำธุรกิจร่วมกัน
        และผู้รับข้อมูลตกลงที่จะรับและรักษาข้อมูลความลับดังกล่าวตามข้อกำหนดและเงื่อนไขในสัญญานี้
        คู่สัญญาจึงตกลงทำสัญญามีข้อความดังต่อไปนี้:
      </p>

      <h2 className="font-bold mb-2">
        1. คำนิยามข้อมูลที่เป็นความลับ (Definition of Confidential Information)
      </h2>
      <p className="mb-2 text-justify pl-4 font-normal">
        1.1. &ldquo;ข้อมูลที่เป็นความลับ&rdquo; (Confidential Information) หมายถึง
        ข้อมูล เอกสาร สารสนเทศ เทคโนโลยี และความรู้ความชำนาญ (Know-how) ทั้งหมด
        ไม่ว่าจะอยู่ในรูปแบบใด (ลายลักษณ์อักษร, วาจา, อิเล็กทรอนิกส์, รหัสคอมพิวเตอร์,
        หรือสื่อบันทึกข้อมูลอื่นใด) ที่ผู้เปิดเผยข้อมูลส่งมอบ เปิดเผย หรือให้เข้าถึงแก่ผู้รับข้อมูล
        ทั้งก่อนและหลังวันทำสัญญาฉบับนี้ ซึ่งรวมถึงแต่ไม่จำกัดเพียง:
      </p>

      <ul className="list-disc pl-12 space-y-1.5 text-justify font-normal">
        <li>
          <span className="font-bold">ข้อมูลด้านเทคนิคและซอฟต์แวร์:</span> ซอร์ซโค้ด
          (Source Code), ออบเจกต์โค้ด (Object Code), อัลกอริทึม (Algorithms),
          สถาปัตยกรรมระบบ (System Architecture), โครงสร้างฐานข้อมูล, เอกสาร API,
          คู่มือเทคนิค, ผลการทดสอบ, บัก (Bugs), Credential, Log, API Token, User
          Experience (UX), User Interface (UI), Credential ต่างๆ, Knowledge Base
          และข้อผิดพลาดของระบบ
        </li>
        <li>
          <span className="font-bold">ข้อมูลทางการค้าและธุรกิจ:</span>{" "}
          ข้อมูลราคาต้นทุน (Cost Structure), โครงสร้างส่วนลด (Discount Schemes),
          อัตราค่าคอมมิชชั่น, บันทึกการประชุม, แผนกลยุทธ์การตลาด, แผนการขาย,
          รายชื่อและข้อมูลลูกค้าปลายทาง (End-customers), รายชื่อผู้จัดจำหน่าย
          และประมาณการทางการเงิน
        </li>
        <li>
          <span className="font-bold">ข้อมูลส่วนบุคคล (Personal Data):</span>{" "}
          ข้อมูลส่วนบุคคลของพนักงาน ลูกค้า หรือผู้ใช้งานระบบตามกฎหมายว่าด้วยการคุ้มครอง
          ข้อมูลส่วนบุคคล (PDPA) ที่ผู้รับข้อมูลเข้าถึงได้ระหว่างการทำระบบ การทดสอบ (PoC)
          หรือการสนับสนุนทางเทคนิค (Technical Support)
        </li>
        <li>
          <span className="font-bold">ความคิดสร้างสรรค์และทรัพย์สินทางปัญญา:</span>{" "}
          แบบระเบียบ ขั้นตอนการทำงาน ต้นแบบ (Prototypes) สิทธิบัตร เครื่องหมายการค้า
          หรือความลับทางการค้าที่ยังไม่ได้เปิดเผยต่อสาธารณะ
        </li>
      </ul>
    </div>
  );
}
