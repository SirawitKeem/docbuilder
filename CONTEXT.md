# 📚 DocBuilder (Ally Doc) - Project Context & Architecture Guide

> **จุดประสงค์ของเอกสารนี้**: เอกสารสรุปบริบทและโครงสร้างทั้งหมดของโปรเจกต์ **DocBuilder (Ally Doc)** เพื่อให้ AI หรือนักพัฒนาคนใหม่สามารถทำความเข้าใจสถาปัตยกรรม, โค้ด, ดีไซน์ซิสเต็ม, และสถานะของโปรเจกต์ได้อย่างรวดเร็วและแม่นยำ 100%

---

## 1. 🌟 ภาพรวมโปรเจกต์ (Project Overview)

* **ชื่อโปรเจกต์**: `DocBuilder` / `Ally Doc` (AI-Powered Document Automation & Management System)
* **เป้าหมาย**: ระบบสร้าง, จัดการ, ออกเอกสารสัญญา และใบเสนอราคาออนไลน์ระดับองค์กร รองรับการซิงค์ข้อมูลส่วนกลาง (Central Profile Data), การคำนวณภาษี/ส่วนลดหลายหน้ากระดาษ (Multi-Page Quotation), การแสดงตัวอย่างแบบ A4 (Live A4 Preview), การส่งออก/พิมพ์ PDF, และการส่งอีเมลพร้อมประวัติติดตามสถานะ
* **เทคโนโลยีหลัก (Tech Stack)**:
  * **Framework**: Next.js 16+ (App Router, Turbopack)
  * **Language & Files**: React 19 (ไฟล์ทั้งหมดในโปรเจกต์ถูกแปลงเป็น `.jsx` เพื่อความเรียบง่ายและเป็นมาตรฐานเดียวกัน)
  * **Styling**: Tailwind CSS, PostCSS, Lucide React Icons
  * **3D Graphics & Physics**: Three.js (WebGL Canvas สำหรับ 3D Particle Animation ในหน้า Auth)
  * **State & Data**: React Context (`DocumentFieldsContext.jsx`), RESTful API Handlers (`app/api/`)

---

## 2. 🗂️ โครงสร้างโฟลเดอร์และเส้นทางของระบบ (Project Structure & Routing)

