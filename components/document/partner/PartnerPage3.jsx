export default function PartnerPage3() {
  return (
    <div className="text-[13px] leading-[1.9] text-gray-900 font-normal">
      <h2 className="font-bold mb-2">
        ข้อ 5. การกำหนดราคา ส่วนลด และเงื่อนไขการชำระเงิน (Pricing, Discounts, and Payment Terms)
      </h2>
      <ul className="list-none space-y-2 mb-6 text-justify font-normal">
        <li className="pl-4">
          <span className="font-bold">5.1. โครงสร้างราคา:</span>{" "}
          &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; จะกำหนด และจัดส่งราคาต้นทุน (Cost Price) สำหรับ &ldquo;ตัวแทนจำหน่าย&rdquo; และระบุราคาแนะนำสำหรับ &ldquo;ผู้ใช้ปลายทาง&rdquo; (MSRP)
        </li>
        <li className="pl-4">
          <span className="font-bold">5.2. ส่วนลดพิเศษ (Special Discounts):</span>{" "}
          การอนุมัติส่วนลดพิเศษให้อยู่ในวิจารณญาณของ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; โดย &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; จะแจ้งยืนยันเป็นลายลักษณ์อักษร (หรือผ่านระบบอิเล็กทรอนิกส์) พร้อมกำหนดระยะเวลาความคุ้มครองของราคานั้นๆ (Price Validity Period)
        </li>
        <li className="pl-4">
          <span className="font-bold">5.3. เงื่อนไขการชำระเงิน (Payment Terms):</span>{" "}
          &ldquo;ตัวแทนจำหน่าย&rdquo; ตกลงชำระเงินค่า &ldquo;สิทธิ์การใช้งาน&rdquo; ให้แก่ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ตามเงื่อนไข เครดิตเทอม หรือระยะเวลาชำระเงินที่ระบุไว้ในใบแจ้งหนี้ (Invoice) หรือตามตกลงแยกต่างหาก การชำระเงินล่าช้าอาจมีดอกเบี้ยปรับตามอัตราที่กฎหมายกำหนด
        </li>
        <li className="pl-4">
          <span className="font-bold">5.4. เงื่อนไขอัตราแลกเปลี่ยน (Exchange Rate Condition):</span>{" "}
          กรณีที่ราคาต้นทุนของ &ldquo;ผลิตภัณฑ์&rdquo; ถูกอ้างอิงเป็นสกุลเงินต่างประเทศ (เช่น USD หรือ EUR) ทั้งสองฝ่ายตกลงให้อัตราแลกเปลี่ยนที่นำมาคำนวณราคาขายเงินบาท คำนวณ ณ วันที่ออกใบแจ้งหนี้ หรือตามอัตราแลกเปลี่ยนอ้างอิงของธนาคารแห่งประเทศไทยที่กำหนดไว้ในใบเสนอราคา
        </li>
      </ul>

      <h2 className="font-bold mb-2">
        ข้อ 6. การรักษาความลับ (Confidentiality)
      </h2>
      <p className="mb-4 pl-4 text-justify">
        <span className="font-bold">6.1.</span> ทั้งสองฝ่ายตกลงที่จะรักษาข้อมูลอันเป็นความลับทางธุรกิจ ข้อมูลทางเทคนิค ข้อมูลรายชื่อลูกค้า ข้อมูลราคา และข้อมูลใดๆ ที่ได้รับจากอีกฝ่ายหนึ่งระหว่างการดำเนินงานตามสัญญานี้ ไว้เป็นความลับอย่างเคร่งครัด
      </p>
      <p className="mb-6 pl-4 text-justify">
        <span className="font-bold">6.2.</span> ข้อผูกพันในการรักษาความลับตามข้อนี้จะยังคงมีผลบังคับใช้ต่อเนื่องเป็นระยะเวลา 3 (สาม) ปี นับแต่วันที่สัญญานี้สิ้นสุดลง ไม่ว่าด้วยเหตุใดก็ตาม
      </p>

      <h2 className="font-bold mb-2">
        ข้อ 7. ทรัพย์สินทางปัญญา (Intellectual Property)
      </h2>
      <p className="mb-4 pl-4 text-justify">
        <span className="font-bold">7.1.</span> เครื่องหมายการค้า โลโก้ ชื่อทางการค้า ลิขสิทธิ์ และสิทธิในทรัพย์สินทางปัญญาทั้งหมดที่เกี่ยวข้องกับ &ldquo;ผลิตภัณฑ์&rdquo; เป็นของ &ldquo;เจ้าของผลิตภัณฑ์&rdquo; แต่เพียงผู้เดียว
      </p>
      <p className="pl-4 text-justify">
        <span className="font-bold">7.2.</span> &ldquo;ตัวแทนจำหน่าย&rdquo; ได้รับสิทธิ์จำกัดเฉพาะในการใช้เครื่องหมายการค้า และสื่อการตลาดของ &ldquo;ผลิตภัณฑ์&rdquo; เพื่อวัตถุประสงค์ในการทำการตลาดและการจัดจำหน่ายตามสัญญานี้เท่านั้น
      </p>
    </div>
  );
}