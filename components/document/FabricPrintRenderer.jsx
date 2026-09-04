"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as fabric from "fabric";
import { replaceTokens, DEFAULT_SAMPLE_TOKEN_MAP } from "@/lib/tokens/tokenEngine";
import { getCanvasPreset } from "@/lib/editor/canvasPresets";
import {
  DEFAULT_FONTS,
  CURATED_THAI_FONTS,
  buildGoogleFontsUrl,
  findFontByFamily,
} from "@/lib/fonts/fontRegistry";

/**
 * 🛡️ Patch FabricText SVG renderer with Smart Style-Grouping
 * 1. Groups consecutive characters that share the same style into single <tspan> chunks
 * 2. Preserves Rich Text Formatting (bold, colors, font sizes within same line)
 * 3. Eliminates duplicate character glyphs in Thai text extraction
 */
function patchFabricSvgTextForThai() {
  const targetProtos = [
    fabric.FabricText ? fabric.FabricText.prototype : null,
    fabric.IText ? fabric.IText.prototype : null,
    fabric.Textbox ? fabric.Textbox.prototype : null,
  ].filter(Boolean);

  targetProtos.forEach((proto) => {
    if (proto && !proto.__thaiSvgPatched) {
      proto._setSVGTextLineText = function (textSpans, lineIndex, textLeftOffset, textTopOffset) {
        const lineHeight = this.getHeightOfLine(lineIndex);
        const line = this._textLines[lineIndex];
        if (!line || line.length === 0) return;

        textTopOffset += (lineHeight * (1 - this._fontSizeFraction)) / this.lineHeight;

        const lineStyles = this.styles && this.styles[lineIndex];
        const hasLineStyles = lineStyles && Object.keys(lineStyles).length > 0;

        // 1. If no per-character styles on this line, emit a SINGLE clean <tspan> for the entire line!
        // This completely eliminates character-by-character tspan splintering and duplicate Thai characters in PDF!
        if (!hasLineStyles && !this.charSpacing && !this.path) {
          const fullLineText = Array.isArray(line) ? line.join("") : String(line);
          const style = this._getStyleDeclaration(lineIndex, 0) || {};
          const firstCharBox =
            this.__charBounds && this.__charBounds[lineIndex] && this.__charBounds[lineIndex][0]
              ? this.__charBounds[lineIndex][0]
              : {};
          textSpans.push(this._createTextCharSpan(fullLineText, style, textLeftOffset, textTopOffset, firstCharBox));
          return;
        }

        // 2. If line has per-character styles, group consecutive characters with identical styles into chunks
        const chunks = [];
        let currentChunkText = "";
        let currentStyleKey = null;
        let currentStyleObj = null;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const charStyle = (lineStyles && lineStyles[i]) || {};
          const styleKey = JSON.stringify(charStyle);

          if (styleKey === currentStyleKey) {
            currentChunkText += char;
          } else {
            if (currentChunkText.length > 0) {
              chunks.push({ text: currentChunkText, style: currentStyleObj, idx: i - currentChunkText.length });
            }
            currentChunkText = char;
            currentStyleKey = styleKey;
            currentStyleObj = charStyle;
          }
        }
        if (currentChunkText.length > 0) {
          chunks.push({ text: currentChunkText, style: currentStyleObj, idx: line.length - currentChunkText.length });
        }

        let currLeft = textLeftOffset;
        for (const chunk of chunks) {
          const charBox =
            this.__charBounds && this.__charBounds[lineIndex] && this.__charBounds[lineIndex][chunk.idx]
              ? this.__charBounds[lineIndex][chunk.idx]
              : {};
          textSpans.push(this._createTextCharSpan(chunk.text, chunk.style, currLeft, textTopOffset, charBox));

          let chunkWidth = 0;
          for (let cIdx = chunk.idx; cIdx < chunk.idx + chunk.text.length; cIdx++) {
            const b = this.__charBounds && this.__charBounds[lineIndex] ? this.__charBounds[lineIndex][cIdx] : null;
            chunkWidth += b ? b.kernedWidth || b.width || 0 : 0;
          }
          currLeft += chunkWidth;
        }
      };
      proto.__thaiSvgPatched = true;
    }
  });
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

  // Extract all unique fonts used across template pages
  const googleFontsUrl = useMemo(() => {
    const fontsToLoad = new Map();

    // Always include default fonts with Google Fonts
    DEFAULT_FONTS.forEach((f) => {
      if (f.googleFont) fontsToLoad.set(f.id, f);
    });

    // Scan template pages for any custom fonts
    if (template && Array.isArray(template.pages)) {
      template.pages.forEach((page) => {
        if (!page || !page.json) return;
        try {
          const pageData = typeof page.json === "string" ? JSON.parse(page.json) : page.json;
          if (pageData && Array.isArray(pageData.objects)) {
            pageData.objects.forEach((obj) => {
              if (obj.fontFamily) {
                const matched = findFontByFamily(obj.fontFamily, CURATED_THAI_FONTS);
                if (matched && matched.googleFont) {
                  fontsToLoad.set(matched.id, matched);
                }
              }
            });
          }
        } catch {
          // ignore parsing error
        }
      });
    }

    return buildGoogleFontsUrl(Array.from(fontsToLoad.values()));
  }, [template]);

  return (
    <div
      ref={containerRef}
      id="fabric-print-container"
      className="bg-white m-0 p-0"
      style={{ width: `${preset.width}px` }}
      data-ready={isRendered ? "true" : "false"}
    >
      {googleFontsUrl && (
        <link rel="stylesheet" href={googleFontsUrl} />
      )}

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