# 📚 DocBuilder (Ally Doc) - Project Context & Architecture Guide

> **จุดประสงค์ของเอกสารนี้**: เอกสารสรุปบริบท สถาปัตยกรรม โครงสร้างโค้ด ดีไซน์ซิสเต็ม และสถานะการพัฒนาของโปรเจกต์ **DocBuilder (Ally Doc)** ครอบคลุมทั้งระบบเดิมและ **A4 Document Studio (Canva-like Engine Phase 1–7)** เพื่อให้นักพัฒนาหรือ AI Agent สามารถทำความเข้าใจและทำงานต่อได้อย่างถูกต้อง แม่นยำ 100%

---

## 1. 🌟 ภาพรวมโปรเจกต์ (Project Overview)

* **ชื่อโปรเจกต์**: `DocBuilder` / `Ally Doc` (AI-Powered Document Automation & Visual Studio)
* **เป้าหมายหลัก**:
  1. **Document Workspaces**: ออกเอกสารสัญญา ใบเสนอราคา ใบเสร็จรับเงิน ประกาศ และแบบฟอร์มองค์กรแบบอัตโนมัติ
  2. **A4 Document Studio (Canva-like Editor)**: เครื่องมือออกแบบและแก้ไขเทมเพลตเอกสารขนาด A4 เสมือนจริง ทำงานด้วย Fabric.js v6 แบบ Native Multi-Page, Dual mm Rulers, Dynamic Pricing Table, Text Tokenization, และ True Vector PDF Export
* **เทคโนโลยีหลัก (Tech Stack)**:
  * **Framework**: Next.js 16+ (App Router, Turbopack)
  * **Frontend Engine**: React 19 (`.jsx`), Fabric.js v6 (HTML5 Canvas & Vector SVG Engine)
  * **PDF & Printing**: Puppeteer Headless (Chromium PDF Generator), SVG Vector Layer, Google Fonts (`Noto Sans Thai`, `Noto Sans Thai Looped`, `Sarabun`)
  * **Styling**: Tailwind CSS v4, PostCSS, Lucide React Icons
  * **3D Animation**: Three.js (WebGL Conic Particles ในหน้า Auth)
  * **Database & Persistence**: JSON-based Database Adapter (`data/db.json`, `lib/db/adapters/json/`)

---

## 2. 🗂️ โครงสร้างโฟลเดอร์หลักของระบบ (Project Architecture)

```
docbuilder/
├── app/
│   ├── (auth)/                          # ระบบยืนยันตัวตน (Login, Register, 2FA, 3D Canvas)
│   ├── (main)/                          # หน้าหลักแอปพลิเคชัน
│   │   ├── page.jsx                     # Dashboard หน้าแรก
│   │   ├── create/                      # หน้ารวมฟอร์มสร้างสัญญา (NDA, Quotation, Distributor, Partner)
│   │   ├── documents/page.jsx           # คลังจัดการเอกสารของฉัน (My Documents)
│   │   ├── profile-data/                # จัดการโปรไฟล์ข้อมูลส่วนกลาง (Shared Profiles)
│   │   ├── templates/                   # แคตตาล็อกเทมเพลต และตัวเปิด Studio Editor
│   │   │   ├── page.jsx                 # หน้ารายการเทมเพลตทั้งหมด
│   │   │   └── new/                     # 🎨 A4 Document Studio (Canva-like Editor)
│   │   │       ├── page.jsx             # Template Builder Shell & API Sync
│   │   │       └── components/editor/   # องค์ประกอบของ A4 Studio Engine
│   │   │           ├── DocumentEditor.jsx       # Main Studio Coordinator & State Manager
│   │   │           ├── CanvasStage.jsx          # Fabric Canvas Stage, mm Rulers & Snapping
│   │   │           ├── TopToolbar.jsx           # Toolbar, Zoom, Preview Mode, Undo/Redo
│   │   │           ├── LeftSidebar.jsx          # Tool Sidebar (Text, Shape, Image, Table, Tokens)
│   │   │           ├── RightSidebar.jsx         # Properties & Layers Panel (Colors, Fonts, Align)
│   │   │           ├── PagePaginationBar.jsx    # Multi-Page Bottom Bar (Add, Dup, Delete, Move)
│   │   │           ├── Ruler.jsx                # SVG Metric (mm) Rulers with Mouse Cursor Tracker
│   │   │           ├── elements/
│   │   │           │   ├── DocTable.js          # Custom DocTable Fabric Group Class
│   │   │           │   ├── HeaderBlock.js       # Company Header & Party Info Grid Builders
│   │   │           │   └── SignatureBlock.js    # Single & Dual Signature Block Builders
│   │   │           └── hooks/
│   │   │               └── useHistory.js        # Scoped Undo/Redo History Stack
│   │   ├── history/page.jsx             # ประวัติการส่งเอกสารและสถานะอีเมล
│   │   └── settings/page.jsx            # ตั้งค่าระบบและโปรไฟล์บริษัท
│   │
│   ├── api/                             # RESTful Backend Endpoints
│   │   ├── templates/                   # CRUD Custom Templates (Multi-Page JSON)
│   │   ├── export-pdf/route.js          # Puppeteer Headless PDF Export Pipeline
│   │   ├── documents/                   # CRUD User Documents
│   │   ├── quotations/                  # จัดการใบเสนอราคา และรันเลขที่เอกสาร
│   │   └── send-email/                  # จัดการส่งเอกสารทางอีเมลผ่าน SMTP
│   │
│   └── print/[templateId]/page.jsx      # หน้า Dedicated Print/Puppeteer Vector Rendering
│
├── components/
│   ├── document/
│   │   ├── FabricPrintRenderer.jsx      # 🖨️ True Vector SVG Multi-Page PDF Renderer
│   │   ├── DocumentHeader.jsx           # หัวกระดาษเอกสารมาตรฐาน
│   │   └── DocumentFooter.jsx           # ท้ายกระดาษและเลขหน้า
│   └── layout/
│       ├── LayoutShell.jsx              # โครงหน้าแดชบอร์ด
│       └── Sidebar.jsx                  # Sidebar เมนูซ้ายพร้อม Badge NEW
│
├── lib/
│   ├── tokens/
│   │   └── tokenEngine.js               # 🏷️ Text Token Engine, Replacement & Safe JSON Reversion
│   ├── db/
│   │   └── adapters/json/index.js       # Database Adapter & Seed Data (data/db.json)
│   └── templates/registry.js            # ทะเบียน Schema ของเทมเพลตมาตรฐาน
│
└── data/
    └── db.json                          # JSON Persistence Store (Custom Templates & Documents)
```

