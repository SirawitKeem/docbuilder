"use client";

import { useState } from "react";
import { useDocumentField } from "@/context/DocumentFieldsContext";

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
      <span className="inline whitespace-pre-line">{value}</span>
    ) : (
      <span>{value}</span>
    );
  }

  const stateClasses = focused
    ? "border-primary-500 bg-white ring-2 ring-primary-100"
    : isEmpty
    ? "border-dashed border-primary-300 bg-primary-50 hover:bg-primary-100"
    : "border-transparent bg-transparent hover:bg-primary-50";

  if (type === "textarea") {
    return (
      <textarea
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={2}
        className={`block w-full max-w-full my-1 px-2 py-1 rounded border outline-none transition-colors duration-150 resize-none text-inherit font-inherit leading-inherit ${stateClasses}`}
      />
    );
  }

  const calcWidth = value ? value.length + 2 : minWidth || 6;

  return (
    <input
      type="text"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ width: `${Math.max(minWidth, calcWidth)}ch` }}
      className={`inline-block align-baseline max-w-full px-1.5 py-0.5 mx-0.5 rounded border outline-none transition-colors duration-150 text-inherit font-inherit ${stateClasses}`}
    />
  );
}