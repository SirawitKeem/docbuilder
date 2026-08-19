import Field from "../Field";
import { partnerTemplate } from "@/lib/templates/partner/schema";

export default function PartnerPage1() {
  const { distributorParty } = partnerTemplate;

  return (
    <div className="text-[12px] leading-[1.75] text-gray-900 font-normal">
      <h1 className="text-center text-[14px] font-bold mb-0.5">
        สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย
      </h1>
      <p className="text-center font-normal text-[12px] mb-3">(Partner Agreement)</p>

      <p className="mb-2">
        สัญญาฉบับนี้ทำขึ้น ณ วันที่ <Field id="contract_date_day" placeholder="17" minWidth={3} />{" "}
        เดือน <Field id="contract_date_month" placeholder="สิงหาคม" minWidth={8} />{" "}
        พ.ศ. <Field id="contract_date_year" placeholder="2569" minWidth={5} />
      </p>

      <p className="mb-0.5 font-normal">ระหว่าง:</p>

      <p className="mb-2 text-justify">
        {distributorParty.name} เลขทะเบียนนิติบุคคล {distributorParty.registrationNumber} สำนักงานใหญ่ ตั้งอยู่เลขที่ 8/40 เดอะ คอนเนค 37 ซอยช่างอากาศอุทิศ 10 แยก 1-2 แขวงดอนเมือง เขตดอนเมือง กรุงเทพมหานคร 10210{" "}
        (ซึ่งต่อไปในสัญญานี้จะเรียกว่า &ldquo;Distributor&rdquo; หรือ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo;) ฝ่ายหนึ่ง
      </p>

      <p className="mb-0.5 font-normal">กับ</p>

      <p className="mb-2.5 text-justify">
        <Field id="reseller_name" placeholder="ระบุชื่อบริษัท Reseller" minWidth={24} /> เลขทะเบียนนิติบุคคล{" "}
        <Field id="reseller_registration_number" placeholder="0000000000000" minWidth={16} />{" "}
        สำนักงานใหญ่ ตั้งอยู่เลขที่{" "}
        <Field id="reseller_address" type="textarea" placeholder="ระบุที่อยู่" />
        {" "}(ซึ่งต่อไปในสัญญานี้จะเรียกว่า &ldquo;Reseller&rdquo; หรือ &ldquo;ตัวแทนจำหน่าย&rdquo;) อีกฝ่ายหนึ่ง
      </p>

      <p className="mb-3 text-justify">
        คู่สัญญาทั้งสองฝ่ายตกลงเข้าทำสัญญาแต่งตั้งตัวแทนจำหน่าย เพื่อทำการตลาด นำเสนอ และจัดจำหน่ายผลิตภัณฑ์ ซอฟต์แวร์ และเครื่องมือทางไอที (ซึ่งต่อไปนี้เรียกว่า &ldquo;ผลิตภัณฑ์&rdquo;) โดยมีข้อกำหนดและเงื่อนไขดังต่อไปนี้:
      </p>

      <h2 className="font-bold mb-1 text-[12px]">ข้อ 1. นิยามศัพท์ (Definitions)</h2>
      <p className="mb-1 text-justify">
        ในสัญญานี้ คำหรือข้อความดังต่อไปนี้ให้มีความหมายตามที่กำหนดไว้ เว้นแต่บริบทจะกำหนดเป็นอย่างอื่น:
      </p>

      <ul className="list-none space-y-1 text-justify mb-3">
        <li className="pl-4">
          <span className="font-bold">1.1 &ldquo;เจ้าของผลิตภัณฑ์&rdquo; (Vendor)</span> หมายถึง บุคคล นิติบุคคล หรือผู้พัฒนาซอฟต์แวร์ ซึ่งเป็นผู้ถือครองลิขสิทธิ์ ทรัพย์สินทางปัญญา และสิทธิ์โดยชอบด้วยกฎหมายในตัวผลิตภัณฑ์ซอฟต์แวร์แต่เพียงผู้เดียว (หรือตามสิทธิ์ที่ได้รับอนุญาต)
        </li>
        <li className="pl-4">
          <span className="font-bold">1.2 &ldquo;ผู้ใช้ปลายทาง&rdquo; (End User)</span> หมายถึง บุคคล นิติบุคคล หรือองค์กรที่เป็นผู้ซื้อ ได้รับสิทธิ์ หรือจัดหาผลิตภัณฑ์ซอฟต์แวร์ไปเพื่อวัตถุประสงค์ในการใช้งานจริงภายในองค์กรของตนเอง ไม่ใช่เพื่อวัตถุประสงค์ในการนำไปจำหน่ายหรือให้เช่าช่วง
        </li>
        <li className="pl-4">
          <span className="font-bold">1.3 &ldquo;ผลิตภัณฑ์&rdquo; (Product)</span> หมายถึง ซอฟต์แวร์ ระบบปฏิบัติการ หรือเครื่องมือทางไอที รวมถึง &ldquo;สิทธิ์การใช้งาน&rdquo; เอกสารคู่มือ การอัปเดต และแพตช์แก้ไขความปลอดภัย ซึ่ง &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ได้รับสิทธิ์จัดจำหน่ายจาก &ldquo;เจ้าของผลิตภัณฑ์&rdquo;
        </li>
        <li className="pl-4">
          <span className="font-bold">1.4 &ldquo;สิทธิ์การใช้งาน&rdquo; (License/Subscription)</span> หมายถึง สิทธิ์ทางกฎหมายที่ &ldquo;เจ้าของผลิตภัณฑ์&rdquo; หรือ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; อนุญาตให้ &ldquo;ตัวแทนจำหน่าย&rdquo; นำไปจัดจำหน่ายแก่ &ldquo;ผู้ใช้ปลายทาง&rdquo; เพื่อเข้าใช้ &ldquo;ผลิตภัณฑ์&rdquo; ตามข้อกำหนดและเงื่อนไขที่กำหนดไว้ในข้อตกลงสิทธิ์การใช้งานสำหรับ &ldquo;ผู้ใช้ปลายทาง&rdquo; (EULA)
        </li>
        <li className="pl-4">
          <span className="font-bold">1.5 &ldquo;การลงทะเบียนสิทธิ์ในข้อตกลงทางการค้า&rdquo; (Deal Registration)</span> หมายถึง กระบวนการที่ &ldquo;ตัวแทนจำหน่าย&rdquo; แจ้งข้อมูลรายละเอียดของ &ldquo;ผู้ใช้ปลายทาง&rdquo; ขอบเขตงาน หรือโอกาสทางการค้า ผ่านระบบหรือช่องทางที่ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; กำหนดไว้ เพื่อขอรับสิทธิ์ในการเสนอขายและสิทธิประโยชน์อื่นใดตามเงื่อนไขของสัญญานั้น ๆ
        </li>
      </ul>

      <h2 className="font-bold mb-1 text-[12px]">ข้อ 2. ขอบเขตการแต่งตั้งและอาณาเขต (Scope of Appointment & Territory)</h2>
      <p className="mb-0.5 pl-4 font-bold">2.1 การแต่งตั้งและบทบาทของ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo;:</p>
      <ul className="list-disc pl-10 space-y-1 text-justify mb-1.5">
        <li>
          &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ในฐานะผู้ได้รับสิทธิ์อย่างถูกต้องจาก &ldquo;เจ้าของผลิตภัณฑ์&rdquo; แต่งตั้งตัวแทนจำหน่ายให้เป็น &ldquo;ตัวแทนจำหน่าย&rdquo; ประเภทแบบไม่ผูกขาด (Non-exclusive)
        </li>
        <li>
          &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; มีหน้าที่ในการจัดหา จัดส่ง และประสานงานเรื่องการออก &ldquo;สิทธิ์การใช้งาน&rdquo; ของ &ldquo;ผลิตภัณฑ์&rdquo; ให้แก่ &ldquo;ตัวแทนจำหน่าย&rdquo; เพื่อนำไปจำหน่ายให้แก่ &ldquo;ผู้ใช้ปลายทาง&rdquo;
        </li>
      </ul>
      <p className="text-justify pl-4 mb-1">
        <span className="font-bold">2.2 สิทธิ์การจำหน่ายของ &ldquo;ตัวแทนจำหน่าย&rdquo;:</span> &ldquo;ตัวแทนจำหน่าย&rdquo; สามารถจัดจำหน่าย &ldquo;สิทธิ์การใช้งาน&rdquo; ของ &ldquo;ผลิตภัณฑ์&rdquo; ให้กับ &ldquo;ผู้ใช้ปลายทาง&rdquo; เท่านั้น ไม่สามารถโอนสิทธิ์การใช้งาน หรือแสดงความเป็นเจ้าของในตัว &ldquo;ผลิตภัณฑ์&rdquo;
      </p>
      <p className="text-justify pl-4">
        <span className="font-bold">2.3 อาณาเขตทางภูมิศาสตร์ (Territory):</span> &ldquo;ตัวแทนจำหน่าย&rdquo; มีสิทธิดำเนินกิจกรรมการขาย การส่งเสริมการขาย และทำตลาด &ldquo;ผลิตภัณฑ์&rdquo; ได้ภายในพื้นที่ ประเทศไทย เท่านั้น
      </p>
    </div>
  );
}