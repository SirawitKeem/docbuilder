export async function getTemplates() {
  return [
    {
      id: "nda",
      name: "NDA",
      fullName: "หนังสือสัญญาไม่เปิดเผยข้อมูล",
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
      id: "partner",
      name: "Partner Agreement",
      fullName: "สัญญาแต่งตั้งพันธมิตรตัวแทนจำหน่าย",
      description: "สัญญาแต่งตั้งพันธมิตร พร้อมเงื่อนไข Deal Registration และอัตราแลกเปลี่ยน",
      color: "purple",
      href: "/create/partner",
      available: true,
    },
    {
      id: "service-agreement",
      name: "Service Agreement",
      fullName: "สัญญาจ้างบริการและขอบเขตการทำงาน",
      description: "ข้อตกลงการให้บริการและขอบเขตการทำงาน (Scope of Work)",
      color: "amber",
      href: "/create/service-agreement",
      available: false,
    },
    {
      id: "receipt",
      name: "Receipt",
      fullName: "ใบเสร็จรับเงิน / หลักฐานการชำระเงิน",
      description: "เอกสารสำคัญสำหรับการรับชำระเงินและออกหลักฐานให้แก่ลูกค้า",
      color: "warning",
      href: "/create/receipt",
      available: false,
    },
  ];
}