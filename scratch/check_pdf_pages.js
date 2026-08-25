const puppeteer = require("puppeteer");
const path = require("path");

async function checkPdf() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const absolutePath = path.resolve("scratch/test_output.pdf");
  console.log("Loading PDF from:", absolutePath);
  
  // Navigate to PDF file
  await page.goto(`file:///${absolutePath.replace(/\\/g, "/")}`);
  
  // Inspect PDF rendering in PDF viewer
  const pdfInfo = await page.evaluate(() => {
    return {
      title: document.title,
      bodyText: document.body ? document.body.innerText : "",
    };
  });
  
  console.log("PDF Viewer Info:", pdfInfo);
  await browser.close();
}

checkPdf().catch(console.error);
