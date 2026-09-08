# Design System Reference (Source of Truth: tenant-hub)

> **เอกสารอ้างอิงกลาง (Master Design System Specification)**
> สกัดจากโปรเจกต์ต้นแบบ: `C:\Users\Keem\Desktop\tenant-hub`
> เพื่อนำไปปรับใช้กับ: `C:\Users\Keem\Desktop\docbuilder`
> เป้าหมาย: ให้ทั้งสองแอปพลิเคชันมีอัตลักษณ์ของ UI, สี, Typography, Radius, Shadow และ Component Patterns ออกมาเป็น "ตระกูลเดียวกัน" (Cohesive Product Family) โดยไม่แตะต้อง Business Logic หรือโครงสร้างฟังก์ชันเดิม

---

## 1. Design Philosophy & Creative Direction

- **Creative North Star**: *"The Scoped Operations Desk"* — พื้นที่ทำงานแบบ B2B Operations ที่สงบ กะทัดรัด สบายตา ให้ข้อมูลชัดเจนโดยไม่รบกวนสายตา
- **The One Saturated Accent Rule**: สีม่วง (**Violet / Brand**) คือสีเดียวที่อิ่มตัวสูง (Saturated Accent) ในระบบ สงวนไว้สำหรับ Primary Action, Focus State, Selected Item, Active Tab/Icon และสถานะสำคัญเท่านั้น ห้ามใช้สีสดอื่นๆ มาเป็นสีหลักร่วม
- **Tonal Layering Over Hard Shadows**: ลำดับชั้นความลึก (Depth) สร้างด้วยความต่างของโทนพื้นผิว (Neutral Tonal Layering: Canvas → Shell → Raised Card) มากกว่าการใช้เงาหนาหนัก
- **Flat by Default**: การ์ดและกล่องข้อความเรียบแบนที่สถานะปกติ (Resting State) ใช้เส้นขอบบาง 1px (`Hairline Border`) และใช้เงาเฉพาะเมื่อมีปฏิสัมพันธ์ (Hover Lift) หรือชิ้นส่วนที่ลอยอยู่ (Floating Sheet / Modal / Dropdown)
- **Base Rhythm**: ใช้ระบบระยะห่างฐาน 4px / 8px อย่างเคร่งครัด

---

## 2. Color Tokens & Palette

ระบบสีอ้างอิงจาก **Tailwind CSS v4 Primitive Families** โดยแบ่งเป็น Neutral, Brand (Violet), และ Semantic Status (Success, Warning, Error, Info)

### 2.1 Brand & Interactive Colors (Violet Family)

| Token | Light Value | Dark Value | การนำไปใช้งาน |
|---|---|---|---|
| `--primary` / `bg-brand-solid` | `#7C3AED` (`violet-600`) | `#8B5CF6` (`violet-500`) | ปุ่มหลัก (Primary Button), จุดเน้นปฏิสัมพันธ์หลัก |
| `--primary-hover` / `bg-brand-solid-hover` | `#6D28D9` (`violet-700`) | `#7C3AED` (`violet-600`) | เมื่อ Hover ปุ่มหลัก |
| `--primary-text` / `text-brand-secondary` | `#6D28D9` (`violet-700`) | `#D4D4D4` (`neutral-300`) | ข้อความลิงก์เด่น, Active Tab Label |
| `--primary-tint` / `bg-brand-primary` | `#F5F3FF` (`violet-50`) | `#262626` (`neutral-800`) | พื้นหลังอ่อนสำหรับเลือกหรือไฮไลต์ |
| `--primary-tint-strong` / `bg-brand-secondary` | `#EDE9FE` (`violet-100`) | `#404040` (`neutral-700`) | Focus ring tint, Badge brand |
| `--button-gradient-bottom` | `#7C3AED` | `#7C3AED` | จุดเริ่ม Gradient ด้านล่างของ Primary Button |
| `--button-gradient-top` | `#8B5CF6` | `#8B5CF6` | จุดสิ้นสุด Gradient ด้านบนของ Primary Button |
| `--border-brand` | `#8B5CF6` | `#A78BFA` | เส้นขอบขณะ Focus input หรือกรอบการ์ดที่ถูกเลือก |

