"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Layers,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  ArrowUp,
  ArrowDown,
  Square,
  Plus,
  Table as TableIcon,
} from "lucide-react";
import { getCanvasPreset } from "@/lib/editor/canvasPresets";

export default function RightSidebar({
  canvas,
  activeObject,
  onPushHistory,
  canvasPreset = "a4-portrait",
}) {
  const preset = getCanvasPreset(canvasPreset);
  const [activeTab, setActiveTab] = useState("properties");
  const [layersList, setLayersList] = useState([]);

  const [propsState, setPropsState] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    angle: 0,
    opacity: 1,
    fill: "#000000",
    stroke: "#000000",
    strokeWidth: 0,
    rx: 0,
    text: "",
    fontSize: 14,
    fontFamily: "'Noto Sans Thai', sans-serif",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left",
    lineHeight: 1.2,
    locked: false,
    visible: true,
  });

  // Sync state when activeObject changes
  useEffect(() => {
    if (!activeObject) return;

    const isText = activeObject.type === "textbox" || activeObject.type === "i-text" || activeObject.type === "text";
    const scaledWidth = activeObject.getScaledWidth ? activeObject.getScaledWidth() : (activeObject.width || 0) * (activeObject.scaleX || 1);
    const scaledHeight = activeObject.getScaledHeight ? activeObject.getScaledHeight() : (activeObject.height || 0) * (activeObject.scaleY || 1);

    setPropsState({
      left: Math.round(activeObject.left || 0),
      top: Math.round(activeObject.top || 0),
      width: Math.round(scaledWidth),
      height: Math.round(scaledHeight),
      angle: Math.round(activeObject.angle || 0),
      opacity: activeObject.opacity !== undefined ? activeObject.opacity : 1,
      fill: typeof activeObject.fill === "string" ? activeObject.fill : "#4F46E5",
      stroke: activeObject.stroke || "#000000",
      strokeWidth: activeObject.strokeWidth || 0,
      rx: activeObject.rx || 0,
      text: isText ? activeObject.text : "",
      fontSize: isText ? activeObject.fontSize || 14 : 14,
      fontFamily: isText ? activeObject.fontFamily || "'Noto Sans Thai', sans-serif" : "'Noto Sans Thai', sans-serif",
      fontWeight: isText ? (activeObject.fontWeight === "bold" || activeObject.fontWeight >= 700 ? "bold" : "normal") : "normal",
      fontStyle: isText ? activeObject.fontStyle || "normal" : "normal",
      underline: isText ? Boolean(activeObject.underline) : false,
      textAlign: isText ? activeObject.textAlign || "left" : "left",
      lineHeight: isText ? activeObject.lineHeight || 1.2 : 1.2,
      locked: Boolean(activeObject.lockMovementX),
      visible: activeObject.visible !== false,
    });
  }, [activeObject]);

  // Refresh Layers List whenever canvas changes or after Undo/Redo
  const refreshLayers = () => {
    if (!canvas) return;
    const objs = canvas.getObjects();
    setLayersList([...objs].reverse());
  };

  useEffect(() => {
    if (!canvas) return;
    refreshLayers();

    const handleCanvasChange = () => refreshLayers();
    canvas.on("object:added", handleCanvasChange);
    canvas.on("object:removed", handleCanvasChange);
    canvas.on("object:modified", handleCanvasChange);

    return () => {
      canvas.off("object:added", handleCanvasChange);
      canvas.off("object:removed", handleCanvasChange);
      canvas.off("object:modified", handleCanvasChange);
    };
  }, [canvas]);

  const applyProperty = (key, value) => {
    if (!canvas || !activeObject) return;

    if (key === "width" || key === "height") {
      if (activeObject.type === "textbox") {
        activeObject.set(key, Number(value));
      } else {
        if (key === "width") activeObject.scaleToWidth(Number(value));
        if (key === "height") activeObject.scaleToHeight(Number(value));
      }
    } else {
      activeObject.set(key, value);
    }

    setPropsState((prev) => ({ ...prev, [key]: value }));
    canvas.requestRenderAll();
    if (onPushHistory) onPushHistory(canvas);
  };

  // 100% Zoom-Independent Alignment using getScaledWidth() / getScaledHeight()
  const handleAlign = (type) => {
    if (!canvas || !activeObject) return;

    // Use unscaled native A4 dimension metrics
    const objWidth = activeObject.getScaledWidth ? activeObject.getScaledWidth() : (activeObject.width || 0) * (activeObject.scaleX || 1);
    const objHeight = activeObject.getScaledHeight ? activeObject.getScaledHeight() : (activeObject.height || 0) * (activeObject.scaleY || 1);

    switch (type) {
      case "left":
        activeObject.set("left", preset.marginPx);
        break;
      case "center":
        activeObject.set("left", (preset.width - objWidth) / 2);
        break;
      case "right":
        activeObject.set("left", preset.width - preset.marginPx - objWidth);
        break;
      case "top":
        activeObject.set("top", preset.marginPx);
        break;
      case "middle":
        activeObject.set("top", (preset.height - objHeight) / 2);
        break;
      case "bottom":
        activeObject.set("top", preset.height - preset.marginPx - objHeight);
        break;
    }

    setPropsState((prev) => ({
      ...prev,
      left: Math.round(activeObject.left),
      top: Math.round(activeObject.top),
    }));
    activeObject.setCoords();
    canvas.requestRenderAll();
    if (onPushHistory) onPushHistory(canvas);
  };

  const handleBringForward = (obj = activeObject) => {
    if (!canvas || !obj) return;
    if (canvas.bringObjectForward) canvas.bringObjectForward(obj);
    else if (canvas.bringForward) canvas.bringForward(obj);
    canvas.requestRenderAll();
    refreshLayers();
    if (onPushHistory) onPushHistory(canvas);
  };

  const handleSendBackward = (obj = activeObject) => {
    if (!canvas || !obj) return;
    if (canvas.sendObjectBackwards) canvas.sendObjectBackwards(obj);
    else if (canvas.sendBackwards) canvas.sendBackwards(obj);
    canvas.requestRenderAll();
    refreshLayers();
    if (onPushHistory) onPushHistory(canvas);
  };

  // Toggle Lock: Keeps selectable=true so object can be clicked and unlocked anytime
  const handleToggleLock = (obj = activeObject) => {
    if (!canvas || !obj) return;
    const isLocked = !obj.lockMovementX;
    obj.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockRotation: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
      hasControls: !isLocked,
      selectable: true, // Always selectable so it can be selected and unlocked
    });
    setPropsState((prev) => ({ ...prev, locked: isLocked }));
    canvas.requestRenderAll();
    refreshLayers();
    if (onPushHistory) onPushHistory(canvas);
  };

  const handleToggleVisibility = (obj = activeObject) => {
    if (!canvas || !obj) return;
    const isVisible = obj.visible !== false;
    obj.set("visible", !isVisible);
    if (isVisible) canvas.discardActiveObject();
    canvas.requestRenderAll();
    refreshLayers();
    if (onPushHistory) onPushHistory(canvas);
  };

  const handleDelete = (obj = activeObject) => {
    if (!canvas || !obj) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    refreshLayers();
    if (onPushHistory) onPushHistory(canvas);
  };

  const isText = activeObject && (activeObject.type === "textbox" || activeObject.type === "i-text" || activeObject.type === "text");
  const isShape = activeObject && (activeObject.type === "rect" || activeObject.type === "circle" || activeObject.type === "line");
  const isDocTable = activeObject && (activeObject.isDocTable || activeObject.type === "DocTable" || activeObject.type === "docTable");

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-53px)] select-none z-20 shrink-0 shadow-xs">
      <div className="flex border-b border-gray-200 bg-gray-50/70 p-1 gap-1">
        <button
          onClick={() => setActiveTab("properties")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "properties" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>คุณสมบัติ (Properties)</span>
        </button>

        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "layers" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>เลเยอร์ ({layersList.length})</span>
        </button>
      </div>

      {activeTab === "properties" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {!activeObject ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Square className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">ยังไม่ได้เลือกวัตถุ</p>
                <p className="text-gray-400 text-[11px] mt-0.5">คลิกที่วัตถุบนหน้ากระดาษ A4 เพื่อปรับแต่ง</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-left space-y-1.5 mt-4">
                <div className="flex justify-between text-gray-500">
                  <span>ประเภท / ขนาด:</span>
                  <span className="font-mono font-semibold text-gray-800">{preset.name}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>พิกเซล (96 DPI):</span>
                  <span className="font-mono font-semibold text-gray-800">{preset.width} × {preset.height} px</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>ระยะขอบ (Margin):</span>
                  <span className="font-mono font-semibold text-rose-500">{preset.mmWidth ? `15 mm (${preset.marginPx} px)` : `${preset.marginPx} px`}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-bold text-gray-900 text-sm">
                  {isDocTable
                    ? "📊 ตารางใบเสนอราคา (DocTable)"
                    : isText
                    ? "🔤 ข้อความ (Text)"
                    : isShape
                    ? "🔷 รูปทรง (Shape)"
                    : "🖼️ รูปภาพ (Image)"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleLock()}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      propsState.locked ? "bg-amber-50 text-amber-600 border-amber-200" : "text-gray-500 hover:bg-gray-100 border-gray-200"
                    }`}
                    title={propsState.locked ? "ปลดล็อกวัตถุ" : "ล็อกวัตถุ"}
                  >
                    {propsState.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete()}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="ลบวัตถุ (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── DOCTABLE DYNAMIC ROW CONTROLS ── */}
              {isDocTable && (
                <div className="space-y-3 p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                      <TableIcon className="w-4 h-4 text-blue-600" />
                      <span>จัดการแถวตาราง</span>
                    </span>
                    <span className="text-[11px] font-semibold text-blue-800 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-200">
                      {activeObject.docTableData?.items?.length || 0} แถว
                    </span>
                  </div>

                  {/* Add / Remove Row Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        activeObject.addRow();
                        if (onPushHistory) onPushHistory(canvas);
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มแถว (+)</span>
                    </button>

                    <button
                      onClick={() => {
                        activeObject.removeRow();
                        if (onPushHistory) onPushHistory(canvas);
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>ลบแถว (-)</span>
                    </button>
                  </div>

                  {/* Header Color Picker & VAT Toggle */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/60">
                    <div>
                      <label className="text-[10px] text-blue-900 font-semibold mb-1 block">สีหัวตาราง</label>
                      <div className="flex items-center gap-1.5 bg-white border border-blue-200 rounded-lg p-1">
                        <input
                          type="color"
                          value={activeObject.docTableData?.themeColor || "#2563EB"}
                          onChange={(e) => {
                            activeObject.setThemeColor(e.target.value);
                            if (onPushHistory) onPushHistory(canvas);
                          }}
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="font-mono text-[10px] text-blue-900 uppercase truncate">
                          {activeObject.docTableData?.themeColor || "#2563EB"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-blue-900 font-semibold mb-1 block">ภาษีมูลค่าเพิ่ม</label>
                      <select
                        value={activeObject.docTableData?.vatRate !== undefined ? activeObject.docTableData.vatRate : 7}
                        onChange={(e) => {
                          activeObject.setVatRate(Number(e.target.value));
                          if (onPushHistory) onPushHistory(canvas);
                        }}
                        className="w-full bg-white border border-blue-200 rounded-lg px-2 py-1.5 text-xs font-bold text-blue-900 outline-none cursor-pointer"
                      >
                        <option value={7}>VAT 7%</option>
                        <option value={0}>VAT 0% (ยกเว้น)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {isText && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">แบบอักษรและการจัดวาง</h3>
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">ฟอนต์ (Font Family)</label>
                    <select
                      value={propsState.fontFamily}
                      onChange={(e) => applyProperty("fontFamily", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="'Noto Sans Thai', sans-serif">Noto Sans Thai (มาตรฐาน)</option>
                      <option value="'Noto Sans Thai Looped', sans-serif">Noto Sans Thai Looped (ทางการ)</option>
                      <option value="'Sarabun', sans-serif">Sarabun (สารบรรณ)</option>
                      <option value="'Inter', sans-serif">Inter (Modern Sans)</option>
                      <option value="monospace">Monospace (รหัส/ตัวเลข)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">ขนาด (Size)</label>
                      <input
                        type="number"
                        min="8"
                        max="120"
                        value={propsState.fontSize}
                        onChange={(e) => applyProperty("fontSize", Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">สีตัวอักษร (Color)</label>
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <input
                          type="color"
                          value={propsState.fill}
                          onChange={(e) => applyProperty("fill", e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="font-mono text-[11px] text-gray-600 uppercase truncate">{propsState.fill}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-1">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => applyProperty("fontWeight", propsState.fontWeight === "bold" ? "normal" : "bold")}
                        className={`p-1.5 rounded cursor-pointer ${
                          propsState.fontWeight === "bold" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        title="ตัวหนา (Bold)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => applyProperty("fontStyle", propsState.fontStyle === "italic" ? "normal" : "italic")}
                        className={`p-1.5 rounded cursor-pointer ${
                          propsState.fontStyle === "italic" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        title="ตัวเอียง (Italic)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => applyProperty("underline", !propsState.underline)}
                        className={`p-1.5 rounded cursor-pointer ${
                          propsState.underline ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        title="ขีดเส้นใต้ (Underline)"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="h-4 w-px bg-gray-300" />

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => applyProperty("textAlign", "left")}
                        className={`p-1.5 rounded cursor-pointer ${
                          propsState.textAlign === "left" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        title="ชิดซ้าย"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => applyProperty("textAlign", "center")}
                        className={`p-1.5 rounded cursor-pointer ${
                          propsState.textAlign === "center" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        title="กึ่งกลาง"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => applyProperty("textAlign", "right")}
                        className={`p-1.5 rounded cursor-pointer ${
                          propsState.textAlign === "right" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        title="ชิดขวา"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isShape && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">สีพื้นหลังและเส้นขอบ</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">สีพื้นหลัง (Fill)</label>
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <input
                          type="color"
                          value={propsState.fill}
                          onChange={(e) => applyProperty("fill", e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="font-mono text-[11px] text-gray-600 uppercase truncate">{propsState.fill}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">สีเส้นขอบ (Stroke)</label>
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <input
                          type="color"
                          value={propsState.stroke}
                          onChange={(e) => applyProperty("stroke", e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="font-mono text-[11px] text-gray-600 uppercase truncate">{propsState.stroke}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-500 mb-1 block">ความหนาขอบ (px)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={propsState.strokeWidth}
                        onChange={(e) => applyProperty("strokeWidth", Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    {activeObject.type === "rect" && (
                      <div>
                        <label className="text-[11px] text-gray-500 mb-1 block">ความโค้งมน (Radius)</label>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={propsState.rx}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            activeObject.set("ry", val);
                            applyProperty("rx", val);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h3 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">ตำแหน่งและขนาด</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">พิกัด X (ซ้าย - px)</label>
                    <input
                      type="number"
                      value={propsState.left}
                      onChange={(e) => applyProperty("left", Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-800 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">พิกัด Y (บน - px)</label>
                    <input
                      type="number"
                      value={propsState.top}
                      onChange={(e) => applyProperty("top", Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-800 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>ความโปร่งใส (Opacity)</span>
                    <span className="font-mono font-bold">{Math.round(propsState.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={propsState.opacity}
                    onChange={(e) => applyProperty("opacity", Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-500 mb-1.5 block">จัดตำแหน่งบนหน้ากระดาษ A4</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleAlign("left")}
                      className="py-1.5 px-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      ชิดซ้าย
                    </button>
                    <button
                      onClick={() => handleAlign("center")}
                      className="py-1.5 px-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      กึ่งกลางแนวนอน
                    </button>
                    <button
                      onClick={() => handleAlign("right")}
                      className="py-1.5 px-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      ชิดขวา
                    </button>
                    <button
                      onClick={() => handleAlign("top")}
                      className="py-1.5 px-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      ชิดบน
                    </button>
                    <button
                      onClick={() => handleAlign("middle")}
                      className="py-1.5 px-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      กึ่งกลางแนวตั้ง
                    </button>
                    <button
                      onClick={() => handleAlign("bottom")}
                      className="py-1.5 px-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      ชิดล่าง
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[11px] text-gray-500 mb-1.5 block">ลำดับชั้น (Layer Stacking)</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleBringForward()}
                      className="flex items-center justify-center gap-1 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[11px] font-medium cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>ขยับขึ้น 1 ชั้น</span>
                    </button>
                    <button
                      onClick={() => handleSendBackward()}
                      className="flex items-center justify-center gap-1 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[11px] font-medium cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>ขยับลง 1 ชั้น</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "layers" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs">
          {layersList.length === 0 ? (
            <div className="text-center py-10 text-gray-400">ไม่มีวัตถุบนหน้ากระดาษ</div>
          ) : (
            layersList.map((obj, idx) => {
              const isSelected = activeObject === obj;
              const isObjTable = obj.isDocTable || obj.type === "DocTable" || obj.type === "docTable";
              const isObjText = obj.type === "textbox" || obj.type === "i-text" || obj.type === "text";
              const isObjShape = obj.type === "rect" || obj.type === "circle" || obj.type === "line";
              const label = isObjTable
                ? `ตารางใบเสนอราคา (${obj.docTableData?.items?.length || 0} แถว)`
                : isObjText
                ? obj.text || "กล่องข้อความ"
                : isObjShape
                ? `รูปทรง (${obj.type})`
                : "กลุ่มวัตถุ / รูปภาพ";

              return (
                <div
                  key={idx}
                  onClick={() => {
                    canvas.setActiveObject(obj);
                    canvas.requestRenderAll();
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/80 border-indigo-300 text-indigo-900 font-semibold shadow-xs"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-1 mr-2">
                    <span className="text-[10px] font-mono text-gray-400">#{layersList.length - idx}</span>
                    <span className="truncate text-xs">{label}</span>
                  </div>

                  <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleBringForward(obj)}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-200"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleSendBackward(obj)}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-200"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleToggleLock(obj)}
                      className={`p-1 rounded ${
                        obj.lockMovementX ? "text-amber-600 bg-amber-50" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"
                      }`}
                      title={obj.lockMovementX ? "ปลดล็อก" : "ล็อก"}
                    >
                      {obj.lockMovementX ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(obj)}
                      className={`p-1 rounded ${
                        obj.visible === false ? "text-gray-300" : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"
                      }`}
                      title={obj.visible === false ? "แสดง" : "ซ่อน"}
                    >
                      {obj.visible === false ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </aside>
  );
}