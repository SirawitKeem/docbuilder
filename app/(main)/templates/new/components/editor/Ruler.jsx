"use client";

import React, { useMemo } from "react";

export function CornerRuler() {
  return (
    <div className="w-6 h-6 bg-gray-200 border-r border-b border-gray-300 flex items-center justify-center select-none shrink-0 z-20">
      <span className="text-[9px] font-mono font-bold text-gray-500">mm</span>
    </div>
  );
}

export function TopRuler({ width, zoom, mousePos }) {
  const totalMm = 210;

  // Memoize static ticks based purely on zoom and width
  const ticks = useMemo(() => {
    const mmStep = (794 / 210) * zoom;
    const items = [];
    for (let mm = 0; mm <= totalMm; mm++) {
      const x = mm * mmStep;
      const isCm = mm % 10 === 0;
      const isHalfCm = mm % 5 === 0 && !isCm;

      items.push(
        <g key={mm}>
          <line
            x1={x}
            y1={isCm ? 6 : isHalfCm ? 13 : 17}
            x2={x}
            y2={24}
            stroke={isCm ? "#64748B" : "#CBD5E1"}
            strokeWidth={isCm ? 1.2 : 0.8}
          />
          {isCm && (
            <text
              x={x + 2}
              y={10}
              fontSize="8.5"
              fill="#475569"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              className="select-none font-semibold"
            >
              {mm}
            </text>
          )}
        </g>
      );
    }
    return items;
  }, [zoom]);

  return (
    <div
      className="relative h-6 bg-[#F8FAFC] border-b border-gray-300 select-none overflow-hidden"
      style={{ width }}
    >
      <svg width={width} height={24} className="block pointer-events-none">
        {ticks}
        {/* Dynamic single guide line rendered separately without re-computing ticks */}
        {mousePos?.x !== undefined && mousePos.x !== null && mousePos.x >= 0 && mousePos.x <= width && (
          <line
            x1={mousePos.x}
            y1={0}
            x2={mousePos.x}
            y2={24}
            stroke="#EF4444"
            strokeWidth={1.5}
          />
        )}
      </svg>
    </div>
  );
}

export function LeftRuler({ height, zoom, mousePos }) {
  const totalMm = 297;

  // Memoize static ticks based purely on zoom and height
  const ticks = useMemo(() => {
    const mmStep = (1123 / 297) * zoom;
    const items = [];
    for (let mm = 0; mm <= totalMm; mm++) {
      const y = mm * mmStep;
      const isCm = mm % 10 === 0;
      const isHalfCm = mm % 5 === 0 && !isCm;

      items.push(
        <g key={mm}>
          <line
            x1={isCm ? 6 : isHalfCm ? 13 : 17}
            y1={y}
            x2={24}
            y2={y}
            stroke={isCm ? "#64748B" : "#CBD5E1"}
            strokeWidth={isCm ? 1.2 : 0.8}
          />
          {isCm && (
            <text
              x={2}
              y={y + 8}
              fontSize="8"
              fill="#475569"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              className="select-none font-semibold"
            >
              {mm}
            </text>
          )}
        </g>
      );
    }
    return items;
  }, [zoom]);

  return (
    <div
      className="relative w-6 bg-[#F8FAFC] border-r border-gray-300 select-none overflow-hidden"
      style={{ height }}
    >
      <svg width={24} height={height} className="block pointer-events-none">
        {ticks}
        {/* Dynamic single guide line rendered separately without re-computing ticks */}
        {mousePos?.y !== undefined && mousePos.y !== null && mousePos.y >= 0 && mousePos.y <= height && (
          <line
            x1={0}
            y1={mousePos.y}
            x2={24}
            y2={mousePos.y}
            stroke="#EF4444"
            strokeWidth={1.5}
          />
        )}
      </svg>
    </div>
  );
}