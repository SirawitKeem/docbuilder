"use client";

import { useState } from "react";

export default function InlineTextField({
  value = "",
  onChange,
  placeholder = "",
  readOnly = false,
  className = "",
  type = "text",
  numeric = false,
  multiline = false,
}) {
  const [focused, setFocused] = useState(false);
  const isEmpty = value === undefined || value === null || value === "";

  if (readOnly) {
    if (isEmpty) return null;
    return (
      <span className={`inline-block ${multiline ? "whitespace-pre-line" : "truncate"} ${className}`}>
        {value}
      </span>
    );
  }

  const baseStateClasses = focused
    ? "bg-white ring-1 ring-emerald-500 shadow-2xs"
    : "bg-transparent hover:bg-emerald-50/50";

  if (multiline) {
    return (
      <textarea
        value={value || ""}
        placeholder={placeholder}
        rows={2}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`px-1 py-0 rounded outline-none transition-colors duration-150 resize-none w-full max-w-full ${baseStateClasses} ${className}`}
      />
    );
  }

  return (
    <input
      type={type}
      value={value === undefined || value === null ? "" : value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(numeric ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`px-1 py-0 rounded outline-none transition-colors duration-150 w-full max-w-full placeholder:text-gray-300 placeholder:font-normal ${baseStateClasses} ${className}`}
    />
  );
}