> **Primary Button Formula**:
> ```css
> background: linear-gradient(to top, var(--button-gradient-bottom) [#7C3AED], var(--button-gradient-top) [#8B5CF6]);
> color: #FFFFFF;
> border: 0;
> box-shadow: 0 1px 2px rgba(79, 3, 188, 0.18);
> ```

---

### 2.2 Neutral & Surface Hierarchy

| Role | Light Mode | Dark Mode | รายละเอียดการใช้งาน |
|---|---|---|---|
| `bg-primary` (Canvas) | `#FFFFFF` | `#0A0A0A` (`neutral-950`) | พื้นหลังระนาบทำงานหลัก |
| `bg-secondary` (Shell / Desk) | `#FAFAFA` (`neutral-50`) | `#171717` (`neutral-900`) | กรอบนอกของ Shell, App Inset |
| `sidebar` | `#F6F6F6` | `#121212` | แถบเมนูด้านข้าง (เข้มกว่า Canvas ใน Dark) |
| `bg-card-raised` | `#F5F5F5` (`neutral-100`) | `#1C1C1C` | การ์ดที่ต้องการยกระดับ 1 ขั้น, Settings Card |
| `bg-tertiary` | `#F5F5F5` | `#262626` (`neutral-800`) | หัวตาราง (Table Header), แถบ Segmented Track |
| `bg-primary-hover` | `#FAFAFA` | `#202020` | เมื่อ Hover แถวตารางหรือรายการลิสต์ |
| `workspace-control` | `#FFFFFF` | `#262626` | พื้นผิวของ Input, Select ในหน้าทำงาน |

---

### 2.3 Text & Foreground Roles

| Token | Light Mode | Dark Mode | การนำไปใช้งาน |
|---|---|---|---|
| `text-primary` / `fg-primary` | `#171717` (`neutral-900`) | `#FAFAFA` (`neutral-50`) | หัวข้อหลัก, ข้อความเนื้อหาสำคัญ |
| `text-secondary` / `fg-secondary` | `#404040` (`neutral-700`) | `#D4D4D4` (`neutral-300`) | ข้อความรอง, คำอธิบายทั่วไป, เมนูที่ไม่ได้เลือก |
| `text-tertiary` / `fg-tertiary` | `#525252` (`neutral-600`) | `#A3A3A3` (`neutral-400`) | หัวคอลัมน์ตาราง, วันเวลา, ข้อมูลประกอบ |
| `text-quaternary` / `fg-quaternary` | `#737373` (`neutral-500`) | `#737373` (`neutral-500`) | Placeholder, เส้น Scrollbar thumb |
| `text-primary-on-brand` | `#FFFFFF` | `#FAFAFA` | ตัวหนังสือบนปุ่มม่วงหรือแถบสีทึบ |

---

### 2.4 Border Tokens

| Token | Light Mode | Dark Mode | การนำไปใช้งาน |
|---|---|---|---|
| `border-primary` | `#D4D4D4` (`neutral-300`) | `#404040` (`neutral-700`) | กรอบ Input, เส้นขอบหลักของคอนโทรล |
| `border-secondary` | `#E5E5E5` (`neutral-200`) | `#262626` (`neutral-800`) | เส้นแบ่งการ์ด, เส้นแบ่งแถวตาราง (Hairline) |
| `border-tertiary` | `#F5F5F5` (`neutral-100`) | `#262626` | เส้นคั่นส่วนบางพิเศษ |

---

### 2.5 Semantic Status Tokens (Feedback & Badges)

