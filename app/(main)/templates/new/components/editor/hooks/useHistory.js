"use client";

import { useState, useRef, useCallback } from "react";
import { CUSTOM_CANVAS_PROPS } from "../elements/DocTable";

export function useHistory() {
  const [historyStack, setHistoryStack] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isExecutingRef = useRef(false);

  // Initialize or Reset History with initial canvas state
  const initHistory = useCallback((canvas) => {
    if (!canvas) return;
    try {
      const json = canvas.toJSON(CUSTOM_CANVAS_PROPS);
      setHistoryStack([json]);
      setCurrentIndex(0);
    } catch (err) {
      console.warn("initHistory error:", err);
    }
  }, []);

  // Push new state snapshot to stack
  const pushState = useCallback((canvas) => {
    if (!canvas || isExecutingRef.current) return;
    try {
      const json = canvas.toJSON(CUSTOM_CANVAS_PROPS);
      setHistoryStack((prev) => {
        // Truncate any future redo states
        const updated = prev.slice(0, currentIndex + 1);
        return [...updated, json];
      });
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.warn("pushState error:", err);
    }
  }, [currentIndex]);

  // Undo action
  const undo = useCallback((canvas) => {
    if (!canvas || currentIndex <= 0) return;
    isExecutingRef.current = true;
    const targetIndex = currentIndex - 1;
    const targetState = historyStack[targetIndex];

    if (targetState) {
      canvas.loadFromJSON(targetState).then(() => {
        canvas.renderAll();
        setCurrentIndex(targetIndex);
        isExecutingRef.current = false;
      }).catch((err) => {
        console.error("Undo error:", err);
        isExecutingRef.current = false;
      });
    } else {
      isExecutingRef.current = false;
    }
  }, [currentIndex, historyStack]);

  // Redo action
  const redo = useCallback((canvas) => {
    if (!canvas || currentIndex >= historyStack.length - 1) return;
    isExecutingRef.current = true;
    const targetIndex = currentIndex + 1;
    const targetState = historyStack[targetIndex];

    if (targetState) {
      canvas.loadFromJSON(targetState).then(() => {
        canvas.renderAll();
        setCurrentIndex(targetIndex);
        isExecutingRef.current = false;
      }).catch((err) => {
        console.error("Redo error:", err);
        isExecutingRef.current = false;
      });
    } else {
      isExecutingRef.current = false;
    }
  }, [currentIndex, historyStack]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < historyStack.length - 1;

  return {
    initHistory,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    currentIndex,
    totalStates: historyStack.length,
  };
}