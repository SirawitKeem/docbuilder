const puppeteer = require("puppeteer");
const fs = require("fs");

const defaultLineItems = [
  {
    id: "item-1",
    title: "<u>CDNetworks Annual Services</u>",
    qty: "",
    unitPrice: "",
    groups: [
      {
        id: "group-1-1",
        heading: "<u>Application Shield Services</u>",
        qty: 1,
        unitPrice: 204000,
        bullets: [
          { id: "b1-1", text: "Protected Top-Level-Domain up to 5, and Unlimited Sub-Domain", subBullets: [] },
          { id: "b1-2", text: "Dynamic Web Acceleration Platform Fee/month", subBullets: [] },
          { id: "b1-3", text: "Application Shield Platform Fee/month", subBullets: [] },
          { id: "b1-4", text: "Commit traffic up to 500Gbps/month", subBullets: [] },
          {
            id: "b1-5",
            text: "Cloud Security 2.0 Fee/month",
            subBullets: [
              { id: "sb1-1", text: "Web Application Firewall (WAF)" },
              { id: "sb1-2", text: "DDoS Protection" },
              { id: "sb1-3", text: "BOT Management" },
            ],
          },
          { id: "b1-6", text: "Contract Term: One (1) Year", subBullets: [] },
        ],
      },
    ],
  },
  {
    id: "item-2",
    title: "<u>Application Shield Including Services</u>",
    qty: "",
    unitPrice: "",
    groups: [
      {
        id: "group-2-1",
        heading: "Onboarding Assistance & Advanced Customer Support",
        bullets: [
          { id: "b2-1", text: "New domain onboarding assistance", subBullets: [] },
          { id: "b2-2", text: "Security configuration assistance and customization", subBullets: [] },
          { id: "b2-3", text: "Security policies analysis", subBullets: [] },
          { id: "b2-4", text: "24/7/365 email/Group Chat and phone hotline support", subBullets: [] },
          { id: "b2-5", text: "Advanced 100% SLA Guarantee", subBullets: [] },
        ],
      },
      {
        id: "group-2-2",
        heading: "Web Application Firewall (WAF)",
        bullets: [
          { id: "b3-1", text: "Advanced Access Control", subBullets: [] },
          { id: "b3-2", text: "Advanced Rate Limiting", subBullets: [] },
          { id: "b3-3", text: "IP Repeated Violations", subBullets: [] },
          { id: "b3-4", text: "HTTP Protocol Validation", subBullets: [] },
          { id: "b3-5", text: "Built-In WAF Rules", subBullets: [] },
          { id: "b3-6", text: "OWASP Core Rulesets", subBullets: [] },
          { id: "b3-7", text: "Zero Day Protection", subBullets: [] },
          { id: "b3-8", text: "Flexible Response Actions", subBullets: [] },
          { id: "b3-9", text: "Rule tempate Management", subBullets: [] },
          { id: "b3-10", text: "Log & Incident investigation tools_Baisc", subBullets: [] },
          { id: "b3-11", text: "Custom Block Page", subBullets: [] },
          { id: "b3-12", text: "WAF Dashboard", subBullets: [] },
        ],
      },
      {
        id: "group-2-3",
        heading: "DDoS Protection",
        bullets: [
          { id: "b4-1", text: "Advance Access Control", subBullets: [] },
          { id: "b4-2", text: "Advance Rate Limiting", subBullets: [] },
          { id: "b4-3", text: "L3/L4 DDoS Mitigation", subBullets: [] },
          { id: "b4-4", text: "L7 DDoS Dashboard", subBullets: [] },
          { id: "b4-5", text: "Present Protection Policies", subBullets: [] },
          { id: "b4-6", text: "Log & Incident Investigation Tools Basic", subBullets: [] },
          { id: "b4-7", text: "Deploy History", subBullets: [] },
        ],
      },
      {
        id: "group-2-4",
        heading: "BOT Management",
        bullets: [
          { id: "b5-1", text: "Transparent Challenges", subBullets: [] },
          { id: "b5-2", text: "Human Behavior Detection", subBullets: [] },
          { id: "b5-3", text: "Customized Actions", subBullets: [] },
          { id: "b5-4", text: "Advanced Rate Limiting", subBullets: [] },
          { id: "b5-5", text: "Visual Dashboard", subBullets: [] },
        ],
      },
      {
        id: "group-2-5",
        heading: "General Features",
        bullets: [
          { id: "b6-1", text: "Multiple Protocol support [HTTP/HTTPS/Websocket/HTTP2]", subBullets: [] },
          { id: "b6-2", text: "Email Notification of Attack Event", subBullets: [] },
          { id: "b6-3", text: "Security Analysis and Basic Report", subBullets: [] },
        ],
      },
    ],
  },
  {
    id: "item-3",
    title: "<u>Managed Service</u>",
    qty: "",
    unitPrice: "",
    groups: [
      {
        id: "group-3-1",
        heading: "",
        bullets: [
          { id: "b7-1", text: "Service Level Agreement (SLA) 24x7x4", subBullets: [] },
          { id: "b7-2", text: "Level 2 Support", subBullets: [] },
          { id: "b7-3", text: "Unlimited Phone, email support", subBullets: [] },
          { id: "b7-4", text: "Implementation Service", subBullets: [] },
          { id: "b7-5", text: "Monthly Report", subBullets: [] },
        ],
      },
    ],
  },
];

const payload = {
  quotationNo: "CZ2608063",
  quotationDate: "25 Aug 2026",
  priceValidity: "24 Sept 2026",
  deliveryTerm: "7 days",
  creditTerm: "30 days",
  billTo: {
    companyName: "CS LoxInfo Public Company Limited.",
    attn: "Sarun Phongpodchanan",
    endUser: "P.R. Foodland Co., Ltd.",
    subject: "CDNetworks Annual Services (WAF+DDoS+BOT)",
    am: "Narin Rattanavijai / Channel Manager",
  },
  lineItems: defaultLineItems,
  vatRate: 7,
  remarks: "Payment: Annually",
  senderName: "Narin Rattanavajij (PoP)",
  senderPhone: "+6682-44-686-95",
};

async function debugPdf() {
  const jsonString = JSON.stringify(payload);
  const encoded = Buffer.from(jsonString, "utf-8").toString("base64");
  const printUrl = `http://localhost:3000/print/quotation?data=${encodeURIComponent(encoded)}`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1122, deviceScaleFactor: 2 });

  await page.goto(printUrl, { waitUntil: "networkidle0" });
  await page.waitForSelector('.print-page[data-ready="true"]', { timeout: 15000 });

  // Take a full page screenshot of the print route
  await page.screenshot({ path: "scratch/full_print_page.png", fullPage: true });

  // Generate PDF without preferCSSPageSize vs with preferCSSPageSize
  const pdfBuffer1 = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
  });
  fs.writeFileSync("scratch/pdf_no_prefer.pdf", pdfBuffer1);

  const pdfBuffer2 = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
  });
  fs.writeFileSync("scratch/pdf_prefer.pdf", pdfBuffer2);

  await browser.close();

  console.log("Full print page screenshot saved to scratch/full_print_page.png");
  console.log("PDF no_prefer size:", pdfBuffer1.length);
  console.log("PDF prefer size:", pdfBuffer2.length);
}

debugPdf().catch(console.error);