| Status | Solid / Icon | Light Text | Light Background (Tint) | Dark Text | Dark Background |
|---|---|---|---|---|---|
| **Success** | `#16A34A` (`green-600`) | `#16A34A` | `#DCFCE7` (`green-100`) | `#4ADE80` | `#052E16` |
| **Warning** | `#CA8A04` (`yellow-600`)| `#CA8A04` | `#FEF9C3` (`yellow-100`) | `#FACC15` | `#422006` |
| **Destructive / Error** | `#DC2626` (`red-600`)| `#DC2626` | `#FEE2E2` (`red-100`) | `#F87171` | `#450A0A` |
| **Info** | `#2563EB` (`blue-600`) | `#2563EB` | `#DBEAFE` (`blue-100`) | `#60A5FA` | `#172554` |

---

## 3. Typography Hierarchy

### 3.1 Font Families
- **UI Sans (English)**: `"Inter Variable"`, `Inter`, ui-sans-serif, system-ui, sans-serif
- **UI Sans (Thai)**: `"Noto Sans Thai Variable"`, `"Noto Sans Thai"`, `"Inter Variable"`, sans-serif
- **Code / Monospace / Numeric**: `"JetBrains Mono Variable"`, monospace (ใช้ร่วมกับ `tabular-nums` สำหรับตัวเลขตาราง)
- **Special Editorial / Quotes**: `"Radley"`, Georgia, serif
- *(สำหรับ docbuilder เฉพาะส่วนเรนเดอร์เอกสารและส่งออก PDF ให้คงฟอนต์มาตรฐานเอกสารราชการ/สัญญา เช่น `Sarabun`, `Noto Sans Thai Looped` ไว้ใน Document Body)*

### 3.2 Scale & Weights

| Role | Size | Weight | Line Height | Letter Spacing | การใช้งาน |
|---|---|---|---|---|---|
| **Display** | `clamp(2.4rem, 5vw, 5rem)` | 600 (Semibold) | 1.02 | `-0.04em` | หน้า Entry Proposition เท่านั้น |
| **Headline** | `30px` | 600 (Semibold) | 36px | `-0.03em` | หัวข้อหน้า Login / Sign-in / Onboarding |
| **Title (Page Heading)** | `20px` | 600 (Semibold) | 28px | `-0.025em` | ชื่อหน้าบน Utility Topbar / หัวข้อหน้าทำงาน |
| **Section Title** | `16px` | 600 (Semibold) | 24px | `-0.02em` | หัวข้อ Card / Section Group |
| **Body (Default)** | `14px` | 400 (Regular) | 20px | Normal | ข้อความทั่วไป, เนื้อหาตาราง, ฟอร์ม |
| **Control** | `14px` | 500 (Medium) | 20px | Normal | ข้อความบนปุ่ม, ลิงก์เมนู, แถบนำทาง |
| **Label / Caption** | `12px` | 500 (Medium) | 16px | Normal | Metadata, หัวคอลัมน์ตาราง, Badges |

---

## 4. Spacing Scale (4px Rhythm)

| Token | Dimension | การนำไปใช้ |
|---|---|---|
| `--space-1` | `4px` | Padding ภายในปุ่มเล็ก, ไอคอนกับข้อความ |
| `--space-2` | `8px` | Gap ระหว่าง Input กับ Label, Icon-to-label gap |
| `--space-3` | `12px` | Horizontal insets ของปุ่มและฟิลด์, Gap กะทัดรัด |
| `--space-4` | `16px` | Inset ของการ์ด, Gap ระหว่าง Grid items |
| `--space-5` | `20px` | Internal padding มาตรฐานของการ์ด, Table cell X inset |
| `--space-6` | `24px` | Page padding บนหน้าจอ Desktop |
| `--space-8` | `32px` | ระยะห่างระหว่าง Section ในหน้า Settings / ฟอร์มใหญ่ |

---

## 5. Border Radius Scale

