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

function estimateGroupHeight(group) {
  let h = group.heading ? 22 : 0;
  (group.bullets || []).forEach((b) => {
    const textLen = (b.text || "").length;
    const lines = Math.max(1, Math.ceil(textLen / 52));
    h += lines * 18 + 4;
    if (b.subBullets && b.subBullets.length > 0) {
      b.subBullets.forEach((sb) => {
        const sbLen = (sb.text || "").length;
        const sbLines = Math.max(1, Math.ceil(sbLen / 48));
        h += sbLines * 16 + 2;
      });
    }
  });
  return Math.max(h, 20);
}

function paginateQuotationBlocks(lineItems = []) {
  if (!lineItems || lineItems.length === 0) {
    return [{ blocks: [], hasSummary: true }];
  }

  const PAGE1_MAX_HEIGHT = 520;
  const PAGEN_MAX_HEIGHT = 760;
  const SUMMARY_BLOCK_HEIGHT = 220;

  const blocks = [];
  lineItems.forEach((item, itemIdx) => {
    blocks.push({
      type: "item-header",
      id: `header-${item.id || itemIdx}`,
      title: item.title,
      height: item.title ? 28 : 0,
    });

    if (item.groups && item.groups.length > 0) {
      item.groups.forEach((group, groupIdx) => {
        blocks.push({
          type: "group-block",
          id: `group-${group.id || groupIdx}`,
          heading: group.heading,
          height: estimateGroupHeight(group),
        });
      });
    }
  });

  const pages = [];
  let currentBlocks = [];
  let currentHeight = 0;
  let isFirstPage = true;

  blocks.forEach((block) => {
    const maxCapacity = isFirstPage ? PAGE1_MAX_HEIGHT : PAGEN_MAX_HEIGHT;

    if (currentHeight + block.height > maxCapacity && currentBlocks.length > 0) {
      pages.push({ blocks: currentBlocks, hasSummary: false, height: currentHeight });
      currentBlocks = [block];
      currentHeight = block.height;
      isFirstPage = false;
    } else {
      currentBlocks.push(block);
      currentHeight += block.height;
    }
  });

  if (currentBlocks.length > 0) {
    pages.push({ blocks: currentBlocks, hasSummary: false, height: currentHeight });
  }

  const lastPageIndex = pages.length - 1;
  const lastPage = pages[lastPageIndex];
  let lastPageItemsHeight = 0;
  lastPage.blocks.forEach((b) => {
    lastPageItemsHeight += b.height;
  });

  const lastPageMaxCapacity = lastPageIndex === 0 ? PAGE1_MAX_HEIGHT : PAGEN_MAX_HEIGHT;
  if (lastPageItemsHeight + SUMMARY_BLOCK_HEIGHT <= lastPageMaxCapacity) {
    lastPage.hasSummary = true;
  } else {
    pages.push({ blocks: [], hasSummary: true });
  }

  return pages;
}

const result = paginateQuotationBlocks(defaultLineItems);
console.log("Total Pages:", result.length);
result.forEach((p, idx) => {
  console.log(`\n--- Page ${idx + 1} (hasSummary: ${p.hasSummary}, height: ${p.height}) ---`);
  p.blocks.forEach((b) => console.log(`  [${b.type}] ${b.title || b.heading || "(no title)"} (height: ${b.height})`));
});