---

## 3. 🎨 A4 Document Studio Engine (Canva-like Editor: Phase 1 – 7)

### 📐 Phase 1: Native A4 Canvas & Metric SVG Rulers
* **A4 Dimensions**: กว้าง `794px` × สูง `1,123px` (อัตราส่วน 1:1.414 เสมือนกระดาษ A4 จริง ที่ 96 DPI)
* **Printable Margin**: ขอบกระดาษพิมพ์ `56px` (~15mm) แสดงเส้นประสีชมพูพร้อมป้ายระบุ
* **Native Zooming**: ใช้ `canvas.setZoom(zoom)` และ `canvas.setDimensions(...)` โดยตรง ไม่ใช้ CSS Scale Transform ทำให้ตัวอักษรและเวกเตอร์คมชัดทุกระดับซูม
* **Metric Dual Rulers (`Ruler.jsx`)**: ไม้บรรทัดมิลลิเมตร (mm) ด้านบนและซ้าย คำนวณขีดมิลลิเมตรด้วย `useMemo` อัตโนมัติ พร้อมเส้นขีดสีแดงติดตามตำแหน่งเมาส์แบบเรียลไทม์

---

### 🧰 Phase 2: Toolbar + History Pipeline
* **Top Toolbar (`TopToolbar.jsx`)**: ปุ่มควบคุมชื่อเทมเพลต, Zoom In/Out/Reset, สลับแสดง/ซ่อนไม้บรรทัดและเส้นมาร์จิน, Undo/Redo, ปุ่มพรีวิวข้อมูลจริง, และปุ่มบันทึก
* **Scoped Undo/Redo (`useHistory.js`)**:
  * บันทึกสถานะ Canvas Snapshot ด้วย `canvas.toJSON(CUSTOM_CANVAS_PROPS)`
  * ป้องกัน Race Condition ขณะ Restore ด้วย Flag `isExecutingRef`
  * ดักจับคีย์ลัดระดับสากล: `Ctrl+Z` (Undo), `Ctrl+Y` / `Ctrl+Shift+Z` (Redo), และ `Delete` / `Backspace` (ลบวัตถุที่เลือก)
  * **Editing Safety**: ไม่ทำงานเมื่อเคอร์เซอร์กำลังพิมพ์ข้อความอยู่ใน Textbox (`activeObj.isEditing`)

---

