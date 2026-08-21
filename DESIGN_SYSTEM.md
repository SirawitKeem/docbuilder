# Comprehensive Design System & UI Specification

This document defines the complete Design System, visual tokens, typography, component patterns, and layout guidelines for building B2B SaaS applications matching this design standard.

AI agents working on a codebase using this system MUST strictly adhere to these specifications. Do not introduce unapproved colors, arbitrary corner radii, or custom font families.

---

## 1. Design Philosophy & Guidelines

- **Product Domain**: Data-first B2B SaaS Workspace (CRM / Operations Dashboard).
- **Visual Mood**: Clean, Focused, Trustworthy, Compact, Low-friction.
- **One Saturated Accent Rule**: Only **Deep Purple (`#7C4DFF`)** is used as the saturated brand accent for interactive elements (primary buttons, active tabs/icons, active links, progress bars). No second saturated brand color is allowed.
- **Surface Hierarchy**: Application background canvas uses a calm neutral (`#F6F6FA`). Cards, tables, and side panels sit on pure white (`#FFFFFF`). Sidebar framing uses `#F3F3F5`.
- **Restrained Color Usage**: Decorative/category colors must use light pastel derived tints. Saturated colors are reserved strictly for small status indicators (Won/Lost dots).

---

## 2. Color Palette & Design Tokens

### Primary Brand Color & Gradient
- `primary`: `#7C4DFF` (Deep Purple - Main interactive accent)
- `primary-hover`: `#6A3FE0`
- `primary-text`: `#5C33CC` (Darkened for accessible text contrast on light backgrounds)
- `primary-tints`: `["#F5F1FF", "#E1D3FF", "#C3A8FF", "#A47DFF", "#7C4DFF"]`
- `button-gradient-bottom`: `#4F03BC` (Linear gradient bottom stop)
- `button-gradient-top`: `#9F1EF4` (Linear gradient top stop)
- `button-border`: `#5B03A7`

> **Primary Button Fill**: All primary action buttons use a linear gradient running **bottom → top** from `#4F03BC` to `#9F1EF4`, with no border and no drop shadow.

### Surfaces & Canvas Colors
- `background`: `#F6F6FA` (App canvas behind white surfaces)
- `surface`: `#FFFFFF` (Cards, side panels, data rows)
- `surface-muted`: `#F6F6FA`
- `control-muted`: `#F9F9FB` (Row hover / header bands)
- `tab-background`: `#F3F3F5` (Segmented tabs container background)
- `sidebar-background`: `#F3F3F5`
- `table-header-background`: `#F9F9FB`
- `scrollbar-thumb`: `#E5E5E7`

### Neutral Scale (Dark Purple / Near Black to Grey)
- `black` / `text-primary`: `#22162B` (Dark Purple near-black, used for primary copy and headings)
- `dark-grey` / `text-secondary`: `#646469` (Secondary text, column headers)
- `silver`: `#C5C2D1`
- `light-grey` / `border`: `#E4E4E8` (Hairline borders, table dividers)
- `text-muted`: `#B2AFBC` (Placeholder text, disabled copy)

### Semantic Status Colors
- `success`: `#239742` (Emerald - Won / Active / Success)
  - `badge-success-bg`: `#DDEEE2`
  - `badge-success-text`: `#17682F`
- `danger`: `#E14400` (Burnt - Lost / Destructive / Error)
  - `badge-danger-bg`: `#F9DFD5`
  - `badge-danger-text`: `#A73300`
- `warning`: `#FFB819` (Sunbeam - Caution / Warning)
  - `badge-warning-bg`: `#FFF2CE`
  - `badge-warning-text`: `#725000`
- `info`: `#1C60E7` (Royal Blue - Informational)
  - `badge-info-bg`: `#E0E9FC`
  - `badge-info-text`: `#174CA9`

### Fallback Avatar Palettes
- `company-avatar-palette`: `["#6E527F", "#536787", "#46756F", "#945C4B"]` (Plum, Slate, Teal, Terracotta)

---

## 3. Typography & Hierarchy

- **Primary Font Family**: `"Sora", -apple-system, "Segoe UI", sans-serif`
- **Page Titles (Utility Header)**: `20px`, Weight `600` (Semibold)
- **Section / Card Titles**: `16px`, Weight `600` (Semibold)
- **Body Copy (Tables & Lists)**: `14px`, Weight `400` or `500`
- **Small Uppercase Labels**: `12px`, Weight `500`, `letter-spacing: 0.04em`, `text-transform: uppercase` (Used strictly for sidebar category group headers, e.g., "WORKSPACE", "CATALOG")

---

## 4. Spacing, Corner Radius & Elevation

