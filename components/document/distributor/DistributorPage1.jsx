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

      {/* Contract Opening Line - Paragraph Indented */}
      <p className="indent-12 mb-4 text-justify">
        สัญญาฉบับนี้ทำขึ้น ณ{" "}
        <Field id="contract_location" placeholder="...................................................................." minWidth={20} />{" "}
        เมื่อวันที่ <Field id="contract_date_day" placeholder="........" minWidth={4} />{" "}
        เดือน <Field id="contract_date_month" placeholder="................" minWidth={8} />{" "}
        พ.ศ. <Field id="contract_date_year" placeholder="............" minWidth={5} />
      </p>

      <p className="mb-2 font-normal">ระหว่าง:</p>

      {/* Party 1 */}
      <p className="mb-3 text-justify">
        (1) บริษัท เครสท์ เซนโด จำกัด สำนักงานใหญ่ ตั้งอยู่เลขที่ 8/40 เดอะ
        คอนเนค 37 ซอยช่างอากาศอุทิศ 10 แยก 1-2 แขวงดอนเมือง เขตดอนเมือง
        กรุงเทพมหานคร 10210 ประเทศไทย ซึ่งต่อไปในสัญญานี้จะเรียกว่า &ldquo;ผู้เปิดเผยข้อมูล&rdquo; (Disclosing Party)
        ฝ่ายหนึ่ง และ
      </p>

      {/* Party 2 */}
      <div className="mb-4 text-justify">
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
      <p className="mb-5 text-justify">
        คู่สัญญาทั้งสองฝ่ายตกลงเข้าทำสัญญาแต่งตั้งตัวแทนจำหน่ายต่อ เพื่อทำการตลาด
        นำเสนอ และจัดจำหน่ายผลิตภัณฑ์ซอฟต์แวร์ และเครื่องมือทางไอที
        (ซึ่งต่อไปนี้เรียกว่า &ldquo;ผลิตภัณฑ์&rdquo;) โดยมีข้อกำหนดและเงื่อนไขดังต่อไปนี้:
      </p>

      {/* Section 1 */}
      <h2 className="font-bold mb-2">1. นิยามศัพท์ (Definitions)</h2>
      <ul className="list-none space-y-2 mb-5 text-justify">
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
          หมายถึง ซอฟต์แวร์ ระบบปฏิบัติการ หรือเครื่องมือทางไอที รวมถึง{" "}
          <span className="font-bold">&ldquo;สิทธิ์การใช้งาน&rdquo;</span> เอกสารคู่มือ การอัปเดต และแพตช์แก้ไขความปลอดภัย ซึ่ง{" "}
          <span className="font-bold">&ldquo;ผู้จัดจำหน่ายหลัก&rdquo;</span> ได้รับสิทธิ์จัดจำหน่ายจาก{" "}
          <span className="font-bold">&ldquo;เจ้าของผลิตภัณฑ์&rdquo;</span>
        </li>
        <li className="pl-4">
          <span className="font-bold">1.4. &ldquo;สิทธิ์การใช้งาน&rdquo; (License/Subscription)</span>{" "}
          หมายถึง สิทธิ์ทางกฎหมายที่{" "}
          <span className="font-bold">&ldquo;เจ้าของผลิตภัณฑ์&rdquo;</span> หรือ{" "}
          <span className="font-bold">&ldquo;ผู้จัดจำหน่ายหลัก&rdquo;</span> อนุญาตให้{" "}
          <span className="font-bold">&ldquo;ตัวแทนจำหน่ายต่อ&rdquo;</span> นำไปจัดจำหน่ายแก่{" "}
          <span className="font-bold">&ldquo;ผู้ใช้ปลายทาง&rdquo;</span> เพื่อเข้าใช้{" "}
          <span className="font-bold">&ldquo;ผลิตภัณฑ์&rdquo;</span> ตามข้อกำหนดและเงื่อนไขที่กำหนดไว้ในข้อตกลงสิทธิ์การใช้งานสำหรับ{" "}
          <span className="font-bold">&ldquo;ผู้ใช้ปลายทาง&rdquo; (EULA)</span>
        </li>
      </ul>

      {/* Section 2 */}
      <h2 className="font-bold mb-2">
        2. ขอบเขตการแต่งตั้งและอาณาเขต (Scope of Appointment & Territory)
      </h2>
      <ul className="list-none space-y-2 text-justify">
        <li className="pl-4">
          <span className="font-bold">2.1. การแต่งตั้งและบทบาทของ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo;:</span>
          <ul className="list-disc pl-6 space-y-1 mt-1">
            <li>
              <span className="font-bold">&ldquo;ผู้จัดจำหน่ายหลัก&rdquo;</span> ในฐานะผู้ได้รับสิทธิ์อย่างถูกต้องจาก{" "}
              <span className="font-bold">&ldquo;เจ้าของผลิตภัณฑ์&rdquo;</span> แต่งตั้งตัวแทนจำหน่ายต่อให้เป็น{" "}
              <span className="font-bold">&ldquo;ตัวแทนจำหน่ายต่อ&rdquo;</span> ประเภทแบบไม่ผูกขาด (Non-exclusive)
            </li>
            <li>
              <span className="font-bold">&ldquo;ผู้จัดจำหน่ายหลัก&rdquo;</span> มีหน้าที่ในการจัดหา จัดส่ง และประสานงานเรื่องการออก{" "}
              <span className="font-bold">&ldquo;สิทธิ์การใช้งาน&rdquo;</span> ของ{" "}
              <span className="font-bold">&ldquo;ผลิตภัณฑ์&rdquo;</span> ให้แก่{" "}
              <span className="font-bold">&ldquo;ตัวแทนจำหน่ายต่อ&rdquo;</span> เพื่อนำไปจำหน่ายต่อให้แก่{" "}
              <span className="font-bold">&ldquo;ผู้ใช้ปลายทาง&rdquo;</span>
            </li>
          </ul>
        </li>
        <li className="pl-4">
          <span className="font-bold">2.2. สิทธิ์การจำหน่ายของ &ldquo;ตัวแทนจำหน่ายต่อ&rdquo;:</span>{" "}
          <span className="font-bold">&ldquo;ตัวแทนจำหน่ายต่อ&rdquo;</span> สามารถจัดจำหน่าย{" "}
          <span className="font-bold">&ldquo;สิทธิ์การใช้งาน&rdquo;</span> ของ{" "}
          <span className="font-bold">&ldquo;ผลิตภัณฑ์&rdquo;</span> ให้กับ{" "}
          <span className="font-bold">&ldquo;ผู้ใช้ปลายทาง&rdquo;</span> เท่านั้น ไม่สามารถโอนสิทธิ์การใช้งาน หรือแสดงความเป็นเจ้าของในตัว{" "}
          <span className="font-bold">&ldquo;ผลิตภัณฑ์&rdquo;</span>
        </li>
        <li className="pl-4">
          <span className="font-bold">2.3. อาณาเขตทางภูมิศาสตร์ (Territory):</span>{" "}
          <span className="font-bold">&ldquo;ตัวแทนจำหน่ายต่อ&rdquo;</span> มีสิทธิ์ดำเนินกิจกรรมการขาย การส่งเสริมการขาย และทำการตลาด{" "}
          <span className="font-bold">&ldquo;ผลิตภัณฑ์&rdquo;</span> ได้ภายในพื้นที่{" "}
          <span className="font-bold">ประเทศไทย เท่านั้น</span>
        </li>
      </ul>
    </div>
  );
}