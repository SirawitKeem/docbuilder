import puppeteer from "puppeteer";

export async function POST(request) {
  let browser;
  try {
    const { templateId, values, quotationData, fileName } = await request.json();

    const payload = quotationData || values || {};
    const encoded = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const printUrl = `${baseUrl}/print/${templateId}?data=${encodeURIComponent(encoded)}`;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage();

    // 1. Lock Viewport strictly to A4 dimensions (794px x 1123px @ 96dpi) with High DPI scale
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    });

    // 2. Disable animations and transitions for instant clean capture
    await page.evaluateOnNewDocument(() => {
      const style = document.createElement("style");
      style.innerHTML = "* { animation: none !important; transition: none !important; }";
      document.head.appendChild(style);
    });

    // 3. Open print route and wait for network idle
    await page.goto(printUrl, { waitUntil: "networkidle0" });

    // 4. Wait for document fonts to be 100% ready & applied in Headless Chrome
    await page.evaluate(() => document.fonts ? document.fonts.ready : Promise.resolve());

    // 5. Wait for explicit data-ready="true" signal from React print page component
    await page.waitForSelector('.print-page[data-ready="true"]', { timeout: 15000 });

    // 6. Generate 1:1 A4 PDF matching onscreen cards with zero margin offset
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
    });

    await browser.close();

    const downloadFileName = fileName || `${payload.quotationNo || "document"}.pdf`;

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
