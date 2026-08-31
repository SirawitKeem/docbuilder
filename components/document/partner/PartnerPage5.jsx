import Field from "../Field";
import { partnerTemplate } from "@/lib/templates/partner/schema";
import { useDocumentFields } from "@/context/DocumentFieldsContext";
import CorporateSeal from "../CorporateSeal";

export default function PartnerPage5() {
  const { distributorParty } = partnerTemplate;
  const { values } = useDocumentFields();

  return (
    <div className="document-body pt-2 text-[12px] leading-snug">
      {/* ส่วนเนื้อหาข้อ 10, ข้อ 11 และย่อหน้าสรุปสัญญา */}
      <div>
        <h2>ข้อ 10. ระยะเวลาและการบอกเลิกสัญญา (Term and Termination)</h2>
        <div className="space-y-1 pl-4 mb-2 text-[12px] text-left">
          <p className="text-left">
            <span className="font-bold">10.1 ระยะเวลาสัญญา:</span> สัญญานี้มีผลบังคับใช้เป็นระยะเวลา 1 (หนึ่ง) ปี นับตั้งแต่วันที่ลงนาม และจะต่ออายุอัตโนมัติคราวละ 1 (หนึ่ง) ปี เว้นแต่ฝ่ายใดฝ่ายหนึ่งจะแจ้งไม่ต่ออายุเป็นลายลักษณ์อักษรล่วงหน้าอย่างน้อย 30 (สามสิบ) วัน ก่อนสิ้นสุดสัญญา
          </p>
          <div>
            <p className="font-bold mb-0.5 text-left">10.2 การบอกเลิกสัญญาแบบมีเหตุผล (Termination for Cause):</p>
            <p className="mb-0.5 text-left">คู่สัญญาฝ่ายใดฝ่ายหนึ่งมีสิทธิบอกเลิกสัญญาได้ทันที หากอีกฝ่าย:</p>
            <ul className="list-disc pl-8 space-y-0.5 font-normal text-[12px]">
              <li className="text-left">ประพฤติผิดสัญญาข้อหนึ่งข้อใดและไม่แก้ไขภายใน 30 (สามสิบ) วัน นับแต่วันได้รับแจ้งเป็นลายลักษณ์อักษร</li>
              <li className="text-left">ตกเป็นผู้มีหนี้สินล้นพ้นตัว ล้มละลาย เลิกบริษัท หรือเข้าสู่กระบวนการฟื้นฟูกิจการ</li>
              <li className="text-left">กระทำผิดกฎหมายอย่างร้ายแรง เช่น กฎหมายต่อต้านการทุจริต กฎหมายคุ้มครองข้อมูลส่วนบุคคล หรือกฎหมายละเมิดลิขสิทธิ์</li>
            </ul>
            <p className="mt-0.5 font-normal text-left text-[12px]">
              สำหรับการลงทะเบียนสิทธิ์ในข้อตกลงทางการค้า (Deal Registration) ที่ได้ทำไว้ก่อนหน้า จะถือว่าสิ้นสุดลงทันที
            </p>
          </div>
          <p className="text-left">
            <span className="font-bold">10.3 การบอกเลิกสัญญาโดยไม่มีเหตุผล (Termination for Convenience):</span> คู่สัญญาฝ่ายใดฝ่ายหนึ่งสามารถบอกเลิกสัญญานี้ได้โดยแจ้งเป็นลายลักษณ์อักษรให้อีกฝ่ายทราบล่วงหน้าไม่น้อยกว่า 60 (หกสิบ) วัน สำหรับการลงทะเบียนสิทธิ์ในข้อตกลงทางการค้า (Deal Registration) ที่ได้ทำไว้ก่อนหน้า จะถือว่าสิ้นสุดลงทันที
          </p>
          <p className="text-left">
            <span className="font-bold">10.4 ภาระผูกพันหลังสิ้นสุดสัญญา:</span> เมื่อสัญญาสินสุดลง &ldquo;ตัวแทนจำหน่าย&rdquo; ยังคงต้องชำระค่าสินค้าหรือบริการที่ค้างชำระทั้งหมด และ &ldquo;ผู้จัดจำหน่ายหลัก&rdquo; ยังคงต้องดูแลจัดการ &ldquo;สิทธิ์การใช้งาน&rdquo; ของ &ldquo;ผู้ใช้ปลายทาง&rdquo; ที่สั่งซื้อไปก่อนวันสิ้นสุดสัญญา ให้ได้รับการให้บริการจนครบกำหนดอายุ &ldquo;สิทธิ์การใช้งาน&rdquo; นั้น ๆ
          </p>
        </div>

        <h2 className="mt-2 mb-1 text-left">ข้อ 11. กฎหมายที่ใช้บังคับและกระบวนการระงับข้อพิพาท (Governing Law & Dispute Resolution)</h2>
        <div className="space-y-1 pl-4 text-[12px] text-left mb-2">
          <p className="text-left">
            <span className="font-bold">11.1 กฎหมายที่ใช้บังคับ:</span> สัญญานี้อยู่ภายใต้การบังคับ และตีความตามกฎหมายแห่งราชอาณาจักรไทย
          </p>
          <p className="text-left">
            <span className="font-bold">11.2 กระบวนการระงับข้อพิพาท:</span> หากเกิดข้อขัดแย้งหรือข้อพิพาทขึ้นจากสัญญานี้ คู่สัญญาตกลงจะหารือเพื่อประนอมข้อพิพาทด้วยมิตรภาพก่อน หากไม่สามารถหาข้อยุติได้ภายใน 30 (สามสิบ) วัน ให้ส่งเรื่องเข้าสู่การพิจารณาของ ศาลไทย
          </p>
        </div>

        {/* ย่อหน้าสรุปสัญญา */}
        <p className="indent-8 text-left text-gray-900 text-[12px] mt-3 mb-4">
          สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยรายละเอียดตลอดแล้ว
          <br />
          จึงได้ลงลายมือชื่อและประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยาน
        </p>
      </div>

      {/* ส่วน Signature Block */}
      <div className="mt-8 pb-2 text-[12px]">
        {/* คู่สัญญาหลัก */}
        <div className="grid grid-cols-2 gap-6 mb-0">
          <div className="flex flex-col items-center text-center relative">
            <p className="font-bold w-full text-center" style={{ textAlign: "center" }}>
              {distributorParty.name}
            </p>
            <div className="h-14 flex items-center justify-center relative w-full mb-0.5">
              {values.our_signature_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.our_signature_image}
                  alt="ลายเซ็นฝ่ายเรา"
                  className="max-h-12 max-w-[160px] object-contain select-none z-10"
                />
              ) : null}
              {values.include_seal !== false && (
                <div className="absolute -right-1 -top-2">
                  <CorporateSeal className="w-14 h-14" opacity={0.82} />
                </div>
              )}
            </div>
            <div className="space-y-1 w-full">
              <p className="w-full text-center" style={{ textAlign: "center" }}>
                ลงชื่อ ......................................................
              </p>
              <p className="w-full text-center" style={{ textAlign: "center" }}>( {distributorParty.signatoryName} )</p>
              <p className="w-full text-center" style={{ textAlign: "center" }}>ตำแหน่ง: {distributorParty.signatoryPosition}</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="font-bold w-full text-center" style={{ textAlign: "center" }}>
              <Field id="reseller_name" placeholder="ระบุชื่อบริษัท Reseller" minWidth={22} />
            </p>
            <div className="h-14 flex items-center justify-center relative w-full mb-0.5">
              {values.counterparty_signature_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.counterparty_signature_image}
                  alt="ลายเซ็นคู่สัญญา"
                  className="max-h-12 max-w-[160px] object-contain select-none"
                />
              ) : null}
            </div>
            <div className="space-y-1 w-full">
              <p className="w-full text-center" style={{ textAlign: "center" }}>
                ลงชื่อ ......................................................
              </p>
              <p className="w-full text-center" style={{ textAlign: "center" }}>
                (&nbsp;<Field id="reseller_signatory_name" placeholder="ชื่อ-นามสกุล" minWidth={16} />&nbsp;)
              </p>
              <p className="w-full text-center" style={{ textAlign: "center" }}>
                ตำแหน่ง:{" "}
                <Field id="reseller_signatory_position" placeholder="เช่น กรรมการผู้จัดการ" minWidth={16} />
              </p>
            </div>
          </div>
        </div>

        {/* พยาน */}
        <div className="grid grid-cols-2 gap-6" style={{ marginTop: "35px" }}>
          <div className="flex flex-col items-center text-center space-y-1.5 w-full">
            <p className="w-full text-center" style={{ textAlign: "center" }}>ลงชื่อ ...................................................... พยาน</p>
            <p className="w-full text-center" style={{ textAlign: "center" }}>( ...................................................... )</p>
            <p className="w-full text-center" style={{ textAlign: "center" }}>ตำแหน่ง: ........................................</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-1.5 w-full">
            <p className="w-full text-center" style={{ textAlign: "center" }}>ลงชื่อ ...................................................... พยาน</p>
            <p className="w-full text-center" style={{ textAlign: "center" }}>( ...................................................... )</p>
            <p className="w-full text-center" style={{ textAlign: "center" }}>ตำแหน่ง: ........................................</p>
          </div>
        </div>
      </div>
    </div>
  );
}