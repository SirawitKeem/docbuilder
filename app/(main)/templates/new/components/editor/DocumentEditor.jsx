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

// Dynamically import CanvasStage with SSR disabled
const CanvasStage = dynamic(() => import("./CanvasStage"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[800px]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-gray-500">กำลังโหลด A4 Studio Engine...</p>
      </div>
    </div>
  ),
});

/**
 * Automatically updates or adds the dynamic Page Number indicator at the bottom right of the A4 page
 */
function syncPageNumberOnCanvas(canvas, pageIdx, totalPages) {
  if (!canvas) return;
  const objs = canvas.getObjects();
  let pageNumObj = objs.find((o) => o.isPageFooterNumber);

  const textVal = `หน้า ${pageIdx + 1} จาก ${totalPages}`;

  if (pageNumObj) {
    pageNumObj.set({ text: textVal });
  } else {
    pageNumObj = new fabric.Textbox(textVal, {
      left: A4_WIDTH - MARGIN_PX - 120,
      top: A4_HEIGHT - 32,
      width: 120,
      fontSize: 10,
      fill: "#94A3B8",
      fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
      textAlign: "right",
      selectable: true,
      hasControls: false,
    });
    pageNumObj.isPageFooterNumber = true;
    canvas.add(pageNumObj);
  }
  canvas.requestRenderAll();
}

export default function DocumentEditor({
  templateName = "เทมเพลตเอกสารใหม่ (A4)",
  categoryName = "Notification Letter",
  onSave,
  saving = false,
}) {
  const [currentTitle, setCurrentTitle] = useState(templateName);
  const [zoom, setZoom] = useState(0.85);
  const [showRuler, setShowRuler] = useState(true);
  const [showMargin, setShowMargin] = useState(true);
  const [activeObject, setActiveObject] = useState(null);
  const [canvasInstance, setCanvasInstance] = useState(null);
  const fabricCanvasRef = useRef(null);

  // 📄 Multi-Page State
  const [pages, setPages] = useState([
    { id: "page-1", json: null },
  ]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const {
    initHistory,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory();

  // Canvas Ready Callback
  const handleCanvasReady = useCallback((canvas) => {
    fabricCanvasRef.current = canvas;
    setCanvasInstance(canvas);

    // Embed initial page footer number
    syncPageNumberOnCanvas(canvas, 0, 1);

    // Initialize history and save initial snapshot into page 1
    initHistory(canvas);
    const initialJson = canvas.toJSON(CUSTOM_CANVAS_PROPS);
    setPages([{ id: "page-1", json: initialJson }]);
  }, [initHistory]);

  const handleHistoryPush = useCallback((canvas) => {
    pushState(canvas);
  }, [pushState]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))));
  const handleZoomReset = () => setZoom(0.85);

  // 📄 Multi-Page Actions

  // 1. Switch Page
  const handleSelectPage = useCallback((targetIndex) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || targetIndex === activePageIndex || targetIndex < 0 || targetIndex >= pages.length) {
      return;
    }

    // Save current active page state
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
        syncPageNumberOnCanvas(canvas, targetIndex, updatedPages.length);
        canvas.renderAll();
        initHistory(canvas); // Clean history stack isolation for target page
      });
    } else {
      canvas.clear();
      canvas.backgroundColor = "#FFFFFF";
      syncPageNumberOnCanvas(canvas, targetIndex, updatedPages.length);
      canvas.renderAll();
      initHistory(canvas);
    }
  }, [activePageIndex, pages, initHistory]);

  // 2. Add Blank Page
  const handleAddPage = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

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
    syncPageNumberOnCanvas(canvas, newIndex, updatedPages.length);
    canvas.renderAll();
    initHistory(canvas);
  }, [activePageIndex, pages, initHistory]);

  // 3. Duplicate Page (Deep JSON Clone)
  const handleDuplicatePage = useCallback((indexToDuplicate) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const currentJson = canvas.toJSON(CUSTOM_CANVAS_PROPS);
    const sourcePage = pages[indexToDuplicate];
    const sourceJson = indexToDuplicate === activePageIndex ? currentJson : sourcePage.json;

    // Deep clone with zero shared memory references
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
      syncPageNumberOnCanvas(canvas, newIndex, updatedPages.length);
      canvas.renderAll();
      initHistory(canvas);
    });
  }, [activePageIndex, pages, initHistory]);

  // 4. Delete Page
  const handleDeletePage = useCallback((indexToDelete) => {
    if (pages.length <= 1) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

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
        syncPageNumberOnCanvas(canvas, newActiveIndex, remainingPages.length);
        canvas.renderAll();
        initHistory(canvas);
      });
    } else {
      canvas.clear();
      canvas.backgroundColor = "#FFFFFF";
      syncPageNumberOnCanvas(canvas, newActiveIndex, remainingPages.length);
      canvas.renderAll();
      initHistory(canvas);
    }
  }, [activePageIndex, pages, initHistory]);

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
      syncPageNumberOnCanvas(canvas, targetIndex, updatedPages.length);
    }
  }, [activePageIndex, pages]);

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
    pushState(canvas);
  }, [pushState]);

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
      pushState(canvas);
    }
  }, [pushState]);

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
      pushState(canvas);
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
  }, [pushState]);

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
    pushState(canvas);
  }, [pushState]);

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
    pushState(canvas);
  }, [pushState]);

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
    }

    if (group) {
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
      pushState(canvas);
    }
  }, [pushState]);

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
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo(canvas);
      }
      // Delete / Backspace active object
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (activeObj) {
          e.preventDefault();
          canvas.remove(activeObj);
          canvas.discardActiveObject();
          canvas.renderAll();
          setActiveObject(null);
          pushState(canvas);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, pushState]);

  // Full Multi-Page Save Payload
  const handleSaveAll = () => {
    if (!onSave) return;
    const canvas = fabricCanvasRef.current;
    const currentJson = canvas ? canvas.toJSON(CUSTOM_CANVAS_PROPS) : null;

    const allPages = pages.map((p, idx) =>
      idx === activePageIndex ? { ...p, json: currentJson } : p
    );

    onSave({
      name: currentTitle,
      categoryName,
      pageCount: allPages.length,
      pages: allPages,
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex flex-col overflow-hidden">
      {/* ── TOP TOOLBAR ── */}
      <TopToolbar
        templateName={currentTitle}
        onUpdateTemplateName={setCurrentTitle}
        categoryName={categoryName}
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
        onUndo={() => undo(fabricCanvasRef.current)}
        onRedo={() => redo(fabricCanvasRef.current)}
        onSave={handleSaveAll}
        saving={saving}
      />

      {/* ── MAIN STUDIO BODY: LEFT SIDEBAR + CANVAS + RIGHT SIDEBAR ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tool Sidebar */}
        <LeftSidebar
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddImage={handleAddImage}
          onAddPreset={handleAddPreset}
          onAddTable={handleAddTable}
          onAddSignature={handleAddSignature}
        />

        {/* Center Canvas Stage + Bottom Pagination Bar */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F1F3F6]">
          <main className="flex-1 overflow-auto flex items-start justify-center p-6">
            <CanvasStage
              zoom={zoom}
              showRuler={showRuler}
              showMargin={showMargin}
              onCanvasReady={handleCanvasReady}
              onHistoryPush={handleHistoryPush}
              onSelectionChange={setActiveObject}
            />
          </main>

          {/* 📑 Bottom Multi-Page Pagination Bar */}
          <PagePaginationBar
            pages={pages}
            activePageIndex={activePageIndex}
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
          onPushHistory={handleHistoryPush}
        />
      </div>
    </div>
  );
}