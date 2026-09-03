"use client";

import * as fabric from "fabric";

export const A4_TABLE_WIDTH = 682;
export const HEADER_HEIGHT = 32;
export const ROW_HEIGHT = 28;
export const SUMMARY_HEIGHT = 84;

export const CUSTOM_CANVAS_PROPS = [
  "id",
  "name",
  "isDocTable",
  "docTableData",
  "rawItems",
  "isPageFooterNumber",
  "isTokenField",
  "tokenKey",
  "rawTemplateText",
  "tokenDefaultValue",
  "lockMovementX",
  "lockMovementY",
  "lockRotation",
  "lockScalingX",
  "lockScalingY",
  "hasControls",
  "selectable",
  "opacity",
  "visible",
];

/**
 * Builds the array of Fabric objects for DocTable
 */
export function buildDocTableElements(data) {
  const {
    width = A4_TABLE_WIDTH,
    themeColor = "#2563EB",
    vatRate = 7,
    items = [
      { no: "1", desc: "บริการพัฒนาระบบคลาวด์และโครงสร้างพื้นฐานดิจิทัล", qty: 1, price: 150000 },
      { no: "2", desc: "แพ็กเกจความปลอดภัยทางไซเบอร์ WAF & Anti-DDoS 24/7", qty: 1, price: 54000 },
      { no: "3", desc: "บริการฝึกอบรมและสนับสนุนทางเทคนิครายปี (Support SLA)", qty: 1, price: 20000 },
    ],
  } = data;

  const elements = [];

  // Column definitions (sums to 682px)
  const cols = [
    { title: "ลำดับ", width: 52, align: "center" },
    { title: "รายการสินค้า / รายละเอียด (Description)", width: 330, align: "left" },
    { title: "จำนวน", width: 60, align: "center" },
    { title: "ราคา/หน่วย (บาท)", width: 120, align: "right" },
    { title: "จำนวนเงิน (บาท)", width: 120, align: "right" },
  ];

  // 1. Header Background
  const headerBg = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height: HEADER_HEIGHT,
    fill: themeColor,
    rx: 4,
    ry: 4,
  });
  elements.push(headerBg);

  // Header Titles
  let currX = 0;
  cols.forEach((col) => {
    const headerText = new fabric.Textbox(col.title, {
      left: currX + (col.align === "left" ? 10 : 0),
      top: 8,
      width: col.width - (col.align === "left" ? 10 : 0),
      fontSize: 11,
      fontWeight: "bold",
      fill: "#FFFFFF",
      fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
      textAlign: col.align,
    });
    elements.push(headerText);
    currX += col.width;
  });

  // 2. Data Rows
  let subtotal = 0;
  items.forEach((item, i) => {
    const rowY = HEADER_HEIGHT + i * ROW_HEIGHT;
    const itemAmount = (Number(item.qty) || 1) * (Number(item.price) || 0);
    subtotal += itemAmount;

    // Row Background (Zebra stripe)
    const rowBg = new fabric.Rect({
      left: 0,
      top: rowY,
      width,
      height: ROW_HEIGHT,
      fill: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
      stroke: "#E2E8F0",
      strokeWidth: 0.8,
    });
    elements.push(rowBg);

    // Row Cells
    let cellX = 0;
    const priceFormatted = Number(item.price || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amountFormatted = itemAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const cellValues = [`${item.no || i + 1}`, item.desc || "รายการ...", `${item.qty || 1}`, priceFormatted, amountFormatted];

    cols.forEach((col, cIdx) => {
      const cellText = new fabric.Textbox(cellValues[cIdx], {
        left: cellX + (col.align === "left" ? 10 : 0),
        top: rowY + 7,
        width: col.width - (col.align === "left" ? 10 : 0),
        fontSize: 11,
        fill: "#1E293B",
        fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
        textAlign: col.align,
      });
      elements.push(cellText);
      cellX += col.width;
    });
  });

  // 3. Summary Block
  const totalY = HEADER_HEIGHT + items.length * ROW_HEIGHT;
  const vatAmount = subtotal * (vatRate / 100);
  const grandTotal = subtotal + vatAmount;

  const summaryBg = new fabric.Rect({
    left: 0,
    top: totalY,
    width,
    height: SUMMARY_HEIGHT,
    fill: "#F1F5F9",
    stroke: "#CBD5E1",
    strokeWidth: 1,
    rx: 4,
    ry: 4,
  });
  elements.push(summaryBg);

  const summaryLabels = [
    { label: "รวมเป็นเงิน (Subtotal):", value: `${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} บาท`, y: totalY + 8, bold: false },
    { label: `ภาษีมูลค่าเพิ่ม (VAT ${vatRate}%):`, value: `${vatAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} บาท`, y: totalY + 32, bold: false },
    { label: "จำนวนเงินรวมทั้งสิ้น (Grand Total):", value: `${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} บาท`, y: totalY + 56, bold: true, color: "#1E40AF" },
  ];

  summaryLabels.forEach((s) => {
    const lbl = new fabric.Textbox(s.label, {
      left: width - 360,
      top: s.y,
      width: 200,
      fontSize: 11.5,
      fontWeight: s.bold ? "bold" : "normal",
      fill: s.color || "#334155",
      fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
      textAlign: "right",
    });
    const val = new fabric.Textbox(s.value, {
      left: width - 150,
      top: s.y,
      width: 140,
      fontSize: 11.5,
      fontWeight: s.bold ? "bold" : "normal",
      fill: s.color || "#0F172A",
      fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
      textAlign: "right",
    });
    elements.push(lbl, val);
  });

  return elements;
}

