import puppeteer from "puppeteer";

export async function POST(request) {
  let browser;
  try {
    const { templateId, values, fileName } = await request.json();

    const encoded = Buffer.from(JSON.stringify(values), "utf-8").toString("base64");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const printUrl = `${baseUrl}/print/${templateId}?data=${encodeURIComponent(encoded)}`;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage();

    // 1. ปิด CSS Animation / Transition เพื่อให้จับภาพ State สมบูรณ์ทันที
    await page.evaluateOnNewDocument(() => {
      const style = document.createElement("style");
      style.innerHTML = "* { animation: none !important; transition: none !important; }";
      document.head.appendChild(style);
    });

    // 2. เปิด URL และรอเครือข่าย + Selector โหลดเสร็จสิ้น
    await page.goto(printUrl, { waitUntil: "networkidle0" });
    await page.waitForSelector(".print-page", { timeout: 10000 });

    // 3. สั่งสร้าง PDF A4 ไร้ขอบ พร้อมพื้นหลังสีตรงตามหน้าจอ
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    await browser.close();

    const downloadFileName = fileName || "document.pdf";

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadFileName)}"`,
      },
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error("export-pdf error:", error);
    return Response.json({ error: "สร้าง PDF ไม่สำเร็จ" }, { status: 500 });
  }
}
