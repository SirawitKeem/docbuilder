import Field from "../Field";

export default function DistributorPage1() {
  return (
    <div className="text-[12px] leading-[1.85] text-gray-900 font-normal">
      {/* Document Title */}
      <h1 className="text-center text-[16px] font-bold mb-1 tracking-tight">
        สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์
      </h1>
      <p className="text-center text-[12px] font-bold mb-6">
        (Distributor and Reseller Master Agreement)
      </p>

      {/* Contract Opening Line - Centered */}
      <p className="text-center mb-5">
        สัญญาฉบับนี้ทำขึ้น ณ{" "}
        <Field id="contract_location" placeholder="...................................................................." minWidth={16} />{" "}
        เมื่อวันที่ <Field id="contract_date_day" placeholder="........" minWidth={4} />{" "}
        เดือน <Field id="contract_date_month" placeholder="................" minWidth={8} />{" "}
        พ.ศ. <Field id="contract_date_year" placeholder="............" minWidth={5} />
      </p>

      <p className="mb-2 font-normal">ระหว่าง:</p>

      {/* Party 1 */}
      <p className="mb-3">
        (1) บริษัท เครสท์ เซนโด จำกัด สำนักงานใหญ่ ตั้งอยู่เลขที่ 8/40 เดอะ
        คอนเนค 37 ซอยช่างอากาศอุทิศ 10 แยก 1-2 แขวงดอนเมือง เขตดอนเมือง
        กรุงเทพมหานคร 10210 ประเทศไทย ซึ่งต่อไปในสัญญานี้จะเรียกว่า &ldquo;ผู้เปิดเผยข้อมูล&rdquo; (Disclosing Party)
        ฝ่ายหนึ่ง และ
      </p>

      {/* Party 2 */}
      <div className="mb-4">
        <p className="mb-1">
          (2) บริษัท/นิติบุคคล{" "}
          <Field id="reseller_name" placeholder="..........................................................................................................................." minWidth={24} />
        </p>
        <p className="mb-1">สำนักงานตั้งอยู่เลขที่</p>
        <Field
          id="reseller_address"
          type="textarea"
          placeholder="..................................................................................................................................................................................................."
        />
        <p className="mt-1">
          (ซึ่งต่อไปในสัญญานี้จะเรียกว่า &ldquo;Reseller&rdquo; หรือ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo;) อีกฝ่ายหนึ่ง
        </p>
      </div>

      {/* Recital */}
      <p className="mb-5">
        คู่สัญญาทั้งสองฝ่ายตกลงเข้าทำสัญญาแต่งตั้งตัวแทนจำหน่ายต่อ เพื่อทำการตลาด
        นำเสนอ และจัดจำหน่ายผลิตภัณฑ์ซอฟต์แวร์ และเครื่องมือทางไอที
        (ซึ่งต่อไปนี้เรียกว่า &ldquo;ผลิตภัณฑ์&rdquo;) โดยมีข้อกำหนดและเงื่อนไขดังต่อไปนี้:
      </p>

      {/* Section 1 */}
      <h2 className="font-bold mb-2">1. นิยามศัพท์ (Definitions)</h2>
      <ul className="list-none space-y-2 mb-5">
        <li className="pl-4">
          <span className="font-bold">1.1. &ldquo;เจ้าของผลิตภัณฑ์&rdquo; (Vendor)</span>{" "}
          หมายถึง บุคคล นิติบุคคล หรือผู้พัฒนาซอฟต์แวร์ ซึ่งเป็นผู้ถือครองลิขสิทธิ์ ทรัพย์สินทางปัญญา และสิทธิ์โดยชอบด้วยกฎหมายในตัวผลิตภัณฑ์ซอฟต์แวร์แต่เพียงผู้เดียว (หรือตามสิทธิ์ที่ได้รับอนุญาต)
        </li>
        <li className="pl-4">
          <span className="font-bold">1.2. &ldquo;ผู้ใช้ปลายทาง&rdquo; (End User)</span>{" "}
          หมายถึง บุคคล นิติบุคคล หรือองค์กรที่เป็นผู้ซื้อ ได้รับสิทธิ์ หรือจัดหาผลิตภัณฑ์ซอฟต์แวร์ไปเพื่อวัตถุประสงค์ในการใช้งานจริงภายในองค์กรของตนเอง ไม่ใช่เพื่อวัตถุประสงค์ในการนำไปจำหน่ายต่อหรือให้เช่าช่วง
        </li>
        <li className="pl-4">
          <span className="font-bold">1.3. &ldquo;ผลิตภัณฑ์&rdquo; (Product)</span>{" "}
          หมายถึง ซอฟต์แวร์ ระบบปฏิบัติการ หรือเครื่องมือทางไอที รวมถึง &ldquo;สิทธิ์การใช้งาน&rdquo; เอกสารคู่มือ การอัปเดต และแพตช์แก้ไขความปลอดภัย ซึ่ง &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ได้รับสิทธิ์จัดจำหน่ายจาก &ldquo;เจ้าของผลิตภัณฑ์&rdquo;
        </li>
        <li className="pl-4">
          <span className="font-bold">1.4. &ldquo;สิทธิ์การใช้งาน&rdquo; (License/Subscription)</span>{" "}
          หมายถึง สิทธิ์ทางกฎหมายที่ &ldquo;เจ้าของผลิตภัณฑ์&rdquo; หรือ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; อนุญาตให้ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; นำไปจัดจำหน่ายแก่ &ldquo;ผู้ใช้ปลายทาง&rdquo; เพื่อเข้าใช้ &ldquo;ผลิตภัณฑ์&rdquo; ตามข้อกำหนดและเงื่อนไขที่กำหนดไว้ในข้อตกลงสิทธิ์การใช้งานสำหรับ &ldquo;ผู้ใช้ปลายทาง&rdquo; (EULA)
        </li>
      </ul>

      {/* Section 2 */}
      <h2 className="font-bold mb-2">
        2. ขอบเขตการแต่งตั้งและอาณาเขต (Scope of Appointment & Territory)
      </h2>
      <ul className="list-none space-y-2">
        <li className="pl-4">
          <span className="font-bold">2.1. การแต่งตั้งและบทบาทของ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo;:</span>
          <ul className="list-disc pl-6 space-y-1 mt-1 font-normal">
            <li>
              &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ในฐานะผู้ได้รับสิทธิ์อย่างถูกต้องจาก &ldquo;เจ้าของผลิตภัณฑ์&rdquo; แต่งตั้งตัวแทนจำหน่ายต่อให้เป็น &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; ประเภทแบบไม่ผูกขาด (Non-exclusive)
            </li>
            <li>
              &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; มีหน้าที่ในการจัดหา จัดส่ง และประสานงานเรื่องการออก &ldquo;สิทธิ์การใช้งาน&rdquo; ของ &ldquo;ผลิตภัณฑ์&rdquo; ให้แก่ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; เพื่อนำไปจำหน่ายต่อให้แก่ &ldquo;ผู้ใช้ปลายทาง&rdquo;
            </li>
          </ul>
        </li>
        <li className="pl-4 font-normal">
          <span className="font-bold">2.2. สิทธิ์การจำหน่ายของ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo;:</span>{" "}
          &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; สามารถจัดจำหน่าย &ldquo;สิทธิ์การใช้งาน&rdquo; ของ &ldquo;ผลิตภัณฑ์&rdquo; ให้กับ &ldquo;ผู้ใช้ปลายทาง&rdquo; เท่านั้น ไม่สามารถโอนสิทธิ์การใช้งาน หรือแสดงความเป็นเจ้าของในตัว &ldquo;ผลิตภัณฑ์&rdquo;
        </li>
        <li className="pl-4 font-normal">
          <span className="font-bold">2.3. อาณาเขตทางภูมิศาสตร์ (Territory):</span>{" "}
          &ldquo;ตัวแทนจำหน่ายต่อ&rdquo; มีสิทธิ์ดำเนินกิจกรรมการขาย การส่งเสริมการขาย และทำการตลาด &ldquo;ผลิตภัณฑ์&rdquo; ได้ภายในพื้นที่ ประเทศไทย เท่านั้น
        </li>
      </ul>
    </div>
  );
}