| Token | Radius | การนำไปใช้ |
|---|---|---|
| Checkbox | `4px` | กล่องติ๊กถูก (เพื่อให้คงรูปทรงสี่เหลี่ยมชัดเจน) |
| `--radius-compact` / `sm` | `6px` | แถบเมนูย่อย, Navigation items ใน Sidebar |
| `--radius-control` / `--radius` | `8px` | ปุ่ม (Buttons), ช่องกรอก (Inputs), Select, Dropdown menu |
| `--radius-card` | `12px` | การ์ดข้อมูล (Cards), กรอบตาราง (`workspace-data-table`) |
| `--radius-panel` | `16px` | บานหน้าต่างเลื่อน (Sheet), หน้าต่าง Modal (Dialog), Shell corners |
| Pill / Badge | `9999px` | สถานะชิป (Status Pills), แท็กสถานะ (Badges) |

---

## 6. Elevation & Shadows

| Token | Box Shadow | การนำไปใช้ |
|---|---|---|
| `--elevation-field` | `inset 0 0 0 1px var(--border-primary), 0 1px 2px rgba(16, 24, 40, 0.05)` | ช่องกรอกข้อมูล (Inputs / Select / Textarea) |
| `--elevation-card` (Ambient Card) | `0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 8px rgba(0, 0, 0, 0.04)` | การ์ดและคอนเทนเนอร์เมื่อต้องการยกตัวเบาๆ |
| `--elevation-panel` (Panel Lift) | `0 8px 32px rgba(0, 0, 0, 0.10)` | Dropdown menus, Sheets, Floating Modals |
| Primary Action Shadow | `0 1px 2px rgba(79, 3, 188, 0.18)` | ใต้ปุ่ม Primary Button |

---

## 7. Component Patterns & Styling Rules

### 7.1 Buttons (`<Button>`)
- **ความสูงมาตรฐาน**:
  - `sm` = 32px (`--control-height-sm`)
  - `default` / `md` = 36px (`--control-height-md`)
  - `lg` = 40px (`--control-height-lg`)
- **Variants**:
  - `default` (Primary): ใช้คลาส `.primary-button` ขอบมน 8px ไม่มีเส้นขอบ ตัวหนังสือสีขาว
  - `outline`: พื้นหลังขาว (Light) หรือ `input/30` (Dark), เส้นขอบ `border-border`, Hover เป็น `bg-secondary`
  - `secondary`: พื้นหลัง `bg-secondary`, ตัวหนังสือ `text-secondary-foreground`
  - `ghost`: โปร่งใส, Hover ด้วย `bg-muted`
  - `destructive`: พื้นหลัง `bg-destructive/10`, ตัวหนังสือ `text-destructive`, Hover เพิ่มความเข้ม
- **Micro-interaction**:
  - Hover: `opacity: 0.92;`
  - Active: `transform: translateY(1px);` (ยุบตัวลง 1px ไม่สั่นไหว)

---

### 7.2 Inputs, Select & Textarea
- **ความสูง**: 36px (หรือ 40px ในหน้า Auth)
- **มุมโค้ง**: 8px (`--radius-control`)
- **พื้นหลัง**: ใน Workspace ใช้ `var(--workspace-control)` (ขาวใน Light, `#262626` ใน Dark)
- **ขอบและเงา**: ใช้ `--elevation-field`
- **Focus State**:
  - ห้ามใช้ขอบสีดำหนา
  - ให้ใช้ `focus-visible:!shadow-[inset_0_0_0_2px_var(--border-brand),var(--elevation-field)]` และ `outline: none`
- **Error State**:
  - พื้นหลังเป็น `bg-error-primary`
  - เงาเป็น `shadow-[inset_0_0_0_2px_var(--border-error),var(--elevation-field)]`

---