### Corner Radii (`--radius-*`)
- `card` / `panel`: `16px` (Summary cards, panel containers)
- `button` / `input` / `deal-card`: `10px` (Standard buttons, form inputs, Kanban cards)
- `stage-strip`: `6px` (Pipeline stage indicators)
- `panel` (Slide Sheet): `20px` (Rounded left corners for sliding side panels)
- `badge`: `999px` (Pill badges)
- `avatar`: `50%` (Circular user avatars)

### Elevation & Shadows
- `shadow-panel`: `0 8px 32px rgba(0, 0, 0, 0.10)`
- `shadow-deal-card`: `0 1px 4px rgba(0, 0, 0, 0.06)`
- `shadow-card`: `0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.04)`

### Layout Grid Specifications
- **Base Grid**: 12 Columns, designed at 1440×1024px desktop canvas.
- **Content Margins**: `20px`
- **Grid Gutters**: `20px`
- **Top Bar / Utility Header**: Height `56px`
- **Sidebar Width**: Expanded `236px` / Collapsed `72px`
- **Content Top Spacing**: `24px` below the header

---

## 5. Iconography Rules

- **System & Nav Icons**: Use **Hugeicons** (Line/Outline style, stroke weight `1.7px` to `1.9px`, neutral gray `#646469` or `currentColor`).
- **Directional Chevrons**: Use `SharpChevronUp/Down/Left/Right` (Straight paths, `strokeLinecap="square"`, `strokeLinejoin="miter"`).
- **Category Tags**: Solid glyph inside a dark rounded-square badge (reserved for category/service tagging only).

---

## 6. Key UI Component Patterns

### A. Data Table Shell (Tray Inset Pattern)
- **Outer Shell**: Border `1px solid #E4E4E8`, Radius `10px`, Background `#F9F9FB` (Header band).
- **Inner Table Body**: White background (`#FFFFFF`), inset **5px** on left, right, and bottom from the outer tray, with an internal `8px` radius.
- **Row Heights**: Contact rows `52px`, Company rows `50px`.
- **Cell Divider**: `1px` horizontal divider (`#E4E4E8`). No vertical grid lines.
- **Floating Pagination**: Floating bar at bottom-center: `‹ 1 2 3 … 8 ›` with dark `#22162B` shell or white buttons.

### B. Side Panel (Detail / Edit View)
- Use a **Right-Side Sliding Sheet** (`~420–480px` wide) instead of centered modal popups.
- White surface, `20px` left corner radius, `shadow-panel`.

### C. Kanban Board (Deals Pipeline)
- Horizontal scroller with columns per stage.
- Stage header uses `36px` high strip (`radius: 6px`) in light pastel derived tint of stage color with a small status dot.
- Deal Cards: White surface, `10px` radius, `1px` border (`#E4E4E8`), soft shadow `0 1px 4px rgba(0,0,0,0.06)`. Vertical gap `12px`.

### D. Currency Formatting
- Display currency format: **Thai Baht (฿)** app-wide.
- Format: `฿` prefix directly before comma-separated number (e.g. `฿1,200,000`).

---

## 7. Tailwind CSS v4 Theme Integration (`src/app/globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-text: var(--primary-text);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  
  --color-success: var(--success);
  --color-danger: var(--danger);
  --color-warning: var(--warning);
  --color-info: var(--info);
  
  --radius-card: var(--radius-card);
  --radius-button: var(--radius-button);
  --radius-input: var(--radius-input);
  --radius-panel: var(--radius-panel);
  --radius-badge: var(--radius-badge);
}

:root {
  --primary: #7C4DFF;
  --primary-hover: #6A3FE0;
  --primary-text: #5C33CC;

  --button-gradient-top: #9F1EF4;
  --button-gradient-bottom: #4F03BC;
  --button-border: #5B03A7;

  --background: #F6F6FA;
  --surface: #FFFFFF;
  --surface-muted: #F6F6FA;
  --control-muted: #F9F9FB;

  --color-black: #22162B;
  --color-dark-grey: #646469;
  --color-silver: #C5C2D1;
  --color-light-grey: #E4E4E8;
  --border-color: #E4E4E8;

  --text-primary: #22162B;
  --text-secondary: #646469;
  --text-muted: #B2AFBC;

  --success: #239742;
  --danger: #E14400;
  --warning: #FFB819;
  --info: #1C60E7;

  --font-sans: "Sora", -apple-system, "Segoe UI", sans-serif;

  --radius-card: 16px;
  --radius-button: 10px;
  --radius-input: 10px;
  --radius-panel: 20px;
  --radius-badge: 999px;
  --radius-avatar: 50%;
}
```
