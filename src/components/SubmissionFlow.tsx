"use client";

import { useRef, type CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { useVisibleAnimation } from "@/hooks/useVisibleAnimation";

export function SubmissionFlow({
  content,
}: {
  content: {
    eyebrow: string;
    title: string;
    copy: string;
    steps: readonly (readonly [string, string, string])[];
  };
}) {
  const visual = useRef<HTMLDivElement>(null);
  useVisibleAnimation(visual);
  return (
    <section
      id="submission-flow"
      className="submission-flow"
      aria-labelledby="submission-flow-heading"
    >
      <div className="wrap submission-flow-grid">
        <Reveal className="submission-flow-copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="submission-flow-heading">{content.title}</h2>
          <p>{content.copy}</p>
        </Reveal>
        <div ref={visual} className="submission-visual" data-playing="false">
          <ol className="submission-sequence">
            {content.steps.map(([number, label, role], index) => (
              <li
                key={label}
                style={{ "--flow-index": index } as CSSProperties}
              >
                <span className="submission-number">{number}</span>
                <span className="submission-role">{role}</span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>
          <div className="submission-link" aria-hidden="true">
            howl0.link/task <span>↗</span>
          </div>
        </div>
      </div>
    </section>
  );
}