/**
 * Custom Fabric Class: DocTable
 * Supports dynamic row insertion/removal, VAT adjustments, and clean JSON serialization.
 */
export class DocTable extends fabric.Group {
  static type = "DocTable";

  constructor(data = {}, options = {}) {
    const tableData = {
      width: A4_TABLE_WIDTH,
      themeColor: data.themeColor || "#2563EB",
      vatRate: data.vatRate !== undefined ? data.vatRate : 7,
      items: data.items && data.items.length > 0 ? data.items : [
        { no: "1", desc: "บริการพัฒนาระบบคลาวด์และโครงสร้างพื้นฐานดิจิทัล", qty: 1, price: 150000 },
        { no: "2", desc: "แพ็กเกจความปลอดภัยทางไซเบอร์ WAF & Anti-DDoS 24/7", qty: 1, price: 54000 },
        { no: "3", desc: "บริการฝึกอบรมและสนับสนุนทางเทคนิครายปี (Support SLA)", qty: 1, price: 20000 },
      ],
    };

    const elements = buildDocTableElements(tableData);

    super(elements, {
      left: options.left !== undefined ? options.left : 56,
      top: options.top !== undefined ? options.top : 320,
      subTargetCheck: true,
      ...options,
    });

    this.isDocTable = true;
    this.docTableData = tableData;
  }

  // ➕ Add Row Dynamically
  addRow(item = null) {
    const currentItems = [...this.docTableData.items];
    const newNo = `${currentItems.length + 1}`;
    const newItem = item || {
      no: newNo,
      desc: `รายการสินค้าลำดับที่ ${newNo}`,
      qty: 1,
      price: 10000,
    };
    currentItems.push(newItem);
    this.updateTableData({ items: currentItems });
  }

  // ➖ Remove Row Dynamically (Keeps at least 1 row)
  removeRow() {
    if (this.docTableData.items.length <= 1) return;
    const currentItems = this.docTableData.items.slice(0, -1);
    this.updateTableData({ items: currentItems });
  }

  // 🎨 Set Theme Color
  setThemeColor(color) {
    this.updateTableData({ themeColor: color });
  }

  // 🏷️ Set VAT Rate
  setVatRate(rate) {
    this.updateTableData({ vatRate: Number(rate) });
  }

  // 🔄 Rebuild table elements with preserved group position
  updateTableData(partialData) {
    this.docTableData = {
      ...this.docTableData,
      ...partialData,
    };

    // Remove all old elements
    const oldObjects = [...this.getObjects()];
    oldObjects.forEach((obj) => this.remove(obj));

    // Build and add new elements
    const newElements = buildDocTableElements(this.docTableData);
    newElements.forEach((el) => this.add(el));

    if (this.canvas) {
      this.setCoords();
      this.canvas.requestRenderAll();
      if (this.canvas.fire) {
        this.canvas.fire("object:modified", { target: this });
      }
    }
  }

  toObject(propertiesToInclude = []) {
    return super.toObject([
      "isDocTable",
      "docTableData",
      "lockMovementX",
      "lockMovementY",
      "lockRotation",
      "lockScalingX",
      "lockScalingY",
      "hasControls",
      "selectable",
      "opacity",
      "visible",
      ...propertiesToInclude,
    ]);
  }

  static async fromObject(object) {
    const data = object.docTableData || {
      themeColor: "#2563EB",
      vatRate: 7,
      items: [],
    };
    const instance = new DocTable(data, {
      left: object.left,
      top: object.top,
      scaleX: object.scaleX,
      scaleY: object.scaleY,
      angle: object.angle,
      opacity: object.opacity !== undefined ? object.opacity : 1,
      visible: object.visible !== false,
      lockMovementX: Boolean(object.lockMovementX),
      lockMovementY: Boolean(object.lockMovementY),
      lockRotation: Boolean(object.lockRotation),
      lockScalingX: Boolean(object.lockScalingX),
      lockScalingY: Boolean(object.lockScalingY),
      hasControls: object.hasControls !== undefined ? object.hasControls : !object.lockMovementX,
      selectable: object.selectable !== undefined ? object.selectable : true,
    });
    return instance;
  }
}

// Register class with Fabric registry for serialization/deserialization safety
if (fabric.classRegistry) {
  fabric.classRegistry.setClass(DocTable, "DocTable");
  fabric.classRegistry.setClass(DocTable, "docTable");
}

export function createDocTable(options = {}) {
  return new DocTable(options, options);
}