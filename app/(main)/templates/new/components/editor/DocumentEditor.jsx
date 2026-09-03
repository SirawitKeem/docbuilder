"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import * as fabric from "fabric";
import TopToolbar from "./TopToolbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import PagePaginationBar from "./PagePaginationBar";
import { useHistory } from "./hooks/useHistory";
import { A4_WIDTH, A4_HEIGHT, MARGIN_PX } from "./CanvasStage";
import { createDocTable, CUSTOM_CANVAS_PROPS } from "./elements/DocTable";
import { createSignatureBlock } from "./elements/SignatureBlock";
import { createCompanyHeaderBlock, createPartyInfoGrid, createTermsBox } from "./elements/HeaderBlock";
import { applyTokensToCanvas, replaceTokens, revertTokensInPageJson } from "@/lib/tokens/tokenEngine";
import { getCanvasPreset } from "@/lib/editor/canvasPresets";

// Dynamically import CanvasStage with SSR disabled
const CanvasStage = dynamic(() => import("./CanvasStage"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[800px]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-gray-500">กำลังโหลด Studio Engine...</p>
      </div>
    </div>
  ),
});

/**
 * Automatically updates or adds the dynamic Page Number indicator at the bottom right of the page/slide
 */
function syncPageNumberOnCanvas(canvas, pageIdx, totalPages, editorType = "document", preset = null) {
  if (!canvas) return;
  const p = preset || { width: 794, height: 1123, marginPx: 56 };
  const objs = canvas.getObjects();
  const pageNumObjs = objs.filter((o) => o.isPageFooterNumber || o.name === "pageFooterNumber");

  const isSlide = editorType === "slide";
  const textVal = isSlide ? `สไลด์ ${pageIdx + 1} / ${totalPages}` : `หน้า ${pageIdx + 1} จาก ${totalPages}`;

  if (pageNumObjs.length > 0) {
    pageNumObjs[0].set({
      text: textVal,
      isPageFooterNumber: true,
      name: "pageFooterNumber",
    });
    for (let i = 1; i < pageNumObjs.length; i++) {
      canvas.remove(pageNumObjs[i]);
    }
  } else {
    const pageNumObj = new fabric.Textbox(textVal, {
      left: p.width - p.marginPx - 120,
      top: p.height - (isSlide ? 28 : 32),
      width: 120,
      fontSize: 10,
      fill: "#94A3B8",
      fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
      textAlign: "right",
      selectable: true,
      hasControls: false,
    });
    pageNumObj.isPageFooterNumber = true;
    pageNumObj.name = "pageFooterNumber";
    canvas.add(pageNumObj);
  }
  canvas.requestRenderAll();
}

