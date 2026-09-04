"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { CornerRuler, TopRuler, LeftRuler } from "./Ruler";
import { CUSTOM_CANVAS_PROPS } from "./elements/DocTable";
import { getCanvasPreset } from "@/lib/editor/canvasPresets";

export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;
export const MARGIN_PX = 56; // ~15mm printable margin
const SNAP_THRESHOLD = 6; // px distance to snap

export default function CanvasStage({
  zoom = 1,
  showRuler = true,
  showMargin = true,
  canvasPreset = "a4-portrait",
  onCanvasReady,
  onHistoryPush,
  onSelectionChange,
}) {
  const preset = getCanvasPreset(canvasPreset);
  const canvasContainerRef = useRef(null);
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: null, y: null });

  // Initialize Fabric Canvas with Dynamic Preset Dimensions
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
      width: preset.width * zoom,
      height: preset.height * zoom,
      backgroundColor: "#FFFFFF",
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true,
    });

    canvas.setZoom(zoom);
    fabricCanvasRef.current = canvas;

    // 🧲 Smart Snapping Guidelines Helper
    const clearSnapGuides = () => {
      const guides = canvas.getObjects().filter((obj) => obj.isSnapGuide);
      guides.forEach((g) => canvas.remove(g));
    };

    const drawSnapGuide = (points) => {
      const line = new fabric.Line(points, {
        stroke: "#D946EF",
        strokeWidth: 1.2,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
        isSnapGuide: true,
        excludeFromExport: true,
      });
      canvas.add(line);
    };

    // 🧲 Snapping Event Listener (object:moving)
    canvas.on("object:moving", (opt) => {
      const target = opt.target;
      if (!target || target.isSnapGuide) return;

      clearSnapGuides();

      const targetWidth = target.getScaledWidth();
      const targetHeight = target.getScaledHeight();

      const targetLeft = target.left;
      const targetCenterX = targetLeft + targetWidth / 2;
      const targetRight = targetLeft + targetWidth;

      const targetTop = target.top;
      const targetCenterY = targetTop + targetHeight / 2;
      const targetBottom = targetTop + targetHeight;

      // Vertical Snap Points: Left Margin, Center, Right Margin
      const vSnapPoints = [
        { x: preset.marginPx, type: "margin-left" },
        { x: preset.width / 2, type: "center-x" },
        { x: preset.width - preset.marginPx, type: "margin-right" },
      ];

      // Horizontal Snap Points: Top Margin, Center, Bottom Margin
      const hSnapPoints = [
        { y: preset.marginPx, type: "margin-top" },
        { y: preset.height / 2, type: "center-y" },
        { y: preset.height - preset.marginPx, type: "margin-bottom" },
      ];

      // Check Vertical Snapping
      for (const p of vSnapPoints) {
        if (Math.abs(targetCenterX - p.x) <= SNAP_THRESHOLD) {
          target.set("left", p.x - targetWidth / 2);
          drawSnapGuide([p.x, 0, p.x, preset.height], "vertical");
          break;
        } else if (Math.abs(targetLeft - p.x) <= SNAP_THRESHOLD) {
          target.set("left", p.x);
          drawSnapGuide([p.x, 0, p.x, preset.height], "vertical");
          break;
        } else if (Math.abs(targetRight - p.x) <= SNAP_THRESHOLD) {
          target.set("left", p.x - targetWidth);
          drawSnapGuide([p.x, 0, p.x, preset.height], "vertical");
          break;
        }
      }

      // Check Horizontal Snapping
      for (const p of hSnapPoints) {
        if (Math.abs(targetCenterY - p.y) <= SNAP_THRESHOLD) {
          target.set("top", p.y - targetHeight / 2);
          drawSnapGuide([0, p.y, preset.width, p.y], "horizontal");
          break;
        } else if (Math.abs(targetTop - p.y) <= SNAP_THRESHOLD) {
          target.set("top", p.y);
          drawSnapGuide([0, p.y, preset.width, p.y], "horizontal");
          break;
        } else if (Math.abs(targetBottom - p.y) <= SNAP_THRESHOLD) {
          target.set("top", p.y - targetHeight);
          drawSnapGuide([0, p.y, preset.width, p.y], "horizontal");
          break;
        }
      }
    });

    // Clear guidelines when mouse is released
    canvas.on("mouse:up", clearSnapGuides);
    canvas.on("object:modified", clearSnapGuides);

    // Mouse tracking for Ruler indicators
    canvas.on("mouse:move", (opt) => {
      if (!opt.e) return;
      const pointer = canvas.getPointer(opt.e);
      setMousePos({ x: pointer.x * zoom, y: pointer.y * zoom });
    });

    canvas.on("mouse:out", () => {
      setMousePos({ x: null, y: null });
    });

    // Selection Change Events
    const handleSelection = (e) => {
      const selected = e.selected && e.selected.length > 0 ? e.selected[0] : null;
      if (onSelectionChange) onSelectionChange(selected);
    };

    const handleClearSelection = () => {
      if (onSelectionChange) onSelectionChange(null);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleClearSelection);

    // History Mutation Events
    const handleMutation = (e) => {
      if (e && e.target && e.target.isSnapGuide) return;
      if (onHistoryPush) onHistoryPush(canvas);
    };

    canvas.on("object:modified", handleMutation);
    canvas.on("object:added", (e) => {
      if (e && e.target && e.target.isSnapGuide) return;
      if (onHistoryPush) onHistoryPush(canvas);
    });
    canvas.on("object:removed", (e) => {
      if (e && e.target && e.target.isSnapGuide) return;
      if (onHistoryPush) onHistoryPush(canvas);
    });

    if (typeof window !== "undefined") {
      window.__FABRIC_CANVAS__ = canvas;
      window.__FABRIC__ = fabric;
    }
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    return () => {
      try {
        canvas.dispose();
      } catch (err) {
        console.warn("Canvas dispose:", err);
      }
    };
  }, [preset.id]);

  // Native Zoom without CSS distortion
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: preset.width * zoom,
      height: preset.height * zoom,
    });
    canvas.requestRenderAll();
  }, [zoom, preset.width, preset.height]);

  const currentWidth = preset.width * zoom;
  const currentHeight = preset.height * zoom;
  const currentMargin = preset.marginPx * zoom;

  return (
    <div className="relative flex flex-col items-center justify-start select-none py-6">
      <div className="flex flex-col bg-white border border-gray-300 shadow-2xl rounded-xs overflow-hidden">
        {showRuler && (
          <div className="flex items-center bg-[#F8FAFC]">
            <CornerRuler canvasPreset={preset} />
            <TopRuler width={currentWidth} zoom={zoom} mousePos={mousePos} canvasPreset={preset} />
          </div>
        )}

        <div className="flex items-start">
          {showRuler && (
            <LeftRuler height={currentHeight} zoom={zoom} mousePos={mousePos} canvasPreset={preset} />
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
                  Margin ({preset.mmWidth ? "15mm" : `${preset.marginPx}px`})
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