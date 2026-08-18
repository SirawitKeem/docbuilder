export default function DistributorPage3() {
  return (
    <div className="text-[13px] leading-[1.9] text-gray-900 font-normal">
      <p className="mb-2 font-medium">5.3. เงื่อนไขการส่งใบแจ้งหนี้ เครดิตเทอม และการชำระเงิน:</p>
      <ul className="list-disc pl-12 space-y-2 mb-6 text-justify">
        <li>
          &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; จะออกใบแจ้งหนี้เมื่อได้รับใบสั่งซื้อ (Purchase Order)
          และดำเนินการออก &ldquo;สิทธิ์การใช้งาน&rdquo; เรียบร้อยแล้ว โดยกำหนดระยะเวลาชำระเงิน
          (Credit Term) ภายใน 30 (สามสิบ) วัน นับแต่วันที่ออกใบแจ้งหนี้ให้กับ
          &ldquo;ตัวแทนจำหน่ายต่อ&rdquo;
        </li>
        <li>
          หาก &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; ชำระเงินล่าช้ากว่ากำหนด ต้องเสียดอกเบี้ยปรับในอัตรา
          ร้อยละ 1.5 (หนึ่งจุดห้า) ต่อเดือนของยอดเงินที่ค้างชำระ และ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo;
          มีสิทธิชะลอการออกสิทธิ์การใช้งานใหม่จนกว่าจะได้รับชำระหนี้ค้างชำระครบถ้วน
        </li>
        <li>สกุลเงินที่ใช้ในการชำระเงินคือ <span className="font-semibold">บาทไทย</span></li>
      </ul>

      <h2 className="font-bold mb-2">
        6. การบริการหลังการขายและการสนับสนุนทางเทคนิค (Technical Support, Maintenance & SLA)
      </h2>
      <ul className="list-none space-y-2 mb-2 text-justify">
        <li className="pl-4">
          <span className="font-medium">6.1. ระดับการบริการขั้นแรกของ Reseller (Tier 1 Support):</span>{" "}
          &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; มีหน้าที่ให้บริการสนับสนุนทางเทคนิคขั้นแรกแก่ลูกค้าปลายทาง
          เช่น การตอบคำถามทั่วไป การติดตั้งเบื้องต้น และการรับเรื่องปัญหา
        </li>
        <li className="pl-4 font-medium">
          6.2. ระดับการบริการของ Distributor และการส่งต่อปัญหา (Tier 2/3 Escalation Path):
        </li>
      </ul>
      <ul className="list-disc pl-12 space-y-2 mb-4 text-justify">
        <li>
          &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; มีหน้าที่ให้บริการสนับสนุนทางเทคนิคระดับสูง
          (Tier 2 Support) แก่ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; ในกรณีที่เกิดปัญหาร้ายแรง
          หรือข้อขัดข้องทางเทคนิคที่เกินกว่าขีดความสามารถของ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo;
        </li>
        <li>
          ในกรณีปัญหาที่เกิดจากข้อผิดพลาดของระบบ (Bug) &ldquo;ผู้จัดจำหน่ายหลัก&rdquo;
          จะทำหน้าที่ส่งต่อเรื่องไปยัง &ldquo;เจ้าของผลิตภัณฑ์&rdquo; (Tier 3 Support)
          เพื่อขอรับแพตช์แก้ไขโดยเร็วที่สุด
        </li>
      </ul>
      <p className="mb-6 pl-4 text-justify">
        <span className="font-medium">6.3. การต่ออายุสัญญาบริการ (Renewals):</span>{" "}
        &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; มีหน้าที่แจ้งเตือนรอบการต่ออายุ &ldquo;สิทธิ์การใช้งาน&rdquo;
        รายปีล่วงหน้าแก่ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; ไม่น้อยกว่า 60 (หกสิบ) วัน ก่อนวันหมดอายุ
        เพื่อให้ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; นำไปติดตามการต่ออายุสัญญาบำรุงรักษาซอฟต์แวร์รายปี
        (Software Maintenance Renewal) ของลูกค้าปลายทาง ตลอดจนแจ้งแพตช์อัปเดตระบบที่สำคัญ
      </p>

      <h2 className="font-bold mb-2">
        7. การจัดการทรัพย์สินทางปัญญาและการจำกัดความรับผิด (Intellectual Property & Limitation of Liability)
      </h2>
      <ul className="list-none space-y-2 mb-6 text-justify">
        <li className="pl-4">
          <span className="font-medium">7.1. การชดใช้ค่าเสียหายจากข้อพิพาทลิขสิทธิ์ (Indemnification):</span>{" "}
          &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; (โดยการสนับสนุนจาก &ldquo;เจ้าของผลิตภัณฑ์&rdquo;)
          รับประกันว่า &ldquo;ผลิตภัณฑ์&rdquo; ไม่มีการละเมิดทรัพย์สินทางปัญญาของบุคคลภายนอก
          หาก &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; ถูกฟ้องร้องจากบุคคลภายนอกเนื่องจากการใช้งานหรือจำหน่าย
          &ldquo;ผลิตภัณฑ์&rdquo; อย่างถูกต้องตามสัญญานี้ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo;
          จะร่วมปกป้องและชดใช้ค่าเสียหายตามเงื่อนไขที่ตกลงกัน โดย &ldquo;ตัวแทนจำหน่ายต่อ&rdquo;
          ต้องแจ้งให้ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ทราบเป็นลายลักษณ์อักษรทันทีที่ได้รับแจ้งข้อเรียกร้อง
        </li>
        <li className="pl-4">
          <span className="font-medium">7.2. การจำกัดความรับผิด (Limitation of Liability):</span>{" "}
          ความรับผิดชอบสูงสุดทางการเงินของคู่สัญญาฝ่ายหนึ่งฝ่ายใดต่อความเสียหายใดๆ
          ที่เกิดขึ้นภายใต้สัญญานี้ (ไม่ว่าจะเป็นทางตรงหรือทางอ้อม) จะถูกจำกัดไว้ไม่เกินยอดเงินรวมที่
          &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; ได้ชำระให้แก่ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo;
          ที่ผ่านมาก่อนเกิดเหตุ ทั้งนี้
          คู่สัญญาจะไม่รับผิดชอบต่อความเสียหายเกี่ยวกับกำไรทางธุรกิจที่สูญเสียไปหรือความเสียหาย
          เนื่องมาจากการสะดุดหยุดลงของธุรกิจ (Consequential Damages)
        </li>
      </ul>

      <h2 className="font-bold mb-2">8. การรับประกันสินค้า (Warranty)</h2>
      <p className="text-justify pl-4">
        <span className="font-medium">8.1. การรับประกันการทำงานของซอฟต์แวร์ (Software Performance Warranty):</span>{" "}
        &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; รับประกันว่า &ldquo;ผลิตภัณฑ์&rdquo;
        จะทำงานได้ตรงตามคุณลักษณะทางเทคนิค (Specifications) ที่ระบุไว้ในคู่มือ
        หรือเอกสารข้อกำหนดทางเทคนิคของ &ldquo;เจ้าของผลิตภัณฑ์&rdquo;
      </p>
    </div>
  );
}