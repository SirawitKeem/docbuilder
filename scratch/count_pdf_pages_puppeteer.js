const puppeteer = require("puppeteer");
const path = require("path");

async function check() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const absPath = path.resolve("scratch/test_output.pdf");
  const fileUrl = `file:///${absPath.replace(/\\/g, "/")}`;
  
  console.log("Opening PDF:", fileUrl);
  await page.goto(fileUrl, { waitUntil: "networkidle0" });
  
  const result = await page.evaluate(() => {
    return {
      title: document.title,
      content: document.body ? document.body.innerText : "",
    };
  });
  
  console.log("PDF Info:", result);
  await browser.close();
}

check().catch(console.error);
