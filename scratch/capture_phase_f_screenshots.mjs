import puppeteer from "puppeteer";
import path from "path";

const ARTIFACT_DIR = "C:\\Users\\Keem\\.gemini\\antigravity\\brain\\3f255250-aae7-459e-82db-b987663452a8";

async function captureScreenshots() {
  console.log("📸 Starting UI Screenshot Capture for Phase F...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  try {
    // 1. Capture Rendered Document Print Page (A4 with Chonburi & Kanit)
    const printPage = await browser.newPage();
    await printPage.setViewport({ width: 850, height: 1200, deviceScaleFactor: 2 });
    await printPage.goto("http://localhost:3000/print/tmpl-phase-f-document-fonts", {
      waitUntil: "networkidle0",
    });
    await printPage.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
    await printPage.waitForSelector('[data-ready="true"]', { timeout: 15000 });

    const docRenderPath = path.join(ARTIFACT_DIR, "phase_f_document_render.png");
    await printPage.screenshot({ path: docRenderPath, fullPage: true });
    console.log(`✅ Captured Document Render: ${docRenderPath}`);
    await printPage.close();

    // 2. Open Editor with Slide Template and Open Font Picker Modal
    const editorPage = await browser.newPage();
    await editorPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await editorPage.goto("http://localhost:3000/templates/new?edit=tmpl-phase-f-slide-fonts", {
      waitUntil: "networkidle0",
    });

    // Wait for canvas to load
    await editorPage.waitForSelector("canvas", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Click on a text object on the canvas to select it and activate RightSidebar text properties
    const canvasBox = await editorPage.$eval("canvas", (el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    // Click near the title position on the canvas
    await editorPage.mouse.click(canvasBox.x + 300, canvasBox.y + 150);
    await new Promise((r) => setTimeout(r, 1000));

    // Capture the Editor with font dropdown / properties in view
    const editorWithFontDropdownPath = path.join(ARTIFACT_DIR, "phase_f_editor_with_fonts.png");
    await editorPage.screenshot({ path: editorWithFontDropdownPath });
    console.log(`✅ Captured Editor with Font Properties: ${editorWithFontDropdownPath}`);

    // Click the "+ เพิ่มฟอนต์" button or dropdown option to open GoogleFontPickerModal
    const addFontBtn = await editorPage.$('button[title="ค้นหาฟอนต์จาก Google Fonts"]');
    if (addFontBtn) {
      await addFontBtn.click();
      await new Promise((r) => setTimeout(r, 1500));

      const modalPath = path.join(ARTIFACT_DIR, "phase_f_font_picker_modal.png");
      await editorPage.screenshot({ path: modalPath });
      console.log(`✅ Captured Google Font Picker Modal: ${modalPath}`);
    } else {
      console.warn("Could not find '+ เพิ่มฟอนต์' button in RightSidebar");
    }

    await editorPage.close();
    console.log("🎉 All UI screenshots captured successfully!");
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch((err) => {
  console.error("Screenshot capture error:", err);
  process.exit(1);
});
