"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { DocTable, CUSTOM_CANVAS_PROPS } from "@/app/(main)/templates/new/components/editor/elements/DocTable";
import { replaceTokens, DEFAULT_SAMPLE_TOKEN_MAP } from "@/lib/tokens/tokenEngine";
import { getCanvasPreset } from "@/lib/editor/canvasPresets";

/**
 * 🛡️ Patch FabricText SVG renderer with Smart Style-Grouping
 * 1. Groups consecutive characters that share the same style into single <tspan> chunks
 * 2. Preserves Rich Text Formatting (bold, colors, font sizes within same line)
 * 3. Eliminates duplicate character glyphs in Thai text extraction
 */
function patchFabricSvgTextForThai() {
  const targetProto = fabric.FabricText ? fabric.FabricText.prototype : fabric.Text ? fabric.Text.prototype : null;
  if (targetProto && !targetProto.__thaiSvgPatched) {
    targetProto._renderTextLines = function (mainX, mainY) {
      const textLines = this._textLines || (typeof this.text === "string" ? this.text.split("\n") : [""]);
      const fontSize = this.fontSize || 14;
      const lineHeight = this.lineHeight || 1.16;
      const styles = this.styles || {};

      return textLines
        .map((line, lineIndex) => {
          const lineY = mainY + (lineIndex * fontSize * lineHeight);
          const lineStyles = styles[lineIndex];

          // 1. If no per-character styles on this line, emit a single clean line tspan
          if (!lineStyles || Object.keys(lineStyles).length === 0) {
            const escaped = fabric.util && fabric.util.escapeXml ? fabric.util.escapeXml(line) : line;
            return `<tspan x="${mainX}" y="${lineY}">${escaped}</tspan>`;
          }

          // 2. Group consecutive characters with identical styles into coherent chunks
          const chunks = [];
          let currentChunkText = "";
          let currentStyleKey = null;
          let currentStyleObj = null;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const charStyle = lineStyles[i] || {};
            const styleKey = JSON.stringify(charStyle);

            if (styleKey === currentStyleKey) {
              currentChunkText += char;
            } else {
              if (currentChunkText.length > 0) {
                chunks.push({ text: currentChunkText, style: currentStyleObj });
              }
              currentChunkText = char;
              currentStyleKey = styleKey;
              currentStyleObj = charStyle;
            }
          }
          if (currentChunkText.length > 0) {
            chunks.push({ text: currentChunkText, style: currentStyleObj });
          }

          // 3. Render grouped styled tspans
          return chunks
            .map((chunk, chunkIdx) => {
              const s = chunk.style || {};
              let styleAttrs = chunkIdx === 0 ? ` x="${mainX}" y="${lineY}"` : "";
              if (s.fill) styleAttrs += ` fill="${s.fill}"`;
              if (s.fontWeight) styleAttrs += ` font-weight="${s.fontWeight}"`;
              if (s.fontStyle) styleAttrs += ` font-style="${s.fontStyle}"`;
              if (s.fontSize) styleAttrs += ` font-size="${s.fontSize}"`;
              if (s.fontFamily) styleAttrs += ` font-family="${s.fontFamily}"`;

              const escaped = fabric.util && fabric.util.escapeXml ? fabric.util.escapeXml(chunk.text) : chunk.text;
              return `<tspan${styleAttrs}>${escaped}</tspan>`;
            })
            .join("");
        })
        .join("");
    };
    targetProto.__thaiSvgPatched = true;
  }
}

