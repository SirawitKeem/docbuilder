/**
 * 📐 Canvas Presets Configuration for Multi-Type Template System
 * Supports Docs (A4 Portrait/Landscape) and Slides (16:9 Presentation)
 */
export const CANVAS_PRESETS = {
  "a4-portrait": {
    id: "a4-portrait",
    name: "A4 แนวตั้ง (Portrait)",
    width: 794,
    height: 1123,
    mmWidth: 210,
    mmHeight: 297,
    marginPx: 56, // ~15mm printable margin
    aspectRatio: "1:1.414",
    defaultZoom: 0.85,
  },
  "a4-landscape": {
    id: "a4-landscape",
    name: "A4 แนวนอน (Landscape)",
    width: 1123,
    height: 794,
    mmWidth: 297,
    mmHeight: 210,
    marginPx: 56,
    aspectRatio: "1.414:1",
    defaultZoom: 0.75,
  },
  "slide-16-9": {
    id: "slide-16-9",
    name: "Presentation (16:9 สไลด์)",
    width: 1280,
    height: 720,
    mmWidth: null, // null indicates pixel-based presentation canvas (no metric mm rulers)
    mmHeight: null,
    marginPx: 40,
    aspectRatio: "16:9",
    defaultZoom: 0.65,
  },
};

export const DEFAULT_PRESET = CANVAS_PRESETS["a4-portrait"];

export function getCanvasPreset(presetId) {
  if (!presetId) return DEFAULT_PRESET;
  if (typeof presetId === "object") {
    if (presetId.id && CANVAS_PRESETS[presetId.id]) {
      return CANVAS_PRESETS[presetId.id];
    }
    if (presetId.width && presetId.height) {
      return presetId;
    }
  }
  return CANVAS_PRESETS[presetId] || DEFAULT_PRESET;
}