import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";

const steps = [
  ["01", "Share link", "Teacher"],
  ["02", "Upload recording", "Student"],
  ["03", "Receive feedback", "Teacher"],
  ["04", "Continue practising", "Student"],
] as const;

export function SubmissionFlow() {
  return (
    <section
      id="submission-flow"
      className="submission-flow"
      aria-labelledby="submission-flow-heading"
    >
      <div className="wrap submission-flow-grid">
        <Reveal className="submission-flow-copy">
          <p className="eyebrow">THE SUBMISSION FLOW</p>
          <h2 id="submission-flow-heading">
            Share the task. Submit the practice. <em>Continue the learning.</em>
          </h2>
          <p>
            A teacher shares one link. The student uploads an audio or video
            recording. Feedback stays connected to what happens next.
          </p>
        </Reveal>
        <ol className="submission-sequence">
          {steps.map(([number, label, role], index) => (
            <li key={label} style={{ "--flow-index": index } as CSSProperties}>
              <span className="submission-number">{number}</span>
              <span className="submission-role">{role}</span>
              <strong>{label}</strong>
            </li>
          ))}
          <div className="submission-link" aria-hidden="true">
            howl0.link/task <span>↗</span>
          </div>
        </ol>
      </div>
    </section>
  );
}
