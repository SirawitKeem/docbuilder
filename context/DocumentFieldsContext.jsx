"use client";

import { createContext, useContext, useState } from "react";

const DocumentFieldsContext = createContext(null);

export function DocumentFieldsProvider({ children, initialValues = {}, defaultReadOnly = false }) {
  const [values, setValues] = useState(initialValues);
  const [readOnly, setReadOnly] = useState(defaultReadOnly);

  const setField = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <DocumentFieldsContext.Provider value={{ values, setField, readOnly, setReadOnly }}>
      {children}
    </DocumentFieldsContext.Provider>
  );
}

export function useDocumentField(id) {
  const ctx = useContext(DocumentFieldsContext);
  if (!ctx) throw new Error("useDocumentField ต้องอยู่ภายใน DocumentFieldsProvider");
  return {
    value: ctx.values[id] || "",
    setValue: (val) => ctx.setField(id, val),
    readOnly: ctx.readOnly,
  };
}

export function useDocumentFields() {
  const ctx = useContext(DocumentFieldsContext);
  if (!ctx) throw new Error("useDocumentFields ต้องอยู่ภายใน DocumentFieldsProvider");
  return ctx;
}