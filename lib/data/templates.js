export async function getTemplates() {
  return [
    {
      id: "nda",
      name: "หนังสือสัญญาไม่เปิดเผยข้อมูล (NDA)",
      fullName: "หนังสือสัญญาไม่เปิดเผยข้อมูล (Non-Disclosure Agreement)",
      description: "Non-Disclosure Agreement สัญญามาตรฐานสำหรับการรักษาความลับทางการค้า",
      color: "primary",
      href: "/create/nda",
      available: true,
    },
    {
      id: "distributor",
      name: "Distributor Agreement",
      fullName: "สัญญาแต่งตั้งและจัดจำหน่ายซอฟต์แวร์",
      description: "สัญญาแต่งตั้งตัวแทนจำหน่ายและจัดจำหน่ายซอฟต์แวร์",
      color: "success",
      href: "/create/distributor",
      available: true,
    },
    {
      id: "service-agreement",
      name: "สัญญาจ้างบริการ (Service Agreement)",
      fullName: "สัญญาจ้างบริการและขอบเขตการทำงาน (Scope of Work)",
      description: "ข้อตกลงการให้บริการและขอบเขตการทำงาน (Scope of Work)",
      color: "purple",
      href: "/create/service-agreement",
      available: false,
    },
    {
      id: "receipt",
      name: "ใบเสร็จรับเงิน (Receipt)",
      fullName: "ใบเสร็จรับเงิน / หลักฐานการชำระเงิน",
      description: "เอกสารสำคัญสำหรับการรับชำระเงินและออกหลักฐานให้แก่ลูกค้า",
      color: "warning",
      href: "/create/receipt",
      available: false,
    },
  ];
}