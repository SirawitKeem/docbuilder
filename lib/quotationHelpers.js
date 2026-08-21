let counter = 0;

export function genId(prefix) {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function createEmptyLineItem() {
  return {
    id: genId("item"),
    title: "",
    qty: 1,
    unitPrice: 0,
    groups: [
      {
        id: genId("group"),
        heading: "",
        bullets: [{ id: genId("bullet"), text: "", subBullets: [] }],
      },
    ],
  };
}

export function createEmptyGroup() {
  return {
    id: genId("group"),
    heading: "",
    bullets: [{ id: genId("bullet"), text: "", subBullets: [] }],
  };
}

export function createEmptyBullet() {
  return { id: genId("bullet"), text: "", subBullets: [] };
}

export function createEmptySubBullet() {
  return { id: genId("sub"), text: "" };
}

export function estimateGroupHeight(group) {
  let h = group.heading ? 24 : 0;
  (group.bullets || []).forEach((b) => {
    h += 20;
    if (b.subBullets && b.subBullets.length > 0) {
      h += b.subBullets.length * 18;
    }
  });
  return Math.max(h, 20);
}

export function estimateLineItemHeight(item) {
  let h = 36;
  (item.groups || []).forEach((g) => {
    h += estimateGroupHeight(g);
  });
  return h;
}

/**
 * Paginate quotation content dynamically based on content height.
 * Automatically splits onto 1, 2, 3, or N pages with ZERO overlap.
 */
export function paginateQuotationBlocks(lineItems = []) {
  if (!lineItems || lineItems.length === 0) {
    return [{ blocks: [], hasSummary: true }];
  }

  // Realistic capacity budgets for clean A4 card layout (1123px card)
  const PAGE1_MAX_HEIGHT = 440; // Page 1 has Logo, Bill To, Quotation Details & Table Header
  const PAGEN_MAX_HEIGHT = 580; // Page 2+ compact header capacity
  const SUMMARY_BLOCK_HEIGHT = 240; // Remarks + Note + Price Summary + Sign-off

  // Flatten line items into flow blocks
  const blocks = [];
  lineItems.forEach((item, itemIdx) => {
    blocks.push({
      type: "item-header",
      id: `header-${item.id || itemIdx}`,
      item,
      height: 36,
    });

    if (item.groups && item.groups.length > 0) {
      item.groups.forEach((group, groupIdx) => {
        blocks.push({
          type: "group-block",
          id: `group-${group.id || groupIdx}`,
          item,
          group,
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
      pages.push({ blocks: currentBlocks, hasSummary: false });
      currentBlocks = [block];
      currentHeight = block.height;
      isFirstPage = false;
    } else {
      currentBlocks.push(block);
      currentHeight += block.height;
    }
  });

  if (currentBlocks.length > 0) {
    pages.push({ blocks: currentBlocks, hasSummary: false });
  }

  // Check if the last page has enough room for the Summary block
  const lastPageIndex = pages.length - 1;
  const lastPage = pages[lastPageIndex];
  let lastPageItemsHeight = 0;
  lastPage.blocks.forEach((b) => {
    lastPageItemsHeight += b.height;
  });

  const lastPageMaxCapacity = (lastPageIndex === 0 ? PAGE1_MAX_HEIGHT : PAGEN_MAX_HEIGHT);
  if (lastPageItemsHeight + SUMMARY_BLOCK_HEIGHT <= lastPageMaxCapacity) {
    lastPage.hasSummary = true;
  } else if (pages.length === 1 && lastPage.blocks.length > 1) {
    const midIndex = Math.ceil(lastPage.blocks.length / 2);
    const firstHalf = lastPage.blocks.slice(0, midIndex);
    const secondHalf = lastPage.blocks.slice(midIndex);
    pages[0] = { blocks: firstHalf, hasSummary: false };
    pages.push({ blocks: secondHalf, hasSummary: true });
  } else {
    pages.push({ blocks: [], hasSummary: true });
  }

  return pages;
}

export function paginateQuotationLineItems(lineItems = []) {
  return paginateQuotationBlocks(lineItems);
}
