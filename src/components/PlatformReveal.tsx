import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const directions = [
  [
    "01",
    "Organise learning",
    "Keep assignments, learning materials and student activity together.",
  ],
  [
    "02",
    "Guide practice",
    "Connect each submission with feedback and the next learning step.",
  ],
  ["03", "See progress", "Build a clearer picture of development over time."],
] as const;

export function PlatformReveal({ showLink = true }: { showLink?: boolean }) {
  return (
    <section
      className="platform-reveal surface-noise"
      aria-labelledby="platform-heading"
    >
      <div className="wrap">
        <Reveal className="platform-intro">
          <p className="eyebrow">THE PRODUCT DIRECTION</p>
          <h2 id="platform-heading">
            The link is <em>only the beginning.</em>
          </h2>
          <p>
            We’re building howl0 into a learning environment designed around how
            music is taught, practised and improved.
          </p>
        </Reveal>
        <ol className="platform-directions">
          {directions.map(([number, title, copy]) => (
            <li key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
        <div className="platform-close">
          <p>
            Start with one simple submission link. Continue with a learning
            platform built for music.
          </p>
          {showLink ? (
            <Link className="text-link" href="/product">
              Explore the product vision <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
