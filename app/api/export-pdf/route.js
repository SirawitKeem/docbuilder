import puppeteer from "puppeteer";

export async function POST(request) {
  let browser;
  try {
    const { values } = await request.json();

    const encoded = Buffer.from(JSON.stringify(values), "utf-8").toString("base64");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const printUrl = `${baseUrl}/print/nda?data=${encodeURIComponent(encoded)}`;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(printUrl, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="NDA.pdf"',
      },
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error("export-pdf error:", error);
    return Response.json({ error: "สร้าง PDF ไม่สำเร็จ" }, { status: 500 });
  }
}
