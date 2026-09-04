import puppeteer from "puppeteer";
import path from "path";

const ARTIFACT_DIR = "C:\\Users\\Keem\\.gemini\\antigravity\\brain\\3f255250-aae7-459e-82db-b987663452a8";

async function captureModal() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto("http://localhost:3000/templates/new?edit=tmpl-phase-f-slide-fonts", {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector("canvas", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Select the text object on the Fabric canvas via canvas click
    // In Slide preset (1280x720), the center of the big title is around x: 400, y: 200 on canvas
    const canvasElem = await page.$("canvas.upper-canvas");
    if (canvasElem) {
      const box = await canvasElem.boundingBox();
      // Click near the title
      await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.28);
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Check if right sidebar shows Font Family
    let addFontBtn = await page.$('button[title="ค้นหาฟอนต์จาก Google Fonts"]');
    if (!addFontBtn) {
      // Try clicking another spot or using layers panel
      console.log("Searching in layer panel or canvas...");
      // Click 'เลเยอร์ (Layers)' tab if available
      const layersTab = await page.$('button:has-text("เลเยอร์")') || (await page.$$("button"))[0];
    }

    // Take screenshot of editor with text selected
    const editorSnap = path.join(ARTIFACT_DIR, "phase_f_editor_selected.png");
    await page.screenshot({ path: editorSnap });
    console.log(`Saved editor screenshot: ${editorSnap}`);

    // If addFontBtn is found, click it!
    addFontBtn = await page.$('button[title="ค้นหาฟอนต์จาก Google Fonts"]');
    if (addFontBtn) {
      await addFontBtn.click();
      await new Promise((r) => setTimeout(r, 1200));

      const modalSnap = path.join(ARTIFACT_DIR, "phase_f_font_picker_modal.png");
      await page.screenshot({ path: modalSnap });
      console.log(`✅ Saved Google Font Picker Modal: ${modalSnap}`);
    } else {
      console.log("Button not visible yet, clicking on Layers item...");
      // Click on Layers tab
      const buttons = await page.$$("button");
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent, btn);
        if (text && text.includes("เลเยอร์")) {
          await btn.click();
          await new Promise((r) => setTimeout(r, 500));
          break;
        }
      }
      // Click on first layer
      const layerItems = await page.$$(".cursor-pointer");
      if (layerItems.length > 0) {
        await layerItems[0].click();
        await new Promise((r) => setTimeout(r, 500));
      }
      // Switch back to properties
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent, btn);
        if (text && text.includes("คุณสมบัติ")) {
          await btn.click();
          await new Promise((r) => setTimeout(r, 500));
          break;
        }
      }
      await new Promise((r) => setTimeout(r, 500));
      const addBtnRetry = await page.$('button[title="ค้นหาฟอนต์จาก Google Fonts"]');
      if (addBtnRetry) {
        await addBtnRetry.click();
        await new Promise((r) => setTimeout(r, 1200));
        const modalSnap = path.join(ARTIFACT_DIR, "phase_f_font_picker_modal.png");
        await page.screenshot({ path: modalSnap });
        console.log(`✅ Saved Google Font Picker Modal (via layers): ${modalSnap}`);
      }
    }
  } finally {
    await browser.close();
  }
}

captureModal().catch(console.error);
