"use client";

import { useRef, type CSSProperties } from "react";
import { useVisibleAnimation } from "@/hooks/useVisibleAnimation";
import { practiceSteps } from "@/lib/practiceLoop";

/** A five-second, CSS-driven view of the teacher-to-student submission journey. */
export function HeroLoopPreview() {
  const root = useRef<HTMLDivElement>(null);

  useVisibleAnimation(root);

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