### 🎨 Phase 3: Properties & Layers Panel
* **Right Sidebar (`RightSidebar.jsx`)**:
  * **Typography Control**: ฟอนต์ (`Noto Sans Thai`, `Sarabun`), ขนาดตัวอักษร, ตัวหนา, ตัวเอียง, ขีดเส้นใต้, จัดชิดซ้าย/กึ่งกลาง/ขวา, ระยะห่างบรรทัด (Line Height)
  * **Fill & Stroke Styling**: เลือกสีพื้นหลัง, สีเส้นขอบ, ความหนาเส้นขอบ, ความโค้งมนขอบ (`rx/ry`), และความโปร่งใส (Opacity)
  * **Alignment Grid**: ปุ่มจัดกึ่งกลางหน้ากระดาษ A4 (กึ่งกลางแนวนอน, กึ่งกลางแนวตั้ง, ชิดขอบมาร์จิน 15mm) คำนวณแบบ Zoom-Independent จากค่าคงที่ `A4_WIDTH / A4_HEIGHT`
  * **Layer Stacking**: ส่งวัตถุไปหน้าสุด (`bringToFront`), ถอยหลัง 1 ชั้น (`sendBackwards`), เดินหน้า 1 ชั้น (`bringForward`), และส่งไปหลังสุด (`sendToBack`)
  * **Lock & Visibility**: ล็อกตำแหน่ง (`lockMovementX`, `lockMovementY`, `hasControls: false`) และเปิด/ปิดการแสดงผล (`visible`)

---

### 📊 Phase 4: Document Blocks & Custom `DocTable` Class
* **Custom `DocTable` Class (`elements/DocTable.js`)**:
  * สืบทอดจาก `fabric.Group` พร้อมลงทะเบียนใน Fabric v6 ผ่าน `fabric.classRegistry.setClass(DocTable, "DocTable")`
  * **Dynamic Row Management**: ฟังก์ชัน `addRow(item)` และ `removeRow(index)` คำนวณตำแหน่งแถวและอัปเดตความสูงของตารางอัตโนมัติ
  * **Automatic VAT Calculation**: คำนวณยอด Subtotal, ภาษีมูลค่าเพิ่ม (VAT 7%), และ Grand Total รวมทั้งสิ้นอัตโนมัติจาก `items`
  * **Serialization Architecture**: Override `toObject()` และ `fromObject()` ให้เก็บก้อน `docTableData` ครบถ้วน 100%
* **Pre-built Document Blocks**:
  * `createCompanyHeaderBlock`: หัวกระดาษบริษัทพร้อมโลโก้และข้อมูลนิติบุคคล
  * `createPartyInfoGrid`: ตารางข้อมูลคู่สัญญาและเลขที่เอกสาร
  * `createTermsBox`: กล่องเงื่อนไขและข้อกำหนดสัญญา
  * `createSignatureBlock`: บล็อกลงนามสัญญาแบบเดี่ยวและแบบคู่ (Dual Signatures)

---

### 📑 Phase 5: Multi-Page Support & Pagination
* **Bottom Pagination Bar (`PagePaginationBar.jsx`)**:
  * เพิ่มหน้าเปล่า (`handleAddPage`), สลับหน้า (`handleSelectPage`), ลบหน้า (`handleDeletePage`), และย้ายลำดับหน้า (`handleMovePage`)
  * **Deep Clone Duplication**: คัดลอกหน้าด้วย `JSON.parse(JSON.stringify(sourceJson))` ป้องกัน Memory Reference รั่วไหลระหว่างหน้า
* **Isolated History per Page**: เมื่อสลับหน้า ระบบจะล้าง Stack และบันทึก Snapshot เริ่มต้นของหน้าเป้าหมาย ทำให้การ Undo/Redo ไม่ข้ามหน้า
* **Dynamic Page Numbering (`syncPageNumberOnCanvas`)**: ตัวนับเลขหน้าอัตโนมัติ `"หน้า {X} จาก {Y}"` ที่มุมล่างขวาของทุกหน้ากระดาษ พร้อมระบบ Deduplication ลบเลขหน้าซ้ำซ้อน

---

### 🏷️ Phase 6: Dynamic Token Engine & Database Sync
* **Token Engine (`lib/tokens/tokenEngine.js`)**:
  * รองรับตัวแปรมาตรฐาน `{{company_name}}`, `{{customer_name}}`, `{{customer_company}}`, `{{doc_no}}`, `{{authorized_signatory_name}}` ฯลฯ
  * แถบ **"🏷️ ตัวแปรไดนามิก (Tokens)"** ใน LeftSidebar กดแทรกตัวแปรเข้า Textbox หรือแถวของ `DocTable` ได้ใน 1 คลิก
* **Live Data Preview**: ปุ่มสลับดูตัวอย่างข้อมูลจริงบนหน้าจอ Editor
* **🛡️ Zero-Leakage Architecture (`revertTokensInPageJson`)**:
  * กวาดล้าง Mock Preview Data และบังคับคืนค่า Raw Token `{{...}}` ในทุกหน้าของ `pages` array แบบ Deep Recursive ก่อนบันทึกลงฐานข้อมูล
  * ข้อมูลที่บันทึกลง `data/db.json` จึงคงความเป็นตัวแปรต้นฉบับ 100% ไม่ปนเปื้อนข้อมูลทดสอบ

---