export default function FabricPrintRenderer({
  template,
  values = {},
  onReady,
}) {
  const containerRef = useRef(null);
  const [renderedSvgPages, setRenderedSvgPages] = useState([]);
  const [isRendered, setIsRendered] = useState(false);

  const preset = getCanvasPreset(
    template?.canvasPreset || (template?.editorType === "slide" ? "slide-16-9" : "a4-portrait")
  );

  const tokenMap = {
    ...DEFAULT_SAMPLE_TOKEN_MAP,
    ...values,
  };

  const pagesList = template?.pages && Array.isArray(template.pages) && template.pages.length > 0
    ? template.pages
    : [{ id: "page-1", json: null }];

  useEffect(() => {
    let isCancelled = false;

    async function renderAllVectorPages() {
      // 1. Apply Smart Style-Grouping SVG patch for Thai language
      patchFabricSvgTextForThai();

      // 2. Wait for Google Fonts to be fully loaded in DOM
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }

      const svgPages = [];

      // 3. Render each page using Fabric and convert to clean Vector SVG
      for (let i = 0; i < pagesList.length; i++) {
        const pageItem = pagesList[i];
        const pageJson = pageItem.json;

        const tempCanvasEl = document.createElement("canvas");
        tempCanvasEl.width = preset.width;
        tempCanvasEl.height = preset.height;

        const fabricCanvas = new fabric.Canvas(tempCanvasEl, {
          width: preset.width,
          height: preset.height,
          backgroundColor: "#FFFFFF",
          renderOnAddRemove: false,
        });

        if (pageJson) {
          await new Promise((resolve) => {
            fabricCanvas.loadFromJSON(pageJson).then(() => {
              const objects = fabricCanvas.getObjects();

              objects.forEach((obj) => {
                // 1. Textbox / Text: Dynamic Token Replacement
                if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text") {
                  const raw = obj.rawTemplateText || obj.text || "";
                  obj.set("text", replaceTokens(raw, tokenMap));
                }

                // 2. DocTable Custom Object: Dynamic Token Replacement & Rebuild
                if (obj.isDocTable && obj.docTableData && obj.updateTableData) {
                  const rawItems = obj.rawItems || obj.docTableData.items || [];
                  const replacedItems = rawItems.map((item) => ({
                    ...item,
                    desc: replaceTokens(item.desc || "", tokenMap),
                  }));
                  obj.updateTableData({ items: replacedItems });
                }

                // 3. Respect visibility: Hide hidden objects from Vector SVG
                if (obj.visible === false) {
                  obj.set({ visible: false, opacity: 0 });
                }
              });

              fabricCanvas.renderAll();
              resolve();
            }).catch((err) => {
              console.error("Load JSON error for page", i, err);
              resolve();
            });
          });
        }

        // ✨ TRUE VECTOR EXPORT: Clean SVG without duplicate character fragmentation
        const svgString = fabricCanvas.toSVG({
          width: preset.width,
          height: preset.height,
          viewBox: { x: 0, y: 0, width: preset.width, height: preset.height },
        });

        svgPages.push(svgString);
        fabricCanvas.dispose();
      }

      // 4. Ensure font readiness before signaling data-ready
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }

      if (!isCancelled) {
        setRenderedSvgPages(svgPages);
        setIsRendered(true);
        if (onReady) onReady();
      }
    }

    renderAllVectorPages();

    return () => {
      isCancelled = true;
    };
  }, [template, JSON.stringify(values), preset.id]);

  return (
    <div
      ref={containerRef}
      id="fabric-print-container"
      className="bg-white m-0 p-0"
      style={{ width: `${preset.width}px` }}
      data-ready={isRendered ? "true" : "false"}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&family=Noto+Sans+Thai+Looped:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&display=swap"
      />

      <style>{`
        @page {
          ${preset.mmWidth ? `size: ${preset.mmWidth}mm ${preset.mmHeight}mm;` : `size: ${preset.width}px ${preset.height}px;`}
          margin: 0mm;
        }
        @media print, all {
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: ${preset.width}px !important;
            height: auto !important;
            font-family: 'Noto Sans Thai', sans-serif !important;
          }
          .fabric-vector-page {
            width: ${preset.width}px !important;
            height: ${preset.height}px !important;
            max-height: ${preset.height}px !important;
            min-height: ${preset.height}px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-sizing: border-box !important;
            position: relative !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }
          .fabric-vector-page + .fabric-vector-page {
            page-break-before: always !important;
            break-before: page !important;
          }
          .fabric-vector-page svg {
            width: ${preset.width}px !important;
            height: ${preset.height}px !important;
            display: block !important;
          }
        }
      `}</style>

      {renderedSvgPages.map((svgHtml, idx) => (
        <div
          key={idx}
          className="fabric-vector-page print-page relative bg-white overflow-hidden"
          style={{ width: `${preset.width}px`, height: `${preset.height}px` }}
          data-ready={isRendered ? "true" : "false"}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      ))}
    </div>
  );
}