export default function DocumentEditor({
  templateName = "เทมเพลตเอกสารใหม่ (A4)",
  categoryName = "Notification Letter",
  onSave,
  saving = false,
  initialPages = null,
  editorType = "document",
  canvasPreset = "a4-portrait",
}) {
  const preset = getCanvasPreset(canvasPreset);
  const mainContainerRef = useRef(null);
  const [currentTitle, setCurrentTitle] = useState(templateName);
  const [zoom, setZoom] = useState(preset.defaultZoom || (editorType === "slide" ? 0.65 : 0.85));
  const [showRuler, setShowRuler] = useState(true);
  const [showMargin, setShowMargin] = useState(true);
  const [activeObject, setActiveObject] = useState(null);
  const [canvasInstance, setCanvasInstance] = useState(null);
  const [isPreviewTokens, setIsPreviewTokens] = useState(false);
  const fabricCanvasRef = useRef(null);
  const hasUnsavedChangesRef = useRef(false);

  // Sync title when loaded from async fetch (e.g. edit mode)
  useEffect(() => {
    if (templateName) {
      setCurrentTitle(templateName);
    }
  }, [templateName]);

  // 📐 REAL Dynamic Fit-to-Screen Zoom Calculation (Measures actual viewport container)
  const calculateFitZoom = useCallback(() => {
    if (!mainContainerRef.current) return preset.defaultZoom || (editorType === "slide" ? 0.65 : 0.85);
    const containerWidth = mainContainerRef.current.clientWidth;
    const containerHeight = mainContainerRef.current.clientHeight;

    const availableWidth = Math.max(200, containerWidth - 48);
    const availableHeight = Math.max(200, containerHeight - 48);

    const scaleX = availableWidth / preset.width;
    const scaleY = availableHeight / preset.height;
    const fitScale = Math.min(scaleX, scaleY) * 0.92;

    return Math.min(1.4, Math.max(0.3, Number(fitScale.toFixed(2))));
  }, [preset.width, preset.height, preset.defaultZoom, editorType]);

  // Dynamic zoom adjustment ONLY on initial mount or when template preset changes
  useEffect(() => {
    const fit = calculateFitZoom();
    setZoom(fit);

    // Run once after initial DOM render pass to ensure accurate container dimensions
    const timer = setTimeout(() => {
      const refinedFit = calculateFitZoom();
      setZoom(refinedFit);
    }, 60);

    return () => clearTimeout(timer);
  }, [preset.id, editorType]);

  // 📄 Multi-Page State
  const [pages, setPages] = useState(() => {
    if (initialPages && Array.isArray(initialPages) && initialPages.length > 0) {
      return initialPages;
    }
    return [{ id: "page-1", json: null }];
  });
  const [activePageIndex, setActivePageIndex] = useState(0);

  const {
    initHistory,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory();

  // 🛡️ Unsaved-Changes Warning on Tab/Window Close (Phase 7)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = "คุณมีการแก้ไขที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้หรือไม่?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Load initialPages when provided (e.g. from API edit mode)
  useEffect(() => {
    if (initialPages && Array.isArray(initialPages) && initialPages.length > 0) {
      setPages(initialPages);
      if (fabricCanvasRef.current && initialPages[0]?.json) {
        fabricCanvasRef.current.loadFromJSON(initialPages[0].json).then(() => {
          syncPageNumberOnCanvas(fabricCanvasRef.current, 0, initialPages.length, editorType, preset);
          fabricCanvasRef.current.renderAll();
          initHistory(fabricCanvasRef.current);
          hasUnsavedChangesRef.current = false;
        });
      }
    }
  }, [initialPages, initHistory, editorType, preset.id]);

  // Canvas Ready Callback
  const handleCanvasReady = useCallback((canvas) => {
    fabricCanvasRef.current = canvas;
    setCanvasInstance(canvas);

    if (initialPages && Array.isArray(initialPages) && initialPages.length > 0 && initialPages[0]?.json) {
      canvas.loadFromJSON(initialPages[0].json).then(() => {
        syncPageNumberOnCanvas(canvas, 0, initialPages.length, editorType, preset);
        canvas.renderAll();
        initHistory(canvas);
        hasUnsavedChangesRef.current = false;
      });
    } else {
      // Embed initial page footer number
      syncPageNumberOnCanvas(canvas, 0, 1, editorType, preset);
      initHistory(canvas);
      const initialJson = canvas.toJSON(CUSTOM_CANVAS_PROPS);
      setPages([{ id: "page-1", json: initialJson }]);
      hasUnsavedChangesRef.current = false;
    }
  }, [initialPages, initHistory, editorType, preset.id]);

  const handleHistoryPush = useCallback((canvas) => {
    pushState(canvas);
    hasUnsavedChangesRef.current = true;
  }, [pushState]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(2))));
  const handleZoomReset = () => {
    const fit = calculateFitZoom();
    setZoom(fit);
  };

  // 🏷️ Toggle Live Data Preview
  const handleTogglePreviewTokens = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const nextPreviewState = !isPreviewTokens;
    setIsPreviewTokens(nextPreviewState);
    applyTokensToCanvas(canvas, nextPreviewState);
  }, [isPreviewTokens]);

  // 🏷️ Insert Token into Active Textbox or create new Token field
  const handleInsertToken = useCallback((tokenKey, exampleVal) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();

    // 1. If currently selecting a Textbox
    if (activeObj && (activeObj.type === "textbox" || activeObj.type === "i-text" || activeObj.type === "text")) {
      const currentText = activeObj.text || "";
      const newText = currentText ? `${currentText} ${tokenKey}` : tokenKey;
      activeObj.set("text", newText);
      activeObj.rawTemplateText = newText;
      activeObj.isTokenField = true;
      activeObj.tokenKey = tokenKey;
      canvas.requestRenderAll();
      handleHistoryPush(canvas);
      return;
    }

    // 2. If currently selecting a DocTable
    if (activeObj && activeObj.isDocTable && activeObj.addRow) {
      activeObj.addRow({
        desc: `บริการตามสัญญาสำหรับ ${tokenKey}`,
        qty: 1,
        price: 50000,
      });
      handleHistoryPush(canvas);
      return;
    }

    // 3. Otherwise add new standalone dynamic token textbox
    const tokenBox = new fabric.Textbox(tokenKey, {
      left: MARGIN_PX + 20,
      top: MARGIN_PX + 60,
      width: 280,
      fontSize: 13,
      fontWeight: "bold",
      fill: "#4338CA",
      fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
      editable: true,
    });
    tokenBox.isTokenField = true;
    tokenBox.tokenKey = tokenKey;
    tokenBox.rawTemplateText = tokenKey;

    canvas.add(tokenBox);
    canvas.setActiveObject(tokenBox);
    canvas.requestRenderAll();
    handleHistoryPush(canvas);
  }, [handleHistoryPush]);

  // 📄 Multi-Page Actions

  // 1. Switch Page
  const handleSelectPage = useCallback((targetIndex) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || targetIndex === activePageIndex || targetIndex < 0 || targetIndex >= pages.length) {
      return;
    }

    // Always restore raw tokens before capturing snapshot
    if (isPreviewTokens) {
      applyTokensToCanvas(canvas, false);
      setIsPreviewTokens(false);
    }

    const currentJson = canvas.toJSON(CUSTOM_CANVAS_PROPS);
    const updatedPages = pages.map((p, idx) =>
      idx === activePageIndex ? { ...p, json: currentJson } : p
    );

    setPages(updatedPages);
    setActivePageIndex(targetIndex);
    setActiveObject(null);

    // Load target page
    const targetPageJson = updatedPages[targetIndex].json;
    if (targetPageJson) {
      canvas.loadFromJSON(targetPageJson).then(() => {
        syncPageNumberOnCanvas(canvas, targetIndex, updatedPages.length, editorType, preset);
        canvas.renderAll();
        initHistory(canvas);
      });
    } else {
      canvas.clear();
      canvas.backgroundColor = "#FFFFFF";
      syncPageNumberOnCanvas(canvas, targetIndex, updatedPages.length, editorType, preset);
      canvas.renderAll();
      initHistory(canvas);
    }
  }, [activePageIndex, pages, initHistory, isPreviewTokens, editorType, preset.id]);

  // 2. Add Blank Page
  const handleAddPage = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (isPreviewTokens) {
      applyTokensToCanvas(canvas, false);
      setIsPreviewTokens(false);
    }

    const currentJson = canvas.toJSON(CUSTOM_CANVAS_PROPS);
    const newPageId = `page-${Date.now()}`;
    const blankJson = { version: "6.5.0", objects: [] };

    const updatedPages = [
      ...pages.map((p, idx) => (idx === activePageIndex ? { ...p, json: currentJson } : p)),
      { id: newPageId, json: blankJson },
    ];

    const newIndex = updatedPages.length - 1;
    setPages(updatedPages);
    setActivePageIndex(newIndex);
    setActiveObject(null);

    canvas.clear();
    canvas.backgroundColor = "#FFFFFF";
    syncPageNumberOnCanvas(canvas, newIndex, updatedPages.length, editorType, preset);
    canvas.renderAll();
    initHistory(canvas);
    hasUnsavedChangesRef.current = true;
  }, [activePageIndex, pages, initHistory, isPreviewTokens, editorType, preset.id]);

  // 3. Duplicate Page (Deep JSON Clone)
  const handleDuplicatePage = useCallback((indexToDuplicate) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (isPreviewTokens) {
      applyTokensToCanvas(canvas, false);
      setIsPreviewTokens(false);
    }

    const currentJson = canvas.toJSON(CUSTOM_CANVAS_PROPS);
    const sourcePage = pages[indexToDuplicate];
    const sourceJson = indexToDuplicate === activePageIndex ? currentJson : sourcePage.json;

    const duplicatedPage = {
      id: `page-${Date.now()}`,
      json: JSON.parse(JSON.stringify(sourceJson)),
    };

    const updatedPages = [...pages];
    if (activePageIndex === indexToDuplicate) {
      updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], json: currentJson };
    }
    updatedPages.splice(indexToDuplicate + 1, 0, duplicatedPage);

    const newIndex = indexToDuplicate + 1;
    setPages(updatedPages);
    setActivePageIndex(newIndex);
    setActiveObject(null);

    canvas.loadFromJSON(duplicatedPage.json).then(() => {
      syncPageNumberOnCanvas(canvas, newIndex, updatedPages.length, editorType, preset);
      canvas.renderAll();
      initHistory(canvas);
      hasUnsavedChangesRef.current = true;
    });
  }, [activePageIndex, pages, initHistory, isPreviewTokens, editorType, preset.id]);

  // 4. Delete Page
  const handleDeletePage = useCallback((indexToDelete) => {
    if (pages.length <= 1) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (isPreviewTokens) {
      applyTokensToCanvas(canvas, false);
      setIsPreviewTokens(false);
    }

    const remainingPages = pages.filter((_, idx) => idx !== indexToDelete);
    const newActiveIndex = Math.min(
      remainingPages.length - 1,
      activePageIndex >= indexToDelete ? Math.max(0, activePageIndex - 1) : activePageIndex
    );

    setPages(remainingPages);
    setActivePageIndex(newActiveIndex);
    setActiveObject(null);

    const targetJson = remainingPages[newActiveIndex].json;
    if (targetJson) {
      canvas.loadFromJSON(targetJson).then(() => {
        syncPageNumberOnCanvas(canvas, newActiveIndex, remainingPages.length, editorType, preset);
        canvas.renderAll();
        initHistory(canvas);
        hasUnsavedChangesRef.current = true;
      });
    } else {
      canvas.clear();
      canvas.backgroundColor = "#FFFFFF";
      syncPageNumberOnCanvas(canvas, newActiveIndex, remainingPages.length, editorType, preset);
      canvas.renderAll();
      initHistory(canvas);
      hasUnsavedChangesRef.current = true;
    }
  }, [activePageIndex, pages, initHistory, isPreviewTokens, editorType, preset.id]);

  // 5. Move Page Order
  const handleMovePage = useCallback((currentIndex, direction) => {
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    const canvas = fabricCanvasRef.current;

    const currentJson = canvas ? canvas.toJSON(CUSTOM_CANVAS_PROPS) : null;
    const updatedPages = pages.map((p, idx) =>
      idx === activePageIndex ? { ...p, json: currentJson } : p
    );

    const temp = updatedPages[currentIndex];
    updatedPages[currentIndex] = updatedPages[targetIndex];
    updatedPages[targetIndex] = temp;

    setPages(updatedPages);
    setActivePageIndex(targetIndex);

    if (canvas) {
      syncPageNumberOnCanvas(canvas, targetIndex, updatedPages.length, editorType, preset);
    }
    hasUnsavedChangesRef.current = true;
  }, [activePageIndex, pages, editorType, preset.id]);

  // 🔤 Add Text
  const handleAddText = useCallback((options) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const textbox = new fabric.Textbox(options.text || "ข้อความตัวอย่าง", {
      left: MARGIN_PX + 20,
      top: MARGIN_PX + 40,
      width: options.width || 320,
      fontSize: options.fontSize || 14,
      fontWeight: options.fontWeight || "normal",
      fill: options.fill || "#111827",
      fontFamily: options.fontFamily || "'Noto Sans Thai', 'Noto Sans', sans-serif",
      editable: true,
    });

    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
    handleHistoryPush(canvas);
  }, [handleHistoryPush]);

  // 🔷 Add Shape
  const handleAddShape = useCallback((options) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let shapeObj = null;

    if (options.type === "rect") {
      shapeObj = new fabric.Rect({
        left: MARGIN_PX + 20,
        top: MARGIN_PX + 40,
        width: options.width || 240,
        height: options.height || 100,
        fill: options.fill || "#F3F4F6",
        stroke: options.stroke || "#9CA3AF",
        strokeWidth: options.strokeWidth || 1,
        rx: options.rx || 0,
        ry: options.rx || 0,
      });
    } else if (options.type === "circle") {
      shapeObj = new fabric.Circle({
        left: MARGIN_PX + 20,
        top: MARGIN_PX + 40,
        radius: options.radius || 40,
        fill: options.fill || "#EEF2FF",
        stroke: options.stroke || "#6366F1",
        strokeWidth: 2,
      });
    } else if (options.type === "line") {
      shapeObj = new fabric.Line([0, 0, options.width || 300, 0], {
        left: MARGIN_PX + 20,
        top: MARGIN_PX + 60,
        stroke: options.stroke || "#9CA3AF",
        strokeWidth: 1.5,
      });
    }

    if (shapeObj) {
      canvas.add(shapeObj);
      canvas.setActiveObject(shapeObj);
      canvas.renderAll();
      handleHistoryPush(canvas);
    }
  }, [handleHistoryPush]);

  // 📁 Add Image / Logo
  const handleAddImage = useCallback((imageUrl) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const applyImage = (img) => {
      const maxWidth = 300;
      if (img.width > maxWidth) {
        const scale = maxWidth / img.width;
        img.scale(scale);
      }
      img.set({
        left: MARGIN_PX + 20,
        top: MARGIN_PX + 20,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      handleHistoryPush(canvas);
    };

    if (fabric.FabricImage && fabric.FabricImage.fromURL) {
      fabric.FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" })
        .then(applyImage)
        .catch((err) => console.error("Image load error:", err));
    } else if (fabric.Image && fabric.Image.fromURL) {
      fabric.Image.fromURL(
        imageUrl,
        (img) => applyImage(img),
        { crossOrigin: "anonymous" }
      );
    }
  }, [handleHistoryPush]);

  // 📊 Add Quotation / Pricing Table
  const handleAddTable = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const tableGroup = createDocTable({
      left: MARGIN_PX,
      top: 320,
      width: A4_WIDTH - MARGIN_PX * 2,
      primaryColor: "#2563EB",
      rowCount: 3,
    });

    canvas.add(tableGroup);
    canvas.setActiveObject(tableGroup);
    canvas.renderAll();
    handleHistoryPush(canvas);
  }, [handleHistoryPush]);

  // ✍️ Add Signature Block
  const handleAddSignature = useCallback((type = "dual") => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const sigGroup = createSignatureBlock({
      type,
      left: MARGIN_PX,
      top: 860,
      width: A4_WIDTH - MARGIN_PX * 2,
      primaryColor: "#1E293B",
    });

    canvas.add(sigGroup);
    canvas.setActiveObject(sigGroup);
    canvas.renderAll();
    handleHistoryPush(canvas);
  }, [handleHistoryPush]);

  // 📑 Add Preset Block
  const handleAddPreset = useCallback((presetKey) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let group = null;

    if (presetKey === "company_header") {
      group = createCompanyHeaderBlock({
        left: MARGIN_PX,
        top: MARGIN_PX,
        width: A4_WIDTH - MARGIN_PX * 2,
      });
    } else if (presetKey === "party_info") {
      group = createPartyInfoGrid({
        left: MARGIN_PX,
        top: 150,
        width: A4_WIDTH - MARGIN_PX * 2,
      });
    } else if (presetKey === "terms_box") {
      group = createTermsBox({
        left: MARGIN_PX,
        top: 680,
        width: A4_WIDTH - MARGIN_PX * 2,
      });
    } else if (presetKey === "slide_title_subtitle") {
      const title = new fabric.IText("หัวข้อการนำเสนอหลัก (Presentation Title)", {
        left: 80,
        top: 220,
        fontSize: 42,
        fontFamily: "'Noto Sans Thai', sans-serif",
        fontWeight: "bold",
        fill: "#0F172A",
      });
      const subtitle = new fabric.IText("คำอธิบายหรือสาระสำคัญสำหรับการบรรยายในสไลด์นี้", {
        left: 80,
        top: 290,
        fontSize: 22,
        fontFamily: "'Noto Sans Thai', sans-serif",
        fill: "#64748B",
      });
      group = new fabric.Group([title, subtitle], { left: 80, top: 220 });
    } else if (presetKey === "slide_two_column") {
      const card1Bg = new fabric.Rect({ left: 80, top: 180, width: 520, height: 420, fill: "#F8FAFC", stroke: "#CBD5E1", rx: 16, ry: 16 });
      const card1Title = new fabric.IText("ประเด็นที่ 1 (Topic A)", { left: 110, top: 210, fontSize: 24, fontWeight: "bold", fill: "#1E293B" });
      const card1Body = new fabric.IText("• รายละเอียดและข้อสังเกตสำคัญ\n• ปัจจัยที่ส่งผลต่อการดำเนินการ\n• ผลลัพธ์เชิงบวกที่คาดว่าจะได้รับ", { left: 110, top: 260, fontSize: 18, fill: "#475569", lineHeight: 1.5 });

      const card2Bg = new fabric.Rect({ left: 660, top: 180, width: 520, height: 420, fill: "#F8FAFC", stroke: "#CBD5E1", rx: 16, ry: 16 });
      const card2Title = new fabric.IText("ประเด็นที่ 2 (Topic B)", { left: 690, top: 210, fontSize: 24, fontWeight: "bold", fill: "#1E293B" });
      const card2Body = new fabric.IText("• แผนงานและขั้นตอนการทดสอบ\n• การบริหารความเสี่ยงในโครงการ\n• กำหนดการส่งมอบงานขั้นสุดท้าย", { left: 690, top: 260, fontSize: 18, fill: "#475569", lineHeight: 1.5 });

      group = new fabric.Group([card1Bg, card1Title, card1Body, card2Bg, card2Title, card2Body], { left: 80, top: 180 });
    } else if (presetKey === "slide_stat_callout") {
      const cardBg = new fabric.Rect({ left: 340, top: 200, width: 600, height: 320, fill: "#EEF2FF", stroke: "#C7D2FE", strokeWidth: 2, rx: 24, ry: 24 });
      const statNum = new fabric.IText("+185%", { left: 490, top: 240, fontSize: 72, fontWeight: "bold", fill: "#4F46E5" });
      const statLabel = new fabric.IText("อัตราการเติบโตของยอดขายรายไตรมาส (Quarterly Growth)", { left: 400, top: 350, fontSize: 20, fill: "#3730A3" });
      const statSub = new fabric.IText("เปรียบเทียบกับเป้าหมายประจำปี 2026", { left: 470, top: 400, fontSize: 16, fill: "#6366F1" });
      group = new fabric.Group([cardBg, statNum, statLabel, statSub], { left: 340, top: 200 });
    } else if (presetKey === "slide_bullets") {
      const t1 = new fabric.IText("✔ 1. สรุปภาพรวมและกลยุทธ์สำคัญขององค์กร", { left: 120, top: 200, fontSize: 24, fontWeight: "bold", fill: "#1E293B" });
      const t2 = new fabric.IText("✔ 2. ทิศทางการพัฒนาเทคโนโลยีและระบบอัตโนมัติ", { left: 120, top: 280, fontSize: 24, fontWeight: "bold", fill: "#1E293B" });
      const t3 = new fabric.IText("✔ 3. แผนการวัดผลและการรักษาเสถียรภาพระบบ 24/7", { left: 120, top: 360, fontSize: 24, fontWeight: "bold", fill: "#1E293B" });
      group = new fabric.Group([t1, t2, t3], { left: 120, top: 200 });
    }

    if (group) {
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
      handleHistoryPush(canvas);
    }
  }, [handleHistoryPush]);

  // Keyboard Shortcuts: Ctrl+Z, Ctrl+Y, Delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      const activeObj = canvas.getActiveObject();
      if (activeObj && activeObj.isEditing) {
        return;
      }

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo(canvas);
        hasUnsavedChangesRef.current = true;
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo(canvas);
        hasUnsavedChangesRef.current = true;
      }
      // Delete / Backspace active object
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (activeObj) {
          e.preventDefault();
          canvas.remove(activeObj);
          canvas.discardActiveObject();
          canvas.renderAll();
          setActiveObject(null);
          handleHistoryPush(canvas);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, handleHistoryPush]);

  // 🛡️ Full Multi-Page Save Payload with 100% Guaranteed Raw Token Preservation Across ALL Pages
  const handleSaveAll = () => {
    if (!onSave) return;
    const canvas = fabricCanvasRef.current;

    // 1. Always force-restore raw tokens on active canvas before capturing final JSON
    if (canvas) {
      applyTokensToCanvas(canvas, false);
      setIsPreviewTokens(false);
    }

    const currentJson = canvas ? canvas.toJSON(CUSTOM_CANVAS_PROPS) : null;

    // 2. 🛡️ CRITICAL MULTI-PAGE GUARD:
    // Strip mock preview values and force raw tokens across EVERY SINGLE PAGE in the document tree
    const allPages = pages.map((p, idx) => {
      const pageJson = idx === activePageIndex ? currentJson : p.json;
      return {
        ...p,
        json: revertTokensInPageJson(pageJson),
      };
    });

    hasUnsavedChangesRef.current = false;

    onSave({
      name: currentTitle,
      categoryName,
      editorType: editorType || "document",
      canvasPreset: canvasPreset || (editorType === "slide" ? "slide-16-9" : "a4-portrait"),
      pageCount: allPages.length,
      pages: allPages,
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex flex-col overflow-hidden">
      {/* ── TOP TOOLBAR ── */}
      <TopToolbar
        templateName={currentTitle}
        onUpdateTemplateName={(newTitle) => {
          setCurrentTitle(newTitle);
          hasUnsavedChangesRef.current = true;
        }}
        categoryName={categoryName}
        editorType={editorType}
        canvasPreset={preset.id}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        showRuler={showRuler}
        onToggleRuler={() => setShowRuler(!showRuler)}
        showMargin={showMargin}
        onToggleMargin={() => setShowMargin(!showMargin)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => {
          undo(fabricCanvasRef.current);
          hasUnsavedChangesRef.current = true;
        }}
        onRedo={() => {
          redo(fabricCanvasRef.current);
          hasUnsavedChangesRef.current = true;
        }}
        onSave={handleSaveAll}
        saving={saving}
        isPreviewTokens={isPreviewTokens}
        onTogglePreviewTokens={handleTogglePreviewTokens}
      />

      {/* ── MAIN STUDIO BODY: LEFT SIDEBAR + CANVAS + RIGHT SIDEBAR ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tool Sidebar */}
        <LeftSidebar
          editorType={editorType}
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddImage={handleAddImage}
          onAddPreset={handleAddPreset}
          onAddTable={handleAddTable}
          onAddSignature={handleAddSignature}
          onInsertToken={handleInsertToken}
        />

        {/* Center Canvas Stage + Bottom Pagination Bar */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F1F3F6]">
          <main ref={mainContainerRef} className="flex-1 overflow-auto flex items-start justify-center p-6">
            <CanvasStage
              zoom={zoom}
              showRuler={showRuler}
              showMargin={showMargin}
              canvasPreset={preset.id}
              onCanvasReady={handleCanvasReady}
              onHistoryPush={handleHistoryPush}
              onSelectionChange={setActiveObject}
            />
          </main>

          {/* 📑 Bottom Multi-Page Pagination Bar */}
          <PagePaginationBar
            pages={pages}
            activePageIndex={activePageIndex}
            editorType={editorType}
            onSelectPage={handleSelectPage}
            onAddPage={handleAddPage}
            onDuplicatePage={handleDuplicatePage}
            onDeletePage={handleDeletePage}
            onMovePage={handleMovePage}
          />
        </div>

        {/* Right Properties & Layers Sidebar */}
        <RightSidebar
          canvas={canvasInstance}
          activeObject={activeObject}
          canvasPreset={preset.id}
          onPushHistory={handleHistoryPush}
        />
      </div>
    </div>
  );
}