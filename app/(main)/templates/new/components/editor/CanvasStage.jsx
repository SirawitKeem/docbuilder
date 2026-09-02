"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { CornerRuler, TopRuler, LeftRuler } from "./Ruler";
import { CUSTOM_CANVAS_PROPS } from "./elements/DocTable";

export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;
export const MARGIN_PX = 56; // ~15mm printable margin

export default function CanvasStage({
  zoom = 1,
  showRuler = true,
  showMargin = true,
  onCanvasReady,
  onHistoryPush,
  onSelectionChange,
}) {
  const canvasContainerRef = useRef(null);
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [mousePos, setMousePos] = useState({ x: null, y: null });

  // Initialize Fabric Canvas with Native Dimensions
  useEffect(() => {
    if (!canvasElRef.current) return;

    // Apply global prototype patch with guard to prevent recursive wrapping in dev mode
    const targetProto = fabric.FabricObject ? fabric.FabricObject.prototype : fabric.Object ? fabric.Object.prototype : null;
    if (targetProto) {
      targetProto.originX = "left";
      targetProto.originY = "top";

      if (!targetProto.__customPropsPatched) {
        const origToObject = targetProto.toObject;
        targetProto.toObject = function (propertiesToInclude = []) {
          return origToObject.call(this, [...CUSTOM_CANVAS_PROPS, ...propertiesToInclude]);
        };
        targetProto.__customPropsPatched = true;
      }
    }

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: A4_WIDTH * zoom,
      height: A4_HEIGHT * zoom,
      backgroundColor: "#FFFFFF",
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true,
    });

    canvas.setZoom(zoom);
    fabricCanvasRef.current = canvas;

    // Mouse tracking for Ruler indicators
    canvas.on("mouse:move", (opt) => {
      const e = opt.e;
      if (e) {
        const rect = canvas.lowerCanvasEl.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    });

    canvas.on("mouse:out", () => {
      setMousePos({ x: null, y: null });
    });

    // History event triggers: object modified & text editing finished
    canvas.on("object:modified", () => {
      if (onHistoryPush) onHistoryPush(canvas);
    });

    canvas.on("text:editing:exited", () => {
      if (onHistoryPush) onHistoryPush(canvas);
    });

    // Selection tracking for Properties Panel
    const updateSelection = (opt) => {
      const selected = opt?.selected?.[0] || canvas.getActiveObject() || null;
      if (onSelectionChange) onSelectionChange(selected);
    };

    canvas.on("selection:created", updateSelection);
    canvas.on("selection:updated", updateSelection);
    canvas.on("selection:cleared", () => {
      if (onSelectionChange) onSelectionChange(null);
    });

    // Add Phase 1 Test Objects
    const testCard = new fabric.Rect({
      left: MARGIN_PX + 20,
      top: MARGIN_PX + 20,
      width: 360,
      height: 150,
      fill: "#F5F3FF",
      stroke: "#7C3AED",
      strokeWidth: 2,
      rx: 12,
      ry: 12,
      shadow: new fabric.Shadow({
        color: "rgba(124, 58, 237, 0.18)",
        blur: 18,
        offsetX: 0,
        offsetY: 8,
      }),
    });

    const testHeading = new fabric.Textbox("✨ A4 Document Studio", {
      left: MARGIN_PX + 42,
      top: MARGIN_PX + 40,
      width: 316,
      fontSize: 16,
      fontWeight: "bold",
      fill: "#5B21B6",
      fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
      editable: true,
    });

    const testDesc = new fabric.Textbox(
      "ระบบเครื่องมือสร้างเทมเพลต (Canva-like):\n• เมนูด้านซ้าย: เพิ่มข้อความ รูปทรง ตาราง อัปโหลดโลโก้\n• เมนูด้านขวา: ปรับแต่งสี ฟอนต์ แถวตาราง เลเยอร์\n• เมนูด้านล่าง: ระบบจัดการหลายหน้า (Multi-Page A4)",
      {
        left: MARGIN_PX + 42,
        top: MARGIN_PX + 72,
        width: 316,
        fontSize: 11.5,
        lineHeight: 1.45,
        fill: "#6D28D9",
        fontFamily: "'Noto Sans Thai', 'Noto Sans', sans-serif",
        editable: true,
      }
    );

    canvas.add(testCard, testHeading, testDesc);
    canvas.setActiveObject(testCard);
    canvas.renderAll();

    setIsReady(true);
    if (onCanvasReady) onCanvasReady(canvas);
    if (onSelectionChange) onSelectionChange(testCard);

    return () => {
      try {
        canvas.dispose();
      } catch (err) {
        console.warn("Canvas dispose:", err);
      }
    };
  }, []);

  // Native Zoom without CSS distortion
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: A4_WIDTH * zoom,
      height: A4_HEIGHT * zoom,
    });
    canvas.requestRenderAll();
  }, [zoom]);

  const currentWidth = A4_WIDTH * zoom;
  const currentHeight = A4_HEIGHT * zoom;
  const currentMargin = MARGIN_PX * zoom;

  return (
    <div className="relative flex flex-col items-center justify-start select-none py-6">
      <div className="flex flex-col bg-white border border-gray-300 shadow-2xl rounded-xs overflow-hidden">
        {showRuler && (
          <div className="flex items-center bg-[#F8FAFC]">
            <CornerRuler />
            <TopRuler width={currentWidth} zoom={zoom} mousePos={mousePos} />
          </div>
        )}

        <div className="flex items-start">
          {showRuler && (
            <LeftRuler height={currentHeight} zoom={zoom} mousePos={mousePos} />
          )}

          <div
            ref={canvasContainerRef}
            className="relative bg-white"
            style={{ width: currentWidth, height: currentHeight }}
          >
            {showMargin && (
              <div
                className="absolute inset-0 pointer-events-none z-10 border border-dashed border-rose-400/70"
                style={{ margin: `${currentMargin}px` }}
              >
                <span className="absolute top-1 left-2 text-[10px] font-mono text-rose-500 font-semibold select-none bg-rose-50/80 px-1 rounded-xs">
                  Margin (15mm)
                </span>
              </div>
            )}
            <canvas ref={canvasElRef} />
          </div>
        </div>
      </div>
    </div>
  );
}