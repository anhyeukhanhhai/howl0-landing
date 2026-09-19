"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { practiceSteps } from "@/lib/practiceLoop";

/** A five-second, CSS-driven view of the teacher-to-student submission journey. */
export function HeroLoopPreview() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.playing = String(
        entry.isIntersecting && !document.hidden,
      );
    });
    const onVisibility = () => {
      element.dataset.playing = String(
        !document.hidden && element.getBoundingClientRect().bottom > 0,
      );
    };
    observer.observe(element);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={root}
      className="hero-preview"
      data-playing="false"
      aria-label="Submission flow: a teacher shares a task, a student opens and submits a recording, then guidance points to the next attempt."
      role="img"
    >
      <span className="preview-task" aria-hidden="true">
        TEACHER TASK <b>↗</b>
      </span>
      <span className="preview-link" aria-hidden="true">
        <small>SUBMISSION START</small>
        <strong>howl0.link/practice</strong>
      </span>
      <span className="preview-practice" aria-hidden="true">
        <i /> <i /> <i /> <i /> <i />
      </span>
      <span className="preview-files" aria-hidden="true">
        <b>AUDIO</b> <b>VIDEO</b>
      </span>
      <span className="preview-feedback" aria-hidden="true">
        FEEDBACK ↗
      </span>
      <ol className="preview-stages" aria-hidden="true">
        {practiceSteps.map(({ word }, index) => (
          <li key={word} style={{ "--step-index": index } as CSSProperties}>
            {word}
          </li>
        ))}
      </ol>
    </div>
  );
}