### 7.3 Cards & Data Containers
- **มุมโค้ง**: 12px (`--radius-card`)
- **เส้นขอบ**: เส้นบาง 1px ด้วย `border-secondary` (`#E5E5E5` ใน Light, `#262626` ใน Dark)
- **พื้นหลัง**: การ์ดยกสเต็ปใช้ `bg-card-raised` (`#F5F5F5` ใน Light, `#1C1C1C` ใน Dark)
- **Padding**: 16px ถึง 24px (ส่วนใหญ่ใช้ 20px)

---

### 7.4 Data Tables (`.workspace-data-table`)
- **โครงสร้าง**: ล้อมด้วยคอนเทนเนอร์มน 12px พร้อมเส้นขอบ `border-secondary`
- **Header**: สูง 40px, พื้นหลัง `bg-tertiary`, ตัวหนังสือ 12px semibold `text-tertiary`
- **Row**: สูง 64px, พื้นหลังโปร่งใส, Hover เป็น `bg-primary-hover` (`#FAFAFA` / `#202020`), เส้นคั่นแนวนอน `border-secondary` (ตัดเส้นแนวตั้งออกทั้งหมด)

---

### 7.5 Status Chips & Badges
- **ทรง**: Pill รูปแคปซูล (`rounded-full` หรือ `rounded-[9999px]`), สูง 20–24px
- **สไตล์**: พื้นหลังใช้ **Tint** สีอ่อน (เช่น `bg-success-secondary`), ตัวหนังสือใช้สีเข้ม (เช่น `text-success-primary`) หลีกเลี่ยงการใช้สีทึบสะท้อนแสงสำหรับป้ายสถานะทั่วไป

---

### 7.6 Navigation & Sidebar Contract
- **ความกว้าง Sidebar**: ขยายเต็ม 260px, ย่อเหลือ 72px
- **รายการเมนู**: สูง 36px, มน 6px (`--radius-compact`), ไอคอนขนาด 17–18px, เว้นวรรค 8px
- **Active State**: พื้นหลังเป็นพื้นผิวยกของธีม (`bg-white` ใน Light พร้อมเงาอ่อน, `bg-card-raised` ใน Dark), ไอคอนเปลี่ยนเป็นสไตล์ทึบ (Filled Icon)
- **Inactive State**: ตัวหนังสือ `text-secondary`, ไอคอน `fg-secondary`, เปลี่ยนเป็นสีเข้มขึ้นเมื่อ Hover

---

## 8. Do's and Don'ts

### ✅ สิ่งที่ควรทำ (Do):
1. ใช้ปุ่มม่วง Gradient (`#7C3AED` → `#8B5CF6`) สำหรับการกด Submit/Create/Primary Actions หลัก
2. รักษาจังหวะช่องไฟ 4px (4, 8, 12, 16, 20, 24, 32px)
3. ใช้ Tonal Surface Hierarchy (ขาว / `#FAFAFA` / `#F5F5F5` ใน Light mode) แบ่งสัดส่วนแทนการตีกรอบดำ
4. ทำให้ Hover และ Focus state มีความนุ่มนวล ไม่กระตุก layout

### ❌ สิ่งที่ไม่ควรทำ (Don't):
1. **ห้ามนำสีหลักสีที่สองเข้ามาปน** (เช่น สีน้ำเงินเข้ม ส้มสด หรือเขียวฉูดฉาด ในจุดที่เป็นปุ่ม Action หลัก)
2. **ห้ามใช้เงาดำหนาหนัก** หรือมุมโค้งที่เหลี่ยมคมเกินไป (0px) หรือโค้งเกินไป (เช่น ปุ่มวงรี 9999px ในจุดที่ไม่ใช่ Badge)
3. **ห้ามแตะต้อง Document Canvas หรือคำนวณ mm/PDF Export** ในโปรเจกต์ docbuilder ให้ปรับเฉพาะ Shell, Header, Sidebar, Dashboard, Table, Modal และ Form Controls เท่านั้น
