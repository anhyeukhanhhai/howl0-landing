"use client";
import { useRef, useState } from "react";
const audience = [
  {
    name: "Teacher",
    title: "Keep assignments and guidance in one place.",
    copy: "Start with a simple submission flow and keep the next step clear.",
    signal: "01 / ASSIGN → RESPOND",
    benefits: [
      "One clear task",
      "Recordings in context",
      "Guidance that carries forward",
    ],
  },
  {
    name: "Student",
    title: "Share an attempt without a platform lesson.",
    copy: "Open the task, choose an existing recording and send it on.",
    signal: "02 / OPEN → SUBMIT",
    benefits: ["An existing recording", "Audio or video", "A clear next step"],
  },
  {
    name: "Parent",
    title: "See the direction without managing the process.",
    copy: "The student and teacher stay at the centre of the learning journey.",
    signal: "03 / UNDERSTAND → SUPPORT",
    benefits: [
      "Visible direction",
      "Less process management",
      "Student-led practice",
    ],
  },
];
export function AudienceTabs() {
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
      <div
        className="tablist"
        role="tablist"
        aria-label="Audience perspectives"
      >
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
          <span className="eyebrow">{audience[active].signal}</span>
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