### 🖨️ Phase 7: True Vector PDF Export, Snapping & Polish
* **True Vector SVG PDF Pipeline (`components/document/FabricPrintRenderer.jsx`)**:
  * เรนเดอร์หน้ากระดาษผ่าน `fabricCanvas.toSVG()` ส่งต่อให้ Puppeteer สร้างไฟล์ PDF แบบ **Native Vector Text 100%**
  * **Selectable & Searchable**: ผู้ใช้สามารถใช้เมาส์ลากคลุม คัดลอกตัวอักษร และกด `Ctrl+F` ค้นหาข้อความภาษาไทยในไฟล์ PDF ได้สมบูรณ์
  * **🛡️ Smart Style-Grouping Algorithm (`patchFabricSvgTextForThai`)**:
    * แก้ไขปัญหาตัวอักษรภาษาไทยซ้ำซ้อน (เช่น `บริษัริ ษัท`) ใน Text Stream ของ SVG
    * รวมกลุ่มตัวอักษรที่มี Style เหมือนกันติดกันเป็น `<tspan>` ชิ้นเดียว ทำให้คง Rich Text Formatting (ตัวหนา, สีน้ำเงิน) ไว้ครบถ้วน
  * **Font Readiness**: ฝัง Google Fonts (`Noto Sans Thai`, `Sarabun`) พร้อมรอ `document.fonts.ready` ก่อนเริ่มพิมพ์ PDF
* **Smart Snapping Guides (`CanvasStage.jsx`)**:
  * เมื่อลากวัตถุเข้าใกล้กึ่งกลางกระดาษหรือเส้นมาร์จิน 15mm (Threshold 6px) ระบบจะดูดวัตถุเข้าตำแหน่งพอดี พร้อมแสดงเส้นประไกด์สีชมพู (`#D946EF`)
  * เส้นไกด์มี `excludeFromExport: true` และถูกลบทิ้งอัตโนมัติเมื่อปล่อยเมาส์
* **Unsaved-Changes Warning**: แจ้งเตือนยืนยันก่อนปิดหรือรีเฟรชหน้าเว็บหากมีการแก้ไขที่ยังไม่ได้กดบันทึก

---

## 4. 📜 กฎเหล็กประจำสถาปัตยกรรม (Architectural Rules & Directives)

1. **Serialization Props Rule**: วัตถุหรือคุณสมบัติใหม่ใดๆ ที่สร้างขึ้น (`isDocTable`, `docTableData`, `rawItems`, `isPageFooterNumber`, `isTokenField`, `tokenKey`, `rawTemplateText`, `tokenDefaultValue`, `name`) **ต้องเพิ่มเข้าใน `CUSTOM_CANVAS_PROPS` เสมอ**
2. **Fast Refresh Guard Rule**: การ Patch Prototype บน Fabric.js ต้องมี Guard ตรวจสอบ `if (!targetProto.__customPropsPatched)` หรือ `if (!targetProto.__thaiSvgPatched)` เพื่อป้องกัน Function Wrapping ซ้ำซ้อนใน Next.js Hot Reload
3. **DocTable Single Source of Truth**: การแทนที่ Token ในตาราง ต้องแทนที่ใน `docTableData.items` และเรียก `updateTableData()` เพื่อ Rebuild โครงสร้างตารางใหม่เสมอ ห้ามแก้ไข Textbox ย่อยตรงๆ
4. **Clean Code & No TypeScript**: ใช้ไฟล์นามสกุล `.jsx` และ `.js` เท่านั้น และรักษาความสะอาดของคอมเมนต์ดั้งเดิม
5. **Build Verification**: ทุกครั้งที่มีการเปลี่ยนแปลงโค้ด ต้องรันตรวจสอบผ่าน `npm run build` โดยต้องได้ Exit Code 0 ครบทุก 32 routes เสมอ

---

## 5. 🎯 สถานะการพัฒนาปัจจุบัน (Project Status)

| ระบบงาน | สถานะ | หมายเหตุ |
|---|:---:|---|
| **Auth & 3D Antigravity Particles** | ✅ 100% | Login, Sign Up, 2FA, Three.js Conic Mesh |
| **Contract Workspaces (NDA, Quotation, Distributor, Partner)** | ✅ 100% | 2-Column Split View, Auto-Fill, Digital Signatures |
| **A4 Document Studio (Canva-like Engine: Phase 1–7)** | ✅ 100% | Native A4, Rulers, Undo/Redo, Properties, DocTable, Multi-Page, Tokens, Vector PDF |
| **Puppeteer PDF Export Integration** | ✅ 100% | True Vector PDF, Smart Style-Grouping, Selectable Thai Text |
| **Central Field Profiles & Sent History** | ✅ 100% | Shared Profiles Sync, SMTP Email Tracking |

---

*เอกสารฉบับนี้อัปเดตล่าสุด: กันยายน 2569 (Phase 1–7 Complete & Production Verified)* 🚀🏛️