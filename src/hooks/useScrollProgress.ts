"use client";
import { useEffect, type RefObject } from "react";

type Mode = "pin" | "enter";
type Options = {
  mode?: Mode;
  stages?: number;
  onProgress?: (progress: number) => void;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Writes progress to the element without causing a React render on scroll. */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { mode = "enter", stages, onProgress }: Options = {},
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastStage = -1;
    let active = true;
    const measure = () => {
      frame = 0;
      if (!active) return;
      if (reduced.matches) {
        element.style.setProperty("--scene-progress", "1");
        if (stages) element.dataset.stage = String(stages - 1);
        onProgress?.(1);
        return;
      }
      const rect = element.getBoundingClientRect();
      const height = window.innerHeight;
      const progress =
        mode === "pin"
          ? clamp(-rect.top / Math.max(1, rect.height - height))
          : clamp((height - rect.top) / (height + rect.height));
      element.style.setProperty("--scene-progress", progress.toFixed(4));
      if (stages) {
        const stage = Math.min(stages - 1, Math.floor(progress * stages));
        if (stage !== lastStage) {
          element.dataset.stage = String(stage);
          lastStage = stage;
        }
      }
      onProgress?.(progress);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) request();
      },
      { rootMargin: "25% 0px" },
    );
    observer.observe(element);
    const onMotion = () => request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    reduced.addEventListener("change", onMotion);
    request();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduced.removeEventListener("change", onMotion);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, mode, stages, onProgress]);
}
