const puppeteer = require("puppeteer");
const path = require("path");

async function checkPdfFile(pdfName) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const absPath = path.resolve(`scratch/${pdfName}`);
  console.log(`Checking ${pdfName}... Path: file:///${absPath.replace(/\\/g, "/")}`);
  
  // Create a minimal HTML container with embed or iframe to render PDF pages in Puppeteer
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: #525659; }
          iframe { width: 100vw; height: 100vh; border: none; }
        </style>
      </head>
      <body>
        <iframe src="file:///${absPath.replace(/\\/g, "/")}#toolbar=0"></iframe>
      </body>
    </html>
  `);
  
  await page.setViewport({ width: 1200, height: 1600 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 2000)));
  
  await page.screenshot({ path: `scratch/${pdfName}_preview.png` });
  console.log(`Saved preview to scratch/${pdfName}_preview.png`);
  
  await browser.close();
}

async function run() {
  await checkPdfFile("pdf_prefer.pdf");
  await checkPdfFile("pdf_no_prefer.pdf");
}

run().catch(console.error);
