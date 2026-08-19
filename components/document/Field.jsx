"use client";

import { useState } from "react";
import { useDocumentField } from "@/context/DocumentFieldsContext";

// คำนวณความกว้างตัวอักษรภาษาไทยโดยตัดสระบน/ล่าง และวรรณยุกต์ (Zero-width diacritics) ออก
function getThaiVisualWidth(str) {
  if (!str) return 0;
  const baseChars = str.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, "");
  return baseChars.length;
}

export default function Field({ id, placeholder, type = "text", minWidth = 4 }) {
  const { value, setValue, readOnly } = useDocumentField(id);
  const [focused, setFocused] = useState(false);
  const isEmpty = !value;

  // โหมด Review / Print — แสดงเป็นข้อความในเนื้อเอกสารจริง ไม่มีกรอบฟอร์ม
  if (readOnly) {
    if (isEmpty) {
      return <span className="inline-block border-b border-gray-400 min-w-[3ch] px-1">&nbsp;</span>;
    }
    return type === "textarea" ? (
      <span className="whitespace-pre-line">{value}</span>
    ) : (
      <span>{value}</span>
    );
  }

  const stateClasses = focused
    ? "border-primary-500 bg-white ring-2 ring-primary-100"
    : isEmpty
    ? "border-dashed border-primary-300 bg-primary-50 hover:bg-primary-100"
    : "border-transparent bg-primary-50/80 hover:bg-primary-100";

  if (type === "textarea") {
    return (
      <textarea
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={1}
        className={`inline-block w-full max-w-full my-0.5 px-2 py-0.5 rounded border outline-none transition-colors duration-150 resize-y text-inherit font-inherit leading-normal ${stateClasses}`}
      />
    );
  }

  // คำนวณความกว้างอินพุทให้พอดี ไม่ถูกตัดซ่อนตัวอักษรท้าย (เพิ่มเผื่อ 1.8ch สำหรับ padding ภายใน)
  const visualLen = getThaiVisualWidth(value);
  const placeholderLen = getThaiVisualWidth(placeholder);
  const calcWidth = value
    ? visualLen + 1.8
    : Math.max(minWidth || 4, placeholderLen + 1.8);

  return (
    <input
      type="text"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ width: `${calcWidth}ch` }}
      className={`inline-block align-baseline max-w-full px-1.5 py-0.5 mx-0.5 rounded border outline-none transition-colors duration-150 text-inherit font-inherit ${stateClasses}`}
    />
  );
}