```
docbuilder/
├── app/
│   ├── (auth)/                          # ระบบยืนยันตัวตน (Authentication)
│   │   ├── login/page.jsx               # หน้าเข้าสู่ระบบ
│   │   ├── sign-up/page.jsx             # หน้าลงทะเบียนบัญชีใหม่
│   │   ├── reset-password/page.jsx      # หน้ารีเซ็ตรหัสผ่าน
│   │   └── two-step-verification/       # หน้ายืนยันรหัส OTP 2 ขั้นตอน (2FA)
│   │
│   ├── (main)/                          # หน้าหลักและเมนูการทำงานของแอปพลิเคชัน
│   │   ├── page.jsx                     # หน้าหลักแดชบอร์ด (Home Dashboard - http://localhost:3000/)
│   │   ├── create/                      # หน้ารวมตัวเลือกสร้างเอกสารใหม่
│   │   │   ├── nda/page.jsx             # หน้าฟอร์มสร้างสัญญา NDA
│   │   │   ├── quotation/page.jsx       # หน้าฟอร์มสร้างใบเสนอราคา (Quotation)
│   │   │   ├── distributor/page.jsx     # หน้าฟอร์มสร้างสัญญาแต่งตั้งผู้จัดจำหน่าย
│   │   │   └── partner/page.jsx         # หน้าฟอร์มสร้างสัญญาพันธมิตร
│   │   ├── documents/page.jsx           # หน้าจัดการเอกสารของฉัน (My Documents Hub)
│   │   ├── profile-data/                # หน้าจัดการข้อมูลส่วนกลาง (Shared Profiles)
│   │   │   ├── page.jsx                 # หน้ารายการโปรไฟล์ข้อมูล
│   │   │   ├── new/page.jsx             # หน้าสร้างโปรไฟล์ใหม่
│   │   │   └── [id]/page.jsx            # หน้าแก้ไขโปรไฟล์
│   │   ├── templates/page.jsx           # หน้าแคตตาล็อกเทมเพลตทั้งหมด
│   │   ├── history/page.jsx             # หน้าประวัติการส่งเอกสารและสถานะอีเมล
│   │   └── settings/page.jsx            # หน้าตั้งค่าระบบ
│   │
│   ├── api/                             # Backend API Routes
│   │   ├── documents/route.js           # CRUD เอกสาร
│   │   ├── quotations/                  # จัดการใบเสนอราคา, รันเลขที่เอกสาร, สร้าง Revision
│   │   ├── field-profiles/              # จัดการ Profile Data กลาง
│   │   ├── send-email/route.js          # API ส่งอีเมลเอกสาร
│   │   ├── email-status/route.js        # API ตรวจสอบสถานะอีเมล
│   │   ├── sent-history/route.js        # API ประวัติการส่ง
│   │   └── export-pdf/route.js          # API ส่งออก PDF
│   │
│   ├── print/[templateId]/page.jsx      # หน้าสำหรับการพิมพ์/Preview A4 PDF คมชัดสูง
│   ├── globals.css                      # Global Styles, Custom Animations, Fonts
│   └── layout.jsx                       # Root HTML Layout
│
├── components/
│   ├── auth/                            # คอมโพเนนต์ของระบบ Auth
│   │   ├── AuthLayoutShell.jsx          # โครงสร้าง Layout 2 ฝั่ง (Form + Right Brand Panel)
│   │   ├── Antigravity.jsx              # Three.js 3D Conic Gradient Particle Canvas
│   │   ├── LoginForm.jsx                # ฟอร์มเข้าสู่ระบบ
│   │   ├── SignUpForm.jsx               # ฟอร์มลงทะเบียน
│   │   ├── ResetPasswordForm.jsx        # ฟอร์มรีเซ็ตรหัสผ่าน
│   │   └── TwoStepVerificationForm.jsx  # ฟอร์มกรอก OTP 6 หลัก
│   │
│   ├── layout/                          # คอมโพเนนต์ Layout หลัก
│   │   ├── LayoutShell.jsx              # โครงหน้าแอปพลิเคชัน
│   │   ├── Sidebar.jsx                  # Sidebar เมนูด้านซ้าย (Header, Menu, NEW Badge, Profile)
│   │   └── Header.jsx                   # Topbar แถบเมนูด้านบน
│   │
│   ├── home/                            # คอมโพเนนต์ของหน้าหลัก (Home)
│   │   ├── HeroSection.jsx              # แบนเนอร์ทักทายและปุ่ม Action
│   │   ├── TemplateGrid.jsx             # กริดแสดงการ์ดเทมเพลตเริ่มต้น
│   │   └── RecentDocumentsTable.jsx     # ตารางแสดงเอกสารล่าสุด
│   │
│   ├── document/                        # คอมโพเนนต์สร้างและแสดงเอกสาร
│   │   ├── ContractFormSidebar.jsx      # แถบฟอร์มกรอกข้อมูลสัญญา (2-Column Split View)
│   │   ├── quotation/                   # ฟอร์มและหน้ากระดาษใบเสนอราคา
│   │   ├── nda/                         # ฟอร์มและหน้ากระดาษสัญญา NDA (4 หน้า)
│   │   ├── DocumentHeader.jsx           # ส่วนหัวกระดาษเอกสาร
│   │   └── DocumentFooter.jsx           # ส่วนท้ายกระดาษเอกสาร
│   │
│   └── documents/
│       └── DocumentsTable.jsx           # ตารางจัดการเอกสาร (Preview, Delete, Bulk Delete, Edit)
│
├── context/
│   └── DocumentFieldsContext.jsx        # Context ผูกข้อมูลฟิลด์ระหว่าง Form และ Live Preview
│
└── lib/
    ├── templates/registry.js            # ทะเบียน Schema และการตั้งค่าของทุกเทมเพลต
    ├── quotationHelpers.js              # ตรรกะคำนวณและตัดแบ่งหน้ากระดาษใบเสนอราคา
    └── data/                            # Mock Data และ Data Fetching Helpers
```

---

## 3. 🎨 มาตรฐานการออกแบบและดีไซน์ซิสเต็ม (Design System & UI Rules)

### 3.1 โทนสีหลัก (Color Palette)
* **Primary Brand Purple**: `#5542F6` / `#7C4DFF` (สีม่วงแบรนด์หลัก)
* **Secondary Indigo / Blue Accent**: `#4F46E5` / `#38BDF8` (สีครามและฟ้าไฮไลต์)
* **Gradient Theme**: การไล่เฉดสีฟ้า ➔ น้ำเงิน ➔ ม่วง ➔ ชมพูมาเจนต้า (`from-[#2563EB] via-[#6366F1] to-[#A855F7]`)
* **Backgrounds & Surfaces**:
  * ขาวสะอาดตา (`bg-white`), พื้นหลังเพจ (`bg-[#F8F9FB]`), เส้นขอบตัดโปร่งบาง (`border-[#EAEAEF]` หรือ `border-[#F0F0F3]`)
  * การ์ดขอบมนนุ่มนวล (`rounded-2xl` หรือ `rounded-[14px]`) พร้อมเงาละมุน (`shadow-xs` / `shadow-2xs`)

