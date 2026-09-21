"use client";
import { useRef, useState } from "react";

type Audience = {
  readonly name: string;
  readonly title: string;
  readonly copy: string;
  readonly benefits: readonly string[];
};

export function AudienceTabs({
  audience,
  label,
}: {
  audience: readonly Audience[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function keyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % 3;
    else if (e.key === "ArrowLeft") next = (i + 2) % 3;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 2;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }
  return (
    <div className={`audience-panel audience-${active}`}>
      <div className="tablist" role="tablist" aria-label={label}>
        {audience.map((a, i) => (
          <button
            key={a.name}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`tab-${i}`}
            role="tab"
            aria-selected={active === i}
            aria-controls="audience-content"
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => keyDown(e, i)}
          >
            {a.name}
            <span aria-hidden="true">0{i + 1}</span>
          </button>
        ))}
      </div>
      <div
        id="audience-content"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="audience-content"
      >
        <div>
          <h3>{audience[active].title}</h3>
          <p>{audience[active].copy}</p>
          <ul className="audience-benefits">
            {audience[active].benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
        <div className="audience-art" aria-hidden="true">
          <div className="art-orbit">
            <img
              src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
              alt=""
            />
          </div>
          <span>{audience[active].name}</span>
        </div>
      </div>
    </div>
  );
}
