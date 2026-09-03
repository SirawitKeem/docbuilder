import puppeteer from "puppeteer";
import { customTemplatesRepo } from "@/lib/db/repositories";

export async function POST(request) {
  let browser;
  try {
    const { templateId, values, quotationData, fileName } = await request.json();

    const payload = quotationData || values || {};
    
    // Dynamically determine template format & dimensions (Docs A4 vs Slides 16:9)
    let isSlide = false;
    let pageWidth = 794;
    let pageHeight = 1123;

    try {
      if (templateId) {
        const tmpl = await customTemplatesRepo.getById(templateId);
        if (tmpl) {
          if (tmpl.canvasPreset === "slide-16-9" || tmpl.editorType === "slide") {
            isSlide = true;
            pageWidth = 1280;
            pageHeight = 720;
          } else if (tmpl.canvasPreset === "a4-landscape" || tmpl.orientation === "landscape") {
            pageWidth = 1123;
            pageHeight = 794;
          }
        }
      }
    } catch (tmplErr) {
      console.warn("Could not load template config for export-pdf:", tmplErr);
    }

    // Dynamically resolve host and protocol from current incoming request
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    
    // Also include encoded query string as a secondary fallback
    const jsonString = JSON.stringify(payload);
    const encoded = Buffer.from(jsonString, "utf-8").toString("base64");
    const printUrl = `${baseUrl}/print/${templateId}?data=${encodeURIComponent(encoded)}`;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage();

    // Inject data object directly into page window.__PRINT_DATA__ (bypasses URL length limits)
    await page.evaluateOnNewDocument((data) => {
      window.__PRINT_DATA__ = data;
      const style = document.createElement("style");
      style.innerHTML = "* { animation: none !important; transition: none !important; }";
      document.head.appendChild(style);
    }, payload);

    // Set initial viewport matching page dimensions
    await page.setViewport({
      width: pageWidth,
      height: pageHeight,
      deviceScaleFactor: 2,
    });

    await page.goto(printUrl, { waitUntil: "networkidle0" });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
    await page.waitForSelector('[data-ready="true"]', { timeout: 15000 });

    // Count actual page card elements rendered in the DOM
    const pageCount = await page.evaluate(() => {
      const wrapper = document.querySelector(".quotation-document-wrapper");
      if (wrapper && wrapper.children.length > 0) return wrapper.children.length;
      const printPages = document.querySelectorAll(".print-page");
      if (printPages && printPages.length > 0) return printPages.length;
      const readyPages = document.querySelectorAll("[data-ready='true']");
      if (readyPages && readyPages.length > 0) return readyPages.length;
      return 1;
    });

    // Resize viewport to exactly fit all pages
    await page.setViewport({
      width: pageWidth,
      height: Math.max(pageHeight, pageCount * pageHeight),
      deviceScaleFactor: 2,
    });

    // Small wait for any reflow after resize
    await new Promise((r) => setTimeout(r, 300));

    // 🛡️ CRITICAL RULE: Pure isolation between format: "A4" and custom width/height
    let pdfBuffer;
    if (isSlide) {
      pdfBuffer = await page.pdf({
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
        displayHeaderFooter: false,
      });
    } else {
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
        displayHeaderFooter: false,
      });
    }

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