### 3.2 ปุ่มกด Animated Gradient Button
* **Class**: `.animate-gradient-button` (กำหนด Animation ใน `app/globals.css` ด้วยคีย์เฟรม `buttonGradientFlow 4s ease infinite`)
* **ข้อกำหนดสำคัญ**: ตัวหนังสือภายในปุ่มต้องเป็น **สีขาวทึบ 100% (`text-white font-bold`)** พร้อมไอคอนประกายดาว **`✦ SparkleStar` สีขาว (`fill-white`)** เสมอ

### 3.3 แอนิเมชัน 3D Antigravity Particle (`components/auth/Antigravity.jsx`)
* ใช้ Three.js `InstancedMesh` บันทึกอนุภาคแคปซูล 3D จำนวน 280 ชิ้น
* **Conic 360° Gradient**: คำนวณองศา atan2(y, x) รอบจุดศูนย์กลาง เพื่อไล่เฉดสีรุ้งหมุนวน 360° ตลอดเวลา
* **Left-Half Screen Detection**: เมื่อเคอร์เซอร์เมาส์อยู่ฝั่งซ้ายของหน้าจอ (`e.clientX < window.innerWidth / 2`) แอนิเมชันจะตัดเข้าสู่โหมด **Auto-Orbit Floating ทันที** อย่างลื่นไหล

### 3.4 Sidebar Menu (`components/layout/Sidebar.jsx`)
* **Header**: โลโก้ `Ally Doc` + ตัวหนังสือ `DocBuilder font-extrabold text-[18px]` + ประกายดาว `✦ SparkleStar` (4-Point Diamond Sparkle SVG)
* **Category Labels**: `WORKSPACE`, `CATALOG`, `SYSTEM` ฟอนต์ `text-[10px] font-bold text-[#9CA3AF] tracking-[0.14em] uppercase`
* **Active State Indicator**: แถบ Indicator ซ้ายมือ `w-[3.5px] bg-[#5542F6] rounded-r-md` พร้อมพื้นหลัง `bg-[#F5F1FF] text-[#5542F6] font-bold`
* **Badge `NEW`**: กล่องทรงรีแนวนอน ขอบโค้งมน (`rounded-full`) โดย **ภายในกล่องเป็นสีขาวมน (`bg-white`)** และ **ขอบกล่องเป็นการไล่เฉดสีฟ้า-ม่วง (`p-[1px] bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#C084FC]`)** พร้อมตัวหนังสือ `NEW` สีม่วงครามเข้ม `#5542F6 font-black`

---

## 4. ⚙️ ตรรกะการทำงานสำคัญ (Core Business Logic)

1. **Dynamic Template Architecture**:
   - ระบบเทมเพลตถูกออกแบบเป็น Dynamic Registry (`lib/templates/registry.js`) รองรับการเพิ่มเทมเพลตใหม่ๆ ได้ไม่จำกัด โดยแต่ละเทมเพลตจะมี `schema`, `fields`, `defaultValues`, และ `pages` (A4 Pages) ของตนเอง
2. **Central Profile Data Sync**:
   - ข้อมูลกลาง (เช่น ชื่อบริษัทผู้ให้บริการ, เลขผู้เสียภาษี, ผู้มีอำนาจลงนาม, ที่อยู่) ที่ถูกบันทึกใน `/profile-data` จะถูกซิงค์อัตโนมัติเข้ากับฟิลด์ที่มี `sharedKey` เดียวกันในทุกเทมเพลต
3. **Quotation Engine & Auto-Pagination**:
   - ตรรกะ `lib/quotationHelpers.js` จะคำนวณภาษี VAT (7%), ส่วนลด (Discount), ยอดรวมสุทธิ และ **ตัดแบ่งหน้ากระดาษ A4 อัตโนมัติ (Pagination)** หากมีรายการสินค้าจำนวนมากเกิน 1 หน้ากระดาษ
4. **Document Revision System**:
   - สำหรับใบเสนอราคา รองรับการกด **"สร้างฉบับปรับปรุง (New Rev)"** ผ่าน `/api/quotations/[id]/revision` ซึ่งจะสร้างเอกสารชุดใหม่ที่คงข้อมูลเดิมไว้ พร้อมอัปเดตเลข Revision (`-Rev.01`, `-Rev.02`) ทันที

