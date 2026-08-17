export async function getTemplates() {
  return [
    {
      id: "nda",
      name: "หนังสือสัญญาไม่เปิดเผยข้อมูล (NDA)",
      description: "Non-Disclosure Agreement สัญญามาตรฐานสำหรับการรักษาความลับทางการค้า",
      color: "primary",
      href: "/create/nda",
      available: true,
    },
    {
      id: "quotation",
      name: "ใบเสนอราคา (Quotation)",
      description: "เอกสารเสนอราคาพร้อมรายละเอียดรายการสินค้าและเงื่อนไขการชำระเงิน",
      color: "success",
      href: "/create/quotation",
      available: false,
    },
    {
      id: "service-agreement",
      name: "สัญญาจ้างบริการ (Service Agreement)",
      description: "ข้อตกลงการให้บริการและขอบเขตการทำงาน (Scope of Work)",
      color: "purple",
      href: "/create/service-agreement",
      available: false,
    },
    {
      id: "receipt",
      name: "ใบเสร็จรับเงิน (Receipt)",
      description: "เอกสารสำคัญสำหรับการรับชำระเงินและออกหลักฐานให้แก่ลูกค้า",
      color: "warning",
      href: "/create/receipt",
      available: false,
    },
  ];
}