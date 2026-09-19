import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";

const steps = ["Open link", "Upload recording", "Submit"];

export function OneLinkSummary({ link = true }: { link?: boolean }) {
  return (
    <section className="one-link-summary" aria-labelledby="one-link-heading">
      <div className="wrap one-link-grid">
        <Reveal className="one-link-copy">
          <p className="eyebrow">THE ONE-LINK DIFFERENCE</p>
          <h2 id="one-link-heading">
            Submit practice without <em>learning a platform.</em>
          </h2>
          <p>One link takes a student straight from recording to submission.</p>
          {link ? (
            <Link className="text-link" href="/how-it-works">
              See how it works <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </Reveal>
        <div className="one-link-signal" aria-label={steps.join(", then ")}>
          <ol>
            {steps.map((step, index) => (
              <li
                key={step}
                style={{ "--route-index": index } as CSSProperties}
              >
                <span>0{index + 1}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <div className="one-link-chip" aria-hidden="true">
            howl0.link/practice <span>↗</span>
          </div>
        </div>
      </div>
    </section>
  );
}