---

## 5. 🚀 แผนการพัฒนาปัจจุบันและขั้นตอนถัดไป (Current Roadmap)

* ✅ **Auth Module**: เสร็จสมบูรณ์ 100% (Login, Sign Up, Reset Password, 2FA, Three.js 3D Conic Particles)
* ✅ **Sidebar Modernization**: เสร็จสมบูรณ์ 100% (Header Brand, SparkleStar `✦`, Active States, Gradient Border `NEW` Pill Badge)
* ✅ **All Contract Workspaces (`/create/nda`, `/create/distributor`, `/create/partner`)**: เสร็จสมบูรณ์ 100% (2-Column Split Workspace, Form Sidebar ปรับตามประเภทสัญญา, วันที่อัตโนมัติ, Multi-Page PDF Export 4-5 หน้า)
* ✅ **Digital Signature Pad & E-Sign**: เสร็จสมบูรณ์ 100% (วาดลายเซ็นสดด้วย Canvas หรืออัปโหลดรูป PNG, ประทับลงในหน้า A4 และไฟล์ PDF ทุกสัญญา)
* ✅ **1-Click Duplicate & Status Workflow**: เสร็จสมบูรณ์ 100% (ปุ่มคัดลอกสร้างซ้ำใน 1 คลิก พร้อมปุ่มลัดเปิดแก้ไขทันที, ป๊อปอัปเปลี่ยนสถานะได้โดยตรง 4 สถานะหลัก)
* ✅ **Corporate Red Seal & PDF Watermark**: เสร็จสมบูรณ์ 100% (ตราประทับสีแดงบริษัท เครสท์ เซนโด จำกัด, ลายน้ำ PDF 4 รูปแบบ: DRAFT, COPY, CONFIDENTIAL, None)
* ✅ **Quotation ➔ Receipt in 1-Click**: เสร็จสมบูรณ์ 100% (ปุ่มแปลงใบเสนอราคาเป็นใบเสร็จรับเงิน/ใบกำกับภาษี รันเลข REC อัตโนมัติ)
* ✅ **Systematic Architecture Realignment**: เสร็จสมบูรณ์ 100% (แยกคลังเอกสาร `/documents` กับประวัติการจัดส่ง `/history` อย่างถูกต้องตามหลักวิศวกรรมซอฟต์แวร์ ไม่สร้างเอกสารซ้ำซ้อนเมื่อส่งอีเมล)
* ✅ **Templates Catalog Hub (`/templates`)**: เสร็จสมบูรณ์ 100% (Search Bar, Category Tabs, Structure Preview Modal, Modern Cards)
* ✅ **Home Dashboard Clean Focus (`/`)**: เสร็จสมบูรณ์ 100% (Hero Banner ทักทายตามเวลาจริง + 3D Document Stack, Dynamic Template Cards, Recent Documents Hub มุ่งเน้นการจัดการเอกสาร 100%)
* ✅ **Document Management & Renaming (`/documents`)**: เสร็จสมบูรณ์ 100% (ระบบเปลี่ยนชื่อเอกสารแบบ Pop-up และ Inline Toolbar, กรองสถานะ, ค้นหา, ลบเดี่ยว/กลุ่ม)
* ✅ **Sent History (`/history`) & Central Field Profiles (`/profile-data`)**: เสร็จสมบูรณ์ 100%
* ✅ **Settings & Organization Profile (`/settings`)**: เสร็จสมบูรณ์ 100% (Company Info, Default Signatory, SMTP Status)
* 🎯 **เป้าหมายหลักถัดไป (Core Vision)**: เพิ่มเทมเพลตประกาศและแบบฟอร์มบริษัท (*Company Announcement & Request Form*) และพัฒนาระบบสร้างเทมเพลตเอง (*Custom Template Builder*)

---

## 💡 แนวทางการเขียนโค้ดและกฎประจำโปรเจกต์ (Code Conventions)
1. รักษาความสะอาดและโครงสร้างแบบ Component-Driven
2. ใช้ `.jsx` เสมอ (ไม่มี TypeScript `.tsx`)
3. ใช้ Tailwind CSS Utility Classes ในการตกแต่ง
4. ห้ามลบคอมเมนต์และ Docstrings เดิมที่ไม่เกี่ยวข้องกับการแก้ไข
5. เมื่อทำการแก้ไขโค้ด ให้ตรวจสอบความสมบูรณ์ด้วยการรัน `npm run build` เสมอ
